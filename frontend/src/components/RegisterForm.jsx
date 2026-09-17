function RegisterForm({
    regFirstName,
    setRegFirstName,
    regLastName,
    setRegLastName,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    regError,
    regSuccess,
    onSubmit,
    onSwitchToLogin,
}) {
    return (
        <div>
            <h1>Venue Booking App</h1>
            <form onSubmit={onSubmit}>
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
            <button onClick={onSwitchToLogin}>Log In</button>
        </p>
    </div>
  );
}

export default RegisterForm;