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

	contains(point) {
		return (point.x >= this.left	&&
				point.x <= this.right	&&
				point.y >= this.top		&&
				point.y <= this.bottom);
	}

	intersects(range) {
		if (range instanceof Rectangle) {
			return ! (range.left > this.right 	||
					  range.right < this.left ||
					  range.top > this.bottom ||
					  range.bottom < this.top);
		} else if (range instanceof Circle) {
			return range.intersects(this);
		}
	}
}
