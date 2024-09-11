class Player extends Entity {
	constructor() {
		let x = Screen.canvas.width / 2;
		let y = Screen.canvas.height / 2;
		super(x, y, new Rectangle(x, y, 16, 16), 'black', 5);
		this.type = "player";
		this.health = 100;
		this.origColor = this.color;
	}

	moveUp = function() { this.speed.y -= 1; };
	moveLeft = function() { this.speed.x -= 1; };
	moveDown = function() { this.speed.y += 1; };
	moveRight = function() { this.speed.x += 1; };
	
	get position(){
		return {
			x: this.x,
			y: this.y
		}
	}

	get coordinates(){
		return {
			x: Screen.canvas.width/2 - this.hitbox.width,
			y: Screen.canvas.height/2 - this.hitbox.height
		}
	}

	get centerCoordinates(){
		return {
			x: Screen.canvas.width/2,
			y: Screen.canvas.height/2
		}
	}

	move() {
		this.speed.coefficient = this.speed.base;
		this.speed.x = this.speed.y = 0;
		if (Game.joystick) {
			this.speed.x = joystickStatus.speedX;
			this.speed.y = joystickStatus.speedY;
			this.speed.coefficient = joystickStatus.speedCoef * this.speed.base;
		} else {
			if (keyStatuses.isDown("KeyW") || keyStatuses.isDown("ArrowUp")) { this.moveUp(); }
			if (keyStatuses.isDown("KeyA") || keyStatuses.isDown("ArrowLeft")) { this.moveLeft(); }
			if (keyStatuses.isDown("KeyS") || keyStatuses.isDown("ArrowDown")) { this.moveDown(); }
			if (keyStatuses.isDown("KeyD") || keyStatuses.isDown("ArrowRight")) { this.moveRight(); }
		}
		
		let velocity = this.velocity;
		this.x += velocity.x;
		this.y += velocity.y;
	}

	update(time) {
		super.update(time);
		this.move();
		this.hitbox = new Rectangle(this.x, this.y, 16, 16);
	}

	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.coordinates.x, this.coordinates.y, this.hitbox.width * 2, this.hitbox.height * 2);
	}

	checkCollisions(obj, time){
		if(this.alreadyCollided.get(obj)){ return; }
		switch(obj.type) {
			case "entity":
				break;
			case "enemy":
				this.takeDamage(10);
				this.alreadyCollided.set(obj, time + 300);
				break;
		}
		super.checkCollisions(obj, time);
	}

}
