import React, { useEffect } from "react";
import { usePreview } from "src/react/usePreview";

export function PreviewInlineWysiwyg({
  children,
  name,
  format,
}: {
  name: string;
  children: React.ReactNode;
  format: "html" | "markdown";
}) {
  const preview = usePreview();
  const [InlineWysiwyg, setInlineWysiwyg] = React.useState<JSX.Element>();
  useEffect(() => {
    if (!InlineWysiwyg && preview) {
      import("react-tinacms-editor").then(({ InlineWysiwyg }) =>
        setInlineWysiwyg(
          <InlineWysiwyg name={name} format={format}>
            {children}
          </InlineWysiwyg>
        )
      );
    }
  }, [preview]);

  if (InlineWysiwyg && preview) {
    return InlineWysiwyg;
  }
  return <>{children}</>;
}
