package com.example.venuewebappproject.controller;

import com.example.venuewebappproject.model.EventType;
import com.example.venuewebappproject.repository.EventTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EventTypeController {

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @GetMapping("/api/event-types")
    public List<EventType> getAllEventTypes() {
        return eventTypeRepository.findAll();
    }

}