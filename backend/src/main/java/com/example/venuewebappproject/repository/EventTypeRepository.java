package com.example.venuewebappproject.repository;

import com.example.venuewebappproject.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventTypeRepository extends JpaRepository<EventType, Long> {

}