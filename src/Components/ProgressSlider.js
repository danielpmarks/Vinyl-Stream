import React from 'react';

import Slider from '@material-ui/core/Slider';

export default class ProgressSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            update: true
        }

        this.changeProgess = this.changeProgess.bind(this);
    }

    changeProgess() {
        this.props.update()
    }

    millisToTimestamp(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    

    render() {
        
        let currentTime = this.millisToTimestamp(this.props.progress);
        let timeLeft = this.millisToTimestamp(this.props.duration - this.props.progress);


        return (
            <div className="row">
                <div className="col"><p>{currentTime}</p></div>
                <div className="col-8"><Slider
                    max={this.props.duration}
                    value={this.props.progress}
                    track='normal'
                    //onDragStart={this.setState({ update: false })}
                    //onDragEnd={this.setState({update: true})}
                /></div>
                <div className="col"><p>-{timeLeft}</p></div>
                </div>
        );
    }

}

