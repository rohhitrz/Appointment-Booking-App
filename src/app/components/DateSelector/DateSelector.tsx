'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DateSelector.module.scss';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

// Define a type for react-calendar's value
type CalendarValue = Date | Date[] | null;

const DateSelector = () => {
  const { selectedDate, setSelectedDate, nextStep, bookedAppointments } = useAppointment();
  const [error, setError] = useState<string | null>(null);
  const [activeDateHighlight, setActiveDateHighlight] = useState<Date | null>(null);
  
  // Set min date to today and max date to 3 months from now
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  // Update active date highlight when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setActiveDateHighlight(selectedDate);
    }
  }, [selectedDate]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      // Immediately highlight the selected date
      setActiveDateHighlight(value);
      
      // Set the actual selected date
      setSelectedDate(value);
      setError(null);
    }
  };
  
  const handleContinue = () => {
    if (!selectedDate) {
      setError('Please select a date to continue');
      return;
    }
    nextStep();
  };
  
  // Filter out unavailable dates
  const tileDisabled = ({ date }: { date: Date }) => {
    // Disable past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }
    
    // Disable weekends if needed
    // const day = date.getDay();
    // if (day === 0 || day === 6) { // 0 is Sunday, 6 is Saturday
    //   return true;
    // }
    
    return false;
  };
  
  // Custom tile class for booked dates
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    // Check if date has any bookings
    const hasBookings = bookedAppointments.some(appointment => 
      appointment.date.toDateString() === date.toDateString()
    );
    
    // Highlight the active date
    const isActiveDate = activeDateHighlight && 
      activeDateHighlight.toDateString() === date.toDateString();
    
    if (hasBookings && isActiveDate) {
      return `${styles.hasBookings} ${styles.activeDate}`;
    } else if (hasBookings) {
      return styles.hasBookings;
    } else if (isActiveDate) {
      return styles.activeDate;
    }
    
    return null;
  };
  
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.title}>
        <h2>Select a Date</h2>
        <p>Choose a date for your appointment</p>
      </div>
      
      <div className={styles.calendarWrapper}>
        <Calendar 
          onChange={handleDateChange as any}
          value={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          prevLabel={<span className={styles.navArrow}>←</span>}
          nextLabel={<span className={styles.navArrow}>→</span>}
          navigationLabel={({ date }) => (
            <span className={styles.navLabel}>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          )}
        />
      </div>
      
      {/* <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.availableColor}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.bookedColor}`}></div>
          <span>Partially Booked</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selectedColor}`}></div>
          <span>Selected</span>
        </div>
      </div> */}
      
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
        <div></div> {/* Empty div for spacing */}
        <Button
          onClick={handleContinue}
          icon={<FiArrowRight />}
          variant="neumorphic"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default DateSelector; 