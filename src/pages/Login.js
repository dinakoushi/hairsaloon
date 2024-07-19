import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import "../assets/styles/global.css";
import { useAuth } from '../AuthContext';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    useEffect(() => {
        // Clear local storage when the login component mounts
        localStorage.clear();
    }, []);
    const onLoginClick = async (data) => {
        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                login(result.user); // Assuming login stores user data including role

                // Redirect based on user role
                if (result.user.role === "Admin") {
                    navigate('/DashboardAdmin');
                } else {
                    navigate('/Dashboard'); // Default dashboard
                }
            } else {
                // Handle login error
                alert(`Login failed: ${result.message}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onLoginClick)}>
            <div className="header">
                <div className="topLogo" />
                <ul>
                    <li><a className="active" href="#home">Home</a></li>
                </ul>
            </div>
            <div className="content">
                <div className="loginScreen">
                    <div className="loginForm">
                        <p className="title">Login Form</p>
                        <div className="lbl">
                            <label htmlFor="email"><b>Email</b></label>
                        </div>
                        <div className="inp">
                            <input
                                type="text"
                                placeholder="Enter Email"
                                name="email"
                                {...register("email", { required: "Email is required" })}
                                required
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <div className="lbl">
                            <label htmlFor="psw"><b>Password</b></label>
                        </div>
                        <div className="inp">
                            <input
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                {...register("password", { required: "Password is required" })}
                                required
                            />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="btnSubmit">Login</button>
                        <div className="signup-link">Not a member? <Link to="/Register">Signup now</Link></div>
                    </div>
                </div>
            </div>
        </form>
    );
}
