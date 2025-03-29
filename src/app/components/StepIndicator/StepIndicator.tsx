'use client';

import { useAppointment } from '@/app/context/AppointmentContext';
import styles from './StepIndicator.module.scss';
import { FiCalendar, FiClock, FiUser, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, label: 'Date', icon: <FiCalendar /> },
  { id: 2, label: 'Time', icon: <FiClock /> },
  { id: 3, label: 'Details', icon: <FiUser /> },
  { id: 4, label: 'Confirm', icon: <FiCheck /> },
];

const StepIndicator = () => {
  const { currentStep, goToStep } = useAppointment();
  
  // Calculate progress percentage
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className={styles.container}>
      <div className={styles.progressLine}>
        <motion.div 
          className={styles.progressFill}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {steps.map((step) => (
        <div key={step.id} className={styles.step}>
          <motion.div 
            className={`${styles.stepNumber} 
              ${currentStep === step.id ? styles.active : ''} 
              ${currentStep > step.id ? styles.completed : ''}`}
            onClick={() => currentStep > step.id ? goToStep(step.id) : null}
            whileHover={currentStep > step.id ? { scale: 1.1 } : {}}
            style={{ cursor: currentStep > step.id ? 'pointer' : 'default' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: step.id * 0.1 }}
          >
            {currentStep > step.id ? <FiCheck /> : step.id}
          </motion.div>
          <div className={`${styles.stepLabel} ${currentStep === step.id ? styles.active : ''}`}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator; 