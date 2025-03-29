'use client';

import { useAppointment } from '@/app/context/AppointmentContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import StepIndicator from '../StepIndicator/StepIndicator';
import Landing from '../Landing/Landing';
import DateSelector from '../DateSelector/DateSelector';
import TimeSelector from '../TimeSelector/TimeSelector';
import BookingForm from '../BookingForm/BookingForm';
import Confirmation from '../Confirmation/Confirmation';
import { AnimatePresence } from 'framer-motion';

const BookingApp = () => {
  const { currentStep } = useAppointment();
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Landing />;
      case 2:
        return <DateSelector />;
      case 3:
        return <TimeSelector />;
      case 4:
        return <BookingForm />;
      case 5:
        return <Confirmation />;
      default:
        return <Landing />;
    }
  };
  
  return (
    <div>
      <ThemeToggle />
      
      {currentStep > 1 && currentStep < 5 && <StepIndicator />}
      
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>
    </div>
  );
};

export default BookingApp; 