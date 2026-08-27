import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState(null);

  const [mode, setMode] = useState("login");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
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

      const token = await response.text();
      localStorage.setItem("token", token);
      setLoggedInEmail(email);
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    }
  }

  if (loggedInEmail){
    return (
      <div>
        <h1>Venue Booking App</h1>
        <p>Welcome, {loggedInEmail}!</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }

  if (mode === "register"){
    return (
      <div>
        <h1>Venue Booking App</h1>
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value ={regFirstName}
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
          {regError && <p style={{ color: "red"}}>{regError}</p>}
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
    setLoggedInEmail(null);
    setEmail("");
    setPassword("");
  }

  async function handleRegisterSubmit(e){
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
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

      if (response.status === 409){
        setRegError("Email already registered");
        return;
      }

      if (!response.ok){
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
    } catch (err){
      setRegError ("Something went wrong. Is backend running?");
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