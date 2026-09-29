import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";

describe("App - login", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("calls the login API with the entered email and password", async () => {
    const user = userEvent.setup();

    fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
            token: "fake-token",
            role: "customer",
            firstName: "Test",
            lastName: "User",
        }),
    })
    .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
    })
    .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
    });

    render(<App />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api/auth/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      })
    );
  });
});

describe("App - registration", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a success message after successful registration", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Register" }));

    await user.type(screen.getByLabelText("First Name"), "Test");
    await user.type(screen.getByLabelText("Last Name"), "User");
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Account created! You can now log in.")).toBeInTheDocument();
  });
});

describe("App - booking", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  async function loginAsCustomer(user) {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: "fake-token",
          role: "customer",
          firstName: "Test",
          lastName: "User",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: "The Great Pond", capacity: 200, description: "Main hall" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: "Wedding", description: "Wedding ceremony" }],
      });

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await screen.findByText("Capacity 200");
  }

  it("displays the conflict message when the room is already booked", async () => {
    const user = userEvent.setup();

    render(<App />);
    await loginAsCustomer(user);

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
    });

    await user.selectOptions(screen.getByLabelText("Room"), "1");
    await user.selectOptions(screen.getByLabelText("Event Type"), "1");
    await user.type(screen.getByLabelText("Event Name"), "Test Wedding");

    const dateInput = screen.getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2026-12-25" } });

    await user.click(screen.getByRole("button", { name: "Book room" }));

    expect(await screen.findByText("This room is already booked on that date")).toBeInTheDocument();
  });
});