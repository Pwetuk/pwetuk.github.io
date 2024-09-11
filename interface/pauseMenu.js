var PauseMenu = {
	text: NaN,
	init: function() {
		text = new Image();
		text.src = "./resources/pause.png";
	},
	draw: function(ctx) {
		ctx.drawImage(text, Screen.canvas.width/2 - text.width/2, Screen.canvas.height/10, text.width, text.height);
		VolumeAdjuster.draw(ctx);
		ctx.fillStyle = "black";
		ctx.fillRect(Screen.canvas.width/2 - 300, Screen.canvas.height * 0.75, 600, 100);
	},
	mouseDown: function(event){
		VolumeAdjuster.moveUpdate(event);
		if(Screen.canvas.width/2 - 300 < event.x - Screen.canvas.offsetLeft && 
			event.x - Screen.canvas.offsetLeft < Screen.canvas.width/2 + 300 &&
			Screen.canvas.height*0.75 < event.y - Screen.canvas.offsetTop &&
			event.y - Screen.canvas.offsetTop < Screen.canvas.height * 0.75 + 100){
			Game.resume();
		}
	}
}

class VolumeAdjuster{
	static baseWidth = 400;
	static baseHeight = 50;
	static volume;
	static widthCoef = 2/40;
	static heightCoef = 1/3;
	static wasClicked = false;

	static update(){
		VolumeAdjuster.volume = Game.music.volume;
	}

	static draw(ctx){
		VolumeAdjuster.update();
		ctx.fillStyle = "black";
		ctx.fillRect(Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2, Screen.canvas.height*0.5, VolumeAdjuster.baseWidth, VolumeAdjuster.baseHeight);
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fillRect(Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2 + VolumeAdjuster.volume * VolumeAdjuster.baseWidth - VolumeAdjuster.baseWidth * VolumeAdjuster.widthCoef,
		Screen.canvas.height*0.5 - VolumeAdjuster.baseHeight * VolumeAdjuster.heightCoef, VolumeAdjuster.baseWidth*VolumeAdjuster.widthCoef, VolumeAdjuster.baseHeight * (1 + 2 * VolumeAdjuster.heightCoef));
	}

	static mouseUpdate(canvasX, canvasY){
		var xPos;
		if(Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2 < canvasX){
			xPos = Math.min(canvasX, Screen.canvas.width/2 + VolumeAdjuster.baseWidth/2);
		}else{
			xPos = Math.max(canvasX, Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2);
		}
		var result = xPos - (Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2);
		return result;
	}

	static mouseDown(canvasX, canvasY){
		if(Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2 < canvasX &&
			canvasX < Screen.canvas.width/2 - VolumeAdjuster.baseWidth/2 + VolumeAdjuster.baseWidth &&
			Screen.canvas.height*0.5 < canvasY &&
			canvasY < Screen.canvas.height*0.5 + VolumeAdjuster.baseHeight){
			VolumeAdjuster.wasClicked = true;
			return (canvasX - Screen.canvas.width/2 + VolumeAdjuster.baseWidth/2);
		}
		return VolumeAdjuster.volume * VolumeAdjuster.baseWidth;
	}

	static moveUpdate(event){
		let canvasX = event.x, canvasY = event.y, vol;
		if(!VolumeAdjuster.wasClicked){
 			vol = VolumeAdjuster.mouseDown(canvasX, canvasY);
 		}else if(VolumeAdjuster.wasClicked){
 			vol = VolumeAdjuster.mouseUpdate(canvasX, canvasY);
 		}
		vol = vol / (VolumeAdjuster.baseWidth);
		if(vol <= 0){
			vol = 0;
		}else if(vol >= 1){
			vol = 1;
		}
		Game.changeVolume(vol);
	}

	static release(event){
		VolumeAdjuster.wasClicked = false;
	}
}
