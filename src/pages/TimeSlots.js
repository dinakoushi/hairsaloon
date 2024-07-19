import React, { useState } from 'react';
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

    function getSelectedSlots(startTime, duration) {
        const slotDuration = 30;
        const numberOfSlots = Math.ceil(duration / slotDuration);
        const startIndex = timeSlots.indexOf(startTime);
        if (startIndex === -1) return [];
        return timeSlots.slice(startIndex, startIndex + numberOfSlots);
    }

    const handleTimeSelect = (time) => {
        const slotsToSelect = getSelectedSlots(time, serviceDuration);
        setSelectedSlots(slotsToSelect);
        const endTime = slotsToSelect.length ? slotsToSelect[slotsToSelect.length - 1] : null;
        onTimeSelect({ startTime: time, endTime });
    };

    return (
        <div className="timeslots-container">
            <p className="appointment-p">TIME</p>
            <div className="timeslots-grid">
                {timeSlots.map((time) => {
                    const isSelected = selectedSlots.includes(time);
                    return (
                        <div
                            key={time}
                            className={`timeslot ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleTimeSelect(time)}
                            style={{
                                cursor: 'pointer',
                                opacity: isSelected ? 1 : 1
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
