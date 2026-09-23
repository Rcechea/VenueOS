function AdminView({firstName, lastName, onLogout}){
    return(
        <div>
            <h1>Venue Booking App</h1>
            <p>Welcome Admin, {firstName} {lastName}!</p>
            <button onClick={onLogout}>Log Out</button>
        </div>
    );
}

export default AdminView;