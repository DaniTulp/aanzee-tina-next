import React, { useEffect, useRef } from "react";
import { usePreview } from "src/react/usePreview";

export function PreviewInlineText({
  children,
  name,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const preview = usePreview();
  const mountedRef = useRef<boolean>(false);
  const [InlineText, setInlineText] = React.useState<JSX.Element>();
  useEffect(() => {
    mountedRef.current = true;
    if (!InlineText && preview) {
      import("react-tinacms-inline").then(({ InlineText }) => {
        if (mountedRef.current) {
          setInlineText(<InlineText name={name} />);
        }
      });
    }
    return () => {
      // Called before unmount by React
      mountedRef.current = false;
    };
  }, [preview]);

  if (InlineText && preview) {
    return InlineText;
  }
  return <>{children}</>;
}
