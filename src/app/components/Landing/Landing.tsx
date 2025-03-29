'use client';

import styles from './Landing.module.scss';
import { motion } from 'framer-motion';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { FiCalendar, FiClock, FiCheck, FiArrowRight } from 'react-icons/fi';

const Landing = () => {
  const { nextStep } = useAppointment();
  
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.inner}>
        <motion.div 
          className={styles.content}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className={styles.title}>BookEase</h1>
          <h2 className={styles.tagline}>Simple Appointment Booking</h2>
          <p className={styles.description}>
            Welcome to BookEase, where booking appointments is quick and effortless. 
            Select your date and time, fill in your details, and receive instant confirmation.
          </p>
          
          <ul className={styles.featureList}>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <FiCalendar /> Easy date selection
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <FiClock /> Flexible time slots
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <FiCheck /> Instant confirmation
            </motion.li>
          </ul>
          
          <motion.div 
            className={styles.cta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button 
              onClick={() => nextStep()}
              variant="neumorphic"
              size="large"
              icon={<FiArrowRight />}
            >
              Book Now
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.imageContainer}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className={styles.mockupImage}
            style={{ 
              width: '100%', 
              height: '400px',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
          >
            <div style={{ fontSize: '5rem', fontWeight: 'bold', opacity: 0.1 }}>
              BookEase
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Landing; 