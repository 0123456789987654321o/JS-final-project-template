
var HP = 100;
var score = 0;
var $$ = 70;
var FPS = 60;
var clock = 0;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img");
var towerImg = document.createElement("img");
var crosshairImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/tower.png";
btnImg.src = "images/tower-btn.png";
towerImg.src = "images/slimexx.gif";
crosshairImg.src = "images/crosshair.png"

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if((clock%80) == 0){
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].HP <= 0){
			enemies.splice(i, 1);
			score += 100;
			$$ += 20;
		}else{
			enemies[i].move();	
			ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);
		}
	}
	ctx.drawImage(btnImg,640-64,480-64,64,64);
	if(isBuilding == true){
		ctx.drawImage(towerImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);
	}
	for(var i = 0; i < towers.length; i++){
		ctx.drawImage(towerImg,towers[i].x,towers[i].y);
		towers[i].searchEnemy();
		if(towers[i].aimingEnemyId != null){
			var id = towers[i].aimingEnemyId;
			ctx.drawImage(crosshairImg, enemies[id].x, enemies[id].y)
		}
	}
	ctx.font = "60px Arial";
	ctx.fillStyle = "#0A99FF";
	ctx.fillText("HP: " + HP, 210, 140);
	ctx.fillText("Score: " + score, 210, 200);
	ctx.fillText("$$: " + $$, 210, 260);
	if (HP<=0) {
		clearInterval(intervalID)
		ctx.fillText("GAME-OVER", 150, 370);
		ctx.fillText("嫩", 290, 430);
	}
}

// 執行 draw 函式
var intervalID = setInterval(draw, 1000/FPS);

var enemyPath = [
	{x: 32, y: 32},
	{x: 544, y: 32},
	{x: 544, y: 288},
	{x: 256, y: 288},

];

function Enemy(){
	this.x = 32;
	this.y = 448;
	this.HP = 10;
	this.speedX = 0;
	this.speedY = -64;
	this.pathDes = 0;
	this.move = function(){
		if(isCollided(enemyPath[this.pathDes].x,
					  enemyPath[this.pathDes].y,
					  this.x,
					  this.y,
					  64/FPS,
					  64/FPS)){
			// 移動
			this.x = enemyPath[this.pathDes].x;
			this.y = enemyPath[this.pathDes].y;
			// 指定
			this.pathDes++;
			if(this.pathDes == enemyPath.length){
				this.HP = 0;
				HP -= 10;
				return;
			}
			// 計算, 修改
			if( enemyPath[this.pathDes].y < this.y){
        // 往上走
				this.speedX = 0;
				this.speedY = -64;
			} else if(enemyPath[this.pathDes].x > this.x){
				// 往右走
				this.speedX = 64;
				this.speedY = 0;
			} else if(enemyPath[this.pathDes].y > this.y){
				// 往下走
				this.speedX = 0;
				this.speedY = 64;
			} else if(enemyPath[this.pathDes].x < this.x){
				// 往左走
				this.speedX = -64;
				this.speedY = 0;
			}
		}else{
			this.x += this.speedX/FPS;
			this.y += this.speedY/FPS;
		}
	}
}
var enemies = [];

var cursor = {
	x: 100,
	y: 200
}

function Tower(){
	this.x = 0;
	this.y = 0;
	this.range = 96;
	this.aimingEnemyId = null;
	this.searchEnemy = function(){
		this.readyToShootTime -= 1/FPS;
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime <= 0){
					this.shoot(i);
					this.readyToShootTime = this.fireRate;
				}				
        return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	};
	this.shoot = function(id){
		ctx.beginPath(); // 開始畫線
		ctx.moveTo(this.x, this.y); // 先將畫筆移動到 (x1, y1)
		ctx.lineTo(enemies[id].x, enemies[id].y); // 畫一條直線到 (x2, y2)
		ctx.strokeStyle = '#0FFFAA'; // 設定線條顏色
		ctx.lineWidth = 70; // 設定線條寬度
		ctx.stroke(); // 上色
		enemies[id].HP -= this.damage;
	};
	this.fireRate =1.15;
	this.readyToShootTime = 1.15;
	this.damage = 0.5;
}
var towers = [];

$("#game-canvas").on("mousemove", mousemove);
function mousemove(event){
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
}

var isBuilding = false;

$("#game-canvas").on("click", mouseclick);
function mouseclick(){
	if(cursor.x > 576 && cursor.y > 416){
		isBuilding = true;
	} else{
		// 蓋塔
		if(isBuilding == true){
			if($$ >= 10){
				$$ -= 10;
				var newTower = new Tower();
				newTower.x = cursor.x - cursor.x%32;
				newTower.y = cursor.y - cursor.y%32;
				towers.push(newTower);
			}
		}
		// 建造完成
		isBuilding = false;
	}
}

function isCollided(pointX, pointY, targetX, targetY, targetWidth, targetHeight){
	if(targetX <= pointX &&
				  pointX <= targetX + targetWidth &&
	   targetY <= pointY &&
				  pointY <= targetY + targetHeight){
		return true;
	}else{
		return false;
	}
}
//123123