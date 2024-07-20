import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import HomePage from './HomePage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import BookingDate from './pages/BookingDate';
import ProfileForm from './pages/ProfileForm';
import Review from './pages/Review';
import DashboardAdminPage from './pages/DashboardAdmin';
import ReviewBookingPage from './pages/ReviewBooking';
import CustomerListsPage from './pages/CustomerLists';
import AppListByCustPage from './pages/AppListByCust';
import { AuthProvider, useAuth } from './AuthContext';
import ServicePage from './pages/Service';


function PrivateRoute({ children }) {
    const { user } = useAuth();
    console.log('User:', user); // Debug user state
    return user ? children : <Navigate to="/" />;
}

function App() {
    useEffect(() => {
        let timeout;

        // Function to handle user activity
        const handleUserActivity = () => {
            clearTimeout(timeout); // Clear the previous timeout
            timeout = setTimeout(() => {
                localStorage.clear(); // Clear local storage after 3 minutes
                console.log('Local storage cleared due to inactivity');
            }, 3 * 60 * 1000); // 3 minutes in milliseconds
        };

        // Attach event listeners
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);

        // Clean up event listeners and timeout on component unmount
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
        };
    }, []);
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/Register" element={<RegisterPage />} />
                    <Route path="/Dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/DashboardAdmin" element={<PrivateRoute><DashboardAdminPage /></PrivateRoute>} />
                    <Route path="/BookingDate" element={<PrivateRoute><BookingDate /></PrivateRoute>} />
                    <Route path="/ProfileForm" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
                    <Route path="/ReviewBooking" element={<PrivateRoute><ReviewBookingPage /></PrivateRoute>} />
                    <Route path="/CustomerLists" element={<PrivateRoute><CustomerListsPage /></PrivateRoute>} />
                    <Route path="/appListByCust/:customerId" element={<PrivateRoute><AppListByCustPage /></PrivateRoute>} />
                    <Route path="/Review" element={<PrivateRoute><Review /></PrivateRoute>} />
                    <Route path="/Service" element={<ServicePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App; 