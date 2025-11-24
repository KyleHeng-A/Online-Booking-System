
package com.booking.online_booking_system.controller;

import com.booking.online_booking_system.entity.Student;
import com.booking.online_booking_system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Student loginRequest) {
        Student student = studentRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        return (student != null) ? ResponseEntity.ok("Login successful!") :
                ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudent(@RequestBody Student student) {
        studentRepository.save(student);
        return ResponseEntity.ok("Student added successfully!");
    }
}

