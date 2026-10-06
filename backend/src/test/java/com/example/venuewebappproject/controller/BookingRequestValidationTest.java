package com.example.venuewebappproject.DTO;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class BookingRequestValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private BookingRequest validRequest() {
        BookingRequest request = new BookingRequest();
        request.setRoomId(1L);
        request.setEventTypeId(1L);
        request.setEventName("Test Wedding");
        request.setDate(LocalDate.now().plusDays(30));
        return request;
    }

    @Test
    void validRequest_hasNoViolations() {
        assertTrue(validator.validate(validRequest()).isEmpty());
    }

    @Test
    void missingRoom_isRejected() {
        BookingRequest request = validRequest();
        request.setRoomId(null);

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void pastDate_isRejected() {
        BookingRequest request = validRequest();
        request.setDate(LocalDate.now().minusDays(1));

        assertFalse(validator.validate(request).isEmpty());
    }
}