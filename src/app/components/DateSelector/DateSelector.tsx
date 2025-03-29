'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './DateSelector.module.scss';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

type CalendarValue = Date | null | [Date | null, Date | null];

const DateSelector = () => {
  const { selectedDate, setSelectedDate, nextStep, prevStep, bookedAppointments } = useAppointment();
  
  // Keep track of the minimum allowed date (today)
  const [minDate, setMinDate] = useState<Date>(new Date());
  
  // Keep track of the maximum allowed date (3 months from now)
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Set minDate to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today);
    
    // Set maxDate to 3 months from now
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    setMaxDate(threeMonthsFromNow);
    
    // If no date is selected, default to today
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);
  
  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      // Immediately highlight the selected date
      setSelectedDate(value);
    }
  };
  
  // Check if a date has bookings
  const tileClassName = ({ date }: { date: Date }): string | null => {
    // Convert to date string for comparison
    const dateString = date.toDateString();
    
    // Check if the date is the currently selected date
    const isActive = selectedDate && dateString === selectedDate.toDateString();
    
    // Check if the date has any bookings
    const hasBookings = bookedAppointments.some(booking => 
      booking.date.toDateString() === dateString
    );
    
    if (isActive) return 'activeDate';
    if (hasBookings) return 'hasBookings';
    return null;
  };
  
  // Disable weekends or past dates
  const disableTile = ({ date }: { date: Date }): boolean => {
    // Disable dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    // Optionally disable weekends (uncomment to activate)
    // const day = date.getDay();
    // if (day === 0 || day === 6) return true; // 0 = Sunday, 6 = Saturday
    
    return false;
  };
  
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.title}>
        <h2>Select a Date</h2>
        <p>Choose your preferred appointment date</p>
      </div>
      
      <div className={styles.calendarWrapper}>
        <Calendar 
          onChange={handleDateChange}
          value={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          tileClassName={tileClassName}
          tileDisabled={disableTile}
          // Custom navigation
          navigationLabel={({ date }) => (
            <span className={styles.navLabel}>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          )}
          prevLabel={<span className={styles.navArrow}>&larr;</span>}
          nextLabel={<span className={styles.navArrow}>&rarr;</span>}
          // Don't allow to view invalid dates
          minDetail="month"
          // Use default calendar type
          // calendarType="US"
        />
      </div>
      
      <div className={styles.legend}>
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
          <span>Has Bookings</span>
        </div>
      </div>
      
      <div className={styles.buttonGroup}>
        <Button
          onClick={prevStep}
          icon={<FiArrowLeft />}
          variant="ghost"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          icon={<FiArrowRight />}
          variant="neumorphic"
          disabled={!selectedDate}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default DateSelector; 