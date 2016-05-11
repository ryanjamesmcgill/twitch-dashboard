var React = require("react");

var TwitchRow = React.createClass({
	render: function(){
	
	var object = this.props.object;
    var rowClassName = "";
    if (object.error){
        rowClassName = "danger";
    } else if(object.status == 'online'){
        rowClassName = "success";
    }
    
    var logo=<span className="glyphicon glyphicon-eye-open" style={{fontSize: 45, 
                                                                    color: 'rgba(0,0,0,.15)',
                                                                    verticalAlign: 'middle'}}/>;
    if(object.imgsrc){
        logo=<img src={object.imgsrc} style={{width: 50}}/>;
    }
    
    var rowStyle;
    var statusIcon;
    var clickHandler;
    switch(object.status){
        case "online":
            rowStyle = {cursor:'pointer'};
            statusIcon = <span className="glyphicon glyphicon-volume-up" style={{fontSize:30, color:'#6D9F59'}}/>;
            clickHandler = function(){window.open(object.url)};
            break;
        case "offline":
            rowStyle = {cursor:'pointer'};
            statusIcon = <span className="glyphicon glyphicon-volume-down" style={{fontSize:30, color:'#ADADAD'}}/>;
            clickHandler = function(){window.open(object.url)};
            break;
        default:
            rowStyle = {cursor: 'default'};
            statusIcon = <span className="glyphicon glyphicon-volume-off" style={{fontSize:30, color:'#8F6666'}}/>;
            clickHandler = function(){};
    }
    
		return (
            <tr style={rowStyle} className={rowClassName} onClick={clickHandler}>
                <td style={{verticalAlign:'middle'}}>{logo}<span style={{marginLeft: 15}}>{object.title}</span></td>
                <td style={{verticalAlign:'middle'}} className="statusColumn">{statusIcon}</td>
                <td style={{verticalAlign:'middle'}}>{object.description}</td>
            </tr>
		);
	}
});

module.exports = TwitchRow;
