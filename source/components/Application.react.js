var React = require("react");
var _ = require("lodash");
var $ = require("jquery");
var ChannelTable = require("./ChannelTable.react");
var AddChannelModal = require("./AddChannelModal.react");

var glyphiconStyle = {
	verticalAlign: 'middle',
	top: 0,
	marginRight: 10
};

var channelTableWrapperStyle = {
    marginTop: 10,
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: 5	
};

var Application = React.createClass({
	getInitialState: function(){
		return ({
			loading: false,
			names: ["Paradox","ESL_SC2","freecodecamp","channelnotfound404", "storbeck","OgamingSC2", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"],
			objects: {},
			displayNames: [],
			filterString: "",
			filterRadio: "all"
		});
	},
	addNames: function(new_names){
		var names = this.state.names;
		names = names.concat(new_names);
		this.setState({names: names});
		this.updateChannelObjects(names);
	},
	onRadioClick: function(e){
		var id = e.currentTarget.id;
		var filterRadio;
		switch (id){
			case "onlineFilter":
				filterRadio = "online";
				break;
			case "offlineFilter":
				filterRadio = "offline";
				break;
			case "inactiveFilter":
				filterRadio = "inactive";
				break;
			default:
				filterRadio = "all";
		}
		this.setState({filterRadio: filterRadio});
		this.updateFilteredIndexes(this.state.filterString, filterRadio);	
	},
	updateFilterString: function(e){
		var filterString = e.target.value;
		this.setState({filterString: filterString});
		this.updateFilteredIndexes(filterString, this.state.filterRadio);
	},
	updateFilteredIndexes: function(filterString, filterRadio){
		var objects = this.state.objects;
		filterString = filterString.toLowerCase();
		filterRadio = filterRadio.toLowerCase();
		var displayNames = [];
		
		if (filterRadio === "all"){
			filterRadio = "";
		}
		
		_(objects).forEach(function(object){
			var name = object.title;
			if(name.toLowerCase().indexOf(filterString) > -1 && object.status.toLowerCase().indexOf(filterRadio) > -1){
				displayNames.push(name);
			}
		});
	
		
		displayNames.sort(function(name_a, name_b){
			var status_a = objects[name_a].status;
			var status_b = objects[name_b].status;
			if (status_a == "online"){
				return -1;
			} else if (status_b == "online"){
				return 1;
			} else if (status_a == "offline") {
				return -1;
			} else if (status_b == "offline"){
				return 1;
			} else {
				return 0;
			}
		});
		
		this.setState({displayNames: displayNames});
	},
	updateChannelObjects: function(names){
		this.setState({loading: true});
		if(names.length == 0){
			names = this.state.names;	
		}
		var objects = {};
		var self = this;
		
		var checkStreamingStatus = function(){
			var count = 0;
			_(objects).forEach(function(object){
				$.ajax({
					url:"https://api.twitch.tv/kraken/streams/"+object.title,
					dataType: "jsonp",
					method: "get"
					})
			  	.done(function(data) {
					if(data.error){
						//channel does not exisit
						object.status = 'inactive';
						
					} else if(data.stream) {
						//channel is live streaming
						object.status = 'online';
						object.description = data.stream.channel.status;
						
					} else {
						//channel is not live streaming
						object.status = 'offline';
						object.description = 'offline';
					}
					count += 1;
					
					if(count == Object.keys(objects).length){
						//callbacks complete
						console.log('[twitch-dashboard] API calls complete', objects);
						self.setState({loading: false, objects: objects});
						self.updateFilteredIndexes(self.state.filterString, self.state.filterRadio);
					}
			    })
			    .fail(function(err){
			    	console.warn("[twitch-dashboard] error "+ err);
			    });
			});	
		};
		
		var checkAccountStatus =  function(){
			var count = 0;
			_(names).forEach(function(curr_name){
				$.ajax({
					url:"https://api.twitch.tv/kraken/channels/"+curr_name,
					dataType: "jsonp",
					method: "get"
					})
			  	.done(function(data) {
			  		var object = {};
					if(data.error){
						//channel does not exisit
						object.error = data.error;
						object.description = "no account on twitch.tv";
						object.title = curr_name;
						
					} else { 
						//channel is active, but not required to be live
						object.url = data.url;
						object.imgsrc = data.logo;
						object.title = data.display_name;
					}
					objects[object.title]=object;
					count+=1;
					
					if(count ==  names.length){
						//callback completed
						checkStreamingStatus();
					}
			    })
			    .fail(function(err){
			    	console.warn("[twitch-dashboard] error "+ err);
			    });
			});
		};
		
		checkAccountStatus();
		
	},
	componentWillMount: function(){
		this.updateChannelObjects([]);
	},
	render: function(){
		var self = this;
		var loadingNotification;
		if(this.state.loading){
			loadingNotification = <div className="loaderWrapper"><div className="loader"></div></div>;
		}
		return (
		<div>
	    <nav className="navbar navbar-default navbar-fixed-top">
	      <div className="container">
	        <div className="navbar-header">
	          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
	            <span className="sr-only">Toggle navigation</span>
	            <span className="icon-bar"></span>
	            <span className="icon-bar"></span>
	            <span className="icon-bar"></span>
	          </button>
	          <a className="navbar-brand" href="#">Twitch Dashboard</a>
	        </div>
	        <div id="navbar" className="collapse navbar-collapse">
	          <ul className="nav navbar-nav">
	          	<li>
					<a href="#" id="myModaltrigger" data-toggle="modal" data-target="#myModal">
						<span className="glyphicon glyphicon-plus-sign" aria-hidden="true" style={glyphiconStyle} />Add Channel
					</a>
				</li>
	            <li>
	            	<a href='#' onClick={function(){self.updateChannelObjects([])}}>
	            		<span className="glyphicon glyphicon-refresh" aria-hidden="true" style={glyphiconStyle} />Refresh
					</a>
				</li>
	          </ul>
	        </div>
	      </div>
	    </nav>
	    <AddChannelModal addNames={this.addNames} glyphiconStyle={glyphiconStyle}/>
		<div className="container">
			<div className="row">  
				<div className="col-md-12">
					<div id="channelTableWrapper" style={channelTableWrapperStyle}>
					{loadingNotification}
					<ChannelTable objects={this.state.objects} 
								displayNames={this.state.displayNames} 
								updateFilterString={this.updateFilterString}
								onRadioClick={this.onRadioClick}
								filterRadio={this.state.filterRadio}/>
					</div>
				</div>
			</div>
		</div>
		</div>
		);
	}
});

module.exports = Application;

