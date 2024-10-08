function enableJoystick(event) {
	if(!Game.pause){
		Game.joystick = new Joystick(event.x, event.y, 0, 0);
	}
}

function disableJoystick(event) {
	Game.joystick = NaN;
}

function moveJoystick(event) {
    if(Game.joystick){
    	joystickStatus = Game.joystick.update(event);
    }
}

//Перехват нажатых кнопок
addEventListener("keydown", (event) => {
	keyStatuses.onKeyDown(event.code);
	if(event.code == "Escape" && Game.status == "run"){
		Game.setOnPause();
	}
	if(event.code == "Enter" && Game.status == "pause"){
		Game.resume();
	}
	if(event.code == "KeyG"){
		Game.player.takeDamage(1000);
	}
	if(event.code == "KeyR" && Game.dead){
		DeathScreen.restart();
	}
});

//Удаление отжатых кнопок
addEventListener("keyup", (event) => {
	keyStatuses.onKeyUp(event.code);
})


var timeBlured = 0;
//Проверка на то, в фокусе ли окно, если не
addEventListener("blur", () => { if(Game.status == "run") {Game.setOnPause()}});

Screen.canvas.addEventListener("mousedown", (event) => {
		let pos = Screen.getCanvasCoords(event);

		if(event.button == 0){
			enableJoystick(pos);
		}
		switch(Game.status){
			case "dead":
				DeathScreen.click(pos);
				break;
			case "pause":
				PauseMenu.mouseDown(pos);
				break
			case "run":
				PauseButton.click(pos);
				break;
			case "start":
				StartScreen.click(pos);		
				break
		}
});

window.addEventListener("mouseup", (event) => {
	let pos = Screen.getCanvasCoords(event);
	if(Game.status == "pause"){
		PauseMenu.release();
	}
	disableJoystick(NaN)
})

window.addEventListener("mousemove", (event) => {
		let pos = Screen.getCanvasCoords(event);
		moveJoystick(pos);
		if(Game.pause && event.buttons == 1){
			PauseMenu.mouseDown(pos);
		}
})


Screen.canvas.addEventListener("touchstart", (event) => {
	let pos = Screen.getCanvasCoords(event.touches[0]);
	switch(Game.status){
		case "dead":
			DeathScreen.click(pos);
			break;
		case "pause":
			PauseMenu.mouseDown(pos);
			break;
		case "run":
			PauseButton.click(pos);
			enableJoystick(pos);
			break;
		case "start":
			StartScreen.click(pos);
			break;
	}
});

Screen.canvas.addEventListener("touchend", (event) => {
	console.log("Here");
	disableJoystick(NaN);
	console.log(Game.joystick)
	if(Game.status == "pause"){
		PauseMenu.release();
	}
});

Screen.canvas.addEventListener("touchmove", (event) => {
	touch = Screen.getCanvasCoords(event.touches[0]);
	if(Game.pause){
		PauseMenu.mouseDown(touch);
	}else if(Game.status == "run"){
		moveJoystick({
			x: touch.x,
			y: touch.y,
		});
	}
});

window.oncontextmenu = function() {
  keyStatuses._pressed = {};
}
