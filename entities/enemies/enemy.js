class Enemy extends Entity {
	static count = 0;
	constructor(posX, posY, baseSpeed){
		super(posX, posY, new Rectangle(posX, posY, 16, 16), "rgb(0, 255, 0)", baseSpeed);
		this.hp = 100;
		this.type = "enemy";
	}

	static randomSpawn(obj){
		var playerPos = Game.player.position;
		var x;
		var y;
		switch(randomInt(0, 3)){
			case 0:
				x = randomInt(playerPos.x - Screen.canvas.width/2, playerPos.x + Screen.canvas.width/2);
				y = playerPos.y + Screen.canvas.height/2 + 50;
				break;
			case 1:
				x = randomInt(playerPos.x - Screen.canvas.width/2, playerPos.x + Screen.canvas.width/2);
				y = playerPos.y - Screen.canvas.height/2 - 50;
				break;
			case 2:
				x = playerPos.x - Screen.canvas.width/2 - 50;
				y = randomInt(playerPos.y - Screen.canvas.height/2, playerPos.y + Screen.canvas.height/2);
				break;
			case 3:
				x = playerPos.x + Screen.canvas.width/2 + 50;
				y = randomInt(playerPos.y - Screen.canvas.height/2, playerPos.y + Screen.canvas.height/2);
				break;
		}
		var result = new obj(x, y, (() => {return Game.player.position}));
		Enemy.count += 1;
		return result;
	}

	calculateSpeed(){
		let speeds = this.getPlayerPos();
		this.speed.x = speeds.x - this.x;
		this.speed.y = speeds.y - this.y;
	}

	update(time){
		this.calculateSpeed();
		super.update(time);
		super.move();
		this.hitbox = new Rectangle(this.x, this.y, 16, 16);
	}

	checkCollisions(obj, time){
		if(this.alreadyCollided.get(obj)){ return; }
		switch(obj.type){
			case "weapon":
				this.color = "purple";
				this.takeDamage(obj.damage);
				break;
			case "player":
				this.speed.x = this.position.x - obj.position.x;
				this.speed.y = this.position.y - obj.position.y;
				break;
			case "enemy":
				this.speed.x = this.position.x - obj.position.x;
				this.speed.y = this.position.y - obj.position.y;
				obj.speed.x = - this.speed.x;
				obj.speed.y = -this.speed.y;
				break;
			case "entity":
				this.speed.x = this.position.x - obj.position.x;
				this.speed.y = this.position.y - obj.position.y;
				break;
		}
		super.checkCollisions(obj, time);
	}


	delete(){
		Enemy.count -= 1;
		super.delete();
	}

	takeDamage(dmg){
		super.takeDamage(dmg);
		AudioPlayer.effects[1].play();
	}
}
