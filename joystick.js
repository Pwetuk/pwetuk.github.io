function Joystick(x, y, offsetX, offsetY){
	this.x = x - offsetX;
	this.y = y - offsetY;
	this.mouseX = x - offsetX;
	this.mouseY = y - offsetY;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.radius = 100;
	this.speedX = 0;
	this.speedY = 0;
}

Joystick.prototype.update = function(mouseEvent){
	this.mouseX = mouseEvent.x - this.offsetX;
	this.mouseY = mouseEvent.y - this.offsetY;
	this.speedX = this.mouseX - this.x;
	this.speedY = this.mouseY - this.y;
	let length = Math.sqrt(Math.pow(this.mouseX - this.x, 2) + Math.pow(this.mouseY - this.y, 2));
	return [this.speedX, this.speedY, Math.min(1, length/this.radius)];
}

Joystick.prototype.draw = function(context) {
	let length = Math.sqrt(Math.pow(this.mouseX - this.x, 2) + Math.pow(this.mouseY - this.y, 2));
	let drawX, drawY;
	if(length >= this.radius){
		drawX = (this.mouseX - this.x) * this.radius / length + this.x;
		drawY = (this.mouseY - this.y) * this.radius / length + this.y;
	}else{
		drawX = this.mouseX;
		drawY = this.mouseY;
	}
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	context.stroke();
	context.beginPath();
	context.arc(drawX, drawY, this.radius/2, 0, Math.PI * 2, false);
	context.stroke();

}