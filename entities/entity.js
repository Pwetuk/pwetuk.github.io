//Главный класс существ
class Entity {
	constructor(x, y, hitbox, color, baseSpeed) {
		this.x = x;
		this.y = y;
		this.hitbox = hitbox;
		this.color = color;
		this.speed = {
			x: 1,
			y: 1,
			base: baseSpeed,
			coefficient: baseSpeed
		}
		this.type = "entity";
		this.alreadyCollided = new Map();
	}

	isColliding(time) {
		if(this.hitbox instanceof Circle){
			var range = new Circle(this.x, this.y, this.hitbox.r * 5);
		}else{
			var range = new Rectangle(this.x, this.y, this.hitbox.width * 5, this.hitbox.height * 5);
		}
        var points = Game.qt.query(range);
		for (var point of points) {
			if (this != point.userData && this.hitbox.intersects(point.userData.hitbox)) {
				this.checkCollisions(point.userData, time);
				point.userData.checkCollisions(this, time);
			}
		}
	}

	get velocity() {
		let length = Math.sqrt(Math.pow(this.speed.x, 2) + Math.pow(this.speed.y, 2));
		if(length == 0){
			return {
				x: 0,
				y: 0
			}
		}
		if(length < 1){
			return {
				x: this.speed.x * this.speed.coefficient,
				y: this.speed.y * this.speed.coefficient
			}
		}
		return {
			x: this.speed.x * this.speed.coefficient / length,
			y: this.speed.y * this.speed.coefficient / length
		}
	}

	get position(){
		return {
			x: this.x,
			y: this.y
		}
	}

	get coordinates(){
		if(this.hitbox instanceof Circle){
			return {
				x: this.x - Game.player.position.x + Screen.canvas.width/2,
				y: this.y - Game.player.position.y + Screen.canvas.height/2
			}
		}
		return {
			x: this.x - Game.player.position.x - this.hitbox.width + Screen.canvas.width/2,
			y: this.y - Game.player.position.y - this.hitbox.height + Screen.canvas.height/2
		}
	}

	//Дефолтная функция отрисовки существа
	draw(context) {
		context.fillStyle = this.color;
		if(this.hitbox instanceof Circle){
			context.beginPath();
			context.arc(this.coordinates.x, this.coordinates.y, this.hitbox.r, 0, 2 * Math.PI, false);
			context.fill();
		}else{
			context.fillRect(this.coordinates.x, this.coordinates.y, this.hitbox.width * 2, this.hitbox.height * 2);
		}
	}

	//Стандартная функция перемещения существа
	move() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	//Изменить коэфициенты скоростей
	setSpeed(baseSpeed, speedCoef) {
		this.baseSpeed = baseSpeed;
		this.speedCoef = speedCoef;
	}

	update(time){
		this.isColliding(time);
		this.removeFromChecked(time);
		this.despawn();
	}

	checkCollisions(obj, time){
		switch(obj.type) {
			case "weapon":
				this.alreadyCollided.set(obj, time + obj.timeFiring + obj.fireCooldown * 0.5);
				break;
		}
	}

	removeFromChecked(time){
		for(var i of this.alreadyCollided){
			if(i[1] <= time){
				this.alreadyCollided.delete(i[0]);
			}
		}
	}

	takeDamage(damage){
		this.health -= damage;
		if(this.health <= 0){
			this.delete();
		}
	}

	delete(){
		Game.objects.delete(this);
	}

	despawn(){
		if(Math.abs(Game.player.x - this.x) > Screen.canvas.width/2 + 200 || Math.abs(Game.player.y - this.y) > Screen.canvas.height/2 + 200){
			this.delete();
		}
	}

}
