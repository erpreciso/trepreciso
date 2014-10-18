$(document).ready(init);
function init(){
    var action = $(".current").attr("id");
    if (action == "bouncingball") {
	bouncinganimation();
    }
    else if (action == "movebrick") {
	movebrickanimation();
    }
    else if (action == "home"){
	writehome();
    }	
    else if (action == "contacts"){
	writecontacts();
    }
    else if (action == "gravity"){
	var b = $(document.createElement("button"))
	    .text("Restart gravity")
	    .attr("id", "restart")
	    .css("display", "block")
	    .on("click", gravity);
	$("#canvas").before(b);
	gravity();
    }
    shortcuts();
    $("input").focus(function(){
	$(document).off();
    })
    $("input").focusout(shortcuts);
}

function Ball () {
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

function Universe(){
    this.balls = [];
    this.time = 0;
    this.world = null;
}

function defineWorld(){
    // return an object world with ground, left and right bounds
    var world = new Object();
    world.ground = 300;
    world.left = 5;
    world.right = 400;
    world.gravity = 5000;
    return world;
}

function distance(x1,y1,x2,y2){return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));}

Universe.prototype = {
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
	this.canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
	var collision = [];
	for (var i = 0; i < this.balls.length; i++) {
	    var ball = this.balls[i];
	    ball.move(this.time, this.world);
	    for (var j = i + 1; j < this.balls.length; j++) {
		var otherBall = this.balls[j];
	       //if (otherBall.overlapX(ball.x+ball.radius) && otherBall.overlapY(ball.y+ball.radius)){
		if (distance(ball.x,ball.y,otherBall.x,otherBall.y)<(ball.radius+otherBall.radius)){
		       // COLLISION!!
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

Ball.prototype = {
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
	    //console.log("vx:"+this.vx.toFixed(2)+", newvx: "+vfxnew.toFixed(2));
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

function createObjects(){
    // return list off balls
    var res = [];
    var now = Date.now();
    var ball = new Ball();
    ball.radius = 30;
    ball.x = 100;
    ball.y = 10;
    ball.vx = 20;
    ball.time = now;
    ball.mass = 20;
    ball.color =  "red";
    res.push(ball);
    var ball2 = new Ball();
    ball2.radius = 20;
    ball2.x = 200;
    ball2.y = 10;
    ball2.mass = 5;
    ball2.time = now;
    ball2.color = "blue";
    res.push(ball2);
    var ball3 = new Ball();
    ball3.radius = 5;
    ball3.x = 300;
    ball3.y = 150;
    ball3.vx = 50;
    ball3.mass = 500;
    ball3.time = now;
    res.push(ball3);
    return res;
}

function gravity(){
    var canvas = document.getElementById("canvas");
    var universe = new Universe();
    var objs = createObjects();
    for (var i = 0; i < objs.length; i++){
	universe.addBall(objs[i]);
    }
    universe.setCanvas(canvas);
    universe.setWorld(defineWorld());
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
    
    function drawGraph(obj){
	var ctx = canvas.getContext("2d");
	ctx.fillRect(graphx,100+obj.vy*100,1,1);
	ctx.fillRect(graphx,(obj.y+300)/10,1,1);
	graphx +=.05;
    }
}

function writecontacts(){
    $("canvas").remove();
    var contacts = document.createElement("div");
    $(contacts).text("Here my contacts and links");
    $(".content").append(contacts);
}

function writehome(){
    $("canvas").remove();
    var home = document.createElement("div");
    $(home).text("This is the initial page, and I will put here a cover and some pictures");
    $(".content").append(home);
    
}

function shortcuts(){
	$(document).keydown(function(event){
//		console.log("key:"+event.which);
		href = window.location.href;
		url = href.substring(0, href.lastIndexOf("/"));
		if (event.which == 72){
			window.location.href = url + "/home";
		}
		else if (event.which == 67){
			window.location.href = url + "/contacts";
		}
		else if (event.which == 66){
			window.location.href = url + "/bouncingball";
		}
		else if (event.which == 77){
			window.location.href = url + "/movebrick";
		}
		else if (event.which == 83){
			window.location.href = url + "/distancespider";
		}
		else if (event.which == 71){
			window.location.href = url + "/gravity";
		}
	});
	
}

function drawSignature () {
	var canvas = document.getElementById("signature");
	var ctx = canvas.getContext('2d');
	ctx.font = "12px OpenSans, Arial, sans-serif";
	ctx.fillStyle = "Navy";
	ctx.fillText("Stefano Merlo", 40,15);
	ctx.fillStyle = "#888";
	ctx.fillText("email: trepreciso@gmail.com", 40, 35);
}


function drawGrid(ctx, granularity){
	// draw a grid providing the granularity and the context.
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (var i = 0; i < granularity; i++){
		var x = (canvas.width * i / granularity) + 0.5;
		var y = (canvas.height * i / granularity) + 0.5;
		ctx.moveTo(x, 0);
		ctx.lineTo(x,canvas.height);
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
	}
	ctx.strokeStyle = "#ddd";
	ctx.stroke();
	ctx.fillStyle = "red"
	ctx.fillRect(10,10,10,10);
}


    function bouncinganimation(){
	    var ballcanvas = document.getElementById("canvas");
	    drawBouncingBall(ballcanvas);
    }

    function drawBouncingBall (canvas) {
	    
	    var radius = 6;
	    var x =  radius;
	    var y = 0;
	    var maxspeed = 10;
	    var minspeed = 5;
	    var xspeed = generateSpeed(minspeed,maxspeed)
	    var yspeed = generateSpeed(minspeed,maxspeed)
	    function generateSpeed(lowBound,upBound){
		    return Math.floor(Math.random() * (upBound-lowBound)+lowBound);
	    }
	    
	    function animate() {
		    reqAnimFrame = window.requestAnimationFrame ||
			    window.mozRequestAnimationFrame    ||
			    window.webkitRequestAnimationFrame ||
			    window.msRequestAnimationFrame     ||
			    window.oRequestAnimationFrame;
		    reqAnimFrame(animate);
		    x += xspeed;
		    y += yspeed;
		    if(x < radius || x > (canvas.width - radius)){
			    xspeed = (radius + Math.abs(xspeed))*(Math.abs(xspeed)/-xspeed);
			    draw("yellow");
			    x += xspeed;
			    xspeed = generateSpeed(minspeed,maxspeed)*(Math.abs(xspeed)/xspeed);
		    }
		    if(y < radius || y > (canvas.height - radius)){
			    yspeed = (radius + Math.abs(yspeed))*(Math.abs(yspeed)/-yspeed);
			    draw("yellow");
			    y += yspeed;
			    yspeed = generateSpeed(minspeed,maxspeed)*(Math.abs(yspeed)/yspeed);
		    }
		    if (x < (radius+10) || x > (canvas.width-radius-10) ||
				    y < (radius+10) || y > (canvas.height-radius-10)) {
			    draw("yellow");
		    }
		    else{			
			    draw("red");
		    }
	    }
	    function draw(color) {
		    var ctx = canvas.getContext('2d');
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
		    ctx.fillStyle = color;
		    drawArc(ctx, x, y, radius);
	    }
	    animate();
    }

    function drawArc(context, xCenter, yCenter, radius){
	    context.beginPath();
	    context.arc(xCenter, yCenter, radius, 0, Math.PI * 2, false);
	    context.fill();
    }

    function radians (degrees) {
	    return (Math.PI / 180) * degrees;
    }

    function movebrickanimation(){
	    var brickcanvas = document.getElementById("canvas");
	    drawBrick(brickcanvas);
	    var dist = 3;
	    $(document).keydown(function(event){
		    if (event.which >= 37 && event.which <= 40){
			    var direction = event.which - 37; 
			    moveBrick(brickcanvas, direction, dist);
		    }
	    });
    }

    function moveBrick(canvas, direction, amount){
	    // 0: left, 1: up, 2: right, 3: down
	    var ctx = canvas.getContext('2d');
	    if (direction == 0){
		    ctx.translate(-amount, 0);
	    }
	    else if (direction == 1){
		    ctx.translate(0, -amount);
	    }
	    else if (direction == 2){
		    ctx.translate(amount, 0);
	    }
	    else if (direction == 3){
		    ctx.translate(0, amount);
	    }
	    drawBrick(canvas);
    }
    function drawBrick(canvas){
	    var ctx = canvas.getContext('2d');
	    ctx.clearRect(0,0,canvas.width,canvas.height);
	    ctx.fillStyle = "red";
	    ctx.fillRect(10,10,20,20);
	    ctx.fill();
    }

