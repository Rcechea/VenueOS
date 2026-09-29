import Logo from "./Logo";

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
        <div className="auth-screen">
            <div className="auth-hero">
                <Logo className="auth-motif" />
                <h1 className="wordmark">VenueOS</h1>
                <p className="auth-tagline">Bookings, staffing, and inventory — all in one place.</p>
            </div>

            <div className="auth-panel">
                <form onSubmit={onSubmit} className="auth-form">
                    <h2>Log in</h2>
                    <div className="field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button type="submit" className="btn-primary">Log in</button>
                </form>
                <p className="auth-switch">
                    Don't have an account?{" "}
                    <button onClick={onSwitchToRegister} className="btn-link">Register</button>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;