# Backup Manifest

**Date:** YYYY-MM-DD
**Operator:** Igor / Claude
**Type:** [ ] Git bundle [ ] Sanity export [ ] Both

## Files Created

- `backups/git/byt-website-YYYYMMDD-HHMMSS.bundle`
- `backups/sanity/sanity-production-YYYYMMDD-HHMMSS.tar.gz`

## Reason

<!-- Why was this backup taken? (before migration, before deploy, scheduled, etc.) -->

## Verified

- [ ] Git bundle restores cleanly: `git clone backups/git/<file>.bundle`
- [ ] Sanity export file is non-zero bytes: `ls -lh backups/sanity/<file>.tar.gz`
