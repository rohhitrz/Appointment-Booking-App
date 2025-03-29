'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  formData: FormData;
}

interface AppointmentContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
  confirmAppointment: () => void;
  appointment: Appointment | null;
  bookedAppointments: Appointment[];
  isTimeSlotBooked: (date: Date, time: string) => boolean;
  cancelBooking: (appointmentId: string) => void;
}

// Create the context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Initial form data
const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  notes: ''
};

// Provider component
export const AppointmentProvider = ({ children }: { children: React.ReactNode }) => {
  // State for the selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // State for the selected time
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // State for form data
  const [formData, setFormDataInternal] = useState<FormData>(initialFormData);
  
  // State for booked appointments
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  
  // State for the current step in the booking process
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // State for the most recently booked appointment
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  
  // Load booked appointments from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAppointments = localStorage.getItem('bookedAppointments');
      
      if (storedAppointments) {
        try {
          // Parse stored appointments and convert date strings back to Date objects
          const parsedAppointments = JSON.parse(storedAppointments);
          setBookedAppointments(
            parsedAppointments.map((app: any) => ({
              ...app,
              date: new Date(app.date)
            }))
          );
        } catch (error) {
          console.error('Error parsing appointments from localStorage:', error);
        }
      }
    }
  }, []);
  
  // Helper function to save appointments to localStorage
  const saveAppointmentsToLocalStorage = (appointments: Appointment[]) => {
    // Convert Date objects to strings for storage
    const serializedAppointments = appointments.map(appointment => ({
      ...appointment,
      date: appointment.date.toISOString()
    }));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookedAppointments', JSON.stringify(serializedAppointments));
    }
  };
  
  // Function to update form data
  const setFormData = (data: Partial<FormData>) => {
    setFormDataInternal(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Function to move to the next step
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  // Function to move to the previous step
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Function to check if a time slot is already booked
  const isTimeSlotBooked = (date: Date, time: string): boolean => {
    if (!date) return false;
    
    return bookedAppointments.some(
      appointment => 
        appointment.date.toDateString() === date.toDateString() && 
        appointment.time === time
    );
  };
  
  // Function to confirm an appointment
  const confirmAppointment = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Create a new appointment with a unique ID
    const newAppointment: Appointment = {
      id: uuidv4(),
      date: selectedDate,
      time: selectedTime,
      formData
    };
    
    // Add the new appointment to the booked appointments
    const updatedAppointments = [...bookedAppointments, newAppointment];
    setBookedAppointments(updatedAppointments);
    
    // Save to localStorage
    saveAppointmentsToLocalStorage(updatedAppointments);
    
    // Set the current appointment for confirmation details
    setAppointment(newAppointment);
    
    // Go to the confirmation screen
    nextStep();
  };
  
  // Function to cancel a booking
  const cancelBooking = (appointmentId: string) => {
    const updatedAppointments = bookedAppointments.filter(
      appointment => appointment.id !== appointmentId
    );
    
    setBookedAppointments(updatedAppointments);
    saveAppointmentsToLocalStorage(updatedAppointments);
  };
  
  // Reset the booking process
  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFormDataInternal(initialFormData);
    setCurrentStep(0);
    setAppointment(null);
  };
  
  // Context value
  const value: AppointmentContextType = {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    formData,
    setFormData,
    currentStep,
    nextStep,
    prevStep,
    resetBooking,
    confirmAppointment,
    appointment,
    bookedAppointments,
    isTimeSlotBooked,
    cancelBooking
  };
  
  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  
  return context;
}; 