$(document).ready(function (){
    var action = $(".current").attr("id");
    if (action == "gravity"){
	gravity();
    }
    else if (action == "distancespider"){
	distancespider.init();
    }
});

function gravity(){
    // contains all related to Gravity page
    function Ball () {
	// define Ball object
	this.radius = 1;
	this.mass = 10;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.time = 0;
	this.color = "black";
    }
    Ball.prototype = {
	// define Ball methods
	getX: function(){ return this.x; },
	getData: function(){
	    var r = this.color + " --> x: " + this.x.toFixed(2);
	    r += ", y: " + this.y.toFixed(2);
	    r += ", vx: " + this.vx.toFixed(2);
	    r += ", vy: " + this.vy.toFixed(2);
	    return r;
	},
	move: function(time, world){
	    // update position based on time elapsed
	    var aygrav = this.ay + world.gravity;
	    var timeElapsed = (time - this.time)/1000;
	    var xDispl = this.vx*timeElapsed + .5*this.ax*Math.pow(timeElapsed,2);
	    var yDispl = this.vy*timeElapsed + .5*aygrav*Math.pow(timeElapsed,2);
	    var vfx = this.vx + this.ax*timeElapsed;
	    var vfy = this.vy + aygrav*timeElapsed;
	    // if goes on the ground
	    if (this.y + yDispl >= world.ground) {
		var gap = this.y + yDispl - world.ground;
		var vfynew = Math.sqrt(Math.pow(this.vy,2)+2*aygrav*(yDispl-gap));
		var timedown = 2*(yDispl-gap)/(this.vy+vfynew);
		var timeup = timeElapsed - timedown;
		var yDisplFromGround = vfynew*timeup + .5*aygrav*Math.pow(timeup,2);
		this.y = world.ground - yDisplFromGround;
		this.vy = -vfynew + aygrav*timeup;
	    }
	    // if it goes on the roof
	    else if (this.y + yDispl <= world.roof) {
		var gap = this.y + yDispl - world.roof;
		if (this.vy < 0) {
		    var vfynew = -Math.sqrt(Math.pow(this.vy,2)+2*aygrav*(yDispl-gap));
		}
		else {
		    var vfynew = Math.sqrt(Math.pow(this.vy,2)+2*aygrav*(yDispl-gap));
		}
		var timeup = 2*(yDispl-gap)/(this.vy+vfynew);
		var timedown = timeElapsed - timeup;
		var yDisplFromRoof = vfynew*timedown + .5*aygrav*Math.pow(timedown,2);
		this.y = world.roof - yDisplFromRoof;
		this.vy = -vfynew + aygrav*timedown;
	    }
	    else
	    {
		this.y += yDispl;
		this.vy = vfy;
	    }
	    // if it goes on the right
	    if (this.x + xDispl >= world.right) {
		var gap = this.x + xDispl - world.right;
		var vfxnew = Math.sqrt(Math.pow(this.vx,2)+2*this.ax*(xDispl-gap));
		var timeright = 2*(xDispl-gap)/(this.vx+vfxnew);
		var timeleft = timeElapsed - timeright;
		var xDisplFromRight = vfxnew*timeleft + .5*this.ax*Math.pow(timeleft,2);
		this.x = world.right - xDisplFromRight;
		this.vx = -vfxnew + this.ax*timeleft;
	    }
	    // if it goes to the left
	    else if (this.x + xDispl <= world.left) {
		var gap = this.x + xDispl - world.left;
		if (this.vx < 0) {
		    var vfxnew = -Math.sqrt(Math.pow(this.vx,2)+2*this.ax*(xDispl-gap));
		}
		else {
		    var vfxnew = -Math.sqrt(Math.pow(this.vx,2)+2*this.ax*(xDispl-gap));
		}
		var timeleft = 2*(xDispl-gap)/(this.vx+vfxnew);
		var timeright = timeElapsed - timeleft;
		var xDisplFromLeft = vfxnew*timeright + .5*this.ax*Math.pow(timeright,2);
		this.x = world.left - xDisplFromLeft;
		this.vx = -vfxnew + this.ax*timeright;
	    }
	    else {
		this.x += xDispl;
		this.vx = vfx;
	    }
	    this.time = time;
	},
	draw: function(canvas) {
	    var ctx = canvas.getContext("2d");
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false);
	    ctx.fill();
	}
    };
    function createBall(){
	var ball = new Ball();
	ball.radius = parseInt($("#new_ball_radius").val(), 10);
	ball.ax = parseInt($("#new_ax").val(), 10);
	ball.ay = parseInt($("#new_ay").val(), 10);
	ball.x = parseInt($("#new_x").val(), 10);
	ball.y = parseInt($("#new_y").val(), 10);
	ball.vx = parseInt($("#new_vx").val(), 10);
	ball.vy = parseInt($("#new_vy").val(), 10);
	ball.time = Date.now();
	ball.mass = parseInt($("#new_ball_mass").val(), 10);
	ball.color = $("#new_ball_color").val();
	console.log(ball);
	return ball;
    }
    function Universe(){
	// define Universe object
	this.balls = [];
	this.time = 0;
	this.world = null;
    }
    function World(){
	// define object world with ground, left and right bounds
	this.ground = $("#canvas").height() - 10;
	this.roof = 10;
	this.left = 10;
	this.right = $("#canvas").width() - 10;
	this.gravity = -500;
    }
    Universe.prototype = {
	// define Universe methods
	setCanvas: function (canvas){ this.canvas = canvas;},
	setTime: function (time){ this.time = time;},
	setWorld: function (world) {this.world = world;},
	addBall: function(ball) { this.balls.push(ball);},
	getData: function(){
	    var r = "";
	    for (ball of this.balls) {
		r += ball.getData() + "\n";
	    }
	    return r;
	},
	update: function() {
	    function distance(x1,y1,x2,y2){return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));}
	    var ctx = this.canvas.getContext("2d");
	    ctx.clearRect(0,0,canvas.width,canvas.height);
	    ctx.beginPath();
	    ctx.rect(0,this.world.ground,this.canvas.width,this.canvas.height-this.world.ground);
	    ctx.rect(this.world.right,0,this.canvas.width,this.canvas.height);
	    ctx.rect(0,0,this.world.left,this.canvas.height);
	    ctx.rect(0,0,this.canvas.width,this.world.roof);
	    ctx.fillStyle = "yellow";
	    ctx.fill();
	    var collision = [];
	    for (var i = 0; i < this.balls.length; i++) {
		var ball = this.balls[i];
		ball.move(this.time, this.world);
		for (var j = i + 1; j < this.balls.length; j++) {
		    var otherBall = this.balls[j];
		    if (distance(ball.x,ball.y,otherBall.x,otherBall.y)<(ball.radius+otherBall.radius)){
		       this.manageCollision([ball, otherBall]);
		    }
		    else {
		    }
		}
		ball.draw(this.canvas);
	    }
	},
	manageCollision: function (collision){
	    var b1 = collision[0];
	    var b2 = collision[1];
	    //console.log("Collision detected @ " + this.time + " between " + b1.color + " and " + b2.color);
	    //console.log(b1.getData() + "\n" + b2.getData());
	    // calc collision data
	    var normalvX = b1.x - b2.x;
	    var normalvY = b1.y - b2.y;
	    //console.log("Normal vector --> (" + normalvX.toFixed(2) + "," + normalvY.toFixed(2) + ")");
	    var magnitude = Math.sqrt(Math.pow(normalvX,2)+Math.pow(normalvY,2));
	    var unitnormalvX = normalvX / magnitude;
	    var unitnormalvY = normalvY / magnitude;
	    var unittangentvX = -unitnormalvY;
	    var unittangentvY = unitnormalvX;
	    //console.log("Normal unit vector --> (" + unitnormalvX.toFixed(2) + "," + unitnormalvY.toFixed(2) + ")");
	    //console.log("Tangent unit vector --> (" + unittangentvX.toFixed(2) + "," + unittangentvY.toFixed(2) + ")");
	    //console.log("Initial velocity vector --> (" + b1.color + " : " + b1.vx.toFixed(2) + "," + b1.vy.toFixed(2) + ")");
	    //console.log("Initial velocity vector --> (" + b2.color + " : " + b2.vx.toFixed(2) + "," + b2.vy.toFixed(2) + ")");
	    var obj1normal = b1.vx*unitnormalvX + b1.vy*unitnormalvY;
	    var obj1tangent = b1.vx*unittangentvX + b1.vy*unittangentvY;
	    var obj2normal = b2.vx*unitnormalvX + b2.vy*unitnormalvY;
	    var obj2tangent = b2.vx*unittangentvX + b2.vy*unittangentvY;
	    //console.log("Projected velocity --> " + b1.color + ": normal (" + obj1normal.toFixed(2) + "), tangent (" + obj1tangent.toFixed(2) + ")"); 
	    //console.log("Projected velocity --> " + b2.color + ": normal (" + obj2normal.toFixed(2) + "), tangent (" + obj2tangent.toFixed(2) + ")"); 
	    var obj1newtangent = obj1tangent;
	    var obj2newtangent = obj2tangent;
	    var obj1newnormal = (obj1normal*(b1.mass-b2.mass)+2*b2.mass*obj2normal)/(b1.mass+b2.mass);
	    var obj2newnormal = (obj2normal*(b2.mass-b1.mass)+2*b1.mass*obj1normal)/(b1.mass+b2.mass);
	    var obj1newnormalvX = obj1newnormal*unitnormalvX;
	    var obj1newnormalvY = obj1newnormal*unitnormalvY;
	    var obj1newtangentvX = obj1newtangent*unittangentvX;
	    var obj1newtangentvY = obj1newtangent*unittangentvY;
	    var obj2newnormalvX = obj2newnormal*unitnormalvX;
	    var obj2newnormalvY = obj2newnormal*unitnormalvY;
	    var obj2newtangentvX = obj2newtangent*unittangentvX;
	    var obj2newtangentvY = obj2newtangent*unittangentvY;
	    var newb1vx = obj1newnormalvX + obj1newtangentvX;
	    var newb1vy = obj1newnormalvY + obj1newtangentvY;
	    var newb2vx = obj2newnormalvX + obj2newtangentvX;
	    var newb2vy = obj2newnormalvY + obj2newtangentvY;
	    //console.log("New velocities --> " + b1.color + " (" + newb1vx + "," + newb1vy + ") " + b2.color + " (" + newb2vx + "," + newb2vy + ")");
	    b1.vx = newb1vx;
	    b1.vy = newb1vy;
	    b2.vx = newb2vx;
	    b2.vy = newb2vy;
	},
    }
    function initializeDefaultUniverse(){
	var universe = new Universe();
	var now = Date.now();
	var ball = new Ball();
	ball.radius = 30;
	ball.x = 100;
	ball.y = 50;
	ball.vx = 20;
	ball.time = now;
	ball.mass = 20;
	ball.color =  "red";
	universe.addBall(ball);
	var ball2 = new Ball();
	ball2.radius = 20;
	ball2.x = 200;
	ball2.y = 50;
	ball2.ax = -1000;
	ball2.mass = 5;
	ball2.time = now;
	ball2.color = "blue";
	universe.addBall(ball2);
	var canvas = document.getElementById("canvas");
	universe.setCanvas(canvas);
	universe.setWorld(new World());
	return universe;
    }
    var universe = initializeDefaultUniverse();
    $("#add_ball").on("click",function(){
	universe.addBall(createBall());
    });
    animate();
    function animate() {
	reqAnimFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame;
	universe.setTime(Date.now());
	universe.update();
	reqAnimFrame(animate);
    }
}

var distancespider = {
    init: function () {
	$("button.create_map").on("click", this.create_map);
    },
    map: null,
    map_center: null,
    directions: null,
    distance: null,
    create_map: function (event) {
	var triggered = $(event.target).attr('id');
	var display_map = false;
	if (triggered == "display_default_map") {
            console.log("Default map trigg");
	    distancespider.set_mapcenter_from_values(46.2, 11.2);
	    display_map = true;
	}
	else if (triggered == "display_address_map" || 
		 triggered == "display_coordinates_map" ||
		 triggered == "display_directions_map") {
	    var uinput = distancespider.get_user_input()
	    if (uinput.input_type == 'nothing')
	    {
		alert("enter more info");
	    }
	    else if (uinput.input_type == 'latlng')
	    {
		distancespider.set_mapcenter_from_values(uinput.latitude, uinput.longitude);
		display_map = true;
	    }
	    else if (uinput.input_type == 'address') {
		distancespider.set_mapcenter_from_address(uinput.address);
		display_map = true;
	    }
	    else if (uinput.input_type == 'direction') {
		distancespider.get_directions(uinput.start, uinput.end);
		distancespider.set_mapcenter_from_address(uinput.start);
		distancespider.get_distance(uinput.start, uinput.end);
		
		display_map = true;
	    }
	    else {
		alert("OOPS");
	    }
	}
	if (display_map) {
	    distancespider.initialize_map(map_center);
	}
    },

    initialize_map: function (mapcenter) {
	directions = new google.maps.DirectionsRenderer();
	var mapOptions = {
	      center: mapcenter,
	      zoom: 12
	      };
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	if (typeof(directions) != "undefined") {
	    directions.setMap(map);
	}
    },
    get_user_input: function (){
	    // return an object containing all user's string inputed
	var user = new Object();
	var lat = $("#user_lat").val();
	var lng = $("#user_lng").val();
	var addr = $("#user_address").val();
	var dir1 = $("#user_direction_address_1").val();
	var dir2 = $("#user_direction_address_2").val();
	if (dir1 != "" && dir2 != "") {
	    user.input_type = "direction";
	    user.start = dir1;
	    user.end = dir2;
	}
	else if (addr != "") {
	    user.input_type = "address";
	    user.address = addr;
	}
	else if (lat != "" && lng != "") {
	    user.input_type = "latlng";
	    user.latitude = lat;
	    user.longitude = lng;
	}
	else {
	    user.input_type = "nothing";
	}
	return user;
    },
    get_directions: function(start, end) {
	var directionsService = new google.maps.DirectionsService();
	var request = {
	  origin:start,
	  destination:end,
	  travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
		directions.setDirections(response);
	    }
	});
    },
    get_distance: function (start, end) {
	var distance_service = new google.maps.DistanceMatrixService();
	distance_service.getDistanceMatrix(
	      {
		origins: [start],
		destinations: [end],
		travelMode: google.maps.TravelMode.DRIVING,
	      }, distancespider.distance_callback);
    },

    distance_callback: function (response, status) {
	if (status == google.maps.DistanceMatrixStatus.OK) {
	    var origins = response.originAddresses;
	    var destinations = response.destinationAddresses;
	    var result = response.rows[0].elements[0];
	    distance = result.distance.text;
	    $("#user").append("<div>" + distance + "</div>");
	}
    },
    set_mapcenter_from_address: function (address) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address' : address}, function (results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		var latitude = results[0].geometry.location.lat();
		var longitude = results[0].geometry.location.lng();
		distancespider.set_mapcenter_from_values(latitude, longitude);
	    }
	    else {
		alert('Geocode was not successful for the following reason: ' + status);
	    }
	    
	});
    },
    set_mapcenter_from_values: function (latitude, longitude) {
	map_center = new google.maps.LatLng(latitude, longitude)
    },
} 
