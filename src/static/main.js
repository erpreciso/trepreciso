
$(document).ready(init);

function init(){
	shortcuts();
	$("input").focus(function(){
		$(document).off();
	})
	$("input").focusout(shortcuts);
}

function shortcuts(){
	$(document).keydown(function(event){
		console.log("key:"+event.which);
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

