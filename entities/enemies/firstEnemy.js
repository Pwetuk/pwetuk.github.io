class Enemy1 extends Enemy{
	constructor(posX, posY, getPlayerPos){
		super(posX, posY, 3);
		this.color = "rgb(0, 255, 255)";
		this.origColor = this.color;
		this.getPlayerPos = getPlayerPos;
		this.health = 200;
	}
}