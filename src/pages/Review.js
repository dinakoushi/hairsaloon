import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentAlt } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component
import '../assets/styles/review.css'; // Import the CSS file for styling

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [userId, setUserId] = useState("66897ffee6217b5fec676c0e");

    // Fetch reviews from the server
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5001/reviewsList');
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
            const response = await axios.post('http://localhost:5001/addReview', {
                feedback,
                userId
            });
            alert("Data saved successfully");
            setFeedback("");
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

    return (
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
    );
};

export default Reviews;
