import React from "react";
import {
  render,
  waitFor,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { DirectusProvider, Tina } from "src";
import { server, rest } from "test/server";

const setup = () => {
  return render(
    <Tina>
      <DirectusProvider>I am authenticated</DirectusProvider>
    </Tina>
  );
};

test("Should show the child when it's authenticated", async () => {
  const { getByText } = setup();
  expect(getByText("Loading...")).toBeInTheDocument();

  await waitFor(() =>
    expect(getByText("I am authenticated")).toBeInTheDocument()
  );
});

test("Should show the modal when it's unauthenticated and be able to reauthenticate", async () => {
  server.use(
    rest.get("/api", async (req, res, ctx) => res.once(ctx.status(400)))
  );

  const { getByText, getByTestId } = setup();
  expect(getByText("Loading...")).toBeInTheDocument();

  await waitFor(() =>
    expect(getByText("I am authenticated")).toBeInTheDocument()
  );

  await waitFor(() => expect(getByText("Reauthenticate")).toBeInTheDocument());

  const emailInput = getByTestId("email");
  fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });

  const passwordInput = getByTestId("password");
  fireEvent.change(passwordInput, { target: { value: "password" } });

  await act(async () => {
    await fireEvent.submit(passwordInput);
  });

  expect(getByText("Reauthenticate")).toBeInTheDocument()
  fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
  await act(async () => {
    await fireEvent.submit(passwordInput);
  });
  await waitForElementToBeRemoved(getByText("Reauthenticate"));
});
