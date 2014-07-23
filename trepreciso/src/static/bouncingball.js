$(document).ready(animation);

function animation(){
	var ballcanvas = document.getElementById("bouncingballcanvas");
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
		ctx.clearRect(0, 0, 420, 270);
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
