//Главный объект, через который совершаются большинство действий игры
var Game = {
	objects: [],
	nextGameTick: (new Date),
	pause: false,
	frameStartTime: Date.now(),
	time: 0,
	music: new Audio("./resources/music.mp3"),
	fps: 50,
	qt: new Quadtree(new Rectangle(Screen.canvas.width / 2, Screen.canvas.height / 2, Screen.canvas.width / 2, Screen.canvas.height / 2), 4),
};

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

var joystickStatus = {
	speedX: 0,
	speedY: 0,
	speedCoef: 0,
}

Game.setOnPause = function(){
	Game.pause = true;
	Game.timeOnPause = Game.time;
	keyStatuses._pressed = {};
	Game.joystick = NaN;
}

Game.resume = function(){
	Game.pause = false;
	Game.time = Game.timeOnPause;
	Game.music.play();
}

Game.changeVolume = function(vol){
	Game.music.volume = vol;
}

//Инициализация игры
Game.start = function(){
	Game.player = new Entity(0, 0, NaN, "rgb(255, 0, 0)", 5);
	Game.ctx = Screen.canvas.getContext("2d");
	Game.objects = new Set();
	Game.weapons = new Set();
	Game.joystick = NaN;
	Screen.background.src = "./resources/testmap.jpg"; 
	Screen.changeCanvasSize();
	Game.player = new Player();
	Game.objects.add(Game.player);
	PauseMenu.init();
	Game.startTime = Date.now();
	Game.weapons.add(new Weapon1(Game.time, 
		(() => {return Game.player.position}),
		(() => {return Game.player.centerCoordinates})));
	Game.weapons.add(new Weapon2(Game.time, 
		(() => {return Game.player.position}),
		(() => {return {x: Screen.canvas.width/2, y: Screen.canvas.height/2}})));
	Game.weapons.add(new Weapon3spawner(Game.time,
		(() => {return Game.player.position}),
		(() => {return {x: Screen.canvas.width/2, y: Screen.canvas.height/2}})));
	
	Game.setOnPause();
}

Game.spawn = function(){
    if(Game.time < 3*1000){
        SpawnPresets.stage1(Game.time, Game.objects.length);
    }else{
        SpawnPresets.stage2(Game.time, Game.objects.length);
    }
}

//Главная функция отрисовки
Game.draw = function(){
	Game.ctx.clearRect(0, 0, Screen.canvas.width, Screen.canvas.height);
	Game.ctx.drawImage(Screen.background,
					   Screen.canvas.width / 2 - Game.player.x,
					   Screen.canvas.height / 2 - Game.player.y,
					   Screen.background.width,
					   Screen.background.height);
	Game.weapons.forEach((obj) => {obj.draw(Game.ctx)});
	Game.objects.forEach((object) => {object.draw(Game.ctx)});
	if (Game.joystick && !Game.pause) {
		Game.joystick.draw(Game.ctx);
	}
	if(Game.pause){
		PauseMenu.draw(Game.ctx);
		Game.time = Game.timeOnPause;
	}
};

//Главная функция обновления позиций и касаний
Game.update = function() {
	if (!Game.pause) {
		Game.qt =  new Quadtree(new Rectangle(Screen.canvas.width / 2, Screen.canvas.height / 2, Screen.canvas.width / 2, Screen.canvas.height / 2), 4);
    for (object of Game.objects) {
        Game.qt.insert(new Point(object.x, object.y, object));
    }
    for (obj of Game.weapons){
    	Game.qt.insert(new Point(obj.x, obj.y, obj));
    }
		Game.weapons.forEach((obj) => {obj.update(Game.time);});
		Game.objects.forEach((obj) => {obj.update(Game.time);});
		Game.spawn();
	}else{
		Game.time = Game.timeOnPause;
	}
	if(Game.music.ended){
		Game.music.play();
	}
	Screen.changeCanvasSize();
};

//Главный цикл
Game.run = (function() {
	var loops = 0, skipTicks = Math.floor(1000 / Game.fps);
	Game.nextGameTick = (new Date).getTime();

  return function() {
	  loops = 0;
	  while ((new Date).getTime() > Game.nextGameTick) {
		  Game.update();
		  Game.nextGameTick += skipTicks;
		  loops++;
    }

    if (! loops) {
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
      var _cb = function() {cb(); requestAnimationFrame(_cb); Game.time += Date.now() - Game.frameStartTime; Game.frameStartTime = Date.now();}
      _cb();
    };
  }else {
    onEachFrame = function(cb) {
    	var _cb = function() {Game.frameStartTime = Date.now(); cb(); Game.time += Date.now() - Game.frameStartTime + Math.floor(1000/60)}
      setInterval(_cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();


Game.start();
window.onEachFrame(Game.run);
