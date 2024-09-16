class Enemy2 extends Enemy {
	static lastspawned = 0;
	constructor(posX, posY, getPlayerPos){
		super(posX, posY, 6);
		this.color = "rgb(0, 0, 255)";
		this.origColor = this.color;
		this.getPlayerPos = getPlayerPos;
		this.health = 50;
		this.texture = new Image();
		this.revtexture = new Image();
		this.texture.src = "https://lazyevaluation.ru/dominator/bat.png";
		this.revtexture.src = "https://lazyevaluation.ru/dominator/revenemy2.png";
		this.textureX = 64;
		this.textureY = 64;
		this.textureW = 30;
		this.textureH = 30;
		this.frames = 1;
	}
}