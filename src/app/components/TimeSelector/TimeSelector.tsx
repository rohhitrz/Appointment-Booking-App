'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TimeSelector.module.scss';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiClock, FiCalendar, FiTrash2, FiX } from 'react-icons/fi';

// Define TimeSlot interface
interface TimeSlot {
  time: string;
  available: boolean;
  booked: boolean;
}

interface TimeSlots {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
}

const TimeSelector = () => {
  const { 
    selectedDate, 
    selectedTime, 
    setSelectedTime, 
    nextStep, 
    prevStep,
    isTimeSlotBooked,
    bookedAppointments,
    cancelBooking
  } = useAppointment();
  
  const [error, setError] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({
    morning: [],
    afternoon: [],
    evening: []
  });
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState<string | null>(null);
  
  // Track if time slots have been generated for current date
  const timeSlotsGeneratedRef = useRef<string | null>(null);
  
  // Generate time slots based on the selected date
  useEffect(() => {
    if (!selectedDate) return;
    
    const dateString = selectedDate.toDateString();
    
    // Only regenerate slots if date has changed
    if (timeSlotsGeneratedRef.current === dateString) return;
    
    timeSlotsGeneratedRef.current = dateString;
    
    const morningSlots = ['9:00 AM', '10:00 AM', '11:00 AM'];
    const afternoonSlots = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    const eveningSlots = ['5:00 PM', '6:00 PM', '7:00 PM'];
    
    // Generate a random seed based on date to keep availability consistent
    const dateSeed = selectedDate.getDate() + selectedDate.getMonth() * 31;
    
    // Function to determine availability based on time and date seed
    const isSlotAvailable = (time: string, index: number): boolean => {
      // Use a deterministic approach based on the date and time
      const timeCode = time.charCodeAt(0) + time.charCodeAt(1);
      const pseudoRandom = (dateSeed + timeCode + index) % 10;
      return pseudoRandom > 3; // 70% chance of being available
    };
    
    // Check availability for time slots
    const generateSlots = (slots: string[], timeType: string): TimeSlot[] => {
      return slots.map((time, index) => {
        const isBooked = isTimeSlotBooked(selectedDate, time);
        // Instead of random, use deterministic availability
        const isAvailable = !isBooked && isSlotAvailable(time, index);
        
        return {
          time,
          available: isAvailable,
          booked: isBooked
        };
      });
    };
    
    setTimeSlots({
      morning: generateSlots(morningSlots, 'morning'),
      afternoon: generateSlots(afternoonSlots, 'afternoon'),
      evening: generateSlots(eveningSlots, 'evening')
    });
    
    // Clear selected time when date changes
    setSelectedTime(null);
  }, [selectedDate, isTimeSlotBooked, setSelectedTime]);
  
  const handleTimeSelect = (time: string) => {
    // Only set selected time if it's available (not booked)
    setSelectedTime(time);
    setError(null);
  };
  
  const handleContinue = () => {
    if (!selectedTime) {
      setError('Please select a time slot to continue');
      return;
    }
    nextStep();
  };
  
  const handleCancelBooking = (appointmentId: string) => {
    cancelBooking(appointmentId);
    setCancelConfirmation(null);
  };
  
  // Format the date for display
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';
  
  // Filter bookings for the selected date
  const bookingsForSelectedDate = selectedDate 
    ? bookedAppointments.filter(booking => 
        booking.date.toDateString() === selectedDate.toDateString()
      )
    : [];
  
  // Sort bookings by date
  const sortedBookings = [...bookedAppointments].sort((a, b) => {
    // Sort by date (newest first)
    const dateComparison = b.date.getTime() - a.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If same date, sort by time
    return a.time.localeCompare(b.time);
  });
  
  // Check if a booking is in the future
  const isBookingInFuture = (booking: typeof bookedAppointments[0]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    
    return bookingDate >= today;
  };
  
  // Check if a slot is available or booked
  const isSlotAvailable = (time: string): boolean => {
    if (!selectedDate) return false;
    
    const timeGroup = 
      timeSlots.morning.find(slot => slot.time === time) ||
      timeSlots.afternoon.find(slot => slot.time === time) ||
      timeSlots.evening.find(slot => slot.time === time);
    
    return timeGroup?.available || false;
  };
  
  const isSlotBooked = (time: string): boolean => {
    if (!selectedDate) return false;
    
    const timeGroup = 
      timeSlots.morning.find(slot => slot.time === time) ||
      timeSlots.afternoon.find(slot => slot.time === time) ||
      timeSlots.evening.find(slot => slot.time === time);
    
    return timeGroup?.booked || false;
  };
  
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.title}>
        <h2>Select a Time</h2>
        <p>Choose an available time slot for {formattedDate}</p>
        
        {bookedAppointments.length > 0 && (
          <motion.button
            className={styles.viewBookingsButton}
            onClick={() => setShowMyBookings(!showMyBookings)}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <FiCalendar />
            {showMyBookings ? 'Hide My Bookings' : 'View My Bookings'}
          </motion.button>
        )}
      </div>
      
      {showMyBookings && (
        <motion.div 
          className={styles.myBookingsContainer}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3>Your Bookings</h3>
          {bookedAppointments.length === 0 ? (
            <p>You don't have any bookings yet.</p>
          ) : (
            <div className={styles.bookingsList}>
              {sortedBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className={`${styles.bookingItem} ${isBookingInFuture(booking) ? styles.futureBooking : styles.pastBooking}`}
                >
                  <div className={styles.bookingInfo}>
                    <span className={styles.bookingDate}>
                      {booking.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={styles.bookingTime}>{booking.time}</span>
                  </div>
                  
                  {isBookingInFuture(booking) && (
                    cancelConfirmation === booking.id ? (
                      <div className={styles.cancelConfirmation}>
                        <span>Are you sure?</span>
                        <button 
                          className={styles.confirmCancelButton}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Yes
                        </button>
                        <button 
                          className={styles.cancelCancelButton}
                          onClick={() => setCancelConfirmation(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        className={styles.cancelButton}
                        onClick={() => setCancelConfirmation(booking.id)}
                      >
                        <FiTrash2 />
                        Cancel
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
      
      {/* <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.availableColor}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selectedColor}`}></div>
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.bookedColor}`}></div>
          <span>Booked</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.unavailableColor}`}></div>
          <span>Unavailable</span>
        </div>
      </div> */}
      
      <div className={styles.timeGroup}>
        <h3 className={styles.groupTitle}>Morning</h3>
        <div className={styles.timeSlotsWrapper}>
          {timeSlots.morning.map((slot, index) => (
            <motion.div
              key={`morning-${index}`}
              className={`${styles.timeSlot} 
                ${selectedTime === slot.time ? styles.selected : ''} 
                ${slot.booked ? styles.booked : ''}
                ${!slot.available && !slot.booked ? styles.disabled : ''}`}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              whileHover={slot.available ? { scale: 1.05 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className={styles.timeValue}>{slot.time}</span>
              <small className={styles.availability}>
                {slot.booked 
                  ? 'Booked' 
                  : slot.available 
                    ? selectedTime === slot.time 
                      ? 'Selected' 
                      : 'Available' 
                    : 'Unavailable'}
              </small>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className={styles.timeGroup}>
        <h3 className={styles.groupTitle}>Afternoon</h3>
        <div className={styles.timeSlotsWrapper}>
          {timeSlots.afternoon.map((slot, index) => (
            <motion.div
              key={`afternoon-${index}`}
              className={`${styles.timeSlot} 
                ${selectedTime === slot.time ? styles.selected : ''} 
                ${slot.booked ? styles.booked : ''}
                ${!slot.available && !slot.booked ? styles.disabled : ''}`}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              whileHover={slot.available ? { scale: 1.05 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <span className={styles.timeValue}>{slot.time}</span>
              <small className={styles.availability}>
                {slot.booked 
                  ? 'Booked' 
                  : slot.available 
                    ? selectedTime === slot.time 
                      ? 'Selected' 
                      : 'Available' 
                    : 'Unavailable'}
              </small>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className={styles.timeGroup}>
        <h3 className={styles.groupTitle}>Evening</h3>
        <div className={styles.timeSlotsWrapper}>
          {timeSlots.evening.map((slot, index) => (
            <motion.div
              key={`evening-${index}`}
              className={`${styles.timeSlot} 
                ${selectedTime === slot.time ? styles.selected : ''} 
                ${slot.booked ? styles.booked : ''}
                ${!slot.available && !slot.booked ? styles.disabled : ''}`}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              whileHover={slot.available ? { scale: 1.05 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <span className={styles.timeValue}>{slot.time}</span>
              <small className={styles.availability}>
                {slot.booked 
                  ? 'Booked' 
                  : slot.available 
                    ? selectedTime === slot.time 
                      ? 'Selected' 
                      : 'Available' 
                    : 'Unavailable'}
              </small>
            </motion.div>
          ))}
        </div>
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: 'var(--secondary)', textAlign: 'center', marginBottom: '1rem' }}
        >
          {error}
        </motion.p>
      )}
      
      <div className={styles.buttonGroup}>
        <Button
          onClick={prevStep}
          icon={<FiArrowLeft />}
          variant="ghost"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          icon={<FiArrowRight />}
          variant="neumorphic"
          disabled={!selectedTime}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default TimeSelector; 