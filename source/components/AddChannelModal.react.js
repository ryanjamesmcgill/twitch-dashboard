var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
var AddChannelRow = require("./AddChannelRow.react");

var tableWrapperStyle = {
	marginTop: 10,
    height: 200,
    overflow: 'scroll',
    border: '1px solid rgb(195, 195, 195)',
    borderRadius: 5
};

var AddChannelModal = React.createClass({
	getInitialState: function(){
		return({
			loading: false,
			searchString: "",
			channels: [],
			selectedChannels: []
		});	
	},
	onSelectChannel: function(e){
		var name = e.currentTarget.id;
		var selectedChannels = this.state.selectedChannels;
		if(selectedChannels.indexOf(name) < 0){
		selectedChannels.push(name);
		}
		this.setState({selectedChannels: selectedChannels});
	},
	onAddSelectedChannels: function(){
		this.setState({searchString: ""});
		this.updateSearchTable("");
		this.props.addNames(this.state.selectedChannels);

	},
	updateSearchString: function(e){
		var searchString = e.target.value;
		this.setState({searchString: searchString});
		this.updateSearchTable(searchString);
	},
	updateSearchTable: function(searchString){
		this.setState({loading: true});
		var channels = [];
		var self = this;
		if(searchString === ""){
			self.setState({
				loading: false,
				channels: channels,
				selectedChannels: []
			});
			return;
		}
		$.ajax({
			url:"https://api.twitch.tv/kraken/search/channels?q="+searchString,
			dataType: "jsonp",
			method: "get"
			})
	  	.done(function(data) {
			var objects = data.channels;
			_(objects).forEach(function(object){
				var channel = {};
				channel.title = object.display_name;
				channel.description = object.status;
				channel.imgsrc = object.logo;
				channel.url = object.url;
				channel.followers = object.followers;
				channels.push(channel);
			});
			
			if(self.state.searchString === searchString){
				self.setState({
					loading: false,
					channels: channels,
					selectedChannels: []}
				);
			}
			
	    })
	    .fail(function(err){
	    	console.warn("[twitch-dashboard] error "+ err);
	    });
	},
	render: function(){
		var self = this;
		var channels = this.state.channels;
		var selectedChannels = this.state.selectedChannels;
		var loadingNotification = "";
		if(this.state.loading){
			loadingNotification = <span><img src="./img/loader.gif" style={{height: 25, verticalAlign:"top"}}/></span>;
		}
		return (
		<div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
		  <div className="modal-dialog" role="document">
		    <div className="modal-content">
		      <div className="modal-header">
		        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 className="modal-title" id="myModalLabel">Add channel.. {loadingNotification}</h4>
	        	
		      </div>
		      <div className="modal-body">
		        <input className="form-control" onChange={this.updateSearchString} value={this.state.searchString} placeholder="enter channel name..." />
		        <div id="table-wrapper" style={tableWrapperStyle}>
		        <table className="table table-hover" style={{marginBottom: 0}}>
		        <tbody>
		        	{channels.map(function(channel){
		        		var selected = false;
		        		if(selectedChannels.indexOf(channel.title) > -1){
		        			selected = true;
		        		}
		        		return (<AddChannelRow 
		        					key={channel.url} 
		        					channel={channel} 
		        					onSelectChannel={self.onSelectChannel}
		        					selected={selected}/>);
		        	})}
		        </tbody>
		        </table>
		        </div>
		      </div>
		      <div className="modal-footer">
		        <button type="button" className="btn btn-default" data-dismiss="modal" 
		        onClick={function(){
		        			self.setState({searchString:""});
		        			self.updateSearchTable("");
		        			}
		        		}
		        >Close</button>
		        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onAddSelectedChannels}>Add</button>
		      </div>
		    </div>
		  </div>
		</div>
		);
	}
});

module.exports = AddChannelModal;

