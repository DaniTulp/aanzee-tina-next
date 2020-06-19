import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { createBrowserClient, DirectusContext, useDirectusClient } from "src";

test("Expect exception to be thrown if there is no context", () => {
  const { result } = renderHook(() => useDirectusClient());

  expect(() => {
    expect(result.current).not.toBe(undefined);
  }).toThrowError(
    "useDirectusClient could not find an instance of Directus SDK"
  );
});

test("Expect to get a directusclient back", () => {
  const wrapper = ({ children }: any) => (
    <DirectusContext.Provider value={createBrowserClient()}>
      {children}
    </DirectusContext.Provider>
  );

  const { result } = renderHook(() => useDirectusClient, { wrapper });

  expect(result.current).toBeTruthy();
});
