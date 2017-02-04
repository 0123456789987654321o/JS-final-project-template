// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img");
var towerImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/slime.gif";
btnImg.src = "images/tower-btn.png";
towerImg.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(enemyImg,enemy.x,enemy.y);
	ctx.drawImage(btnImg,640-64,480-64,64,64);
	if(isBuilding == true){
		ctx.drawImage(towerImg,cursor.x,cursor.y);
	}
}

// 執行 draw 函式
setInterval(draw, 16);

var enemy = {
	x: 96,
	y: 480-32
}

var cursor = {
	x: 100,
	y: 200
}

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
		isBuilding = false;
	}
}