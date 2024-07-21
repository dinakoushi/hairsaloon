import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimeSlots from './TimeSlots';
import "../assets/styles/appointment.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

function BookingDate() {
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [status, setStatus] = useState("Pending");
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        phoneNo: '',
    });
    const [selectedService, setSelectedService] = useState({ servicesCode: "", servicesDesc: "", duration: 0 });
    const [services, setServices] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState({ startTime: null, endTime: null });
    const [selectedStaff, setSelectedStaff] = useState({ _id: "", staffName: "" });
    const [staff, setStaff] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const loginName = user ? user.name : null;

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(minDate.getDate() + 1); 

    const handleDateChange = (date) => {
        if (date <= minDate) {
            alert("Bookings can only be made one day in advance!");
            return;
        }
        setSelectedDate(date);
        fetchBookedSlots(formatDateToString(date), selectedStaff._id);
    };

    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/services`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/staff`);
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchProfile = async (userId) => {
        console.log(`Fetching profile for user ID: ${userId}`);
        try {
            const response = await axios.get(`${API_BASE_URL}/profile/${userId}`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchBookedSlots = async (date, staffID) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bookedSlots`, { params: { date, staffID } });
            setBookedSlots(response.data);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
        }
    };

    const handleBooking = async () => {
        if (!selectedStaff) {
            alert("Please select a staff.");
            return;
        }
        if (!selectedService) {
            alert("Please select a service.");
            return;
        }
        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }
        if (!selectedTime.startTime || !selectedTime.endTime) {
            alert("Please select a time slot before booking.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/book`, {
                userId: loginId,
                date: formatDateToString(selectedDate),
                serviceCode: selectedService.servicesCode,
                serviceDesc: selectedService.servicesDesc,
                staffName: selectedStaff.staffName,
                staffID: selectedStaff._id,
                startTime: selectedTime.startTime,
                endTime: selectedTime.endTime,
                status: status,
            });
            alert(response.data.message);
            fetchBookedSlots(formatDateToString(selectedDate), selectedStaff._id);
            setSelectedTime({ startTime: null, endTime: null });
            setSelectedService({ servicesCode: "", servicesDesc: "", duration: 0 });
            setSelectedStaff({ _id: "", staffName: "" });
            setSelectedDate(null);
        } catch (error) {
            console.error('Error booking slot:', error);
            alert('Failed to book slot. Please try again.');
        }
    };

    useEffect(() => {
        fetchProfile(loginId);
        fetchServices();
        fetchStaff();
    }, []);

    const formatDateToString = (date) => {
        if (!(date instanceof Date)) {
            throw new Error("Input must be a Date object");
        }
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0
        )).toISOString().split('T')[0];
    };

    const handleServiceChange = (e) => {
        const selectedService = services.find(service => service.servicesCode === e.target.value);
        setSelectedService(selectedService || { servicesCode: "", servicesDesc: "", duration: 0 });
    };

    const handleStaffChange = (e) => {
        const selectedStaff = staff.find(staff => staff._id === e.target.value);
        setSelectedStaff(selectedStaff || { _id: "", staffName: "" });
        if (selectedDate && selectedStaff) {
            fetchBookedSlots(formatDateToString(selectedDate), selectedStaff._id);
        }
    };

    const viewCustomer = (customerId, customerName) => {
        // This function navigates to a new route
        navigate(`/appListByCust/${customerId}`, { state: { name: customerName } });
    };

    return (
        <>
            <div className="header">
                <div className="topLogo" />
                <ul>
                    <li><a className="active" href="/" data-toggle="tooltip" title="Logout"><i className="fas fa-sign-out-alt"></i></a></li>
                    <li><a className="active" href="/Dashboard" data-toggle="tooltip" title="Home"><i class="fas fa-home"></i></a></li>
                    <li><a className="active" href="/ProfileForm" data-toggle="tooltip" title="Profile"><i class="fas fa-user"></i></a></li>
                    <li><a className="active" href="/Review" data-toggle="tooltip" title="Feedback"><i class="fas fa-comments"></i></a></li>
                    <li><a className="active" href="#" data-toggle="tooltip" title="Progress" onClick={(e) => { e.preventDefault(); viewCustomer(loginId, loginName); }}><i class="fas fa-tachometer-alt"></i></a></li>
                    <li><a className="active" href="/BookingDate" data-toggle="tooltip" title="Booking"><i class="fas fa-calendar-check"></i></a></li>
                    <li><a className="active" href="Service" data-toggle="tooltip" title="Services Lists"><i className="fas fa-cut"></i></a></li>
                </ul>
            </div>
            <div className="app-container">
                <div className="booking-header">
                    <h2>BOOKING</h2>
                </div>
                <div className="page-container">
                    <div className="form-container">
                        <div className="form-group">
                            <div className="lbl"><label htmlFor="name"><b>Name</b></label></div>
                            <div className="inp"><input type="text" placeholder="Enter Name" name="name" value={profile.name} onChange={(e) => setName(e.target.value)} required disabled={false} /></div>

                            <div className="lbl"><label htmlFor="phoneNo"><b>Phone No</b></label></div>
                            <div className="inp"><input type="text" placeholder="Enter Phone Number" name="phoneNo" value={profile.phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required /></div>

                            <div className="lbl"><label htmlFor="hairstylists"><b>Hair Stylists</b></label></div>
                            <div className="inp">
                                <select className="select-Opt" name="staff" value={selectedStaff._id} onChange={handleStaffChange} required>
                                    <option value="">Select a Hair Stylist</option>
                                    {staff.map(staff => (
                                        <option key={staff._id} value={staff._id}>{staff.staffName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="lbl"><label htmlFor="services"><b>Services</b></label></div>
                            <div className="inp">
                                <select className="select-Opt" name="services" value={selectedService.servicesCode} onChange={handleServiceChange} required>
                                    <option value="">Select a Service</option>
                                    {services.map(service => (
                                        <option key={service.servicesCode} value={service.servicesCode}>{service.servicesDesc}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="button" className="btnSubmit" onClick={handleBooking}>Book</button>
                        </div>
                    </div>
                    <div className="calendar-container">
                        {selectedStaff._id && selectedService.servicesCode ? (
                            <>
                                <Calendar
                                    className="calendarStyle"
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    minDate={minDate} // Disable past dates
                                />
                                {selectedDate && <TimeSlots bookedSlots={bookedSlots} onTimeSelect={setSelectedTime} selectedTime={selectedTime.startTime} serviceDuration={selectedService.duration} />}
                            </>
                        ) : (
                            <p className="selectPrompt">Please select a hairstylist and a service before selecting a date.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookingDate;
