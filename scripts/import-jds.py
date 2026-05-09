#!/usr/bin/env python3
"""Import job description .docx files from content/job-descriptions/ into Sanity.

Usage:
    source ~/.profile && python3 scripts/import-jds.py

Each .docx is parsed for: title, location, employment type, about role,
duties, requirements, and offers. A jobPosting document is created in Sanity
with status "open". Processed files are renamed to *.processed.docx.
"""
import json
import os
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

SANITY_PROJECT = 'bpjtbps6'
SANITY_DATASET = 'production'
SANITY_API_VERSION = '2024-01-01'
CONTENT_DIR = Path(__file__).parent.parent / 'content' / 'job-descriptions'
NS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

SECTION_MARKERS = {
    'about_us': 'About Us',
    'about_role': 'About the Role',
    'duties': 'Responsibilities',
    'requirements': 'Requirements',
    'offers': 'Why Join Us',
    'apply': 'How to Apply',
}


def get_token() -> str:
    token = os.environ.get('SANITY_AUTH_TOKEN', '')
    if not token:
        print('ERROR: SANITY_AUTH_TOKEN not set. Run: source ~/.profile', file=sys.stderr)
        sys.exit(1)
    return token


def extract_lines(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as z:
        xml_data = z.read('word/document.xml')
    root = ET.fromstring(xml_data)
    lines = []
    for para in root.iter(f'{NS}p'):
        text = ''.join(r.text or '' for r in para.iter(f'{NS}t')).strip()
        lines.append(text)
    return lines


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')[:96]


def detect_track(filename: str) -> str:
    lower = filename.lower()
    if 'teletherapy' in lower or 'online' in lower or 'remote' in lower:
        return 'teletherapy'
    if 'onsite' in lower or 'on_site' in lower or 'on-site' in lower or 'geriatric' in lower or 'facility' in lower:
        return 'facility'
    return ''


def parse_jd(lines: list[str]) -> dict:
    title = ''
    location = ''
    employment_type = ''
    about_role_lines: list[str] = []
    duties: list[str] = []
    requirements: list[str] = []
    offers: list[str] = []

    current_section = 'header'

    for line in lines:
        if not line:
            continue

        # Detect section markers
        stripped = line.strip()
        if stripped == SECTION_MARKERS['about_us']:
            current_section = 'about_us'
            continue
        if stripped == SECTION_MARKERS['about_role']:
            current_section = 'about_role'
            continue
        if stripped == SECTION_MARKERS['duties']:
            current_section = 'duties'
            continue
        if stripped == SECTION_MARKERS['requirements']:
            current_section = 'requirements'
            continue
        if stripped == SECTION_MARKERS['offers']:
            current_section = 'offers'
            continue
        if stripped == SECTION_MARKERS['apply']:
            current_section = 'apply'
            continue

        if current_section == 'header':
            if not title and stripped and not stripped.startswith('Location:') and not stripped.startswith('Employment Type:'):
                title = stripped
            elif stripped.startswith('Location:'):
                location = stripped.removeprefix('Location:').strip()
            elif stripped.startswith('Employment Type:'):
                employment_type = stripped.removeprefix('Employment Type:').strip()
        elif current_section == 'about_role':
            about_role_lines.append(stripped)
        elif current_section == 'duties':
            duties.append(stripped)
        elif current_section == 'requirements':
            requirements.append(stripped)
        elif current_section == 'offers':
            offers.append(stripped)

    return {
        'title': title,
        'location': location,
        'employmentType': employment_type,
        'aboutRole': '\n\n'.join(about_role_lines),
        'duties': duties,
        'requirements': requirements,
        'offers': offers,
    }


def sanity_create(doc: dict, token: str) -> str:
    url = f'https://{SANITY_PROJECT}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}'
    payload = json.dumps({'mutations': [{'create': doc}]}).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
    return result.get('transactionId', '')


def main():
    token = get_token()
    docx_files = sorted(CONTENT_DIR.glob('*.docx'))

    if not docx_files:
        print('No .docx files found in', CONTENT_DIR)
        return

    for docx_path in docx_files:
        print(f'\nProcessing: {docx_path.name}')
        lines = extract_lines(docx_path)
        parsed = parse_jd(lines)

        if not parsed['title']:
            print(f'  SKIP — could not extract title from {docx_path.name}')
            continue

        track = detect_track(docx_path.name)
        slug = slugify(parsed['title'])

        doc = {
            '_type': 'jobPosting',
            'title': parsed['title'],
            'slug': {'_type': 'slug', 'current': slug},
            'status': 'open',
            'track': track,
            'location': parsed['location'],
            'employmentType': parsed['employmentType'],
            'aboutRole': parsed['aboutRole'],
            'duties': parsed['duties'],
            'requirements': parsed['requirements'],
            'offers': parsed['offers'],
        }

        print(f'  Title:    {doc["title"]}')
        print(f'  Track:    {doc["track"]}')
        print(f'  Location: {doc["location"]}')
        print(f'  Duties:   {len(doc["duties"])} items')
        print(f'  Reqs:     {len(doc["requirements"])} items')
        print(f'  Offers:   {len(doc["offers"])} items')

        doc_id = sanity_create(doc, token)
        print(f'  Created:  {doc_id}')

        processed_path = docx_path.with_suffix('.processed.docx')
        docx_path.rename(processed_path)
        print(f'  Renamed:  {processed_path.name}')

    print('\nDone.')


if __name__ == '__main__':
    main()
