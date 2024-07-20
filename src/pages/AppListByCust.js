// src/AppListByCust.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import '../assets/styles/customerlists.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Modal from './Modal'; // Import the Modal component
import { useNavigate } from 'react-router-dom';
import path from '../services/productAPI';
function AppListByCust() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const location = useLocation();
    const [remark, setRemark] = useState("");
    const [file, setFile] = useState(null); // Add state for file
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { name } = location.state || {};
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const role = user ? user.role : null;
    const loginName = user ? user.name : null;

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchBookings();
    }, [customerId]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bookings/${customerId}`);
            setBookings(response.data);
        } catch (error) {
            console.error('There was an error fetching the booking data!', error);
        }
    };

    const handleUpdateClick = async (e) => {
        e.preventDefault();

        if (!selectedBooking) {
            console.error('No booking selected.');
            return;
        }

        const formData = new FormData();
        formData.append('remark', remark);
        formData.append('appointmentId', selectedBooking._id);
        if (file) {
            formData.append('file', file);
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/updateProgress`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setRemark('');
            setFile(null);
            setIsModalOpen(false);
            fetchBookings(); // Refresh the booking list
            alert('Progress updated successfully!'); // Alert on success
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModalForBooking = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const fetchAppointmentDetails = async (appointmentId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/appointments/details`, { appointmentId });
            setSelectedAppointment(response.data);
        } catch (error) {
            console.error('There was an error fetching the appointment details!', error);
        }
    };

    const openViewModal = async (booking) => {
        await fetchAppointmentDetails(booking._id); // Fetch booking details
        setIsViewModalOpen(true);
    };

    const viewCustomer = (customerId, customerName) => {
        // This function navigates to a new route
        navigate(`/appListByCust/${customerId}`, { state: { name: customerName } });
    };
    function formatDate(datetimeString) {
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
    }


    return (
        <>
            <div className="header">
                <div className="topLogo" />

                {role === 'Admin' ?
                    <ul>
                        <li><a className="active" href="/" data-toggle="tooltip" title="Logout"><i className="fas fa-sign-out-alt"></i></a></li>
                        <li><a className="active" href="/DashboardAdmin" data-toggle="tooltip" title="Home"><i className="fas fa-home"></i></a></li>
                        <li><a className="active" href="/CustomerLists" data-toggle="tooltip" title="Update Progress"><i className="fas fa-tachometer-alt"></i></a></li>
                        <li><a className="active" href="/ReviewBooking" data-toggle="tooltip" title="Pending Booking"><i className="fas fa-list-alt"></i></a></li>
                    </ul>
                    : <ul>
                        <li><a className="active" href="/" data-toggle="tooltip" title="Logout"><i className="fas fa-sign-out-alt"></i></a></li>
                        <li><a className="active" href="/Dashboard" data-toggle="tooltip" title="Home"><i className="fas fa-home"></i></a></li>
                        <li><a className="active" href="/ProfileForm" data-toggle="tooltip" title="Profile"><i className="fas fa-user"></i></a></li>
                        <li><a className="active" href="/Review" data-toggle="tooltip" title="Feedback"><i className="fas fa-comments"></i></a></li>
                        <li><a className="active" href="#" data-toggle="tooltip" title="Progress" onClick={(e) => { e.preventDefault(); viewCustomer(loginId, loginName); }}><i className="fas fa-tachometer-alt"></i></a></li>
                        <li><a className="active" href="/BookingDate" data-toggle="tooltip" title="Booking"><i className="fas fa-calendar-check"></i></a></li>
                    </ul>
                }
            </div>
        <div className="app-container">
            <div className="booking-header">
                <h2>APPOINTMENT LISTS</h2>
                <h6>Customer Name: {name}</h6>
            </div>
            <div className="AppListByCust">
                {bookings.length > 0 ? (
                    <table className="tbleStyle">
                        <thead className="tHeadStyle">
                            <tr>
                                <th style={{ width: '35%' }}>Service</th>
                                <th style={{ width: '15%' }}>Date</th>
                                <th style={{ width: '15%' }}>Time</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '20%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="tBodyStyle">
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.serviceDesc}</td>
                                    <td>{booking.date}</td>
                                    <td>{booking.time}</td>
                                    <td>{booking.status}</td>
                                    <td>
                                        {booking.serviceCode === "ST" && (
                                            <>
                                                <button className="btnIcon" onClick={() => openViewModal(booking)}>
                                                    <i className="fas fa-eye"></i>
                                                    <span className="tooltip">View Progress</span>
                                                </button>
                                                {role === 'Admin' ? <button
                                                    className="btnIcon"
                                                    onClick={() => openModalForBooking(booking)}
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                    <span className="tooltip">Update Progress</span>
                                                </button> : null
                                            }
                                                
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedBooking && (
                    <form className="updateprogress-form" onSubmit={handleUpdateClick}>
                        <h6>UPDATE PROGRESS TREATMENT!</h6>
                        <div className="progressForm">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="updateprogress-file-input"
                            />
                            <textarea
                                name="remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Write remark here...."
                                required
                                className="updateprogress-textarea"
                            />
                        </div>
                        <button type="submit" className="updateprogress-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                )}
                </Modal>
                <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
                    <form className="updateprogress-form" onSubmit={handleUpdateClick}>
                {selectedAppointment ? (
                    <div className="view-progress">
                        <h6>VIEW PROGRESS</h6>
                        {selectedAppointment.filePath && (<>
                                <div className="view-image">
                                        <img className="uploadImage" src={path.getFullUrl(selectedAppointment.filePath)} alt="Progress" />
                                        <p className="remark"><strong>{formatDate(selectedAppointment.createdAt)}</strong> : {selectedAppointment.remark}</p>
                                </div></>
                        )}
                            </div>) : <p><strong>Update progress information is not available yet.</strong></p>

                }</form>
            </Modal>
            </div>
        </>
    );
}

export default AppListByCust;
