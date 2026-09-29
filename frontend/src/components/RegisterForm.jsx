import Logo from "./Logo";

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
        <div className="auth-screen">
            <div className="auth-hero">
                <Logo className="auth-motif" />
                <h1 className="wordmark">VenueOS</h1>
                <p className="auth-tagline">Bookings, staffing, and inventory — all in one place.</p>
            </div>

            <div className="auth-panel">
                <form onSubmit={onSubmit} className="auth-form">
                    <h2>Create an account</h2>
                    <div className="field">
                        <label htmlFor="register-first-name">First Name</label>
                        <input
                            id="register-first-name"
                            type="text"
                            value={regFirstName}
                            onChange={(e) => setRegFirstName(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="register-first-name">Last Name</label>
                        <input
                            id="register-first-name"
                            type="text"
                            value={regLastName}
                            onChange={(e) => setRegLastName(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                        />
                    </div>
                    {regError && <p className="form-error">{regError}</p>}
                    {regSuccess && <p className="form-success">{regSuccess}</p>}
                    <button type="submit" className="btn-primary">Create account</button>
                </form>
                <p className="auth-switch">
                    Already have an account?{" "}
                    <button onClick={onSwitchToLogin} className="btn-link">Log in</button>
                </p>
            </div>
        </div>
    );
}

export default RegisterForm;