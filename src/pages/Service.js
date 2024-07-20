import React from "react";
import { useNavigate } from 'react-router-dom';
import "../assets/styles/global.css";
import "../assets/styles/dashboard.css";
import serviceImage from '../assets/images/service.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Service() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const loginName = user ? user.name : null;

    const onLoginClick = async () => {
        navigate('/BookingDate'); 
    };
    const viewCustomer = (customerId, customerName) => {
            // This function navigates to a new route
            navigate(`/appListByCust/${customerId}`, { state: { name: customerName } });
        };
    return (
        <>
        <form>
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
            <div className="centered-container">
                <img src={serviceImage} alt="Service" className="serviceImage" />
            </div>
        </form>
        </>
    );
}
