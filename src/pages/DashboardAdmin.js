import React, { useState , useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import "../assets/styles/global.css";
import "../assets/styles/dashboard.css";
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3.jpg';
import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg';
import img6 from '../assets/images/6.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function DashboardAdmin() {
    const [slideIndex, setSlideIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevSlideIndex) => (prevSlideIndex + 1) % 3);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const slides = [
        {
            src: img1,
            caption: '',
        },
        {
            src: img2,
            caption: '',
        },
        {
            src: img3,
            caption: '',
        },
        {
            src: img4,
            caption: '',
        },
        {
            src: img5,
            caption: '',
        },
        {
            src: img6,
            caption: '',
        },
    ];
    const onReviewClick = async () => {
        navigate('/ReviewBooking'); 
    };

    const onCustClick = async () => {
        navigate('/CustomerLists');
    };
    return (
        <>
            <form>
            <div className="header">
                <div className="topLogo" />
                <ul>
                    <li><a className="active" href="/" data-toggle="tooltip" title="Logout"><i className="fas fa-sign-out-alt"></i></a></li>
                    <li><a className="active" href="/DashboardAdmin" data-toggle="tooltip" title="Home"><i className="fas fa-home"></i></a></li>
                    <li><a className="active" href="/CustomerLists" data-toggle="tooltip" title="Update Progress"><i className="fas fa-tachometer-alt"></i></a></li>
                    <li><a className="active" href="/ReviewBooking" data-toggle="tooltip" title="Pending Booking"><i className="fas fa-list-alt"></i></a></li>
                </ul>
            </div>
            <div className="split left">
                <div className="centered">
                        <h2 className="headerName">Welcome to</h2>
                        <h2 className="headerName">Huda Hair & Beauty Saloon</h2>
                        <h4 className="headerName">(Admin Page)</h4>
                        <button type="button" className="btnSubmit" onClick={onCustClick}><i className="fas fa-tachometer-alt"></i>   Update Progress</button>
                        <button type="button" className="btnSubmit" onClick={onReviewClick}><i className="fas fa-list-alt"></i>   Pending Booking</button>
                </div>
            </div>
            <div className="split right">
                <div className="centered">
                        <div>
                            <div className="slideshow-container">
                                {slides.map((slide, index) => (
                                    <div
                                        className={`mySlides fade ${index === slideIndex ? 'show' : ''}`}
                                        key={index}
                                    >
                                        <div className="numbertext">{`${index + 1} / ${slides.length}`}</div>
                                        <img src={slide.src} style={{ width: '100%' }} alt={`Slide ${index + 1}`} />
                                        <div className="text">{slide.caption}</div>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <div style={{ textAlign: 'center' }}>
                                {slides.map((_, index) => (
                                    <span
                                        className={`dot ${index === slideIndex ? 'active' : ''}`}
                                        key={index}
                                    ></span>
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </form>
        </>
    );
}