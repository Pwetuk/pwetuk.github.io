function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


class SpawnPresets{
	static enemies = 1;
	static lastSpawned = 0;
	static resetCounter(){
		this.enemies = 1;
	} 

	static defaultSpawn(gameTime, enemiesType, lastSpawned, spawnCooldown, enemiesCountRiseCoef){
		if(gameTime - lastSpawned > spawnCooldown * 1000 && Enemy.count < 50){
			for(var i=0;i<=this.enemies;i++){
				var enemy = Enemy.randomSpawn(enemiesType);
				Game.objects.add(enemy);
			}
			this.enemies *= enemiesCountRiseCoef;
			return true;
		}
		return false;
	}

	static stage1(gameTime){
		if(this.defaultSpawn(gameTime, Enemy1, this.lastSpawned, 1, 1.1)){
			this.lastSpawned = gameTime;
		}

	}

	static stage2(gameTime){
		if(this.defaultSpawn(gameTime, Enemy2, this.lastSpawned, 2, 1.2)){
			this.lastSpawned = gameTime;
		}
	}

	static stage3(gameTime){
		if(this.defaultSpawn(gameTime, Enemy1, this.lastSpawned, 1, 1) && this.defaultSpawn(gameTime, Enemy2, this.lastSpawned, 1, 1)){
			
			this.lastSpawned = gameTime;
		}
	}

	static stage4(gameTime){
		if(Enemy.count < 30){
			let enemy = Enemy.randomSpawn(Enemy2);
			enemy.health = 1000;
			enemy.speed.base = 20;
			enemy.speed.coeficient = 20;
			Game.objects.add(enemy);
		}
	}

	static timeToStage(gameTime){
		if(0 <= gameTime && gameTime < 3 * 1000){
			return 1;
		}
		if(3 * 1000 <= gameTime && gameTime < 10 * 1000){
			return 2;
		}
		if(10 * 1000 <= gameTime && gameTime <= 60 * 1000){
			return 3;
		}
		return 4;
	}

	static spawn(gameTime){
		switch(this.timeToStage(gameTime)){
			case 1:
				this.stage1(gameTime);
				break;
			case 2:
				this.stage2(gameTime);
				break;
			case 3:
				this.stage3(gameTime);
				break;
			case 4:
				this.stage4(gameTime);
				break;
		}
	}
}
