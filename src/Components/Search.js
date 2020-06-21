import React from 'react';


export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            display: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.selectSong = this.selectSong.bind(this);
        this.exitSearch = this.exitSearch.bind(this);
        
    }

    selectSong(id) {
        this.props.selection(id);
        this.exitSearch();
    }

    handleChange(event) {
        this.setState({ input: event.target.value });
        this.props.value(this.state.input);
    }

    exitSearch() {
        this.props.exit(true);
    }
   

    render() {

        var display = this.props.enabled;

        var covers = [];
        var tracks = [];

        if (display) {
            return (
                <div>
                    <div className="dimBackground" />
                    <button onClick={this.exitSearch} className="material-icons exitSearch" style={{ webkitTextStroke: "1px black"}}>clear</button>
                    <div className="row searchCard">

                        <input className="form-control searchBar" type="text"
                            value={this.state.input} onChange={this.handleChange} />
                        <div className="list-group searchList" style={{border: this.props.results.length > 0 ? "2px solid black" : "none"}}>
                            {this.props.results.map((value) => {
                                if (value != undefined) {
                                    return <button key={value} onClick={() => this.selectSong(value)} className="list-group-item list-group-action"><div className="row"><div className="col-2 px-0"> <img className="searchThumbnail" src={value.album.images[0].url} /></div>
                                        <div className="col text-truncate text-left"><p className="searchResult">{value.name}</p></div></div></button>
                                }
                            })}
                        </div>
                    </div>
                </div>

            );
        } else {
            return (
                <div />
            );
        }
    }
}