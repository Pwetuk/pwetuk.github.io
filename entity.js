//Главный класс существ
class Entity {
	constructor(x, y, baseSpeed, speedCoef){
		this.x = x;
		this.y = y;
		this.baseSpeed = baseSpeed;
		this.speedCoef = speedCoef;
		this.speedX = 1;
		this.speedY = 1;
		this.width = 32;
		this.height = 32;
		this.color = "rgb(255, 0, 0)";
	}

	//Приведение скорости существа к единице(По факту за скорость существа отвечает только speedCoef)
	normalizeSpeed(){
		length = Math.sqrt(Math.pow(this.speedX, 2) + Math.pow(this.speedY, 2));
		if(length != 0){
			this.speedX = this.speedX * this.speedCoef / length
			this.speedY = this.speedY * this.speedCoef / length
		}else{
			this.speedX = 0;
			this.speedY = 0;
		}
	}

	//Дефолтная функция отрисовки существа
	draw(context, playerX, playerY){
		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect(-playerX + this.x, -playerY + this.y, this.width * Screen.sizeCoef, this.height * Screen.sizeCoef);
	}

	//Изменение для управлением джойстиком
	getSpeed(speedX, speedY, coef=1){
		this.speedX = speedX;
		this.speedY = speedY;
		this.speedCoef = coef * this.baseSpeed;
		this.normalizeSpeed();
	}

	//Стандартная функция перемещения существа
	move(){
		this.x += this.speedX;
		this.y += this.speedY;
		window.document.getElementById("log").innerText = "x: " + Game.player.x + " y: " + Game.player.y
	}

	//Определение необходимого вектора движения игрока
	playerCalculateMovement(){
		this.speedCoef = this.baseSpeed;
		this.speedX = this.speedY = 0;
		if(keyStatuses.isDown("KeyA") || keyStatuses.isDown("ArrowLeft")){
			this.speedX -= 1;
		}
		if(keyStatuses.isDown("KeyD") || keyStatuses.isDown("ArrowRight")){
			this.speedX += 1;
		}
		if(keyStatuses.isDown("KeyS") || keyStatuses.isDown("ArrowDown")){
			this.speedY += 1;
		}
		if(keyStatuses.isDown("KeyW") || keyStatuses.isDown("ArrowUp")){
			this.speedY -= 1;
		}
		this.normalizeSpeed();
	}

	//Функция отрисовки игрока
	drawPlayer(context){
		context.fillStyle = Game.player.color;
		context.fillRect((Screen.canvas.width - Game.player.width)/2,
			(Screen.canvas.height - Game.player.height)/2, Game.player.width * Screen.sizeCoef, Game.player.height * Screen.sizeCoef);
	}

	//Изменить коэфициенты скоростей
	setSpeed(baseSpeed, speedCoef){
		this.baseSpeed = baseSpeed;
		this.speedCoef = speedCoef;
	}
}
