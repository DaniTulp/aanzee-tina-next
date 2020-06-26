import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { PreviewProvider, usePreview } from "src";

test("should get value from preview provider", () => {
  const wrapper = ({ children }: any) => (
    <PreviewProvider value={false}>{children}</PreviewProvider>
  );

  const { result } = renderHook(() => usePreview(), { wrapper });

  expect(result.current).toBe(false);
});
