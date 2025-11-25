
package com.booking.online_booking_system.controller;

import com.booking.online_booking_system.entity.Booking;
import com.booking.online_booking_system.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/book")
    public ResponseEntity<String> bookFacility(@RequestBody Booking bookingRequest) {
        List<Booking> existingBookings = bookingRepository.findByFacilityIdAndDate(
                bookingRequest.getFacilityId(), bookingRequest.getDate());

        boolean overlap = existingBookings.stream().anyMatch(b ->
                bookingRequest.getStartTime().isBefore(b.getEndTime()) &&
                bookingRequest.getEndTime().isAfter(b.getStartTime())
        );

        if (overlap) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("This time slot is already booked. Please choose another.");
        }

        bookingRepository.save(bookingRequest);
        return ResponseEntity.ok("Booking confirmed!");
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
