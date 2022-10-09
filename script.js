
var canvas = document.getElementById('vaszon');
var c = canvas.getContext("2d");


c.fillStyle = '#0080ff';
c.beginPath();
var grd = c.createRadialGradient(400, 700, 50, 400, 700, 250);
grd.addColorStop(0, "blue");
grd.addColorStop(1, "transparent");
c.fillStyle = grd;
c.arc(400, 700, 250, 0, Math.PI * 2);
c.fill();

//VÁLTOZÓK
var aliensY = 110;
var heroY = 370;
var heroX = 480;
var score = 0;
var isRunning = false;
var intervalTime = 1000;
const initAliens = [
	[
		{x:-180+350,y:0},
		{x:-120+350,y:0},
		{x:-60+350,y:0},
		{x:0+350,y:0},
		{x:60+350,y:0},
		{x:120+350,y:0},
		{x:180+350,y:0},
		{x:240+350,y:0}
	],
	[
		{x:-180+350,y:50},
		{x:-120+350,y:50},
		{x:-60+350,y:50},
		{x:0+350,y:50},
		{x:60+350,y:50},
		{x:120+350,y:50},
		{x:180+350,y:50},
		{x:240+350,y:50},
	],
	[
		{x:-180+350,y:110},
		{x:-120+350,y:110},
		{x:-60+350,y:110},
		{x:0+350,y:110},
		{x:60+350,y:110},
		{x:120+350,y:110},
		{x:180+350,y:110},
		{x:240+350,y:110},
	]
]

let aliens = [...initAliens];
//tömb a bombáknak
var bombList = [];

var intervalID;
let steps = 0;
let direction = "right";
var alienMoveInterval;
var aliensHeightInterval;

function draw() {
    drawHero();
    drawAliens();
}

function start() {
	if(!isRunning) {
		intervalID = setInterval(collosionDetection,10);
		canvas.classList.add("animatedBg");
		c.clearRect(0, 0, 800, 470);
		isRunning = true;
		score = 0;
		refreshScore();
		aliens = [...initAliens];
		draw();
		moveAliens();
	}
}
//----------------------------------------------------------------------------------------------------

const hero = new Image();
hero.src = "hero.png";

const heroR = new Image();
heroR.src = "hero_r.png";

const heroL = new Image();
heroL.src = "hero_l.png";


function drawHero() {
    c.drawImage(hero, heroY, heroX, 50, 50);
}

var alien = new Image();
alien.src = "alien.png";

function drawAliens() {
	aliens.forEach(alienRow => {
		alienRow.forEach(alienPos => {
			c.drawImage(alien, 0, 0, 520, 520, alienPos.x, alienPos.y, 50, 50);
		});
	});
}

function moveAliens() {
	alienMoveInterval = setInterval(moveAliensRight,intervalTime);
	aliensHeightInterval = setInterval(moveAliensDown,30*intervalTime);
	intervalID = setInterval(collosionDetection,10);
}

function moveAliensLeft() {
	if(direction == "right") {
		steps += 1;
	}
	else {
		steps -= 1;
	}
	if(steps === -10) {
		clearInterval(alienMoveInterval);
		alienMoveInterval = setInterval(moveAliensRight,intervalTime);
		
		direction = "right";
	}
	aliens = aliens.map(alienRow => {
		return alienRow.map(alien => { 
			c.clearRect(alien.x, alien.y, 50, 50);
			return {
				...alien,
				x:alien.x-10
			}
		} );
	});
	drawAliens();
}

function moveAliensRight() {
	if(direction == "right") {
		steps += 1;
	}
	else {
		steps -= 1;
	}
	if(steps === 10) {
		clearInterval(alienMoveInterval);
		alienMoveInterval = setInterval(moveAliensLeft,intervalTime);
		direction = "left";
	}
	aliens = aliens.map(alienRow => {
		return alienRow.map(alien => { 
			c.clearRect(alien.x, alien.y, 50, 50);
			return {
				...alien,
				x:alien.x+10
			}
		} );
	});
	drawAliens();
}

function moveAliensDown() {
	aliens = aliens.map(alienRow => {
		return alienRow.map(alien => { 
			aliensY = 0;
			if(aliensY < alien.y) aliensY = alien.y+50;
			c.clearRect(alien.x, alien.y, 50, 50);
			return {
				...alien,
				y:alien.y+50
			}
		} );
	});
	if(aliensY > heroX) {
		console.log(aliensY,heroX)
		gameOver();
	}
	drawAliens();
}


window.addEventListener('click', dropBombs, false);
window.addEventListener('keydown', heroMove, false);
window.addEventListener('keyup', resetShip, false);

const disableselect = (e) => {  
	return false  
}  
document.onselectstart = disableselect  
document.onmousedown = disableselect

function resetShip() {
	if(isRunning) {
		c.clearRect(heroY, heroX, 100, 50);
		c.drawImage(hero, heroY, heroX, 50, 50);
		requestAnimationFrame(resetShip);
	}
}

function heroMove(e) {
	var key = e.which;
	if(!isRunning) {
		if (key === 32 || key === 13) {
			start();
		} 
	}
	else {
		if (key === 39 || key === 68) {
			if (heroY < canvas.width - 60) {
				heroY += 10;
				moveRight();
			}
		} else if (key === 37 || key === 65) {
			if (heroY > 10) {
				heroY -= 10;
				moveLeft();
			}
		}
	}
}

//Mozgató függvények
function moveLeft() {
    c.clearRect(heroY, heroX, 100, 50);
    c.drawImage(heroL, heroY, heroX, 50, 50);
    requestAnimationFrame(moveLeft);
}

function moveRight() {
    c.clearRect(heroY - 50, heroX, 100, 50);
    c.drawImage(heroR, heroY, heroX, 50, 50);
    requestAnimationFrame(moveRight);
}


function dropBombs() {
	if (isRunning) {
		bombList.push({ x: heroY+10, y: heroX-18 });
	}
	else return;
}

function gameOver() {
	canvas.classList.remove("animatedBg");
	c.clearRect(0, 0, 800, 470);
	aliens = [];
	drawAliens();
	
	c.font = "30px Verdana";
	c.fillStyle = "#ffffff";
	c.fillText("GAME OVER!", 300, 300);
	c.font = "20px Verdana";
	c.fillText("Your score is "+score, 300, 330);

    clearInterval(intervalID);
	clearInterval(alienMoveInterval);
	clearInterval(aliensHeightInterval);
	isRunning = false;
}

function collosionDetection() {
	if(aliens[0] && aliens[0].length === 0) {
		aliens = [...initAliens];
		aliensY = 110;
	}
	if(bombList.length === 0) return;
	for (var i in bombList) {
		var bomb = bombList[i];

		c.clearRect(bomb.x-8, bomb.y+4, 16, 16);
		if(bomb.y <= -18) {
			bombList.splice(i, 1);
		}
		else {
			var grd = c.createRadialGradient(bomb.x, bomb.y, 0.1, bomb.x, bomb.y, 2*Math.PI);
			grd.addColorStop(0, "red");
			grd.addColorStop(0.75, "orange");
			grd.addColorStop(1, "black");
			c.fillStyle = grd;
			c.beginPath();
			c.arc(bomb.x, bomb.y, 7.5, 0, 2 * Math.PI);
			c.fill();
			bomb.y -= 6;
		}

		aliens.forEach((alienRow,alienRowId) => {
			alienRow.forEach((alien,alienCellId) => { 
				if ((bomb.x >= alien.x && bomb.x <= alien.x+50)) {
					if(distance(alien,bomb) <= alien.y+50) {
						c.clearRect(alien.x, alien.y, 50, 50);
						c.clearRect(bomb.x-6, bomb.y-4, 16, 16);
						bombList.splice(i, 1);

						aliens[alienRowId].splice(alienCellId, 1);
						score += 100;
						return;
					}
				}
			} );
		});
    }
	refreshScore();
	drawAliens();
}

function refreshScore() {
		document.getElementById("score").textContent = score;
}

function distance(a, b) {
    let dy = b.y - a.y;
	return dy;
}
