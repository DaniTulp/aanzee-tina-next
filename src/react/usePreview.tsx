import { createContext, useContext } from "react";

export const PreviewContext = createContext<boolean>(false);

export function usePreview() {
  const preview = useContext(PreviewContext);

  return preview;
}
