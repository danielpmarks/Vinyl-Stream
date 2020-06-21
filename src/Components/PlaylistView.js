import React from 'react';

export default class PlaylistView extends React.Component {
    constructor(props) {
        super(props);
        this.startPlaylist = this.startPlaylist.bind(this);
        this.exitPlaylistView = this.exitPlaylistView.bind(this);
    }

    startPlaylist(playlist) {
        console.log(playlist.name);
        this.props.startPlaylist(playlist);
        this.props.exit(true);
    }

    exitPlaylistView() {
        this.props.exit(true);
    }

    render() {
        if (this.props.enabled) {
            return (
                <div>
                    <button onClick={this.exitPlaylistView} className="material-icons exitSearch" style={{webkitTextStroke: "1px black"}}>clear</button>
                    <div className="dimBackground" />

                    <div className="container playlistBlock" style={{width: this.props.width, left: this.props.left}}>
                    <h1 className="playlistHeader">Playlists</h1>
                    <div className="list-group playlistMenu">
                        
                        {this.props.playlists.map((value, index) => {

                            return <div className="row list-group-item" style={{ fontFamily: "Roboto", fontSize: "5vmin" }}>
                                <button style={{width: "100%", textAlign: "left"}} onClick={() => this.startPlaylist(value)}>{value.name}</button></div>

                        })}
                    </div>
                    </div>
                    </div>


            );
        } else {
            return (<div />);
        }
    }
}