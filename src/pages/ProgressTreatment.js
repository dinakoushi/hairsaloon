import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams} from 'react-router-dom';
import { FaCommentAlt } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component
import '../assets/styles/customerlists.css'; // Import the CSS file for styling

const ProgressTreatment = (id) => {

    const { appointmentId } = useParams();
    //const [appointmentId, setAppointmentId] = useState("");
    const [progressDescription, setProgressDescription] = useState('');
    const [progressImage, setProgressImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progressList, setProgressList] = useState([]);

    // Fetch reviews from the server
    const fetchProgress = async () => {
        try {
            //const response = await axios.get(`/api/progress/${userId}`);
            //setProgressList(response.data);
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    };

    const handleImageChange = (event) => {
        setProgressImage(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setProgressDescription(event.target.value);
    };

    const handleButtonClick = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('description', progressDescription);
        formData.append('image', progressImage);

        try {
            await axios.post(`http://localhost:5001/updateProgress/${appointmentId}`, formData);
            setProgressDescription('');
            setProgressImage(null);
            setIsModalOpen(false);
            fetchProgress(); // Refresh the progress list
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };


    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <h2>TREATMENT PROGRESS</h2>
            </div>
            <div className="reviews-button-p">
                <button onClick={() => setIsModalOpen(true)} className="progress-button">Update Progress</button>
            </div>

            {/* Display existing progress */}
            <div className="progress-list">
                {progressList.map((item, index) => (
                    <div key={index} className="progress-item">
                        <p>{item.description}</p>
                        {item.image && <img src={item.image} alt="Progress" className="progress-image" />}
                    </div>
                ))}
            </div>

            {/* Modal for updating progress */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form className="progress-form">
                    <h6>Update Progress</h6>
                    <input className="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <textarea
                        className="txtAInput"
                        value={progressDescription}
                        onChange={handleDescriptionChange}
                        placeholder="Enter progress description"
                        required
                    />
                    <button type="submit" className="progress-button" onClick={handleButtonClick}>Submit</button>
                    </form>
            </Modal>
        </div>
    );
};

export default ProgressTreatment;
