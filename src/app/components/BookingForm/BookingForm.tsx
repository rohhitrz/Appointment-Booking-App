'use client';

import { useState } from 'react';
import styles from './BookingForm.module.scss';
import { useAppointment } from '@/app/context/AppointmentContext';
import Button from '../Button/Button';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define validation schema
const schema = yup.object({
  name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email address is required').email('Please enter a valid email address'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number'),
  notes: yup.string().optional(),
}).required();

type FormData = yup.InferType<typeof schema>;

const BookingForm = () => {
  const { selectedDate, selectedTime, formData, setFormData, prevStep, confirmAppointment } = useAppointment();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    }
  });
  
  // Update form in context when input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData({ [name]: value });
    setValue(name as keyof FormData, value, { shouldValidate: true });
  };
  
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Save form data to context
    setFormData(data);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Simulate API call
    setTimeout(() => {
      confirmAppointment();
      setIsSubmitting(false);
      setShowSuccessMessage(false);
    }, 1200);
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
  
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showSuccessMessage && (
        <motion.div 
          className={styles.successMessage}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiArrowRight className={styles.successIcon} />
          <span>Booking confirmed! Redirecting to confirmation page...</span>
        </motion.div>
      )}
      
      <div className={styles.title}>
        <h2>Your Details</h2>
        <p>Please provide your information to complete the booking</p>
      </div>
      
      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{formattedDate}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>{selectedTime}</span>
        </div>
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            <FiUser className={styles.inputIcon} />
            Full Name
          </label>
          <input
            id="name"
            {...register('name')}
            type="text"
            className={errors.name ? styles.errorInput : ''}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">
            <FiMail className={styles.inputIcon} />
            Email
          </label>
          <input
            id="email"
            {...register('email')}
            type="email"
            className={errors.email ? styles.errorInput : ''}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone">
            <FiPhone className={styles.inputIcon} />
            Phone Number
          </label>
          <input
            id="phone"
            {...register('phone')}
            type="tel"
            className={errors.phone ? styles.errorInput : ''}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number (e.g. +1 555-123-4567)"
          />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes">
            <FiFileText className={styles.inputIcon} />
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any special requests or information"
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <Button
            type="button"
            onClick={prevStep}
            icon={<FiArrowLeft />}
            variant="ghost"
          >
            Back
          </Button>
          <Button
            type="submit"
            icon={<FiArrowRight />}
            variant="neumorphic"
            isLoading={isSubmitting}
          >
            Confirm Booking
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm; 