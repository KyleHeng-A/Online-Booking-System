
package com.booking.online_booking_system.repository;

import com.booking.online_booking_system.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByFacilityIdAndDate(String facilityId, LocalDate date);
}
