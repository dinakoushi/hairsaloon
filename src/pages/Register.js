import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/global.css";
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Customer");
    const [verifyPassword, setVerifyPassword] = useState("");
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleOnSubmit = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                name,
                phoneNo,
                email,
                password,
                role
            });
            console.log(response.data); // Log the response from the server
            alert("Data saved successfully");
            setName("");
            setPhoneNo("");
            setEmail("");
            setPassword("");
            setVerifyPassword(""); // Clear verifyPassword state
            navigate('/');
        } catch (error) {
            setName("");
            setPhoneNo("");
            setEmail("");
            setPassword("");
            setVerifyPassword("");
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred");
            }
        }
    }

    const handleButtonClick = async (e) => {
        e.preventDefault();

        // Validate password length
        if (password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validate password match
        if (password !== verifyPassword) {
            alert("Passwords do not match");
            return;
        }

        // Manually call handleOnSubmit when the button is clicked
        handleOnSubmit();
    }

    const validateEmail = (email) => {
        // Regex pattern for basic email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    return (
        <>
            <div className="header">
                <div className="topLogo" />
                <ul>
                    <li><a className="active" href="/" data-toggle="tooltip" title="Login"><i className="fas fa-sign-in-alt"></i></a></li>
                </ul>
            </div>
            <div className="content">
                <div className="loginScreen">
                    <form className="loginForm rgPage">
                        <p className="title">Register Form</p>
                        <div className="lbl"><label htmlFor="name"><b>Name</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>

                        <div className="lbl"><label htmlFor="phoneNo"><b>Phone No</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Phone Number" name="phoneNo" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required /></div>

                        <div className="lbl"><label htmlFor="email"><b>Email</b></label></div>
                        <div className="inp"><input type="text" placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>

                        <div className="lbl"><label htmlFor="psw"><b>Password</b></label></div>
                        <div className="inp"><input type="password" placeholder="Enter Password" name="psw" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>

                        <div className="lbl"><label htmlFor="verifyPassword"><b>Verify Password</b></label></div>
                        <div className="inp"><input type="password" placeholder="Verify Password" name="verifyPassword" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required /></div>

                        <button type="button" className="btnSubmit" onClick={handleButtonClick}>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
