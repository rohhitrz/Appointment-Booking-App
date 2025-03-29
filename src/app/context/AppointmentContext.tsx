'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the types
export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  formData: AppointmentFormData;
}

interface AppointmentContextType {
  selectedDate: Date | null;
  selectedTime: string | null;
  formData: AppointmentFormData;
  currentStep: number;
  appointment: Appointment | null;
  bookedAppointments: Appointment[];
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setFormData: (data: Partial<AppointmentFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  confirmAppointment: () => void;
  resetBooking: () => void;
  isTimeSlotBooked: (date: Date, time: string) => boolean;
  cancelBooking: (appointmentId: string) => void;
}

// Create the context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Initialize form data
const initialFormData: AppointmentFormData = {
  name: '',
  email: '',
  phone: '',
  notes: '',
};

// Helper function to serialize and deserialize Date objects for localStorage
const serializeAppointment = (appointment: Appointment): string => {
  return JSON.stringify({
    ...appointment,
    date: appointment.date.toISOString()
  });
};

const deserializeAppointment = (serialized: string): Appointment => {
  const parsed = JSON.parse(serialized);
  return {
    ...parsed,
    date: new Date(parsed.date)
  };
};

// Helper function to save appointments to localStorage
const saveAppointmentsToLocalStorage = (appointments: Appointment[]) => {
  try {
    localStorage.setItem(
      'bookedAppointments', 
      JSON.stringify(appointments.map(app => ({
        ...app,
        date: app.date.toISOString()
      })))
    );
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Provider component
export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormDataState] = useState<AppointmentFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);

  // Load booked appointments from localStorage on component mount
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem('bookedAppointments');
      if (storedAppointments) {
        const appointments = JSON.parse(storedAppointments).map(deserializeAppointment);
        setBookedAppointments(appointments);
      }
    } catch (error) {
      console.error('Error loading appointments from localStorage:', error);
    }
  }, []);

  // Update form data
  const setFormData = (data: Partial<AppointmentFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  // Generate random appointment ID
  const generateAppointmentId = () => {
    return `BKE-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  };

  // Check if a time slot is already booked
  const isTimeSlotBooked = (date: Date, time: string): boolean => {
    return bookedAppointments.some(app => {
      const sameDate = app.date.toDateString() === date.toDateString();
      const sameTime = app.time === time;
      return sameDate && sameTime;
    });
  };

  // Cancel a booking
  const cancelBooking = (appointmentId: string) => {
    const updatedAppointments = bookedAppointments.filter(
      app => app.id !== appointmentId
    );
    
    setBookedAppointments(updatedAppointments);
    saveAppointmentsToLocalStorage(updatedAppointments);
  };

  // Confirm appointment
  const confirmAppointment = () => {
    if (selectedDate && selectedTime) {
      const newAppointment: Appointment = {
        id: generateAppointmentId(),
        date: selectedDate,
        time: selectedTime,
        formData,
      };
      
      setAppointment(newAppointment);
      
      // Add to booked appointments
      const updatedAppointments = [...bookedAppointments, newAppointment];
      setBookedAppointments(updatedAppointments);
      
      // Save to localStorage
      saveAppointmentsToLocalStorage(updatedAppointments);
      
      nextStep();
    }
  };

  // Reset booking
  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFormDataState(initialFormData);
    setCurrentStep(1);
    setAppointment(null);
  };

  return (
    <AppointmentContext.Provider
      value={{
        selectedDate,
        selectedTime,
        formData,
        currentStep,
        appointment,
        bookedAppointments,
        setSelectedDate,
        setSelectedTime,
        setFormData,
        nextStep,
        prevStep,
        goToStep,
        confirmAppointment,
        resetBooking,
        isTimeSlotBooked,
        cancelBooking,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the context
export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}; 