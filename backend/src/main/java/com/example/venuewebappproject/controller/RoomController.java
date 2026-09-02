package com.example.venuewebappproject.controller;

import com.example.venuewebappproject.model.Room;
import com.example.venuewebappproject.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/api/rooms")
    public List<Room> getAllRooms(){
        return roomRepository.findAll();
    }

}
