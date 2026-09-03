package com.example.venuewebappproject.DTO;

public class LoginResponse {

    private String token;
    private String role;
    private String firstName;
    private String lastName;

    public LoginResponse(String token, String role, String firstName, String lastName) {
        this.token = token;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
