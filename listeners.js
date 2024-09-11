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
	if(event.code == "Escape"){
		Game.setOnPause();
	}
	if(event.code == "Enter"){
		Game.resume();
	}
});

//Удаление отжатых кнопок
addEventListener("keyup", (event) => {
	keyStatuses.onKeyUp(event.code);
})


var timeBlured = 0;
//Проверка на то, в фокусе ли окно, если не
addEventListener("blur", () => {Game.setOnPause()});

Screen.canvas.addEventListener("mousedown", (event) => {
	let pos = Screen.getCanvasCoords(event);
	if(event.button == 0){
		enableJoystick(pos);
	}
	if(Game.pause){
		PauseMenu.mouseDown(pos);
	}
});

window.addEventListener("mouseup", (event) => {
	let pos = Screen.getCanvasCoords(event);
	disableJoystick(pos);
	VolumeAdjuster.release(pos);
})

window.addEventListener("mousemove", (event) => {
	let pos = Screen.getCanvasCoords(event);
	moveJoystick(pos);
	if(Game.pause && event.buttons == 1){
		PauseMenu.mouseDown(pos);
	}
})


Screen.canvas.addEventListener("touchstart", (event) => {
	if(!Game.pause){
		enableJoystick(Screen.getCanvasCoords(event.touches[0]));
	}
});

Screen.canvas.addEventListener("touchend", (event) => {
	if(Game.pause){
		PauseMenu.mouseDown(Screen.getCanvasCoords(event.touches[0]));
	}
	disableJoystick(event);
});

Screen.canvas.addEventListener("touchmove", (event) => {
	touch = event.touches[0];
	moveJoystick(Screen.getCanvasCoords(touch));
});

window.oncontextmenu = function() {
  keyStatuses._pressed = {};
}
