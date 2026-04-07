import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import {useRef} from "react";
import StarsCanvas from "../../components/canves/Star.jsx";
import SpacemanCanvas from "../../components/canves/Spaceman.jsx";

const Homepage = () => {
    const scrollContainer = useRef(null);

    return (
        <div className="homepage" ref={scrollContainer}>
            <StarsCanvas />

            <img src="/orbital.png" alt="" className="orbital" />
            <div className="left">
                <h1>Stock Chat AI</h1>
                <h2>Supercharge your stock research with AI</h2>
                <h3>
                    Powered by RAG &amp; S&amp;P 500 Data
                </h3>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="spaceman-container">
                        <SpacemanCanvas scrollContainer={scrollContainer}/>
                    </div>
                    <div className="chat">
                        <img src="/bot.png" alt="" />
                        <TypeAnimation
                            sequence={[
                                "Ask about any S&P 500 stock and get instant AI insights!",
                                2500,
                                "Explore stock price trends with interactive charts.",
                                2500,
                                "Discover related news and similar companies instantly.",
                                2500,
                                "RAG-powered analysis — grounded in real financial data.",
                                2500,
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt=""/>
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <span>|</span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
