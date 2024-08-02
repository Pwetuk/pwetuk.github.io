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
		Game.joystickEnabled = true;
		Game.joystick = new Joystick(event.x, event.y, Screen.canvas.offsetLeft, Screen.canvas.offsetTop);
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