# BookEase - Modern Appointment Booking System

![BookEase Logo](public/logo.png)

BookEase is a modern, user-friendly appointment booking system built with Next.js, React, and TypeScript. It provides a seamless booking experience with a beautiful neumorphic UI design that adapts to both light and dark themes.

## 🚀 Features

- **Intuitive Booking Flow**: Simple step-by-step process for booking appointments
- **Interactive Calendar**: Select dates with real-time feedback and visual cues
- **Time Slot Selection**: Choose from available time slots with clear visual indicators
- **Smart Validation**: Form validation using Yup and React Hook Form
- **Booking Management**: Stores booked appointments in localStorage to prevent double-booking
- **Responsive Design**: Works beautifully on all devices from mobile to desktop
- **Accessibility Focused**: Designed with accessibility in mind for all users
- **Dark/Light Mode**: Seamless theme switching with neumorphic design elements
- **Booking Confirmation**: QR code generation and detailed booking summary
- **Sharing Capabilities**: Share your booking details or add to calendar

## 📸 Screenshots

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
  <img src="screenshots/date-selection.png" alt="Date Selection" width="250" />
  <img src="screenshots/time-selection.png" alt="Time Selection" width="250" />
  <img src="screenshots/booking-form.png" alt="Booking Form" width="250" />
  <img src="screenshots/confirmation.png" alt="Booking Confirmation" width="250" />
</div>

## 🛠️ Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Static typing for JavaScript
- **SASS/SCSS**: CSS preprocessor for advanced styling
- **Framer Motion**: Animation library for React
- **React Hook Form**: Performant forms with easy validation
- **Yup**: Schema validation for forms
- **React Calendar**: Customizable calendar component
- **React Icons**: Popular icon sets as React components

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookease.git
   cd bookease
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
bookease/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── components/    # UI components
│   │   │   ├── BookingForm/
│   │   │   ├── Button/
│   │   │   ├── Confirmation/
│   │   │   ├── DateSelector/
│   │   │   ├── StepIndicator/
│   │   │   ├── ThemeToggle/
│   │   │   ├── TimeSelector/
│   │   │   └── ...
│   │   ├── context/       # React context providers
│   │   ├── styles/        # Global styles and variables
│   │   ├── page.tsx       # Home page component
│   │   └── layout.tsx     # Root layout
│   └── ...
└── ...
```

## 🎨 Customization

### Themes and Colors

You can customize the theme colors, typography, and other design variables in the `src/app/styles/variables.module.scss` file:

```scss
// Theme colors
$primary-light: #4361ee;
$primary-dark: #3a56d4;
$secondary-light: #f72585;
$secondary-dark: #b5179e;
// ...and more
```

### Booking Logic

To modify time slots or booking rules, check the following files:

- **src/app/components/TimeSelector/TimeSelector.tsx**: Modify available time slots
- **src/app/context/AppointmentContext.tsx**: Modify booking logic and validation

## 📋 Future Enhancements

- Backend integration with real database storage
- Email confirmation and reminders
- Admin panel for managing bookings
- Multiple service types and providers
- Payment integration
- Google Calendar/Outlook integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions or suggestions, please reach out to us at:
- Email: support@bookease.io
- Twitter: [@bookease](https://twitter.com/bookease)

---

Created with ❤️ by [Your Name]
# Appointment-Booking-App
