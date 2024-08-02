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

//Функция определения реальной позиции игрока(Координаты игрока на самом деле координаты верхнего левого угла канваса)
Game.getRealPlayerPosition = function(){
	return {
		x: Game.player.x + Game.screen.width/2 - Game.player.width/2,
		y: Game.player.y + Screen.canvas.height/2 - Screen.canvas.height/2,
	}
}


//Инициализация игры
Game.start = function(){
	Game.player = new Entity(0, 0, 5, 5);
	Game.ctx = Screen.canvas.getContext("2d");
	Game.joystick = NaN;
	Screen.background.src = "./testmap.jpg"; 
	Screen.changeCanvasSize();
}

//Главная функция отрисовки
Game.draw = function(){
	Game.ctx.clearRect(0, 0, Screen.canvas.width, Screen.canvas.height);
	Game.ctx.drawImage(Screen.background, -Game.player.x, -Game.player.y,
	 Screen.background.width * Screen.sizeCoef, Screen.background.height * Screen.sizeCoef);
	Game.objects.forEach((object) => {object.draw(Game.ctx, Game.player.x, Game.player.y)});
	Game.player.drawPlayer(Game.ctx);
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
	Screen.changeCanvasSize();
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

Game.start();
window.onEachFrame(Game.run);