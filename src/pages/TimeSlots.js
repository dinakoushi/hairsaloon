import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../assets/styles/appointment.css";

const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
];
function calculateEndTime(startTime, duration) {
    const [hour, minute, period] = startTime.split(/[:\s]/);
    let hours = parseInt(hour, 10) + (period === 'PM' && hour !== '12' ? 12 : 0);
    let minutes = parseInt(minute, 10);

    minutes += duration;
    hours += Math.floor(minutes / 60);
    minutes %= 60;

    return { hours, minutes };
}

function formatTime(hours, minutes) {
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, '0');
    return `${hours}:${minutes} ${period}`;
}

function getBookedSlots(startTime, duration) {
    const bookedSlots = [];
    let { hours, minutes } = calculateEndTime(startTime, 0);
    const endTime = calculateEndTime(startTime, duration);

    while ((hours < endTime.hours) || (hours === endTime.hours && minutes < endTime.minutes)) {
        bookedSlots.push(formatTime(hours, minutes));
        minutes += 30;
        if (minutes >= 60) {
            minutes -= 60;
            hours += 1;
        }
    }

    return bookedSlots;
}
function TimeSlots({ bookedSlots, onTimeSelect, selectedTime, serviceDuration }) {
    return (
        <div className="timeslots-container">
            <p className="appointment-p">TIME</p>
            <div className="timeslots-grid">
                {timeSlots.map((time) => {
                    const serviceBookedSlots = getBookedSlots(time, serviceDuration);
                    const isBooked = serviceBookedSlots.some(slot => bookedSlots.includes(slot));
                    const isSelected = serviceBookedSlots.includes(selectedTime);

                    return (
                        <div
                            key={time}
                            className={`timeslot ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`}
                            onClick={() => {
                                if (!isBooked) {
                                    onTimeSelect(time);
                                }
                            }}
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
