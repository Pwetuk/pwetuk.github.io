function enableJoystick(event) {
	Game.joystickEnabled = true;
	Game.joystick = new Joystick(event.x, event.y, Screen.canvas.offsetLeft, Screen.canvas.offsetTop);
}

function disableJoystick(event) {
	Game.joystickEnabled = false;
}

function moveJoystick(event) {
	if(Game.joystickEnabled){
		let tmp = Game.joystick.update(event);
		Game.player.getSpeed(tmp[0], tmp[1], tmp[2]);
	}
}

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

Screen.canvas.addEventListener("mousedown", (event) => {
	if(event.button == 0){
		enableJoystick(event);
	}
});

window.addEventListener("mouseup", (event) => {
	disableJoystick(event);
})

window.addEventListener("mousemove", (event) => {
	moveJoystick(event);
})


Screen.canvas.addEventListener("touchstart", (event) => {
	enableJoystick(event);
});

Screen.canvas.addEventListener("touchend", (event) => {
	disableJoystick(event);
});

Screen.canvas.addEventListener("touchmove", (event) => {
	moveJoystick(event);
});

window.oncontextmenu = function ()
{
  keyStatuses._pressed = {};
}