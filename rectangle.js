class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.left = x - width;
		this.right = x + width;
		this.top = y - height;
		this.bottom = y + height;
	}

	static circle(x, y, radius){
		radius *= 1.5;
		return new Rectangle(x - radius/Math.sqrt(2), y - radius/Math.sqrt(2), Math.sqrt(2) * radius, Math.sqrt(2) * radius);
	}

	contains(point) {
		return (point.x >= this.left 	&&
				point.x <= this.right	&&
				point.y >= this.top		&&
				point.y <= this.bottom);
	}

	intersects(range) {
		return ! (range.left > this.right 	||
				  range.right < this.left 	||
				  range.top > this.bottom 	||
				  range.bottom < this.top);
	}
}

