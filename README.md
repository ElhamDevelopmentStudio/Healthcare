# Doctor Appointment Management System

## Table of Contents
- [Overview](#overview)
- [Features](#features)
  - [Doctor Listing](#doctor-listing)
  - [Doctor Details](#doctor-details)
  - [Favorite Doctors](#favorite-doctors)
  - [Appointment Management](#appointment-management)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [State Management](#state-management)
- [Project Structure](#project-structure)
  - [Pages](#pages)
    - [DoctorListPage](#doctorlistpage)
    - [DoctorDetailPage](#doctordetailpage)
    - [FavoriteDoctorsPage](#favoritedoctorspage)
    - [AppointmentManagementSystem](#appointmentmanagementsystem)
  - [Redux Slices](#redux-slices)
  - [Components](#components)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
- [Backend Configuration](#backend-configuration)
  - [1. Use the Hosted Mock API](#1-use-the-hosted-mock-api)
  - [2. Run the Mock API Locally](#2-run-the-mock-api-locally)
  - [Run the Healthcare Application](#run-the-healthcare-application)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
  - [Starting the Application](#starting-the-application)
  - [Booking an Appointment](#booking-an-appointment)
  - [Rescheduling or Canceling an Appointment](#rescheduling-or-canceling-an-appointment)
- [Conclusion](#conclusion)

## Overview

This web application is a Doctor Appointment Management System built using React with TypeScript and Vite as the development environment. The application leverages Mantine for UI components and Redux for state management, including Redux Persist for persistent state storage.

The application allows users to:

- List available doctors.
- View detailed information about each doctor.
- Add doctors to a list of favorites.
- Book and manage appointments with doctors.
- Apply various filters to narrow down doctor searches.

## Features

### Doctor Listing

- Users can browse through a list of doctors, apply filters, and search by various criteria such as name, specialty, availability, and price range.
- Pagination is implemented to manage the display of doctors on multiple pages.

### Doctor Details

- Users can view detailed information about a selected doctor, including their specialty, availability, and consultation fees.
- The details page also provides options to book an appointment or view and manage existing appointments with that doctor.

### Favorite Doctors

- Users can mark doctors as favorites, allowing for quick access to their preferred healthcare providers.
- The favorite doctors are displayed on a dedicated page, which also supports filtering and pagination.

### Appointment Management

- Users can book, view, and manage their appointments.
- Functionality includes rescheduling and canceling appointments.
- A calendar view and a Kanban board view are available to manage appointments effectively.

## Technologies Used

### Frontend

- **React (with TypeScript)**: For building the user interface and ensuring type safety.
- **Vite**: For faster and leaner development.
- **Mantine**: A comprehensive library for UI components, including layout, forms, and modals.
- **Framer Motion**: For animations and transitions within the application.
- **Redux & Redux Persist**: For managing and persisting the application's global state.
- **React Router Dom**: For routing and navigation within the application.

### State Management

- **Redux**: The application state, including doctor listings, favorites, and appointments, is managed using Redux.
- **Redux Persist**: Used to persist the state across sessions, ensuring that user preferences and data are saved.

## Project Structure

### Pages

#### DoctorListPage

- **Purpose**: Displays a list of doctors with options to filter and search.
- **Key Components**:
  - `Sidebar`: Allows filtering by name, specialty, availability, and price range.
  - `DoctorList`: Displays the list of doctors.
  - `Pagination`: Handles the navigation between pages of doctor listings.
  - `LoadingSpinner` and `ErrorDisplay`: Provide feedback during data loading or error states.

#### DoctorDetailPage

- **Purpose**: Provides detailed information about a selected doctor and allows users to book appointments.
- **Key Components**:
  - `DoctorCard`: Displays detailed information about the doctor.
  - `BookAppointment`: A component to initiate the booking of an appointment.
  - `DoctorDetailAppointmentList`: Lists all appointments booked with the selected doctor.
  - `AppointmentForm` and `RescheduleForm`: Modal forms to book or reschedule appointments.

#### FavoriteDoctorsPage

- **Purpose**: Displays a list of the user's favorite doctors.
- **Key Components**:
  - `BadgeCard`: Displays each doctor's information in a card format.
  - `Sidebar`: Allows filtering by name, specialty, availability, and price range.
  - `Pagination`: Handles navigation between pages of favorite doctors.
  - `ErrorDisplay` and `LoadingSpinner`: Provide feedback during data loading or error states.

#### AppointmentManagementSystem

- **Purpose**: Manages the user's appointments with functionalities to view, book, reschedule, and cancel appointments.
- **Key Components**:
  - `AppointmentCalendar`: Displays appointments in a calendar view.
  - `KanbanAppointmentBoard`: Displays appointments in a Kanban-style board for better management.
  - `FilterDrawer`: A drawer that allows users to filter appointments.
  - `AppointmentForm` and `RescheduleForm`: Modal forms for booking and rescheduling appointments.

### Redux Slices

- **DoctorSlice**: Manages the state for doctor listings, including fetching, filtering, and paginating doctors.
- **AppointmentSlice**: Handles the state for booking, rescheduling, and canceling appointments.
- **FavoriteSlice**: Manages the list of favorite doctors.

### Components

- `Sidebar`: A reusable component for filtering doctors or appointments.
- `DoctorCard`: Displays detailed information about a doctor.
- `AppointmentCalendar`: Renders a calendar view for appointments.
- `KanbanAppointmentBoard`: Provides a Kanban-style board for managing appointments.

## Installation and Setup

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/ElhamDevelopmentStudio/Healthcare
cd Healthcare
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

## Backend Configuration

The application relies on a mock API to serve doctor data. You have two options for configuring the backend:

### 1. Use the Hosted Mock API

 We don't recommend this method, because since the mock-api has been hosted on a free tier plan, it may not be available or may be down at the moment. To use the pre-hosted mock API, add the following environment variable to your `.env` file in the root directory of the project:

```bash
VITE_PUBLIC_DOCTOR_API=https://mock-api-1-xjgy.onrender.com
```


### 2. Run the Mock API Locally

Alternatively, you can clone the mock API repository and run it locally:

```bash
git clone https://github.com/ElhamDevelopmentStudio/mock-api.git
cd mock-api
npm install
node server.js
```

This will start the mock API server on `http://localhost:3001`.

Update the `.env` file in the root directory of the main project with:

```bash
VITE_PUBLIC_DOCTOR_API=http://localhost:3001
```

### Run the Healthcare Application

```bash
npm run dev
# or
yarn dev
```

The application will be running on [http://localhost:3000](http://localhost:3000).


## Folder Structure

```bash

└── 📁src
    └── 📁assets
        └── react.svg
    └── 📁components
        └── 📁form
            └── RescheduleForm.tsx
        └── 📁ui
            └── 📁BadgeCard
                └── BadgeCard.module.css
                └── BadgeCard.tsx
            └── 📁Cards
                └── AppointmentCard.tsx
                └── BookAppointmentCard.tsx
                └── DoctorCard.tsx
            └── 📁Filters
                └── FilterDrawer.tsx
                └── FiltersSidebar.tsx
            └── 📁ListComponents
                └── AppointmentKanban.tsx
                └── AppointmentList.tsx
                └── DoctorDetailAppointmentList.tsx
                └── DoctorList.tsx
            └── 📁Modals
                └── AppointmentModal.tsx
            └── AppointmentCalender.tsx
            └── DoctorDetail.tsx
            └── DoctorDetailError.tsx
            └── DoctorProfile.tsx
            └── LoadingSpinner.tsx
        └── Navbar.tsx
    └── 📁hooks
        └── useDoctorDetails.ts
    └── 📁layout
    └── 📁lib
    └── 📁pages
        └── AppointmentListPage.tsx
        └── DoctorDetailPage.tsx
        └── DoctorListPage.tsx
        └── ErrorBoundary.tsx
        └── FavoriteDoctorsPage.tsx
    └── 📁redux
        └── 📁slices
            └── AppointmentSlice.ts
            └── DoctorSlice.ts
            └── FavoriteSlice.ts
        └── store.ts
    └── App.css
    └── App.tsx
    └── index.css
    └── main.tsx
    └── vite-env.d.ts

```

## Usage

### Starting the Application

Once the application is running, you will see the home page displaying all available doctors. 

- Use the sidebar to filter doctors by criteria such as name, specialty, availability, and price range.
- Click on a doctor's card to view detailed information and book an appointment.
- Access the favorite doctors page to manage your preferred doctors.
- Navigate to the appointment management page to view and manage your upcoming appointments.

### Booking an Appointment

To book an appointment:

1. Go to the Doctor Detail Page by selecting a doctor from the Doctor List Page.
2. Click the "Book Appointment" button to open the booking modal.
3. Complete the required details and confirm your appointment.

### Rescheduling or Canceling an Appointment

To reschedule or cancel an appointment:

1. Navigate to the Appointment Management System page.
2. Use the Kanban board or calendar view to locate the appointment you wish to modify.
3. Click on the appointment to access reschedule or cancel options.

## Conclusion

The Doctor Appointment Management System offers a comprehensive platform for managing healthcare appointments. It includes features for doctor listing, detailed doctor profiles, favorite doctor management, and appointment scheduling. Built with modern web development practices, the application provides a user-friendly interface supported by effective state management.
