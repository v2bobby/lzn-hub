import { useEffect } from "react";

/**
 * Sets a per-page <title> and meta description. Restores the previous values
 * on unmount so client-side navigation never leaves a stale title behind.
 */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let tag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    let created = false;
    let previousDescription = "";

    if (description) {
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
        created = true;
      } else {
        previousDescription = tag.content;
      }
      tag.content = description;
    }

    return () => {
      document.title = previousTitle;
      if (!tag) return;
      if (created) tag.remove();
      else if (description) tag.content = previousDescription;
    };
  }, [title, description]);
}
