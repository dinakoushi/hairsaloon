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
export default function Dashboard() {
    const [slideIndex, setSlideIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevSlideIndex) => (prevSlideIndex + 1) % 3);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);
    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user._id : null;
    const loginName = user ? user.name : null;
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
                </ul>
            </div>
            <div className="split left">
                <div className="centered">
                        <h2 className="headerName">Welcome to</h2>
                        <h2 className="headerName">Huda Hair & Beauty Saloon</h2>
                        <p className="pName">Since 2019, Huda Hair Beauty Saloon has been the top choice for women's hair care in Seksyen 16. Offering a range of services including haircuts, wash & blow, hair treatments, and scalp treatments. Each visit is designed to provide a personalized and relaxing experience.
                            <br /><br />Join the many satisfied clients who have trusted Huda Hair Beauty Saloon with their hair care needs. Book now and discover the difference. We look forward to welcoming you!</p>
                    <button type="button" className="btnSubmit" onClick={onLoginClick}>Booking Now!</button>
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