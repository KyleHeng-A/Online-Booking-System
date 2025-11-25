package com.booking.online_booking_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.online_booking_system.repository.StudentRepository;
import com.booking.online_booking_system.entity.Student;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private StudentRepository studentRepository;

    // Hardcoded credentials
    private static final String ADMIN_EMAIL = "admin@tus.ie";
    private static final String ADMIN_PASSWORD = "admin123";

    private static final String STUDENT_EMAIL = "student@student.tus.ie";
    private static final String STUDENT_PASSWORD = "student123";

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Student loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // ✅ Check hardcoded admin credentials
        if (ADMIN_EMAIL.equalsIgnoreCase(email) && ADMIN_PASSWORD.equals(password)) {
            return ResponseEntity.ok("Login successful! (Admin)");
        }

        // ✅ Check hardcoded student credentials
        if (STUDENT_EMAIL.equalsIgnoreCase(email) && STUDENT_PASSWORD.equals(password)) {
            return ResponseEntity.ok("Login successful! (Student)");
        }

        // ✅ Check database for student credentials
        Student student = studentRepository.findByEmailAndPassword(email, password);
        if (student != null) {
            return ResponseEntity.ok("Login successful! (Student from DB)");
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudent(@RequestBody Student student) {
        studentRepository.save(student);
        return ResponseEntity.ok("Student added successfully!");
    }
}

