import React, { useEffect } from "react";
import { usePreview } from "src/react/usePreview";

export function PreviewInlineText({
  children,
  name,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const preview = usePreview();
  const [InlineText, setInlineText] = React.useState<JSX.Element>();
  useEffect(() => {
    if (!InlineText && preview) {
      import("react-tinacms-inline").then(({ InlineText }) =>
        setInlineText(<InlineText name={name}/>)
      );
    }
  }, [preview]);

  if (InlineText && preview) {
    return InlineText
  }
  return <>{children}</>;
}
