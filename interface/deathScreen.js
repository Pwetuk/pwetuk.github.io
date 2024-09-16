var DeathScreen = {
	draw: function(ctx){
		ctx.font = "48px serif";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.fillText("ВЫ УМЕРЛИ", Screen.canvas.width/2, Screen.canvas.height/3);
		let w = Screen.canvas.width/2;
		let h = Screen.canvas.height/3 * 2;
		ctx.beginPath();
		ctx.arc(w - 275, h - 12, 25, Math.PI, Math.PI * 1.5, false);
		ctx.arc(w + 275, h - 12, 25, Math.PI * 1.5, 0, false);
		ctx.arc(w + 275, h + 12, 25, 0, Math.PI * 0.5, false);
		ctx.arc(w - 275, h + 12, 25, Math.PI * 0.5, Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.fillText("ВОЗРОДИТЬСЯ", w, h + 13);
	},

	click: function(click){
		let w = Screen.canvas.width/2;
		let h = Screen.canvas.height/3 * 2;
		if(w - 275 < click.x && click.x < w + 275 && h - 37 < click.y && click.y < h + 38){
			DeathScreen.restart();
		}
	},

	restart: function(){
		Game.dead = false;
		Game.pause = false;
		Game.start();
		Enemy.count = 0;

		SpawnPresets.lastSpawned = 0;
		Game.status = "run";
	}
}