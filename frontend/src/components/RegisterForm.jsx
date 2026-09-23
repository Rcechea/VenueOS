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
                <svg viewBox="0 0 160 180" className="auth-motif" aria-hidden="true">
                    <g
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M23 47 L48 33 C44 20 52 11 62 11 C72 11 78 20 74 30 C66 48 12 70 10 120 C9 150 35 170 70 170 C115 170 145 130 146 65" />
                        <path d="M146 65 C140 105 105 135 66 143" />
                        <path d="M101 30 C75 50 45 85 36 120 C35 126 38 128 42 124" />
                        <path d="M101 30 C112 50 116 75 110 96" />
                        <path d="M42 124 C75 100 115 100 144 77" />
                    </g>
                </svg>
                <h1 className="wordmark">VenueOS</h1>
                <p className="auth-tagline">Bookings, staffing, and inventory — all in one place.</p>
            </div>

            <div className="auth-panel">
                <form onSubmit={onSubmit} className="auth-form">
                    <h2>Create an account</h2>
                    <div className="field">
                        <label>First name</label>
                        <input
                            type="text"
                            value={regFirstName}
                            onChange={(e) => setRegFirstName(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Last name</label>
                        <input
                            type="text"
                            value={regLastName}
                            onChange={(e) => setRegLastName(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
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