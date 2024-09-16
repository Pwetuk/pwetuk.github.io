var PauseMenu = {
	text: NaN,
	init: function() {
		text = new Image();
		text.src = "https://lazyevaluation.ru/dominator/pause.png";
	},
	draw: function(ctx) {
		ctx.drawImage(text, Screen.canvas.width/2 - text.width/2, Screen.canvas.height/9, text.width, text.height);
		PauseMenu.MusicVolumeAdjuster.draw(ctx);
		PauseMenu.EffectsVolumeAdjuster.draw(ctx);
		ctx.fillStyle = "blue";
		let w = Screen.canvas.width/2;
		let h = 7 * Screen.canvas.height / 9
		ctx.beginPath();
		ctx.arc(w - 275, h - 12, 25, Math.PI, Math.PI * 1.5, false);
		ctx.arc(w + 275, h - 12, 25, Math.PI * 1.5, 0, false);
		ctx.arc(w + 275, h + 12, 25, 0, Math.PI * 0.5, false);
		ctx.arc(w - 275, h + 12, 25, Math.PI * 0.5, Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.font = "48px serif"
		ctx.textAlign = "center"
		ctx.fillStyle = "white"
		ctx.fillText("ПРОДОЛЖИТЬ", w, h + 12);

	},
	mouseDown: function(event){
		PauseMenu.MusicVolumeAdjuster.moveUpdate(event);
		PauseMenu.EffectsVolumeAdjuster.moveUpdate(event);
		if(Screen.canvas.width/2 - 300 < event.x && 
			event.x < Screen.canvas.width/2 + 300 &&
			Screen.canvas.height*7/9 - 50 < event.y &&
			event.y < Screen.canvas.height * 7/9 + 50){
			Game.resume();
		}
	},
	prepare: function() {
		PauseMenu.MusicVolumeAdjuster = new MusicVolumeAdjuster();
		PauseMenu.EffectsVolumeAdjuster = new EffectsVolumeAdjuster();
	},
	release: function(){
		PauseMenu.MusicVolumeAdjuster.release();
		PauseMenu.EffectsVolumeAdjuster.release();
	}
}

class MusicVolumeAdjuster{
	constructor(){
		this.baseWidth = 400;
		this.baseHeight = 50;
		this.volume;
		this.widthCoef = 2/40;
		this.heightCoef = 1/3;
		this.canvasCoef = 3/9;
		this.wasClicked = false;
	}
	

	update(){
		this.volume = AudioPlayer.getMusicVol();
	}

	draw(ctx){
		this.update();
		ctx.fillStyle = "blue";
		ctx.fillRect(Screen.canvas.width/2 - this.baseWidth/2, Screen.canvas.height*this.canvasCoef, this.baseWidth, this.baseHeight);
		ctx.fillStyle = "red";
		ctx.beginPath()
		ctx.fillRect(Screen.canvas.width/2 - this.baseWidth/2 + this.volume * this.baseWidth - this.baseWidth * this.widthCoef,
					Screen.canvas.height*this.canvasCoef - this.baseHeight * this.heightCoef,
					this.baseWidth*this.widthCoef, 
					this.baseHeight * (1 + 2 * this.heightCoef));
	}

	mouseUpdate(canvasX, canvasY){
		var xPos;
		if(Screen.canvas.width/2 - this.baseWidth/2 < canvasX){
			xPos = Math.min(canvasX, Screen.canvas.width/2 + this.baseWidth/2);
		}else{
			xPos = Math.max(canvasX, Screen.canvas.width/2 - this.baseWidth/2);
		}
		var result = xPos - (Screen.canvas.width/2 - this.baseWidth/2);
		return result;
	}

	mouseDown(canvasX, canvasY){
		if(Screen.canvas.width/2 - this.baseWidth/2 < canvasX &&
			canvasX < Screen.canvas.width/2 - this.baseWidth/2 + this.baseWidth &&
			Screen.canvas.height*this.canvasCoef < canvasY &&
			canvasY < Screen.canvas.height*this.canvasCoef + this.baseHeight){
			this.wasClicked = true;
			return (canvasX - Screen.canvas.width/2 + this.baseWidth/2);
		}
		return this.volume * this.baseWidth;
	}

	moveUpdate(event){
		let canvasX = event.x, canvasY = event.y, vol;
		if(!this.wasClicked){
 			vol = this.mouseDown(canvasX, canvasY);
 		}else if(this.wasClicked){
 			vol = this.mouseUpdate(canvasX, canvasY);
 		}
		vol = vol / (this.baseWidth);
		if(vol <= 0){
			vol = 0;
		}else if(vol >= 1){
			vol = 1;
		}
		this.passToAudioPlayer(vol);
	}

	passToAudioPlayer(vol){
		AudioPlayer.setMusicVol(vol);
	}

	release(event){
		this.wasClicked = false;
	}
}

class EffectsVolumeAdjuster extends MusicVolumeAdjuster{
	constructor(){
		super();
		this.canvasCoef = 5/9;
	}
	
	update(){
		this.volume = AudioPlayer.getEffectsVol();
	}

	passToAudioPlayer(vol){
		AudioPlayer.setEffectsVol(vol);
	}
}

var PauseButton = {
	img: new Image(),
	draw: function(ctx){
		PauseButton.img.src = "https://lazyevaluation.ru/dominator/pauseBtn.png";
		ctx.drawImage(PauseButton.img, Screen.canvas.width - 100, 25, 75, 75);
	},
	click: function(click){
		if(Screen.canvas.width - 100 < click.x && click.x <  Screen.canvas.width - 25 && 25 < click.y && click.y < 100){
			Game.setOnPause();
		}
	}
}
