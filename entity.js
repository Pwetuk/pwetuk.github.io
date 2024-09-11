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
		return {
			x: this.x - Game.player.position.x - this.hitbox.width + Screen.canvas.width/2,
			y: this.y - Game.player.position.y - this.hitbox.height + Screen.canvas.height/2
		}
	}

	//Дефолтная функция отрисовки существа
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.coordinates.x, this.coordinates.y, this.hitbox.width * 2, this.hitbox.height * 2);
	}

	//Стандартная функция перемещения существа
	move() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		//window.document.getElementById("log").innerText = "x: " + Game.player.x + " y: " + Game.player.y
	}

	//Изменить коэфициенты скоростей
	setSpeed(baseSpeed, speedCoef){
		this.baseSpeed = baseSpeed;
		this.speedCoef = speedCoef;
	}
}
