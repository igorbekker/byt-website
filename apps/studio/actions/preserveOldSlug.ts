import { useDocumentOperation, useEditState } from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

export function createPreserveOldSlugAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const PreserveOldSlugAction = (props: DocumentActionProps) => {
    const { id, type } = props;
    const ops = useDocumentOperation(id, type);
    const editState = useEditState(id, type);
    const original = originalPublishAction(props);

    if (!original) return null;

    return {
      ...original,
      onHandle: () => {
        const published = editState.published as Record<string, unknown> | null; // safe: SanityDocument has index signature
        const draft = editState.draft as Record<string, unknown> | null; // safe: SanityDocument has index signature

        const publishedSlug = published?.slug;
        const draftSlug = draft?.slug;
        const existingOldSlugs = (
          (draft?.oldSlugs ?? published?.oldSlugs ?? []) as unknown[]
        ).filter((s): s is string => typeof s === 'string');

        const shouldPreserve =
          typeof publishedSlug === 'string' &&
          publishedSlug !== '' &&
          draftSlug !== publishedSlug &&
          !existingOldSlugs.includes(publishedSlug);

        if (shouldPreserve) {
          ops.patch.execute([{ set: { oldSlugs: [...existingOldSlugs, publishedSlug] } }]);
        }

        original.onHandle?.();
      },
    };
  };

  return PreserveOldSlugAction;
}
