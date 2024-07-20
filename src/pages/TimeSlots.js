import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../assets/styles/appointment.css";

const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
];

function TimeSlots({ bookedSlots, onTimeSelect, selectedTime, serviceDuration }) {
    const [selectedSlots, setSelectedSlots] = useState([]);

    useEffect(() => {
        setSelectedSlots([]);
    }, [bookedSlots, serviceDuration]);

    function getSelectedSlots(startTime, duration) {
        const slotDuration = 30;
        const numberOfSlots = Math.ceil(duration / slotDuration);
        const startIndex = timeSlots.indexOf(startTime);

        if (startIndex === -1) {
            alert("The selected start time is invalid.");
            return [];
        }

        // Check if the end index exceeds the maximum index
        if (startIndex + numberOfSlots > timeSlots.length) {
            alert("The selected time slot exceeds available time slots. Please choose a different start time or adjust the duration.");
            return [];
        }

        return timeSlots.slice(startIndex, startIndex + numberOfSlots);
    }

    const handleTimeSelect = (time) => {
        const slotsToSelect = getSelectedSlots(time, serviceDuration);
        //if (slotsToSelect.length === 0) {
        //    alert("The selected time slot is invalid.");
        //    return;
        //}




        // Check if the selected slots are already booked
        const isSlotAvailable = slotsToSelect.every(slot => !isTimeSlotBooked(slot));
        if (!isSlotAvailable) {
            alert("The selected time slot is not long enough for the service. Please choose a different time/date slot!");
            return;
        }

        setSelectedSlots(slotsToSelect);
        const endTime = slotsToSelect.length ? slotsToSelect[slotsToSelect.length - 1] : null;
        onTimeSelect({ startTime: time, endTime });
    };

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':');
        const ampm = time.slice(-2);
        const hours24 = ampm === 'PM' && hours !== '12' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);
        return hours24 * 60 + parseInt(minutes.slice(0, 2), 10);
    };

    const isTimeSlotBooked = (time) => {
        const slotTime = timeToMinutes(time);
        return bookedSlots.some(({ startTime, endTime }) => {
            const bookedStart = timeToMinutes(startTime);
            const bookedEnd = timeToMinutes(endTime);
            return slotTime >= bookedStart && slotTime <= bookedEnd; // Inclusive of end time
        });
    };

    return (
        <div className="timeslots-container">
            <p className="appointment-p">TIME</p>
            <div className="timeslots-grid">
                {timeSlots.map((time) => {
                    const isSelected = selectedSlots.includes(time);
                    const isBooked = isTimeSlotBooked(time);
                    return (
                        <div
                            key={time}
                            className={`timeslot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                            onClick={() => !isBooked && handleTimeSelect(time)}
                            style={{
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                opacity: isBooked ? 0.5 : 1
                            }}
                        >
                            {time}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TimeSlots;
