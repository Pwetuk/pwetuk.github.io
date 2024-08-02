function enableJoystick(event) {
	//window.document.getElementById("log").innerText = "x: " + event.x + " y: " + event.y
	Game.joystickEnabled = true;
	Game.joystick = new Joystick(event.x, event.y, Screen.canvas.offsetLeft, Screen.canvas.offsetTop);
}

function disableJoystick(event) {
	Game.joystickEnabled = false;
}

function moveJoystick(event) {
	//window.document.getElementById("log").innerText = "x: " + event.x + " y: " + event.y
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
	touch = event.touches[0];
	enableJoystick({
		x: touch.pageX,
		y: touch.pageY,
	});
});

Screen.canvas.addEventListener("touchend", (event) => {
	touch = event.touches[0];
	disableJoystick(touch);
});

Screen.canvas.addEventListener("touchmove", (event) => {
	touch = event.touches[0];
	moveJoystick({
		x: touch.pageX - parseInt(Screen.canvas.style.marginTop.slice(0, -2)),
		y: touch.pageY - parseInt(Screen.canvas.style.marginLeft.slice(0, -2)),
	});
});

window.oncontextmenu = function ()
{
  keyStatuses._pressed = {};
}