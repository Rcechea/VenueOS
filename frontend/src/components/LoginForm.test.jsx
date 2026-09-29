import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";
import userEvent from "@testing-library/user-event";

describe("LoginForm", () => {
  it("renders the email and password fields", () => {
    render(
      <LoginForm
        email=""
        setEmail={() => {}}
        password=""
        setPassword={() => {}}
        error=""
        onSubmit={() => {}}
        onSwitchToRegister={() => {}}
      />
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("displays an error message when the error prop is set", () => {
    render(
      <LoginForm
        email=""
        setEmail={() => {}}
        password=""
        setPassword={() => {}}
        error="Invalid email or password"
        onSubmit={() => {}}
        onSwitchToRegister={() => {}}
      />
    );

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <LoginForm
        email="test@example.com"
        setEmail={() => {}}
        password="password123"
        setPassword={() => {}}
        error=""
        onSubmit={handleSubmit}
        onSwitchToRegister={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});