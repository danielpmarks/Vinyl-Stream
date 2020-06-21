import React from 'react';
import '../App.css';


class Record extends React.Component {

    render() {
        var centerColors = ["#fee5cc", "#97bcaf", "#7dc1cc", "#fcd134", "#284484", "#711a14"]

        var size = this.props.loc.size;
        var right = this.props.loc.right;
        var top = this.props.loc.top;

        let centerCircle = {
            zIndex: "-1",
            position: "fixed",
            backgroundColor: centerColors[this.props.colorIndex],
            border: "1px solid black",
            borderRadius: "50%",

            width: size / 40 + "vmin",
            height: size / 40 + "vmin",

            right: "calc(" + right + "vw - " + size / 80 + "vmin)",
            top: "calc(" + top + "vh - " + size / 80 + "vmin)",
        }

        let albumStyle = {
            zIndex: "-2",
            width: size/ 2 + "vmin",
            right: "calc(" + right + "vw - " + size / 4 + "vmin)",
            top: "calc(" + top + "vh - " + size / 4 + "vmin)",

            

            position: "fixed",
            borderRadius: "50%",

            animation: "rotate 20s forwards",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",

            animationPlayState: this.props.playing
        };
        let albumBack = {
            zIndex: "-3",
            width: size / 2  + "vmin",
            height: size / 2 + "vmin",
            backgroundColor: "black",
            right: "calc(" + right + "vw - " + size / 4 + "vmin)",
            top: "calc(" + top + "vh - " + size/4 + "vmin)",
            position: "fixed",
            borderRadius: "50%",

         
        };

        let recordStyle = {
            zIndex: "-4",
            width: size + "vmin",
            height: size + "vmin",
            right: "calc(" + right + "vw - " + size/2 + "vmin)",
            top: "calc(" + top + "vh - "+ size/2 + "vmin)",

            position: "fixed",
            borderRadius: "50%",

            animation: "rotate 20s forwards",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",

            animationPlayState: this.props.playing
        }

        

        return (
            <div>
                <img style={recordStyle} src="https://americanvinylco.com/wp-content/uploads/2017/06/LabelsBlank-1024x1024.png" />
                <div style={albumBack}/>
                <img src={this.props.src} style={albumStyle} />
                <div style={centerCircle} />
               
                
            </div>
        );
    }
}

export default Record;