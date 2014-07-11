
$(document).ready(function(){
	draw();
});

function radians (degrees) {
	return (Math.PI / 180) * degrees;
}
function draw () {
	var canvas = document.getElementById("start");
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect(10,10,10,10);
	ctx.beginPath();
	ctx.arc(180, 180, 160, radians(180), radians(250), false);
	ctx.stroke();
	
}