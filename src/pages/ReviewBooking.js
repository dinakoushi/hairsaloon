import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/reviewbooking.css'; // Ensure your styles are correctly linked

function ReviewBooking() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    const fetchPendingAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5001/appointments/pendingBooking');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await axios.put(`http://localhost:5001/appointments/${id}/status`, { status });
            alert("Appointment " + status+" !");
            fetchPendingAppointments(); // Refresh the list after updating the status
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    return (
        <>
        <div className="header">
                <div className="topLogo" />
                <ul>
                    <li><a className="active" href="#home">Appointment</a></li>
                    <li><a className="active" href="/ReviewBooking">Feedback</a></li>
                    <li><a className="active" href="/ProfileForm">Profile</a></li>
                    <li><a className="active" href="#home">Home</a></li>
                </ul>
            </div>
        <div className="app-container">
            <div className="booking-header">
                <h2>PENDING BOOKING</h2>
            </div>
            <div className="page-container">
                <div className="form-container">
                    <div className="appointment-list">
                        {appointments.map(appointment => (
                            <div className="appointment-item" key={appointment.appointmentId}>
                                <p className="detailsBooked">{appointment.userDetails.name} has made an appointment for {appointment.serviceDesc} on {appointment.date}, {appointment.time}</p>
                                <div className="actions">
                                    <button onClick={() => handleStatusUpdate(appointment.appointmentId, 'Approved')}>Accept</button>
                                    <button onClick={() => handleStatusUpdate(appointment.appointmentId, 'Rejected')}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default ReviewBooking;
