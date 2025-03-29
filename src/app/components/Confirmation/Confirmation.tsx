'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Confirmation.module.scss';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiCheck,
  FiShare2
} from 'react-icons/fi';

const Confirmation = () => {
  const { appointment, resetBooking } = useAppointment();
  const [showConfetti, setShowConfetti] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);
    
    // Generate fake QR code after small delay
    const timer = setTimeout(() => {
      // In a real app, you would generate a real QR code with the appointment details
      const qrCodeSvg = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 29 29"><path d="M1 1h7v7h-7zM21 1h7v7h-7zM1 21h7v7h-7zM11 3h1v1h-1zM13 3h3v1h-3zM17 3h1v1h-1zM11 5h1v3h-1zM13 5h1v1h-1zM15 5h1v1h-1zM17 5h3v1h-3zM19 7h1v1h-1zM11 9h1v1h-1zM13 9h3v1h-3zM19 9h1v1h-1zM11 11h3v1h-3zM17 11h3v1h-3zM21 11h3v1h-3zM25 11h1v1h-1zM27 11h1v1h-1zM9 13h1v1h-1zM11 13h1v1h-1zM13 13h1v1h-1zM15 13h1v1h-1zM23 13h1v1h-1zM27 13h1v1h-1zM3 15h1v1h-1zM7 15h1v1h-1zM9 15h1v1h-1zM13 15h1v1h-1zM15 15h1v1h-1zM19 15h1v1h-1zM21 15h1v1h-1zM25 15h1v1h-1zM27 15h1v1h-1zM1 17h1v1h-1zM3 17h3v1h-3zM7 17h1v1h-1zM11 17h1v1h-1zM13 17h1v1h-1zM17 17h1v1h-1zM21 17h1v1h-1zM23 17h1v1h-1zM25 17h1v1h-1zM27 17h1v1h-1zM9 19h1v1h-1zM13 19h1v1h-1zM15 19h1v1h-1zM17 19h1v1h-1zM19 19h1v1h-1zM21 19h1v1h-1zM25 19h1v1h-1zM27 19h1v1h-1zM9 21h1v1h-1zM13 21h1v1h-1zM17 21h1v1h-1zM21 21h1v1h-1zM23 21h1v1h-1zM25 21h1v1h-1zM27 21h1v1h-1zM11 23h1v1h-1zM13 23h1v1h-1zM15 23h1v1h-1zM17 23h1v1h-1zM19 23h1v1h-1zM25 23h1v1h-1zM9 25h3v1h-3zM13 25h3v1h-3zM19 25h1v1h-1zM21 25h1v1h-1zM23 25h1v1h-1zM27 25h1v1h-1zM9 27h1v1h-1zM13 27h1v1h-1zM19 27h1v1h-1zM21 27h1v1h-1zM23 27h1v1h-1zM27 27h1v1h-1z"/><rect x="1" y="1" width="7" height="7" fill="none" stroke="black"/><rect x="21" y="1" width="7" height="7" fill="none" stroke="black"/><rect x="1" y="21" width="7" height="7" fill="none" stroke="black"/></svg>`;
      setQrCode(qrCodeSvg);
    }, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  if (!appointment) {
    return null;
  }
  
  // Format date for display
  const formattedDate = appointment.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Add to Calendar functionality (mock)
  const handleAddToCalendar = () => {
    alert('Add to calendar feature would integrate with Google Calendar, Apple Calendar, etc.');
  };
  
  // Share appointment functionality (mock)
  const handleShare = () => {
    if (isSharing) return; // Prevent multiple share attempts
    
    if (navigator.share) {
      setIsSharing(true);
      navigator.share({
        title: 'My Booking Confirmation',
        text: `I have booked an appointment for ${formattedDate} at ${appointment.time}`,
        url: window.location.href,
      })
      .then(() => {
        console.log('Successfully shared');
      })
      .catch(err => {
        console.error('Error sharing: ', err);
      })
      .finally(() => {
        setIsSharing(false);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      const shareText = `I have booked an appointment for ${formattedDate} at ${appointment.time}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
          .then(() => {
            alert('Booking info copied to clipboard');
          })
          .catch(() => {
            alert('Sharing not supported. Please copy the link manually.');
          });
      } else {
        alert('Sharing not supported. Please copy the link manually.');
      }
    }
  };
  
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              className={styles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div 
        className={styles.confirmationIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      >
        <div className={styles.iconCircle}>
          <FiCheck size={60} />
        </div>
      </motion.div>
      
      <div className={styles.title}>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Your appointment has been successfully scheduled
        </motion.p>
      </div>
      
      <motion.div 
        className={styles.confirmationCard}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className={styles.confirmationId}>
          Confirmation ID: <span>{appointment.id}</span>
        </div>
        
        <div className={styles.detailsGrid}>
          <motion.div 
            className={styles.detailItem}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className={styles.detailLabel}>
              <FiCalendar size={16} />
              Date
            </span>
            <span className={styles.detailValue}>{formattedDate}</span>
          </motion.div>
          
          <motion.div 
            className={styles.detailItem}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className={styles.detailLabel}>
              <FiClock size={16} />
              Time
            </span>
            <span className={styles.detailValue}>{appointment.time}</span>
          </motion.div>
          
          <motion.div 
            className={styles.detailItem}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <span className={styles.detailLabel}>
              <FiUser size={16} />
              Name
            </span>
            <span className={styles.detailValue}>{appointment.formData.name}</span>
          </motion.div>
          
          <motion.div 
            className={styles.detailItem}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span className={styles.detailLabel}>
              <FiMail size={16} />
              Email
            </span>
            <span className={styles.detailValue}>{appointment.formData.email}</span>
          </motion.div>
          
          <motion.div 
            className={styles.detailItem}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <span className={styles.detailLabel}>
              <FiPhone size={16} />
              Phone
            </span>
            <span className={styles.detailValue}>{appointment.formData.phone}</span>
          </motion.div>
          
          {appointment.formData.notes && (
            <motion.div 
              className={styles.detailItem}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <span className={styles.detailLabel}>
                <FiFileText size={16} />
                Notes
              </span>
              <span className={styles.detailValue}>{appointment.formData.notes}</span>
            </motion.div>
          )}
        </div>
        
        {qrCode && (
          <motion.div
            className={styles.qrCodeContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h3>Your Booking QR Code</h3>
            <div className={styles.qrCode}>
              <img 
                src={qrCode} 
                alt="Booking QR Code" 
                width={120} 
                height={120} 
                style={{ margin: '0 auto', display: 'block' }}
              />
            </div>
            <p>Show this QR code when you arrive</p>
          </motion.div>
        )}
        
        <motion.div
          className={styles.actionButtons}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <Button
            onClick={handleAddToCalendar}
            icon={<FiCalendar />}
            variant="ghost"
            size="small"
          >
            Add to Calendar
          </Button>
          
          <Button
            onClick={handleShare}
            icon={<FiShare2 />}
            variant="ghost"
            size="small"
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share Booking'}
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className={styles.resetButton}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Button
          onClick={resetBooking}
          variant="neumorphic"
        >
          Book Another Appointment
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Confirmation; 