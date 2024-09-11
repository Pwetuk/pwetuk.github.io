class Enemy2 extends Enemy {
	constructor(posX, posY, getPlayerPos){
		super(posX, posY, 5);
		this.color = "rgb(0, 0, 255)";
		this.origColor = this.color;
		this.getPlayerPos = getPlayerPos;
		this.health = 100;
	}
}