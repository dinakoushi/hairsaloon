import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentAlt } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component
import '../assets/styles/review.css'; // Import the CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState("");

    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const loginName = user ? user.name : null;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    // Fetch reviews from the server
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviewsList`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/addReview`, {
                feedback,
                loginId
            });
            alert("Data saved successfully");
            setFeedback("");
            fetchReviews();
        } catch (error) {
            alert("Failed to submit feedback. Please try again.");
        }

        setIsModalOpen(false); // Close the modal after submitting
    };

    const handleButtonClick = async (e) => {
        e.preventDefault();

        // Manually call handleOnSubmit when the button is clicked
        handleSubmit();
    }
    const viewCustomer = (customerId, customerName) => {
        // This function navigates to a new route
        navigate(`/appListByCust/${customerId}`, { state: { name: customerName } });
    };
    return ( <>
        <div className="header">
            <div className="topLogo" />
            <ul>
                <li><a className="active" href="/" data-toggle="tooltip" title="Logout"><i className="fas fa-sign-out-alt"></i></a></li>
                <li><a className="active" href="/Dashboard" data-toggle="tooltip" title="Home"><i class="fas fa-home"></i></a></li>
                <li><a className="active" href="/ProfileForm" data-toggle="tooltip" title="Profile"><i class="fas fa-user"></i></a></li>
                <li><a className="active" href="/Review" data-toggle="tooltip" title="Feedback"><i class="fas fa-comments"></i></a></li>
                <li><a className="active" href="#" data-toggle="tooltip" title="Progress" onClick={(e) => { e.preventDefault(); viewCustomer(loginId, loginName); }}><i class="fas fa-tachometer-alt"></i></a></li>
                <li><a className="active" href="/BookingDate" data-toggle="tooltip" title="Booking"><i class="fas fa-calendar-check"></i></a></li>
            </ul>
        </div>
        <div className="reviews-container">
            <div className="reviews-header">
                <FaCommentAlt className="reviews-icon" />
                <h2>FEEDBACK</h2>
            </div>
            <div className="reviews-button-p">
                <button onClick={() => setIsModalOpen(true)} className="reviews-button">Write a Feedback!</button>
            </div>

            {reviews.map((review, index) => (
            <p className = "feedback-box">{review.feedback}</p>
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form className="reviews-form">
                    <h6>WRITE A FEEDBACK FOR US!</h6>
                    <textarea
                        name="feedback"
                        value={feedback}
                        onChange = {(e) => setFeedback(e.target.value)}
                        placeholder="type here...."
                        required
                        className="reviews-textarea"
                    />
                    <button type="submit" className="reviews-button" onClick={handleButtonClick}>Submit</button>
                </form>
            </Modal>
        </div>
       </>
    );
};

export default Reviews;
