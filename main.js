//Поиск канваса по id
const canvas = window.document.getElementById("main_screen")
//Импорт картинок
const img = new Image();
img.src = "./testmap.jpg"

//Главный объект, через который совершаются большинство действий игры
var Game = {
	screen: {},
	map: {},
	objects: [],
	nextGameTick: (new Date),
	pause: false,
};

Game.fps = 50;
//Объект нажатых кнопок
var keyStatuses = {
	_pressed: {},
	isDown: (key) => {
		return keyStatuses._pressed[key];
	},
	onKeyDown: (key) => {
		keyStatuses._pressed[key] = true;
	},
	onKeyUp: (key) => {
		delete keyStatuses._pressed[key];
	},
}

//Главный класс существ
function Entity(){
	this.x = 0;
	this.y = 0;
	this.speedX = 1;
	this.speedY = 1;
	this.speedCoef = 2;
	this.width = 32;
	this.height = 32;
	this.onCollisionX = (hitbox) => {};
	this.onCollisionY = (hitbox) => {};
	this.color = "rgb(255, 0, 0)";
}

function newEntityOnPos(event){
	let temp = new Entity();
	temp.x = event.clientX;
	temp.y = event.clientY;
	temp.speedX = temp.speedY = 0;
	temp.color = "rgb(0, 255, 0)";
	temp.move = (() => {});
	return temp;
}

//Приведение скорости существа к единице(По факту за скорость существа отвечает только speedCoef)
Entity.prototype.normolizeSpeed = function(){
	length = Math.sqrt(Math.pow(this.speedX, 2) + Math.pow(this.speedY, 2));
	if(length != 0){
		this.speedX = this.speedX * this.speedCoef / length
		this.speedY = this.speedY * this.speedCoef / length
	}else{
		this.speedX = 0;
		this.speedY = 0;
	}
}

//Определение необходимого вектора движения игрока
Entity.prototype.playerCalculateMovement = function(){
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
	this.normolizeSpeed();
}

//Функция отрисовки игрока
drawPlayer = function(context){
	context.fillStyle = Game.player.color;
	context.fillRect((Game.screen.width - Game.player.width)/2, (Game.screen.height - Game.player.height)/2, Game.player.width, Game.player.height);
}

//Дефолтная функция отрисовки существа
Entity.prototype.draw = function(context){
	context.fillStyle = this.color;
	context.fillRect(-Game.player.x + this.x, -Game.player.y + this.y, this.width, this.height);
}

//Проверка выхода за границы базовой карты + движение
Entity.prototype.checkB = function(){
	if(0 <= this.x + this.speedX && this.x + this.speedX <= Game.map.width - this.width){
		this.x += this.speedX;
	}else{
		this.onCollisionX(NaN);
	}
	if(0 <= this.y + this.speedY && this.y + this.speedY <= Game.map.height - this.height){
		this.y += this.speedY;
	}else{
		this.onCollisionY(NaN);
	}
}

Entity.prototype.getSpeed = function(speedX, speedY, coef=1){
	this.speedX = speedX;
	this.speedY = speedY;
	this.speedCoef = coef * this.baseSpeed;
	this.normolizeSpeed();
}

//Стандартная функция перемещения существа
Entity.prototype.move = function(){
	this.checkB();
}

//Функция определения реальной позиции игрока(Координаты игрока на самом деле координаты верхнего левого угла канваса)
Game.getRealPlayerPosition = function(){
	return {
		x: Game.player.x + Game.screen.width/2 - Game.player.width/2,
		y: Game.player.y + Game.screen.height/2 - Game.player.height/2,
	}
}


//Инициализация игры
Game.start = function(){
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	Game.player = new Entity();
	Game.player.draw = drawPlayer;
	Game.player.speedCoef = 5;
	Game.player.baseSpeed = 5;
	Game.objects = [new Entity(), new Entity()]
	Game.objects[1].color = "rgb(0, 0, 255)";
	Game.objects[0].color = "rgb(0, 0, 0)";
	Game.objects[1].y = 350;
	Game.objects[1].move = function(){
		playerPos = Game.getRealPlayerPosition();
		this.speedX = playerPos.x - this.x;
		this.speedY = playerPos.y - this.y;
		this.normolizeSpeed();
		this.x += this.speedX;
		this.y += this.speedY;
	}
	Game.ctx = canvas.getContext("2d");
	Game.screen.width = canvas.width;
	Game.screen.height = canvas.height;
	Game.map.width = img.width;
	Game.map.height = img.height;
	Game.joystick = NaN;
}

//Главная функция отрисовки
Game.draw = function(){
	Game.ctx.clearRect(0, 0, canvas.width, canvas.height);
	Game.ctx.drawImage(img, -Game.player.x, -Game.player.y);
	Game.objects.forEach((object) => {object.draw(Game.ctx)});
	Game.player.draw(Game.ctx);
	if(Game.joystickEnabled){
		Game.joystick.draw(Game.ctx);
	}
};

//Главная функция обновления позиций и касаний
Game.update = function(){
	if(!Game.pause){
		if(!Game.joystickEnabled){
			Game.player.playerCalculateMovement();
		}
		Game.player.move();
		Game.objects.forEach((obj) => {obj.move();})
	}
	
};

//Главный цикл
Game.run = (function() {
	var loops = 0, skipTicks = 1000 / Game.fps;
	Game.nextGameTick = (new Date).getTime();

  return function() {
    loops = 0;

    while ((new Date).getTime() > Game.nextGameTick) {
      Game.update();
      Game.nextGameTick += skipTicks;
      loops++;
    }

    if (!loops) {
      Game.draw((Game.nextGameTick - (new Date).getTime()) / skipTicks);
    } else {
      Game.draw(0);
    }
  };
})();

//Подстроение игрового фпс к герцовке экрана
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); requestAnimationFrame(_cb); }
      _cb();
    };
  }else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

//Перехват нажатых кнопок
addEventListener("keydown", (event) => {
	keyStatuses.onKeyDown(event.code);
	if(event.code == "Escape"){
		Game.pause = true;
	}
	if(event.code == "Enter"){
		Game.pause = false;
	}
});

//Удаление отжатых кнопок
addEventListener("keyup", (event) => {
	keyStatuses.onKeyUp(event.code);
})

//Проверка на то, в фокусе ли окно, если не
addEventListener("blur", () => {keyStatuses._pressed = {};Game.pause = true;});
addEventListener("focus", () => {Game.pause = false;})
canvas.addEventListener("mousedown", (event) => {
	if(event.button == 0){
		Game.joystickEnabled = true;
		Game.joystick = new Joystick(event.x, event.y, canvas.offsetLeft, canvas.offsetTop);
	}
});

window.addEventListener("mouseup", (event) => {
	Game.joystickEnabled = false;
})

window.addEventListener("mousemove", (event) => {
	if(Game.joystickEnabled){
		let tmp = Game.joystick.update(event);
		Game.player.getSpeed(tmp[0], tmp[1], tmp[2]);
	}
})

window.oncontextmenu = function ()
{
  keyStatuses._pressed = {};
}

img.onload = () => {
	Game.start();
	window.onEachFrame(Game.run);
}