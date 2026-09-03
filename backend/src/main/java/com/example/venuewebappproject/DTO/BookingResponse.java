package com.example.venuewebappproject.DTO;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private String customerFirstName;
    private String customerLastName;
    private String roomName;
    private String eventTypeName;
    private String eventName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public BookingResponse(Long id, String customerFirstName, String customerLastName, String roomName, String eventTypeName, String eventName, LocalDateTime startTime, LocalDateTime endTime, String status) {
        this.id = id;
        this.customerFirstName = customerFirstName;
        this.customerLastName = customerLastName;
        this.roomName = roomName;
        this.eventTypeName = eventTypeName;
        this.eventName = eventName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerFirstName() {
        return customerFirstName;
    }

    public void setCustomerFirstName(String customerFirstName) {
        this.customerFirstName = customerFirstName;
    }

    public String getCustomerLastName() {
        return customerLastName;
    }

    public void setCustomerLastName(String customerLastName) {
        this.customerLastName = customerLastName;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getEventTypeName() {
        return eventTypeName;
    }

    public void setEventTypeName(String eventTypeName) {
        this.eventTypeName = eventTypeName;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
