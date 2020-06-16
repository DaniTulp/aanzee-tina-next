import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { usePreview, PreviewContext } from "src/react/usePreview";

test("should get value from preview provider", () => {
  
  //Arrange
  const wrapper = ({ children }: any) => (
    <PreviewContext.Provider value={false}>{children}</PreviewContext.Provider>
  );

  //Act
  const { result } = renderHook(() => usePreview(), { wrapper });
  
  //Assert
  expect(result.current).toBe(false);
});
