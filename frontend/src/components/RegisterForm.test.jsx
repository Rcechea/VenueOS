import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  it("renders all four fields", () => {
    render(
      <RegisterForm
        regFirstName=""
        setRegFirstName={() => {}}
        regLastName=""
        setRegLastName={() => {}}
        regEmail=""
        setRegEmail={() => {}}
        regPassword=""
        setRegPassword={() => {}}
        regError=""
        regSuccess=""
        onSubmit={() => {}}
        onSwitchToLogin={() => {}}
      />
    );

    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("displays a success message when the regSuccess prop is set", () => {
    render(
      <RegisterForm
        regFirstName=""
        setRegFirstName={() => {}}
        regLastName=""
        setRegLastName={() => {}}
        regEmail=""
        setRegEmail={() => {}}
        regPassword=""
        setRegPassword={() => {}}
        regError=""
        regSuccess="Account created! You can now log in."
        onSubmit={() => {}}
        onSwitchToLogin={() => {}}
      />
    );

    expect(screen.getByText("Account created! You can now log in.")).toBeInTheDocument();
  });
});