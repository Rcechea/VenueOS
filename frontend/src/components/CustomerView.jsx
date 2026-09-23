function roomIcon(name) {
  const n = (name || "").toLowerCase();

  if (n.includes("main")) {
    return (
      <svg viewBox="0 0 32 32" className="room-icon" aria-hidden="true">
        <g fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 12 Q10 8 16 12 Q22 16 28 12" />
          <path d="M4 18 Q10 14 16 18 Q22 22 28 18" />
          <path d="M4 24 Q10 20 16 24 Q22 28 28 24" />
        </g>
      </svg>
    );
  }

  if (n.includes("small")) {
    return (
      <svg viewBox="0 0 32 32" className="room-icon" aria-hidden="true">
        <path
          d="M4 24 C8 10 20 6 28 10 C24 14 18 14 14 20 C12 23 10 25 4 24 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className="room-icon" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round">
        <ellipse cx="16" cy="22" rx="11" ry="5" />
        <path d="M8 20 L12 14 M14 19 L17 11 M20 19 L23 13" />
      </g>
    </svg>
  );
}

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
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="topbar-brand">
          <svg viewBox="0 0 160 180" className="brand-mark" aria-hidden="true">
            <g fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 47 L48 33 C44 20 52 11 62 11 C72 11 78 20 74 30 C66 48 12 70 10 120 C9 150 35 170 70 170 C115 170 145 130 146 65" />
              <path d="M146 65 C140 105 105 135 66 143" />
            </g>
          </svg>
          <span>VenueOS</span>
        </div>
        <div className="topbar-user">
          <span>Welcome, {firstName} {lastName}</span>
          <button onClick={onLogout} className="btn-secondary">Log out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section>
          <h2 className="section-title">Rooms</h2>
          <div className="room-grid">
            {rooms.map((room) => (
              <div className="room-card" key={room.id}>
                {roomIcon(room.name)}
                <h3>{room.name}</h3>
                <p className="room-meta">Capacity {room.capacity}</p>
                <p className="room-desc">{room.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="booking-section">
          <h2 className="section-title">Book a room</h2>
          <form onSubmit={onBookingSubmit} className="booking-form">
            <div className="field">
              <label>Room</label>
              <select
                value={bookingRoomId}
                onChange={(e) => setBookingRoomId(e.target.value)}
                required
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Event type</label>
              <select
                value={bookingEventTypeId}
                onChange={(e) => setBookingEventTypeId(e.target.value)}
                required
              >
                <option value="">Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>{eventType.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Event name</label>
              <input
                type="text"
                value={bookingEventName}
                onChange={(e) => setBookingEventName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            {bookingError && <p className="form-error">{bookingError}</p>}
            {bookingSuccess && <p className="form-success">{bookingSuccess}</p>}
            <button type="submit" className="btn-primary">Book room</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CustomerView;