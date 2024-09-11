class Joystick {
	constructor(x, y, offsetX, offsetY) {
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

	update(mouseEvent) {
		this.mouseX = mouseEvent.x - this.offsetX;
		this.mouseY = mouseEvent.y - this.offsetY;
		this.speedX = this.mouseX - this.x;
		this.speedY = this.mouseY - this.y;
		let length = Math.sqrt(Math.pow(this.mouseX - this.x, 2) + Math.pow(this.mouseY - this.y, 2));
		return { speedX: this.speedX, speedY: this.speedY, speedCoef: Math.min(1, length/(this.radius)) };
	}

	draw(context) {
		let length = Math.sqrt(Math.pow(this.mouseX - this.x, 2) + Math.pow(this.mouseY - this.y, 2));
		let drawX, drawY, realRadius = this.radius;
		if (length >= realRadius) {
			drawX = (this.mouseX - this.x) * realRadius / length + this.x;
			drawY = (this.mouseY - this.y) * realRadius / length + this.y;
		} else {
			drawX = this.mouseX;
			drawY = this.mouseY;
		}
		context.beginPath();
		context.arc(this.x, this.y, realRadius, 0, Math.PI * 2, false);
		context.stroke();
		context.beginPath();
		context.arc(drawX, drawY, realRadius / 2, 0, Math.PI * 2, false);
		context.stroke();
	}
}
