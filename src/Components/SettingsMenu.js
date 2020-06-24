import React from 'react'

export default class SettingsMenu extends React.Component {
	constructor(props) {
		super(props);

		this.close = this.close.bind(this);
		this.changeColor = this.changeColor.bind(this);
		this.changeTextColor = this.changeTextColor.bind(this);
		this.fullscreen = this.fullscreen.bind(this);
	}

	close() {
		this.props.close(true);
	}

	fullscreen() {
		this.props.fullscreen(true);
    }

	changeColor() {
		this.props.changeColor(true);
	}

	changeTextColor() {
		this.props.changeTextColor(true);
	}

	render() {
		var open = this.props.open;
		return (
			<div>
				<div className="dimBackground" style={{visibility: this.props.open ? "visible" : "hidden"}}/>
				<div className="container settingsMenu" style={{ animation: open ? "slideIn 0.5s forwards" : "slideOut 0.5s forwards" }}>
					<div className="row py-2 px-2 justify-content-between">
						<button onClick={this.fullscreen}>
							<i style={{ fontSize: "5vmin" }} className="material-icons">
								{document.fullscreenElement ? "fullscreen_exit" : "fullscreen"}</i></button>
					<button onClick={this.close}><i style={{ fontSize: "5vmin" }} className="material-icons">clear</i></button></div>
				<div className="col px-1 align-content-center">
					<button className="settingsButton" style={{ backgroundImage: this.props.color, color: this.props.accentColor }} onClick={this.changeColor}>Background Color</button>
					<button className="settingsButton" style={{ backgroundImage: this.props.color, color: this.props.accentColor }} onClick={this.changeTextColor}>Accent Color</button></div>
				</div>
				</div>
			);
	}
}