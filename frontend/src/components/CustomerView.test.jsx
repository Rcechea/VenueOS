import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerView from "./CustomerView";

const rooms = [{ id: 1, name: "The Great Pond", capacity: 200, description: "Main hall" }];
const eventTypes = [{ id: 1, name: "Wedding", description: "Wedding ceremony" }];

describe("CustomerView", () => {
  it("calls onBookingSubmit when the booking form is submitted", async () => {
    const user = userEvent.setup();
    const handleBookingSubmit = vi.fn((e) => e.preventDefault());

    render(
      <CustomerView
        firstName="Test"
        lastName="User"
        onLogout={() => {}}
        rooms={rooms}
        eventTypes={eventTypes}
        bookingRoomId="1"
        setBookingRoomId={() => {}}
        bookingEventTypeId="1"
        setBookingEventTypeId={() => {}}
        bookingEventName="Test Wedding"
        setBookingEventName={() => {}}
        bookingDate="2026-12-25"
        setBookingDate={() => {}}
        bookingError=""
        bookingSuccess=""
        onBookingSubmit={handleBookingSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: "Book room" }));

    expect(handleBookingSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays the conflict message when bookingError is set", () => {
    render(
      <CustomerView
        firstName="Test"
        lastName="User"
        onLogout={() => {}}
        rooms={rooms}
        eventTypes={eventTypes}
        bookingRoomId=""
        setBookingRoomId={() => {}}
        bookingEventTypeId=""
        setBookingEventTypeId={() => {}}
        bookingEventName=""
        setBookingEventName={() => {}}
        bookingDate=""
        setBookingDate={() => {}}
        bookingError="This room is already booked on that date"
        bookingSuccess=""
        onBookingSubmit={() => {}}
      />
    );

    expect(screen.getByText("This room is already booked on that date")).toBeInTheDocument();
  });
});