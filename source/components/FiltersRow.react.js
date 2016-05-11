var React = require("react");

var TwitchRow = React.createClass({
    _onChange: function(){
        //dummy function for radio button event handlers, 
        //real event handling is done in this.props.onRadioClick()
    },
	render: function(){
	    var filterRadio = this.props.filterRadio;
	    var enabledClass = "";
	    if(filterRadio != "all"){
	        enabledClass = "active";
	    }
		return (
            <tr className="active">
                <td id="channelFilter">
                    <input className="form-control"
                            onChange={this.props.updateFilterString}
                            type="text"
                            placeholder="filter by Channel..."/>
                </td>
                <td className="statusColumn">
                    <div className="btn-group">
                      <button type="button" className={"btn btn-default dropdown-toggle "+enabledClass} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="glyphicon glyphicon-filter"></span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                            <a id="onlineFilter" href="#" onClick={this.props.onRadioClick}>
                            <div className="radio">
                                <label><input type="radio" name="optradio" checked={filterRadio=="online"} onChange={this._onChange}/>Online</label>
                            </div>
                            </a>
                        </li>
                        <li>
                            <a id="offlineFilter" href="#" onClick={this.props.onRadioClick}>
                            <div className="radio">
                                <label><input type="radio" name="optradio" checked={filterRadio=="offline"} onChange={this._onChange}/>Offline</label>
                            </div>
                            </a>
                        </li>
                        <li>
                            <a id="inactiveFilter" href="#" onClick={this.props.onRadioClick}>
                            <div className="radio">
                                <label><input type="radio" name="optradio" checked={filterRadio=="inactive"} onChange={this._onChange}/>Inactive</label>
                            </div>
                            </a>
                        </li>
                        <li role="separator" className="divider"></li>
                        <li>
                            <a id="allFilter" href="#" onClick={this.props.onRadioClick}>
                            <div className="radio">
                                <label><input type="radio" name="optradio" checked={filterRadio=="all"} onChange={this._onChange}/>All</label>
                            </div>
                            </a>
                        </li>
                      </ul>
                    </div>
                </td>
                <td>
                </td>
            </tr>
		);
	}
});

module.exports = TwitchRow;
