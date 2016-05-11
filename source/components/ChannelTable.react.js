var React = require("react");
var FiltersRow = require("./FiltersRow.react");
var TwitchRow = require("./TwitchRow.react");


var ChannelTable = React.createClass({
	render: function(){
	    var displayNames = this.props.displayNames;
	    var objects = this.props.objects;
	    return (
        <table className="table table-hover">
        <thead>
            <tr>
                <th className="col-xs-4">Channel</th>
                <th className="col-xs-1 statusColumn">Status</th>
                <th className="col-xs-7">Current Stream</th>
            </tr>
        </thead>
        <tbody>
            <FiltersRow updateFilterString={this.props.updateFilterString}
                        onRadioClick={this.props.onRadioClick}
                        filterRadio={this.props.filterRadio}/>
            {displayNames.map(function(name){
                return <TwitchRow key={name} object={objects[name]} />;
            })}
        </tbody>
        </table>
	    );
	}
});

module.exports = ChannelTable;
