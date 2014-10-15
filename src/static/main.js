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
		gravity();
	}
	shortcuts();
	$("input").focus(function(){
		$(document).off();
	})
	$("input").focusout(shortcuts);
}

function gravity(){
    var objects = new Array();
    var canvas = document.getElementById("canvas");
    var ground = {y: 300} // y-coord from the top
    var now = Date.now();
    var ball = {
	x: 100,
	y: 10,
	vx: .05,
	vy: 0,
	ax: 0,
	ay: 100, // pixel per second
	time: now,
	color: "red"
    };
    var ball2 = {
	x: 10,
	y: 10,
	vx: 0,
	vy: 0,
	ax: 0,
	ay: 0,
	time: now,
	color: "blue"
    };
    objects.push(ball);
    objects.push(ball2);
    animate();
    function animate() {
	reqAnimFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame;
	reqAnimFrame(animate);
	move(objects, Date.now());
	draw(objects);
    }
    function move(objs, time){
	for (var i = 0; i < objs.length; i++) {
	    var obj = objs[i];
	    var telapsed = (time - obj.time)/1000; // time in seconds
	    if (telapsed > 0) {
		var vfx = obj.vx + obj.ax*telapsed;
		var vfy = obj.vy + obj.ay*telapsed;
		var yDisplacement = obj.vy*telapsed + 0.5*obj.ay*Math.pow(telapsed, 2);
		var xDisplacement = obj.vx*telapsed + 0.5*obj.ax*Math.pow(telapsed, 2);
		if (obj.y + yDisplacement >= ground.y && obj.vy > 0){
		    var gap = obj.y + yDisplacement - ground.y;
		    var vfynew = Math.sqrt(Math.pow(obj.vy,2)+2*obj.ay*(yDisplacement-gap));
		    var timedown = 2*(yDisplacement-gap)/(obj.vy+vfynew);
		    var timeup = telapsed - timedown;
		    var yDisplacementFromGround = vfynew*timeup+0.5*obj.ay*Math.pow(timeup,2);
		    obj.y = ground.y - yDisplacementFromGround;
		    obj.vy = -vfynew + obj.ay*timeup;

		}
		else {
		    obj.y += yDisplacement;
		    obj.vy = vfy;
		}
		obj.x += xDisplacement;
		obj.vx = vfx;
		obj.time = time;
	    }
	    else {
		// do nothing
	    }
	}
    }
    function draw (objs) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for (var i = 0; i < objs.length; i++) {
	    var what = objs[i];
	    ctx.fillStyle = what.color;
	    drawArc(ctx, what.x, what.y, 10);
	}
    }
    function drawArc(context,xCenter, yCenter,radius){
	context.beginPath();
	context.arc(xCenter, yCenter, radius, 0, Math.PI*2,false);
	context.fill();
    };
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

