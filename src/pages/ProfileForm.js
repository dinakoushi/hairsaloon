import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/profile.css";
import Modal from './Modal'; // Ensure this is a valid Modal component
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

function ProfileForm({ profileId }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [oldPassword, setOldPassword] = useState(""); // State for old password
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("User");
    const [submitName, setSubmitName] = useState("Edit Profile");
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        phoneNo: '',
        role: '',
        email: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const loginName = user ? user.name : null;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        if (loginId) {
            fetchProfile(loginId);
        }
    }, [loginId]);

    const fetchProfile = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile/${userId}`);
            setProfile(response.data);
            setName(response.data.name);
            setPhoneNo(response.data.phoneNo);
            setEmail(response.data.email);
            setRole(response.data.role);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleOnSubmit = async (userId) => {
        try {
            await axios.put(`${API_BASE_URL}/profileEdit/${userId}`, {
                name,
                phoneNo,
                email,
                role
            });
            alert("Data updated successfully");
            setEditMode(false);
            setSubmitName("Edit Profile");
        } catch (error) {
            console.error("Error submitting profile update:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (editMode) {
            handleOnSubmit(loginId);
        } else {
            setEditMode(true);
            setSubmitName("Update");
        }
    };

    const handleChangePassword = async () => {
        if (password !== verifyPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Validate old password
            const response = await axios.post(`${API_BASE_URL}/validatePassword`, {
                userId: loginId,
                oldPassword: oldPassword
            });

            if (response.data.valid) {
                // Proceed to update password
                await axios.put(`${API_BASE_URL}/changePassword/${loginId}`, {
                    password: password
                });
                alert("Password updated successfully");
                setIsModalOpen(false);
                setOldPassword("");
                setPassword("");
                setVerifyPassword("");
            } else {
                alert("Old password is incorrect!");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to update password. Please try again.");
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
                    <li><a className="active" href="/Dashboard" data-toggle="tooltip" title="Home"><i className="fas fa-home"></i></a></li>
                    <li><a className="active" href="/ProfileForm" data-toggle="tooltip" title="Profile"><i className="fas fa-user"></i></a></li>
                    <li><a className="active" href="/Review" data-toggle="tooltip" title="Feedback"><i className="fas fa-comments"></i></a></li>
                    <li><a className="active" href="#" data-toggle="tooltip" title="Progress" onClick={(e) => { e.preventDefault(); viewCustomer(loginId, loginName); }}><i class="fas fa-tachometer-alt"></i></a></li>
                    <li><a className="active" href="/BookingDate" data-toggle="tooltip" title="Booking"><i className="fas fa-calendar-check"></i></a></li>
                </ul>
            </div>
            <div className="content">
                <div className="loginScreen">
                    <form className="loginForm">
                        <p className="title">Profile</p>
                        <div className="lbl"><label htmlFor="name"><b>Name</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={!editMode} /></div>

                        <div className="lbl"><label htmlFor="phoneNo"><b>Phone No</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Phone Number" name="phoneNo" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required disabled={!editMode} /></div>

                        <div className="lbl"><label htmlFor="email"><b>Email</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!editMode} /></div>

                        <button type="button" className="btnprofile" onClick={handleButtonClick}>{submitName}</button>
                        <button type="button" className="btnprofile" onClick={() => setIsModalOpen(true)}>Change Password</button>
                    </form>
                </div>
            </div>

            {/* Modal for Change Password */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="profileModal">
                    <h6>Change Password</h6>
                    <div className="lbl"><label htmlFor="oldPassword"><b>Old Password</b></label></div>
                    <div className="inp"><input type="password" placeholder="Enter Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>

                    <div className="lbl"><label htmlFor="password"><b>New Password</b></label></div>
                    <div className="inp"><input type="password" placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>

                    <div className="lbl"><label htmlFor="verifyPassword"><b>Verify Password</b></label></div>
                    <div className="inp"><input type="password" placeholder="Re-enter New Password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required /></div>

                    <button type="button" className="btnSubmit" onClick={handleChangePassword}>Submit</button>
                </div>
            </Modal>
        </>
    );
}

export default ProfileForm;
