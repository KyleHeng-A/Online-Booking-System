
package com.booking.online_booking_system.repository;

import com.booking.online_booking_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByEmailAndPassword(String email, String password);
}

