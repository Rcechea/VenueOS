package com.example.venuewebappproject.controller;

import com.example.venuewebappproject.DTO.BookingRequest;
import com.example.venuewebappproject.DTO.BookingResponse;
import com.example.venuewebappproject.model.Booking;
import com.example.venuewebappproject.model.EventType;
import com.example.venuewebappproject.model.Room;
import com.example.venuewebappproject.model.User;
import com.example.venuewebappproject.repository.BookingRepository;
import com.example.venuewebappproject.repository.EventTypeRepository;
import com.example.venuewebappproject.repository.RoomRepository;
import com.example.venuewebappproject.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    private static final LocalDate DATE = LocalDate.of(2030, 6, 15);
    private static final LocalDateTime DAY_START = DATE.atStartOfDay();
    private static final LocalDateTime DAY_END = DATE.atTime(23, 59, 59);

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private EventTypeRepository eventTypeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private BookingController bookingController;

    @BeforeEach
    void setUp() {
        when(authentication.getName()).thenReturn("test@example.com");
    }

    private User customer() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        return user;
    }

    private Room room() {
        Room room = new Room();
        room.setId(1L);
        room.setName("The Great Pond");
        return room;
    }

    private EventType eventType() {
        EventType eventType = new EventType();
        eventType.setId(1L);
        eventType.setName("Wedding");
        return eventType;
    }

    private BookingRequest request() {
        BookingRequest request = new BookingRequest();
        request.setRoomId(1L);
        request.setEventTypeId(1L);
        request.setEventName("Test Wedding");
        request.setDate(DATE);
        return request;
    }

    @Test
    void createBooking_succeeds_andLinksBookingToLoggedInCustomer() {
        User customer = customer();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(customer));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room()));
        when(eventTypeRepository.findById(1L)).thenReturn(Optional.of(eventType()));
        when(bookingRepository.findOverlappingBooking(1L, DAY_START, DAY_END)).thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = bookingController.createBooking(request(), authentication);

        assertEquals(201, response.getStatusCode().value());
        BookingResponse body = (BookingResponse) response.getBody();
        assertEquals("The Great Pond", body.getRoomName());
        assertEquals("Wedding", body.getEventTypeName());
        assertEquals("pending", body.getStatus());

        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(captor.capture());
        Booking saved = captor.getValue();
        assertEquals(customer, saved.getCustomer());
        assertEquals(DAY_START, saved.getStartTime());
        assertEquals(DAY_END, saved.getEndTime());
    }

    @Test
    void createBooking_rejectsRoomThatIsAlreadyBooked() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(customer()));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room()));
        when(eventTypeRepository.findById(1L)).thenReturn(Optional.of(eventType()));
        when(bookingRepository.findOverlappingBooking(1L, DAY_START, DAY_END)).thenReturn(List.of(new Booking()));

        ResponseEntity<?> response = bookingController.createBooking(request(), authentication);

        assertEquals(409, response.getStatusCode().value());
        assertEquals("Room is already booked for that date", response.getBody());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_rejectsUnknownRoom() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(customer()));
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = bookingController.createBooking(request(), authentication);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Room not found", response.getBody());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_rejectsUnknownEventType() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(customer()));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room()));
        when(eventTypeRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = bookingController.createBooking(request(), authentication);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Event type not found", response.getBody());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_rejectsWhenLoggedInUserDoesNotExist() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        ResponseEntity<?> response = bookingController.createBooking(request(), authentication);

        assertEquals(401, response.getStatusCode().value());
        verify(bookingRepository, never()).save(any());
    }
}