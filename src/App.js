import React from 'react';
import './App.css';
import Player from './Pages/Player';
import LandingScreen from './Pages/LandingScreen';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function getAccessToken() {
    var url = window.location;
    var access_token = new URLSearchParams(url.search).get('access_token');
    return access_token;
}

function App() {

    let access_token = getAccessToken();

    if (!access_token) {


        return (
            <LandingScreen />
        );
    } else {
        return (
            <Player />
            );
    }
}

export default App;
