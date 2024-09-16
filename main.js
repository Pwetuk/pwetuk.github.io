//Главный объект, через который совершаются большинство действий игры
var Game = {
	objects: [],
	nextGameTick: (new Date),
	pause: false,
	frameStartTime: Date.now(),
	time: 0,
	fps: 50,
	qt: new Quadtree(new Rectangle(Screen.canvas.width / 2, Screen.canvas.height / 2, Screen.canvas.width / 2, Screen.canvas.height / 2), 4),
	tilesize: 32,
	dead: false,
	status: "start",
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
	PauseMenu.prepare();
	Game.status = "pause";
}

Game.resume = function(){
	Game.pause = false;
	Game.time = Game.timeOnPause;
	AudioPlayer.playMusic();
	Game.status = "run";
}

Game.end = function() {
	Game.dead = true;
	Game.pause = true;
	Game.status = "dead";
	Game.timeOnPause = Game.time;
}

Game.generatemap = function() {
	Game.perlin = [];
	Game.tilemap = [];
	for (let i = -1; i <= 1; i++) {
		let row = [];
		let screenrow = [];
		for (let j = -1; j <= 1; j++) {
			let x = j * Screen.canvas.width + Math.floor(Game.player.x / Screen.canvas.width) * Screen.canvas.width;
			let y = i * Screen.canvas.height + Math.floor(Game.player.y / Screen.canvas.height) * Screen.canvas.height;
			let paired = pair(x, y);
			let getRand = NaN;
			if (x >= 0) {
				if (y >= 0) {
					getRand = xoshiro128ss(paired, Game.seed, Game.seed, Game.seed);
				} else {
					getRand = xoshiro128ss(Game.seed, paired, Game.seed, Game.seed);
				}
			} else {
				if (y >= 0) {
					getRand = xoshiro128ss(Game.seed, Game.seed, paired, Game.seed);
				} else {
					getRand = xoshiro128ss(Game.seed, Game.seed, Game.seed, paired);
				}
			}
			let perlin = new Perlin(16, 9, x, y, getRand);
			for (let m = 0; m < (j != -1 ? 9 : 0); m++) {
				perlin.grid[m][0] = row[j].grid[m][perlin.width];
			}
			for (let n = 0; n < (i != -1 ? 16 : 0); n++) {
				perlin.grid[0][n] = Game.perlin[i][j + 1].grid[perlin.height][n];
			}
			row.push(perlin);
			let screen = [];
			for (let y = 0; y < perlin.height; y += perlin.height / (Screen.canvas.height / Game.tilesize))  {
				let tilerow = [];
				for (let x = 0; x < perlin.width; x += perlin.width / (Screen.canvas.width / Game.tilesize))  {
					var v = (perlin.noise(x, y) / 2 + 0.5) * 255;
					tilerow.push(v);
				}
				screen.push(tilerow);
			}
			screenrow.push(screen);
		}
		Game.tilemap.push(screenrow);
		Game.perlin.push(row);
	}
}

//Инициализация игры
Game.init = function() {
	Game.ctx = Screen.canvas.getContext("2d");
	PauseMenu.init();
	
	//Game.setOnPause();
}

Game.start = function(){
	Game.player = new Player(0, 0, NaN, "rgb(255, 0, 0)", 5);
	Game.objects = new Set();
	Game.weapons = new Set();
	Game.joystick = NaN;
	Screen.changeCanvasSize();
	Game.player = new Player();
	Game.objects.add(Game.player);
	Game.seed = (Math.random() * 2 ** 32) >>> 0;
	Game.tiles = new Image();
	Game.tiles.src = 'https://lazyevaluation.ru/dominator/tileset.png';
	Game.generatemap();


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
}

Game.spawn = function(){
	SpawnPresets.spawn(Game.time);
}

Game.startdrawing = [0.4, 0, 0];
Game.enddrawing = [1, 1, 0.6];

//Главная функция отрисовки
Game.draw = function(){
	Game.ctx.clearRect(0, 0, Screen.canvas.width, Screen.canvas.height);
	Game.ctx.drawImage(Game.tiles, 0, 0, Game.tilesize, Game.tilesize, 0, 0, Screen.canvas.width, Screen.canvas.height);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let y = Math.floor(Game.startdrawing[i] * Math.floor(Screen.canvas.height / Game.tilesize)); y <= Game.enddrawing[i] * Screen.canvas.height / Game.tilesize; y++) {
				for (let x = Math.floor(Game.startdrawing[j] * Math.floor(Screen.canvas.width / Game.tilesize)); x <= Game.enddrawing[j]  * Screen.canvas.width / Game.tilesize; x++) {
					var v = Game.tilemap[i][j][y][x];
					let tx = 0, ty = 0;
					if (v > 150) {
						tx = Math.floor(v % 150 / 10) * 32 + 128;
						if (v % 10 > 5) ty = 0;
						else ty = 32;
					} else if (v < 80) {
						tx = Math.floor(v % 50 / 10) * 32 + 128;
						if (v % 10 > 5) ty = 0;
						else ty = 32;
					} else if (v > 80) {
						tx = Math.floor(v / 20) * 32;
						if (v % 10 < 2) ty = 0;
						else if (v % 10 < 4) ty = 32;
						else if (v % 10 < 6) ty = 64;
						else if (v % 10 < 8) ty = 92;
					}
					Game.ctx.fillStyle = 'hsl(' + v + ', 50% ,50%)';
					Game.ctx.drawImage(Game.tiles, tx, ty, Game.tilesize, Game.tilesize, Game.perlin[i][j].x + x * Game.tilesize - Game.player.x + Screen.canvas.width / 2, Game.perlin[i][j].y + y * Game.tilesize - Game.player.y + Screen.canvas.height / 2, Game.tilesize, Game.tilesize);
				}
			}
		}
	}
	if(Game.status != "start"){
		Game.weapons.forEach((obj) => {obj.draw(Game.ctx)});
		Game.objects.forEach((object) => {object.draw(Game.ctx)});
		if (Game.joystick && !Game.pause) {
			Game.joystick.draw(Game.ctx);
		}
	}
	switch (Game.status){
		case "pause":
			PauseMenu.draw(Game.ctx);
			Game.time = Game.timeOnPause;
			break;
		case "dead":
			DeathScreen.draw(Game.ctx);
			Game.time = 0;
			break;
		case "start":
			StartScreen.draw(Game.ctx);
			Game.time = 0;
			break;
		case "run":
			PauseButton.draw(Game.ctx);
			break;
		default:
			console.log("ERROR");

	}
};

//Главная функция обновления позиций и касаний
Game.update = function() {
	if (Game.status != "pause" && Game.status != "start" && Game.status != "dead") {
		Game.qt =  new Quadtree(new Rectangle(Game.player.x,  Game.player.y, Screen.canvas.width / 2, Screen.canvas.height / 2), 4);
		if ((Math.abs((Game.player.x - Screen.canvas.width / 2) - Game.perlin[1][1].x) > Screen.canvas.width / 2 + Game.tilesize)
	|| ((Math.abs((Game.player.y - Screen.canvas.height / 2) - Game.perlin[1][1].y) > Screen.canvas.height / 2 + Game.tilesize)))  {
			Game.generatemap();
	}

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

Game.init();
Game.start();
window.onEachFrame(Game.run);
