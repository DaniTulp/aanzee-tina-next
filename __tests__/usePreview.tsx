import React from 'react'
import { renderHook } from "@testing-library/react-hooks";
import { usePreview, PreviewContext } from "../src/react/usePreview";

test("should get value from preview provider", () => {
  const wrapper = ({ children }: any) => (
    <PreviewContext.Provider value={false}>{children}</PreviewContext.Provider>
  );
  const { result } = renderHook(() => usePreview(), { wrapper });
  expect(result.current).toBe(false)
});
