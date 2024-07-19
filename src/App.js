import React from 'react';
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
import ProgressTreatmentPage from './pages/ProgressTreatment';
import { AuthProvider, useAuth } from './AuthContext';


function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
}


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/Register" element={<RegisterPage />} />
                    <Route path="/DashboardAdmin" element={<DashboardAdminPage />} />
                    <Route path="/Dashboard" element={<DashboardPage />} />
                    <Route path="/BookingDate" element={<BookingDate />} />
                    <Route path="/ProfileForm" element={<ProfileForm />} />
                    <Route path="/ReviewBooking" element={<ReviewBookingPage />} />
                    <Route path="/CustomerLists" element={<CustomerListsPage />} />
                    <Route path="/appListByCust/:customerId" element={<AppListByCustPage />} />
                    <Route path="/ProgressTreatment" element={<ProgressTreatmentPage />} />
                    <Route path="/Review" element={<Review />} />
                </Routes>
                {/*<Routes>*/}
                {/*    <Route path="/" element={<LoginPage />} />*/}
                {/*    <Route path="/Register" element={<RegisterPage />} />*/}
                {/*    <Route path="/Dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />*/}
                {/*    <Route path="/BookingDate" element={<PrivateRoute><BookingDate /></PrivateRoute>} />*/}
                {/*    <Route path="/ProfileForm" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />*/}
                {/*    <Route path="/Review" element={<PrivateRoute><Review /></PrivateRoute>} />*/}
                {/*</Routes>*/}
            </Router>
        </AuthProvider>
    );
}

export default App; 