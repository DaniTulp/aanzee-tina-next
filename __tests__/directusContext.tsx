import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useDirectusClient, DirectusContext } from "src/react/useDirectus";
import { createBrowserClient } from "src/lib/createDirectusClient";

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
