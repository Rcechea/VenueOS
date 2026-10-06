package com.example.venuewebappproject.controller;

import com.example.venuewebappproject.DTO.LoginRequest;
import com.example.venuewebappproject.DTO.LoginResponse;
import com.example.venuewebappproject.DTO.RegisterRequest;
import com.example.venuewebappproject.model.User;
import com.example.venuewebappproject.repository.UserRepository;
import com.example.venuewebappproject.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest newRegisterRequest(String email) {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword("password123");
        request.setFirstName("Test");
        request.setLastName("User");
        return request;
    }

    @Test
    void register_succeeds_andStoresHashedPassword() {
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        ResponseEntity<?> response = authController.register(newRegisterRequest("new@example.com"));

        assertEquals(201, response.getStatusCode().value());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("hashed-password", captor.getValue().getPasswordHash());
        assertNotEquals("password123", captor.getValue().getPasswordHash());
    }

    @Test
    void register_rejectsDuplicateEmail() {
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = authController.register(newRegisterRequest("existing@example.com"));

        assertEquals(409, response.getStatusCode().value());
        verify(userRepository, never()).save(any());
    }

    private User existingUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("hashed-password");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole("customer");
        return user;
    }

    private LoginRequest loginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    @Test
    void login_succeeds_withValidCredentials() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser()));
        when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(true);
        when(jwtService.generateToken("test@example.com")).thenReturn("fake-jwt");

        ResponseEntity<?> response = authController.login(loginRequest("test@example.com", "password123"));

        assertEquals(200, response.getStatusCode().value());
        LoginResponse body = (LoginResponse) response.getBody();
        assertEquals("fake-jwt", body.getToken());
        assertEquals("customer", body.getRole());
        assertEquals("Test", body.getFirstName());
    }

    @Test
    void login_rejectsWrongPassword() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser()));
        when(passwordEncoder.matches("wrong", "hashed-password")).thenReturn(false);

        ResponseEntity<?> response = authController.login(loginRequest("test@example.com", "wrong"));

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Invalid email or password", response.getBody());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_rejectsUnknownEmail_withSameMessageAsWrongPassword() {
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.login(loginRequest("nobody@example.com", "password123"));

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Invalid email or password", response.getBody());
    }
}