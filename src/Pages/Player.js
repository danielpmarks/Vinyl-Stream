import React from 'react';
import Truncate from 'react-truncate';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import '../App.css';
import Record from '../Components/Record.js';
import Search from '../Components/Search.js'
import SettingsMenu from '../Components/SettingsMenu.js'
import ProgressSlider from '../Components/ProgressSlider.js'

import logo from '../res/Spotify-Logo.png'
import PlaylistView from '../Components/PlaylistView';

var Spotify = require('spotify-web-api-js')
const spotifyApi = new Spotify();

let colors = ["linear-gradient(rgba(255, 187, 170, 1), rgba(254, 255, 225, 1))",
    "linear-gradient(180deg, rgba(170,240,255,1) 0%, rgba(238,226,131,1) 100%)",
    "linear-gradient(180deg, rgba(191, 170, 255, 1) 0%, rgba(49, 221, 147, 1) 100%)",
    "linear-gradient(0deg, rgba(246,137,59,1) 0%, rgba(255,239,50,1) 100%)",
    "linear-gradient(0deg, rgba(48,132,255,1) 0%, rgba(36,39,74,1) 100%)",
    "linear-gradient(0deg, rgba(255,48,62,1) 0%, rgba(51,17,1,1) 100%)",
    "linear-gradient(0deg, rgba(134,134,134,1) 0%, rgba(255,255,255,1) 100%)"];
let accentColors = ["#bd2f00", "#1f5e63", "#320062", "#c70905", "#dbe6ff", "#f6d8ca", "#1d1d1d"]


class Player extends React.Component {
    constructor() {
        super();
        const token  = this.getAccessToken();
       
        console.log(token);
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: {
                name: 'Open Spotify and start a song',
                album: '',
                artist: '',
                albumArt: logo
            },
            is_playing: false,
            playPause: "play_arrow",

            shuffle_state: false,
            repeat_state: "off",

            skipUpdate: false,

            search: false,
            search: false,
            searchList: [],

            userPlaylists: [],
            playlistView: false,

            colors: ["linear-gradient(rgba(255, 187, 170, 1), rgba(254, 255, 225, 1))",
                "linear-gradient(180deg, rgba(170,240,255,1) 0%, rgba(238,226,131,1) 100%)",
                "linear-gradient(180deg, rgba(191, 170, 255, 1) 0%, rgba(49, 221, 147, 1) 100%)",
                "linear-gradient(0deg, rgba(246,137,59,1) 0%, rgba(255,239,50,1) 100%)",
                "linear-gradient(0deg, rgba(48,132,255,1) 0%, rgba(36,39,74,1) 100%)",
                "linear-gradient(0deg, rgba(255,48,62,1) 0%, rgba(51,17,1,1) 100%)",
            "linear-gradient(0deg, rgba(134,134,134,1) 0%, rgba(255,255,255,1) 100%)"],
            
            accentColors: ["#bd2f00", "#1f5e63", "#320062", "#c70905", "#dbe6ff", "#f6d8ca", "#1d1d1d"],
            accentColor: "",


            colorIndex: "",
            background_color: "",

            settingsOpen: false,

            currentTrack: {},

            searchButton: true,
            playlistButton: true,
            settingsButton: true,
            

        } 

        this.getNowPlaying();
        this.recalibrate();
        this.getPlaylists();

        this.skipToNext = this.skipToNext.bind(this);
        this.skipToPrevious = this.skipToPrevious.bind(this);
        this.setPlayState = this.setPlayState.bind(this);
        this.setRepeat = this.setRepeat.bind(this);
        this.setShuffle = this.setShuffle.bind(this);

        this.openSettings = this.openSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);

        this.search = this.search.bind(this);
        this.playSong = this.playSong.bind(this);
        this.openSearch = this.openSearch.bind(this);
        this.exitSearch = this.exitSearch.bind(this);

        this.getPlaylists = this.getPlaylists.bind(this);
        this.startPlaylist = this.startPlaylist.bind(this);
        this.openPlaylistView = this.openPlaylistView.bind(this);
        this.exitPlaylistView = this.exitPlaylistView.bind(this);

        this.changeColor = this.changeColor.bind(this);
        this.changeTextColor = this.changeTextColor.bind(this);
        
        
        
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentDidMount() {

        this.interval = setInterval(() => (this.getNowPlaying(), this.recalibrate()), 750);

        let cIndex = localStorage.getItem('colorIndex');
        let accent = localStorage.getItem('accentColor');
        console.log(cIndex + " " + accent);
        if (cIndex == undefined || accent == undefined) {
            this.setState({
                colorIndex: 0,
                accentColor: "black",

                background_color: colors[0],
            })
        } else {
            this.setState({
                colorIndex: cIndex,
                accentColor: accent,

                background_color: colors[cIndex],
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    getAccessToken() {
        var url = window.location;
        var access_token = new URLSearchParams(url.search).get('access_token');
        return access_token;
    }

    handleKeyPress(event) {
        if (!event.repeat) {
            switch (event.code) {
                case "Space":
                    this.setPlayState();
               /* case "ArrowRight":
                    this.skipToNext();
                case "ArrowLeft":
                    this.skipToPrevious();*/
            } 
        }
        
    }



    openSettings() {
        this.setState({
            settingsOpen: true,
            searchButton: false,
            playlistButton: false
        });
        
    }

    closeSettings() {
        
        this.setState({
            settingsOpen: false,
            searchButton: true,
            playlistButton: true
        });
    }

    changeColor() {
        
        let nextIndex = (this.state.colorIndex + 1) % colors.length;
        let nextBackground = colors[nextIndex];
        let nextAccent = this.state.accentColor === "white" ? "white" : this.state.accentColor === "black" ? "black" :
            accentColors[nextIndex]

        this.setState({
            colorIndex: nextIndex,
            background_color: nextBackground,
            accentColor: nextAccent
        });
        localStorage.setItem('colorIndex', nextIndex);
        localStorage.setItem('accentColor', nextAccent);

      
    }

    changeTextColor() {
        let nextAccent = this.state.accentColor === "black" ? "white" :
            this.state.accentColor === "white" ? accentColors[this.state.colorIndex] : "black"
        this.setState({
            accentColor: nextAccent
        });

        localStorage.setItem('accentColor', nextAccent);
    }

    getPlaylists() {
        spotifyApi.getUserPlaylists()
            .then((response) => {
                var playlists = [];
                for (var i = 0; i < response.items.length; i++) {
                    playlists.push(response.items[i]);
                }
                this.setState({
                    userPlaylists: playlists
                })
            })
    }

    startPlaylist(playlist) {
        var playlistId = {
            "context_uri": playlist.uri
        }
        spotifyApi.play(playlistId);
    }

    openPlaylistView() {
        this.setState({
            playlistView: true,
            searchButton: false,
            settingsButton: false
        })
    }

    exitPlaylistView() {
        this.setState({
            playlistView: false,
            searchButton: true,
            settingsButton: true
        })
    }

    search(value) {
        console.log(value);
        if (value != undefined) {
            spotifyApi.search(value, ['track'])
                .then((response) => {
                    //console.log(response);
                    var results = [];
                    for (var i = 0; i < 10; i++) {
                        var track = response.tracks.items[i];
                        results.push(track);
                    }
                    this.setState({
                        searchList: results
                    })
                });
        }
    }

    openSearch() {
        this.setState({
            search: true,
            playlistButton: false,
            settingsButton: false
        });
    }

    exitSearch() {
        this.setState({
            search: false,
            playlistButton: true,
            settingsButton: true
        });
    }

    

    playSong(id) {
        var play = {
            "uris": [id.uri]
        }
        console.log(id.uri);
        spotifyApi.play(play);
    }

    skipToPrevious() {
        spotifyApi.skipToPrevious();
        this.recalibrate();
    }

    skipToNext() {
        spotifyApi.skipToNext();
        console.log("next");
        this.recalibrate();
    }

    setPlayState() {
        if (this.state.is_playing) {
            spotifyApi.pause();
            this.setState({
                is_playing: "false",
                playPause: "play_arrow",
                skipUpdate: true
            });
        } else {
            spotifyApi.play();
            this.setState({
                is_playing: "true",
                playPause: "pause",
                skipUpdate: true

            });
        }
    }

    setShuffle() {
        spotifyApi.setShuffle(!this.state.shuffle_state);
        this.setState({
            shuffle_state: !this.state.shuffle_state,
            skipUpdate: true
        });
    }

    setRepeat() {
        var repeat = this.state.repeat_state;

        var nextState = "";
        if (repeat === "off") {
            nextState = "context";
        } else if (repeat === "context") {
            nextState = "track";
        } else {
            nextState = "off";
        }

        spotifyApi.setRepeat(nextState);
        this.setState({
            repeat_state: nextState,
            skipUpdate: true
        })
    }


    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                //console.log(response);
                if (response != undefined && response.item != undefined) {
                    this.setState({
                       
                        nowPlaying: {
                            name: response.item.name,
                            album: response.item.album.name,
                            artist: response.item.artists[0].name,
                            albumArt: response.item.album.images[0].url
                        },
                        currentTrack: response
                    });
                }

            });

    }

    recalibrate() {
        if (!this.state.skipUpdate) {
            spotifyApi.getMyCurrentPlaybackState()
                .then((response) => {
                    if (response != undefined) {
                        this.setState({

                            shuffle_state: response.shuffle_state,
                            repeat_state: response.repeat_state,
                            is_playing: response.is_playing,
                            playPause: response.is_playing ? "pause" : "play_arrow"


                        });
                    }

                });
        } else {
            this.setState({
                skipUpdate: false
            })
        }
    }

    render() {


        var nowPlayingSong = this.state.nowPlaying.name;
        var nowPlayingAlbum = this.state.nowPlaying.album;
        var nowPlayingArtist = this.state.nowPlaying.artist;

        var nowPlayingCover = this.state.nowPlaying.albumArt;


        if (window.innerHeight / window.innerWidth <= 7 / 10) {
            
            return (
                <div className="background" style={{"backgroundImage": colors[this.state.colorIndex]}}>

                    <Search exit={this.exitSearch} enabled={this.state.search} selection={this.playSong} results={this.state.searchList} value={this.search} />
                    <SettingsMenu open={this.state.settingsOpen} close={this.closeSettings} color={this.state.background_color} accentColor={this.state.accentColor} changeColor={this.changeColor} changeTextColor={this.changeTextColor} />
                    <PlaylistView exit={this.exitPlaylistView} enabled={this.state.playlistView} playlists={this.state.userPlaylists} startPlaylist={this.startPlaylist} width="60vw" left="20vw"/>



                    {
                        //Nav bar
                    }

                    <div id="topBar" className="container-fluid px-sm-0" >
                        <div className="row justify-content-between" style={{ marginTop: "2vmin" }}>
                            <div className="col-auto mx-3"><a className="VinylStream" href="https://danielpmarks.github.io/vinyl-stream/">
                                <h1 className="VinylStream" style={{ color: this.state.accentColor}}>Vinyl Stream</h1></a>
                            </div>
                            <div className="col-auto mx-5">
                                <div className="row justify-content-end" >

                                    <button disabled={!this.state.searchButton} onClick={this.openSearch} className="playbackButtons">
                                            <i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}>search</i></button>

                                    <button disabled={!this.state.playlistButton} onClick={this.openPlaylistView} className="playbackButtons">
                                            <i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}>playlist_play</i></button>
                                    <button disabled={!this.state.settingsButton} onClick={this.openSettings} className="playbackButtons">
                                            <i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}> settings</i></button>
                                </div>
                            </div>
                        </div>
                        <hr style={{ marginTop: "0vmin", border: "2px solid " + this.state.accentColor }} />
                    </div>
                    <div style={{ height: "90%" }} className="container-fluid">

                        <div style={{ height: "100%" }} className="col-5 mx-3">
                            <div className="row align-items-center" style={{ height: "100%" }}>

                                {
                                    //Playback information
                                }
                                <div className="container" style={{ display: "block", color: this.state.accentColor}}>
                                    <div className="row align-items-end justify-content-center" style={{height: "20vh"}}>
                                        <Truncate lines={2} className="playerInfo p-3" style={{ fontSize: "9vmin", fontWeight: "bold", paddingBottom: "1vmin" }}>
                                            {nowPlayingSong}</Truncate>
                                    </div>

                                    <div className="row justify-content-center">
                                        <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "6vmin", paddingBottom: "1vmin" }}>
                                            {nowPlayingAlbum}</Truncate>
                                    </div>
                                    <div className="row justify-content-center">
                                        <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "4vmin", paddingBottom: "1vmin" }}>
                                            {nowPlayingArtist}</Truncate>
                                    </div>

                                    {
                                        //Playback buttons 
                                    }
                                    <div className="row justify-content-center" style={{ marginTop: "2vh"}}>
                                        <button className="playbackButtons" onClick={this.setShuffle} >
                                            <i style={{fontSize: "6vmin", color: (this.state.shuffle_state ? "#1DB954" : this.state.accentColor) }} className='material-icons queueButtons'>shuffle</i></button>

                                        <div className="row" style={{ marginLeft: "3vmin", marginRight: "3vmin"}}>
                                            <button className="playbackButtons" onClick={this.skipToPrevious}>
                                                <i style={{ fontSize: "10vmin", color: this.state.accentColor}} className='material-icons'>skip_previous</i>
                                            </button>
                                            <button className="playbackButtons" onClick={this.setPlayState}>
                                                <i style={{ fontSize: "10vmin", color: this.state.accentColor }} className='material-icons'>{this.state.playPause}</i></button>
                                            <button className="playbackButtons" onClick={this.skipToNext}>
                                                <i style={{ fontSize: "10vmin", color: this.state.accentColor }} className='material-icons'>skip_next</i>
                                            </button>
                                        </div>

                                        <button className="playbackButtons" onClick={this.setRepeat}>
                                            <i style={{ fontSize: "6vmin", color: (this.state.repeat_state !== "off" ? "#1DB954" : this.state.accentColor) }}
                                                className='material-icons queueButtons'>
                                                {this.state.repeat_state === "track" ? "repeat_one" : "repeat"}</i></button>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {
                            //Vinyl Record
                        }
                        <div className="col-6 align-self-center">
                            <Record colorIndex={this.state.colorIndex} loc={{ size: 80, right: 30, top: 55 }} playing={this.state.is_playing ? "running" : "paused"} src={nowPlayingCover} />
                        </div>

                        

                    </div>
                </div>


            );
        } else if (window.innerHeight / window.innerWidth <= 7/5) {
            return (
                <div className="background" style={{ "backgroundImage": colors[this.state.colorIndex] }}>

                    <Search exit={this.exitSearch} enabled={this.state.search} selection={this.playSong} results={this.state.searchList} value={this.search} />
                    <SettingsMenu open={this.state.settingsOpen} close={this.closeSettings} color={this.state.background_color} accentColor={this.state.accentColor} changeColor={this.changeColor} changeTextColor={this.changeTextColor} />
                    <PlaylistView exit={this.exitPlaylistView} enabled={this.state.playlistView} playlists={this.state.userPlaylists} startPlaylist={this.startPlaylist} width="70vw" left="15vw" />


                    {
                        //Nav bar
                    }

                    <div id="topBar" className="container-fluid px-sm-0" >
                        <div className="row justify-content-between" style={{ marginTop: "2vmin"}}>
                            <div className="col-auto mx-3"><a className="VinylStream" href="https://danielpmarks.github.io/vinyl-stream/">
                                <h1 className="VinylStream" style={{color: this.state.accentColor}}>Vinyl Stream</h1></a>
                            </div>
                            <div className="col-auto mx-5">
                                <div className="row justify-content-end" >
                                    
                                    <button onClick={this.openSearch} className="playbackButtons"><i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}>search</i></button>
                                    
                                    <button onClick={this.openPlaylistView} className="playbackButtons"><i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}>playlist_play</i></button>

                                    <button onClick={this.openSettings} className="playbackButtons">
                                        <i className="material-icons" style={{ fontSize: "5vmin", color: this.state.accentColor }}> settings</i></button>
                                    </div>
                          </div>
                        </div>
                        <hr style={{ marginTop: "0vmin", border: "2px solid " + this.state.accentColor }} />
                    </div>
                    <div style={{ height: "90%" }} className="container-fluid">

                        <div style={{ height: "100%" }} className="col-6 ">
                            <div className="row align-items-center" style={{ height: "100%" }}>

                                {
                                    //Playback information
                                }
                                <div className="container" style={{ display: "block", color: this.state.accentColor }}>
                                    <div className="row justify-content-center ">
                                        <Truncate lines={2} className="playerInfo py-3" style={{fontSize: "7vmin", fontWeight: "bold" }}>
                                            {nowPlayingSong}</Truncate>
                                    </div>

                                    <div className="row justify-content-center ">
                                        <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "5vmin" }}>
                                            {nowPlayingAlbum}</Truncate>
                                    </div>
                                    <div className="row justify-content-center">
                                        <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "4vmin" }}>
                                            {nowPlayingArtist}</Truncate>
                                    </div>

                                    {
                                        //Playback buttons 
                                    }
                                    <div className="row justify-content-center">
                                        <button className="playbackButtons" onClick={this.setShuffle}>
                                            <i style={{ fontSize: "3vmin", color: (this.state.shuffle_state ? "#1DB954" : this.state.accentColor) }} className='material-icons queueButtons'>shuffle</i></button>

                                        <div className="row" style={{marginLeft: "2vw", marginRight: "2vw"}}>
                                            <button className="playbackButtons" onClick={this.skipToPrevious}>
                                                <i style={{ fontSize: "6vmin", color: this.state.accentColor }} className='material-icons'>skip_previous</i>
                                            </button>
                                            <button className="playbackButtons" onClick={this.setPlayState}>
                                                <i style={{ fontSize: "6vmin", color: this.state.accentColor }} className='material-icons'>{this.state.playPause}</i></button>
                                            <button className="playbackButtons" onClick={this.skipToNext}>
                                                <i style={{ fontSize: "6vmin", color: this.state.accentColor }} className='material-icons'>skip_next</i>
                                            </button>
                                        </div>

                                        <button className="playbackButtons" onClick={this.setRepeat}>
                                            <i style={{ fontSize: "3vmin", color: (this.state.repeat_state !== "off" ? "#1DB954" : this.state.accentColor) }}
                                                className='material-icons queueButtons'>
                                                {this.state.repeat_state === "track" ? "repeat_one" : "repeat"}</i></button>



                                    </div>
                                    
                                </div>

                            </div>
                        </div>

                        {
                            //Vinyl Record
                        }
                        <div className="col-6 align-self-center">
                            <Record colorIndex={this.state.colorIndex} loc={{ size: 70, right: 10, top: 55 }} playing={this.state.is_playing ? "running" : "paused"} src={nowPlayingCover} />
                        </div>

                        

                    </div>

                </div>
           );
        
        } else {
            
            return (
                <div className="background" style={{ "backgroundImage": colors[this.state.colorIndex] }}>

                    <Search exit={this.exitSearch} enabled={this.state.search} selection={this.playSong} results={this.state.searchList} value={this.search} />
                    <SettingsMenu open={this.state.settingsOpen} close={this.closeSettings} color={this.state.background_color} accentColor={this.state.accentColor} changeColor={this.changeColor} changeTextColor={this.changeTextColor} />
                    <PlaylistView exit={this.exitPlaylistView} enabled={this.state.playlistView} playlists={this.state.userPlaylists} startPlaylist={this.startPlaylist} width="70vw" left="15vw" />
                    {
                        //Nav bar
                    }

                    <div id="topBar" className="container-fluid px-0">
                        <div className="row justify-content-between mx-1" style={{ marginTop: "2vmin" }}>
                            <div className="col-auto "><a className="VinylStream" href="https://danielpmarks.github.io/vinyl-stream/">
                                <h1 className="VinylStream" style={{color: this.state.accentColor, fontSize: "5vmin"}}>Vinyl Stream</h1></a>
                            </div>
                            <div className="col-auto">
                                <div className="row justify-content-end" >
                                    
                                        <button onClick={this.openSearch} className="playbackButtons">
                                            <i className="material-icons" style={{ fontSize: "7vmin", color: this.state.accentColor }}>search</i></button>
                                    
                                    
                                    <button onClick={this.openPlaylistView} className="playbackButtons">
                                            <i className="material-icons" style={{ fontSize: "7vmin", color: this.state.accentColor }}>playlist_play</i></button>

                                    <button onClick={this.openSettings} className="playbackButtons">
                                        <i className="material-icons" style={{ fontSize: "7vmin", color: this.state.accentColor }}> settings</i></button>
                                </div>
                            </div>
                        </div>
                        <hr style={{ marginTop: "0vmin", border: "2px solid " + this.state.accentColor}} />
                    </div>
                    <div style={{ height: "90%" }} className="col h-90">
                        

                        
                            <div className="col" style={{ height: "30vh", marginTop: "57vh"}}>

                                {
                                    //Playback information
                                }
                            <div className="container" style={{ display: "block", color: this.state.accentColor }}>
                                    <div className="row justify-content-center">
                                    <Truncate lines={2} className="playerInfo py-3" style={{ fontSize: "7vmin", fontWeight: "bold" }}>
                                            {nowPlayingSong}</Truncate>
                                    </div>

                                    <div className="row justify-content-center ">
                                    <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "4vmin" }}>
                                            {nowPlayingAlbum}</Truncate>
                                    </div>
                                    <div className="row justify-content-center ">
                                    <Truncate lines={1} className="playerInfo py-3" style={{ fontSize: "3vmin" }}>
                                            {nowPlayingArtist}</Truncate>
                                </div>
                                </div>

                                    {
                                        //Playback buttons 
                                    }
                            <div className="container">
                                <div className="row justify-content-center px-0" >
                                        <button className="playbackButtons" onClick={this.setShuffle}>
                                            <i style={{ fontSize: "6vmin", color: (this.state.shuffle_state ? "#1DB954" : this.state.accentColor) }} className='material-icons queueButtons'>shuffle</i></button>

                                        <div className="row" style={{ marginLeft: "2vmin", marginRight: "2vmin" }}>
                                            <button className="playbackButtons" onClick={this.skipToPrevious}>
                                            <i style={{ fontSize: "10vmin", color: this.state.accentColor }} className='material-icons'>skip_previous</i>
                                            </button>
                                            <button className="playbackButtons" onClick={this.setPlayState}>
                                            <i style={{ fontSize: "10vmin", color: this.state.accentColor }} className='material-icons'>{this.state.playPause}</i></button>
                                            <button className="playbackButtons" onClick={this.skipToNext}>
                                            <i style={{ fontSize: "10vmin", color: this.state.accentColor }} className='material-icons'>skip_next</i>
                                            </button>
                                        </div>

                                        <button className="playbackButtons" onClick={this.setRepeat}>
                                            <i style={{ fontSize: "6vmin", color: (this.state.repeat_state !== "off" ? "#1DB954" : this.state.accentColor) }}
                                                className='material-icons queueButtons'>
                                                {this.state.repeat_state === "track" ? "repeat_one" : "repeat"}</i></button>

                                </div>
                                </div>
                            </div>

                        {
                            //Vinyl Record
                        }
                        <div className="col-6 align-self-center">
                            <Record colorIndex={this.state.colorIndex} loc={{ size: 80, right: 50, top: 37}} playing={this.state.is_playing ? "running" : "paused"} src={nowPlayingCover} />
                        </div>

                    </div>
                </div>
                );
        }
    }
}

export default Player;
