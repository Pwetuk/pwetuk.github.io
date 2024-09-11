function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAngle(){
	return Math.random() * Math.PI * 2;
}

class Weapon extends Entity{
	constructor(time, playerPosition){
		super(playerPosition().x, playerPosition().y, NaN, NaN, NaN);
		this.type = "weapon";
		this.timeFiring = 100;
		this.fireCooldown = 100;
		this.frame = 0;
		this.frames = 20;
		this.texture = new Image();
	}

	draw(ctx){
		ctx.drawImage(this.texture, this.textureX + this.textureW * Math.floor(this.frame / (this.frames/4)), this.textureY, this.textureW, this.textureH,
		 this.coordinates.x - this.radius, this.coordinates.y - this.radius, this.radius*2, this.radius*2);
	}

	update(time){
		super.update(time);
		this.frame += 1;
		this.frame %= this.frames;
	}
}



class Weapon1 extends Weapon{
	constructor(time, playerPosition, playerCoordinates){
		super(time, playerPosition);
		this.fireCooldown = 1000;
		this.firing = false;
		this.lastFired = time;
		this.color = "pink";
		this.level = 1;
		this.sizeCoef = 1;
		this.radius = 100;
		this.damage = 100;
		this.timeFiring = 100;
		this.playerPosition = playerPosition;
		this.x = playerPosition().x;
		this.y = playerPosition().y;
		this.playerCoordinates = playerCoordinates;
		this.hitbox = new Circle(this.x, this.y, this.radius);
		this.texture.src = "./resources/staticyellowweapons.png";
		this.textureX = 224;
		this.textureY = 160;
		this.textureW = 32;
		this.textureH = 32;
		this.frames = 8;
	}

	fire(time){
		this.frame = 0;
		this.firing = true;
		this.lastFired = time;
		this.x = this.playerPosition().x;
		this.y = this.playerPosition().y;
	}

	endFire(time){
		this.firing = false;
	}

	draw(ctx){
		if(this.firing){
			super.draw(ctx);
		}
	}

	update(time){
		super.update(time);
		this.x = this.playerPosition().x;
		this.y = this.playerPosition().y;
		if(this.firing){
			this.hitbox = new Circle(this.x, this.y, this.radius);
		}else{
			this.hitbox = new Circle(this.x, this.y, 0);
		}
		if(time > this.lastFired + this.fireCooldown){
			this.fire(time)
		}
		if(time > this.lastFired + this.timeFiring){
			this.endFire(time);
		}

	}
}

class Weapon2 extends Weapon{
	constructor(time, playerPosition, playerCoordinates){
		super(time, playerPosition);
		this.fireCooldown = 1312;
		this.lastFired = time;
		this.level = 1;
		this.sizeCoef = 1;
		this.projectiles = 3;
		this.radius = 24;
		this.damage = 25;
		this.timeFiring = 1000;
		this.playerPosition = playerPosition;
		this.x = playerPosition().x;
		this.y = playerPosition().y;
		this.playerCoordinates = playerCoordinates;
		this.hitbox = NaN;
		this.base = 12;
	}

	fire(time){
		this.lastFired = time;
		for(var i = 0; i < this.projectiles; i++){
			let angle = randomAngle();
			var force = new Entity(this.playerPosition().x, this.playerPosition().y, NaN, NaN, NaN);
			var projectile = new Weapon2Projectile(this.playerPosition().x, this.playerPosition().y,
		 	{x: Math.cos(angle), y: Math.sin(angle), base: this.base, coefficient: this.base}, this.radius, this.damage, force);
			force.draw = (() => {});
			force.update = function(){
				this.x = projectile.x;
				this.y = projectile.y;
				this.hitbox = projectile.hitbox;
			}
			Game.objects.add(projectile);
			Game.objects.add(force);
		}
	}

	update(time){
		super.update(time);
		this.x = this.playerPosition().x;
		this.y = this.playerPosition().y;
		if(time > this.lastFired + this.fireCooldown){
			this.fire(time)
		}
	}
}

class Weapon2Projectile extends Weapon{
	constructor(x, y, speed, radius, damage, linkedEntity){
		super(0, (() => {return {x: x, y: y}}));
		this.speed = {
			x: speed.x,
			y: speed.y,
			base: speed.base,
			coefficient: speed.coefficient,
		}
		this.color = "red";
		this.radius = radius;
		this.damage = damage;
		this.type = "weapon";
		this.linkedEntity = linkedEntity;
		this.timeFiring = 200;
		this.fireCooldown = 100;
		this.frame = 0;
		this.texture.src = "./resources/staticyellowweapons.png";
		this.textureX = 352;
		this.textureY = 256;
		this.textureW = 32;
		this.textureH = 32;
	}

	update(time){
		this.hitbox = new Circle(this.x, this.y, this.radius);
		this.move();
		if(Math.abs(this.x - Game.player.x) > Screen.canvas.width/2 + 100 || Math.abs(this.y - Game.player.y) > Screen.canvas.height + 100){
			this.delete();
		}
		this.frame += 1;
		this.frame %= 20;
	}

	delete(){
		this.linkedEntity.delete();
		super.delete();
	}
}


class Weapon3spawner extends Weapon{
	constructor(time, playerPosition, playerCoordinates){
		super(time, playerPosition);
		this.playerPosition = playerPosition;
		this.playerCoordinates = playerPosition;
		this.fireCooldown = 1500;
		this.lastFired = time;
	}

	fire(time){
		var projectile = new Weapon3(time, this.playerPosition, this.playerCoordinates);
		Game.objects.add(projectile);
	}

	update(time){
		if(time > this.lastFired + this.fireCooldown){
			this.fire(time);
			this.lastFired = time;
		}
	}

	draw(){}
}

class Weapon3 extends Weapon{
	constructor(time, playerPosition, playerCoordinates){
		super(time, playerPosition);
		this.x = playerPosition().x;
		this.y = playerPosition().y;
		this.time = time;
		this.acceleration = 0.1;
		var angle = randomAngle();
		this.speed = {
			x: Math.sin(angle),
			y: Math.cos(angle),
			base: 50,
			coefficient: 50
		}
		this.damage = 60;
		this.lastUpdate = time;
		this.width = 16;
		this.height = 16;
		this.texture.src = "./resources/staticyellowweapons.png";
		this.textureX = 384;
		this.textureY = 32;
		this.textureW = 32;
		this.textureH = 32;
		this.radius = 16;
	}

	update(time){
		super.update()
		super.move();
		this.speed.base = this.speed.coefficient = this.speed.base - (time - this.lastUpdate) * this.acceleration;
		this.hitbox = new Rectangle(this.x, this.y, this.width, this.height);
		this.lastUpdate = time;
	}
}