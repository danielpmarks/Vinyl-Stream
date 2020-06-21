import React from 'react';
import '../App.css';


function LandingScreen() {

    const title = {
        marginTop: "20vh",
        fontFamily: "Bungee Shade",
        fontSize: "10vmin"
    }

    const buttonStyle = {
        borderRadius: "5vmin",
        fontSize: "5vmin",
        padding: "1vmin 6vmin 1vmin 6vmin",
        marginTop: "20vmin",
        backgroundColor: "#1DB954",
        color: "white",
        border: "none",
        fontFamily: "Roboto",
        outline: "none"
    }

    return (
        <div className="col text-center background" style={{ backgroundImage: "linear-gradient(rgba(255, 187, 170, 1), rgba(254, 255, 225, 1))"}}>
            <h1 style={title}>Vinyl<br/>Stream</h1>
            <a href="https://vinyl-stream-backend.herokuapp.com/login">
                <button style={buttonStyle}>Sign in with Spotify</button>
            </a>
        </div>
    );
}

export default LandingScreen;
