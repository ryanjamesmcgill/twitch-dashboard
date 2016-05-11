var React = require("react");

var rowStyle = {
	cursor: "pointer"
};

var AddChannelRow = React.createClass({
	render: function(){
		var selectedClass = "";
		if(this.props.selected){
			selectedClass += "success";
		}
		return (
        <tr style={rowStyle} 
        	id={this.props.channel.title} 
        	onClick={this.props.onSelectChannel}
        	className={selectedClass}>
            <td>{this.props.channel.title}</td>
            <td>{this.props.channel.description}</td>
        </tr>
		);
	}
});

module.exports = AddChannelRow;

