'use client';

import { useState, useEffect } from 'react';
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
import QRCode from 'qrcode';

const Confirmation = () => {
  const { appointment, resetBooking } = useAppointment();
  const [showConfetti, setShowConfetti] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);
    
    // Generate QR code with actual appointment details
    if (appointment) {
      const appointmentData = {
        id: appointment.id,
        date: appointment.date.toISOString(),
        time: appointment.time,
        name: appointment.formData.name,
        email: appointment.formData.email,
        phone: appointment.formData.phone,
        notes: appointment.formData.notes || ''
      };
      
      const qrCodeData = JSON.stringify(appointmentData);
      
      // Generate QR code after a small delay
      const timer = setTimeout(() => {
        QRCode.toDataURL(qrCodeData, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 200,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        .then(url => {
          setQrCode(url);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
          // Fallback to a simple QR code with just the appointment ID
          QRCode.toDataURL(`BookEase Appointment: ${appointment.id}`)
            .then(url => setQrCode(url))
            .catch(() => setQrCode(null));
        });
      }, 800);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [appointment]);
  
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
                width={200} 
                height={200} 
                style={{ margin: '0 auto', display: 'block' }}
              />
            </div>
            <p>Show this QR code when you arrive</p>
            <small>Scan to verify appointment details</small>
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