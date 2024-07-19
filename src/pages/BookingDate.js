import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimeSlots from './TimeSlots';
import "../assets/styles/appointment.css";
import axios from "axios";
const sampleUserId = '66897ffee6217b5fec676c0e';
function BookingDate() {
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [status, setStatus] = useState("Pending");
    const [profile, setProfile] = useState({
        name: '',
        phoneNo: '',
    });
    const [selectedService, setSelectedService] = useState({ servicesCode: "", servicesDesc: "", duration: 0 });
    const [services, setServices] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState({ _id: "", staffName: "" });
    const [staff, setStaff] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchBookedSlots(formatDateToString(date));
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:5001/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:5001/staff');
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchProfile = async (userId) => {
        console.log(`Fetching profile for user ID: ${userId}`); // Log the user ID
        try {
            const response = await axios.get(`http://localhost:5001/profile/${userId}`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchBookedSlots = async (date) => {
        try {
            const response = await axios.get('http://localhost:5001/bookedSlots', { params: { date } });
            setBookedSlots(response.data);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
        }
    };

    const handleBooking = async () => {
        // Validate input fields
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
        if (!selectedTime) {
            alert("Please select a time slot before booking.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/book', {
                userId: sampleUserId,
                date: formatDateToString(selectedDate),
                serviceCode: selectedService.servicesCode, // Send the service code
                serviceDesc: selectedService.servicesDesc, // Send the service description
                staffName: selectedStaff.staffName, // Send the service description
                staffID: selectedStaff._id, // Send the service description
                time: selectedTime,
                status: status,
            });
            alert(response.data.message);
            fetchBookedSlots(formatDateToString(selectedDate)); // Refresh booked slots
            setSelectedTime(null); // Reset selected time
            setSelectedService({ servicesCode: "", servicesDesc: "", duration: 0 });; // Reset services
            setSelectedStaff({ _id: "", staffName: "" });; // Reset services
            setSelectedDate(null); // Reset selected date
        } catch (error) {
            console.error('Error booking slot:', error);
            alert('Failed to book slot. Please try again.');
        }
    };

    useEffect(() => {
        // Fetch profile for the sample user ID
        fetchProfile(sampleUserId);
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
            0,  // Set hours to 0 for midnight UTC
            0,  // Set minutes to 0
            0   // Set seconds to 0
        )).toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };

    const handleServiceChange = (e) => {
        const selectedService = services.find(service => service.servicesCode === e.target.value);
        setSelectedService(selectedService || { servicesCode: "", servicesDesc: "", duration: 0 });
    };

    const handleStaffChange = (e) => {
        const selectedStaff = staff.find(staff => staff._id === e.target.value);
        setSelectedStaff(selectedStaff || { _id: "", staffName: ""});
    };
    return (
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
                        <div className="inp"><input type="text" placeholder="Enter Phone Number" name="phoneNo" value={profile.phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required/></div>

                        <div className="lbl"><label htmlFor="hairstylists"><b>Hair Stylists</b></label></div>
                        <div className="inp">
                            <select className="select-Opt" name="staff" value={selectedStaff._id} onChange={handleStaffChange} required>
                                <option value="">Select a Hair Stylists</option>
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
                    <Calendar className="calendarStyle"
                        onChange={handleDateChange}
                        value={selectedDate}
                    />

                    {selectedDate && <TimeSlots bookedSlots={bookedSlots} onTimeSelect={setSelectedTime} selectedTime={selectedTime} serviceDuration={selectedService.duration} />}
                </div>
            </div>
        </div>
    );
}

export default BookingDate;
