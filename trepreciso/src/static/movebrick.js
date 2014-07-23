
$(document).ready(animation);

function animation(){
	var brickcanvas = document.getElementById("movebrickcanvas");
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
