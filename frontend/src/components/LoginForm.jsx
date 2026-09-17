function LoginForm({
    email,
    setEmail,
    password,
    setPassword,
    error,
    onSubmit,
    onSwitchToRegister,
}) {
    return (
        <div>
        <h1>Venue Booking App</h1>
        <form onSubmit={onSubmit}>
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
            <button onClick={onSwitchToRegister}>Register</button>
        </p>
    </div>
  );
}

export default LoginForm;