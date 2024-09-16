var StartScreen = {
	draw: function(ctx){
		let w = Screen.canvas.width/2;
		let h = Screen.canvas.height/2;
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.arc(w - 275, h - 50, 25, Math.PI, Math.PI * 1.5, false);
		ctx.arc(w + 275, h - 50, 25, Math.PI * 1.5, 0, false);
		ctx.arc(w + 275, h + 50, 25, 0, Math.PI * 0.5, false);
		ctx.arc(w - 275, h + 50, 25, Math.PI * 0.5, Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.font = "48px serif"
		ctx.textAlign = "center"
		ctx.fillStyle = "white"
		ctx.fillText("НАЧАТЬ", w, h + 12);
	},

	click: function(event){
		let w = Screen.canvas.width/2;
		let h = Screen.canvas.height/2;
		if(w - 275 < event.x && event.x < w + 275 && h - 50 < event.y && event.y < h + 50){
			Game.status = "run";
			AudioPlayer.playMusic();
		}
	}
}