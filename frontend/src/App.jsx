import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const [mode, setMode] = useState("login");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const [rooms, setRooms] = useState([]);

  const [eventTypes, setEventTypes] = useState([]);

  const [bookingRoomId, setBookingRoomId] = useState("");
  const [bookingEventTypeId, setBookingEventTypeId] = useState("");
  const [bookingEventName, setBookingEventName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");


  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: bookingRoomId,
          eventTypeId: bookingEventTypeId,
          eventName: bookingEventName,
          date: bookingDate,
        }),
      });

      if (response.status === 409) {
        setBookingError("This room is already booked on that date");
        return;
      }

      if (!response.ok) {
        setBookingError("Something went wrong. Please try again.");
        return;
      }

      setBookingSuccess("Booking created!");
      setBookingRoomId("");
      setBookingEventTypeId("");
      setBookingEventName("");
      setBookingDate("");
    } catch (err) {
      setBookingError("Something went wrong. Is the backend running?");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("firstName", data.firstName)
      localStorage.setItem("lastName", data.lastName)
      setRole(data.role);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setLoggedInEmail(email);

    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    }
  }

  useEffect(() => {
    if (!loggedInEmail) return;

    const token = localStorage.getItem("token");

    fetch(`${API_URL}api/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Failed to load rooms", err));

    fetch(`${API_URL}api/event-types`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((err) => console.error("Failed to load event types", err));
  }, [loggedInEmail]);

  if (loggedInEmail && role === "customer") {
    return (
      <div>
        <h1>Venue Booking App</h1>
        <p>Welcome, {firstName} {lastName}!</p>
        <button onClick={handleLogout}>Log Out</button>

        <h2>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              {room.name} — capacity {room.capacity} — {room.description}
            </li>
          ))}
        </ul>
        <h2>Book a Room</h2>
        <form onSubmit={handleBookingSubmit}>
          <div>
            <label>Room</label>
            <select 
              value={bookingRoomId}
              onChange={(e) => setBookingRoomId(e.target.value)}
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
              >
                <option value="">Select an event type</option>
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
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
          {bookingSuccess && <p style={{ color: "green" }}>{bookingSuccess}</p>}
          <button type="submit">Book Room</button>
        </form>
      </div>
    );
  }

  if (loggedInEmail && role === "admin") {
    return (
      <div>
        <h1>Venue Booking App</h1>
        <p>Welcome Admin, {firstName} {lastName}!</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }

  if (loggedInEmail && role === "staff") {
    return (
      <div>
        <h1>Venue Booking App</h1>
        <p>Welcome Staff, {firstName} {lastName}!</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }


  if (mode === "register") {
    return (
      <div>
        <h1>Venue Booking App</h1>
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
          </div>
          {regError && <p style={{ color: "red" }}>{regError}</p>}
          {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an Account?{" "}
          <button onClick={() => setMode("login")}>Log In</button>
        </p>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setLoggedInEmail(null);
    setRole(null);
    setFirstName(null);
    setLastName(null);
    setEmail("");
    setPassword("");
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    try {
      const response = await fetch(`${API_URL}api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          firstName: regFirstName,
          lastName: regLastName,
        }),
      });

      if (response.status === 409) {
        setRegError("Email already registered");
        return;
      }

      if (!response.ok) {
        setRegError("Something went wrong. Please try again.");
        return;
      }

      setRegSuccess("Account created! You can now log in.");
      setRegEmail("");
      setRegPassword("");
      setRegFirstName("");
      setRegLastName("");

      setTimeout(() => {
        setMode("login");
        setRegSuccess("");
      }, 1500);
    } catch (err) {
      setRegError("Something went wrong. Is backend running?");
    }
  }

  return (
    <div>
      <h1>Venue Booking App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => setMode("register")}>Register</button>
      </p>
    </div>
  );
}

export default App;
