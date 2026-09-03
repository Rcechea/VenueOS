package com.example.venuewebappproject.controller;

import com.example.venuewebappproject.DTO.BookingRequest;
import com.example.venuewebappproject.model.Booking;
import com.example.venuewebappproject.model.EventType;
import com.example.venuewebappproject.model.Room;
import com.example.venuewebappproject.model.User;
import com.example.venuewebappproject.repository.BookingRepository;
import com.example.venuewebappproject.repository.EventTypeRepository;
import com.example.venuewebappproject.repository.RoomRepository;
import com.example.venuewebappproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication){

        Optional<User> customerOptional = userRepository.findByEmail(authentication.getName());
        if (customerOptional.isEmpty()){
            return ResponseEntity.status(401).body("User not found");
        }

        User customer = customerOptional.get();

        Optional<Room> roomOptional = roomRepository.findById(request.getRoomId());
        if (roomOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Room not found");
        }

        Room room = roomOptional.get();

        Optional<EventType> eventTypeOptional = eventTypeRepository.findById(request.getEventTypeId());
        if (eventTypeOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Event type not found");
        }

        EventType eventType = eventTypeOptional.get();

        LocalDateTime startTime = request.getDate().atStartOfDay();
        LocalDateTime endTime = request.getDate().atTime(23, 59, 59);

        List<Booking> conflicts = bookingRepository.findOverlappingBooking(room.getId(), startTime, endTime);

        if (!conflicts.isEmpty()) {
            return ResponseEntity.status(409).body("Room is already booked on this date");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setEventType(eventType);
        booking.setEventName(request.getEventName());
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);

        Booking saved = bookingRepository.save(booking);

        return ResponseEntity.status(201).body(saved);
    }
}
