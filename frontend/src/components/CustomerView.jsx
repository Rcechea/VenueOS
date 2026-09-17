function CustomerView({
    firstName,
    lastName,
    onLogout,
    rooms,
    eventTypes,
    bookingRoomId,
    setBookingRoomId,
    bookingEventTypeId,
    setBookingEventTypeId,
    bookingEventName,
    setBookingEventName,
    bookingDate,
    setBookingDate,
    bookingError,
    bookingSuccess,
    onBookingSubmit,
}) {
    return (
        <div>
            <h1>Venue Booking App</h1>
            <p>Welcome, {firstName} {lastName}!</p>
            <button onClick={onLogout}>Log Out</button>
            <h2>Rooms</h2>
            <ul>
                {rooms.map((room) => (
                    <li key = {room.id}>
                        {room.name} - capacity {room.capacity} - {room.description}
                    </li>
                ))}
            </ul>
            <h2>Book a Room</h2>
            <form onSubmit = {onBookingSubmit}>
                <div>
                    <label>Room</label>
                    <select
                        value={bookingRoomId}
                        onChange={(e) => setBookingRoomId(e.target.value)}
                        required
                    >
                        <option value="">Select a room</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Event Type</label>
                    <select
                        value={bookingEventTypeId}
                        onChange={(e) => setBookingEventTypeId(e.target.value)}
                        required
                    >
                        <option value ="">Select an event type</option>
                        {eventTypes.map((eventType) => (
                            <option key={eventType.id} value={eventType.id}>
                                {eventType.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Event Name</label>
                    <input
                        type="text"
                        value={bookingEventName}
                        onChange={(e) => setBookingEventName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />
                </div>
                {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
                {bookingSuccess && <p style={{ color: "green" }}>{bookingSuccess}</p>}
                <button type="submit">Book Room</button>
            </form>
        </div>
    )
}

export default CustomerView;