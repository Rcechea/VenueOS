import { useState, useEffect } from "react";
import AdminView from "./components/AdminView";
import CustomerView from "./components/CustomerView";
import StaffView from "./components/StaffView";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

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
      <CustomerView
        firstName={firstName}
        lastName={lastName}
        onLogout={handleLogout}
        rooms={rooms}
        eventTypes={eventTypes}
        bookingRoomId={bookingRoomId}
        setBookingRoomId={setBookingRoomId}
        bookingEventTypeId={bookingEventTypeId}
        setBookingEventTypeId={setBookingEventTypeId}
        bookingEventName={bookingEventName}
        setBookingEventName={setBookingEventName}
        bookingDate={bookingDate}
        setBookingDate={setBookingDate}
        bookingError={bookingError}
        bookingSuccess={bookingSuccess}
        onBookingSubmit={handleBookingSubmit}
      />
    );
  }

  if (loggedInEmail && role === "admin") {
    return <AdminView firstName={firstName} lastName={lastName} onLogout={handleLogout} />;
  }

  if (loggedInEmail && role === "staff") {
    return <StaffView firstName={firstName} lastName={lastName} onLogout={handleLogout} />;
  }


  if (mode === "register") {
    return (
      <RegisterForm
        regFirstName={regFirstName}
        setRegFirstName={setRegFirstName}
        regLastName={regLastName}
        setRegLastName={setRegLastName}
        regEmail={regEmail}
        setRegEmail={setRegEmail}
        regPassword={regPassword}
        setRegPassword={setRegPassword}
        regError={regError}
        regSuccess={regSuccess}
        onSubmit={handleRegisterSubmit}
        onSwitchToLogin={() => setMode("login")}
      />
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
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      onSubmit={handleSubmit}
      onSwitchToRegister={() => setMode("register")}
    />
  );
}

export default App;
