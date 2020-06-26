import React, { createContext, useContext } from "react";

const PreviewContext = createContext<boolean>(null);

export function usePreview() {
  const preview = useContext(PreviewContext);
  if(preview === null) {
    throw('No PreviewContext found')
  }
  return preview;
}

export function PreviewProvider({
  children,
  value,
}: {
  children?: React.ReactNode;
  value: boolean;
}) {
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
}
