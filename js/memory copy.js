class Game {
	constructor(canvasId){
		this.canvas = document.getElementById(canvasId);
		this.screen = this.canvas.getContext('2d');
		this.gameSize = { x: this.canvas.width, y: this.canvas.height };

		this.bodies = createInvaders(this).concat([new Player(this, this.gameSize)]);
		
		return this.tick();
	};
	tick() {
		// console.log(this.isGameOver());
		if (this.isGameOver() === true) {
			this.screen.font = "30px Arial";
			this.screen.textAlign = "center";
			this.screen.fillText('Game over', this.gameSize.x / 2, this.gameSize.y / 2);
		} else if (this.invadersNumber() == 0) {
			this.screen.font = "30px Arial";
			this.screen.textAlign = "center";
			this.screen.fillText('You win!', this.gameSize.x / 2, this.gameSize.y / 2);
		} else {
			this.score = (24 - this.invadersNumber());
			displayScore(this.score);
			this.update();
			this.draw(this.screen, this.gameSize);
			requestAnimationFrame(this.tick);
		}
	};

	update() {
		var bodies = this.bodies;
		var notCollidingWithAnything = function (b1) {
			return bodies.filter(function (b2) {
				return colliding(b1, b2) &&
					(b1 instanceof Bullet && b2 instanceof Bullet) == false
			}).length === 0;
		};

		this.bodies = this.bodies.filter(notCollidingWithAnything);

		for (var i = 0, length = this.bodies.length; i < length; i++) {
			this.bodies[i].update();
		}
	};

	draw (screen, gameSize) {
		screen.clearRect(0, 0, gameSize.x, gameSize.y);
		for (var i = 0, length = this.bodies.length; i < length; i++) {
			drawRect(screen, this.bodies[i]);
		}
	};

	addBody(body) {
		this.bodies.push(body);
	};

	invadersBelow(invader) {
		return this.bodies.filter(function (b) {
			return b instanceof Invader &&
				b.center.y > invader.center.y &&
				b.center.x - invader.center.x < invader.size.x;
		}).length > 0;
	};

	isGameOver() {
		
		return this.bodies.filter(function (b) {
			return (b instanceof Player)
		}).length == 0;
	};

	invadersNumber() {
		return true;
		// return this.bodies.filter(function (b) {return (b instanceof Invader)}).length;
	}
};

class Player{
	constructor(game, gameSize){
		this.game = game;
		this.size = { x: 15, y: 15 };
		this.center = { x: gameSize.x / 2, y: gameSize.y - 30 };
		this.keyboarder = new Keyboarder();
	}
	

	update() {
		if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
			this.center.x -= 2;
		} else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
			this.center.x += 2;
		}

		if (firstShoot == false) {
			var can = canPlayerShoot();
		}

		if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
			if (firstShoot) {
				this.shoot();
				firstShoot = false;
			}
			if (can) {
				this.shoot();
				count = 0;
			}
		}
	};

	shoot() {
		var bullet = new Bullet(
			{ x: this.center.x, y: this.center.y - this.size.y / 2 - 2 },/* - 2 for colliding */
			{ x: 0, y: -6 }
		);
		this.game.addBody(bullet);
	};
};

class Bullet {
	constructor(center, velocity){
	this.size = { x: 3, y: 3 };
	this.center = center;
	this.velocity = velocity;
	}

	update() {
		this.center.x += this.velocity.x;
		this.center.y += this.velocity.y;
	}
};

class Invader {
	constructor(game, center){
	this.game = game;
	this.size = { x: 15, y: 15 };
	this.center = center;
	this.patrolX = 0;
	this.speedX = 0.3;
	}

	update() {
		if (this.patrolX < 0 || this.patrolX > 40) {
			this.speedX = -this.speedX;
		}
		this.center.x += this.speedX;
		this.patrolX += this.speedX;

		if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
			var bullet = new Bullet(
				{ x: this.center.x, y: this.center.y + this.size.y / 2 + 2 },
				{ x: Math.random() - 0.5, y: 2 }
			);
			this.game.addBody(bullet);
		}
	}
};

var createInvaders = function (game) {
	var invaders = [];
	for (var i = 0; i < 24; i++) {
		var x = 30 + (i % 8) * 30;
		var y = 30 + (i % 3) * 30;
		invaders.push(new Invader(game, { x: x, y: y }));
	}
	return invaders;
};

var drawRect = function (screen, body) {
	screen.fillRect(
		body.center.x - body.size.x / 2,
		body.center.y - body.size.y / 2,
		body.size.x, body.size.y
	);
};

var Keyboarder = function () {
	var keyState = {};

	window.onkeydown = function (e) {
		keyState[e.keyCode] = true;
	};

	window.onkeyup = function (e) {
		keyState[e.keyCode] = false;
	};

	this.isDown = function (keyCode) {
		return keyState[keyCode] === true;
	};

	this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
};

var colliding = function (b1, b2) {
	return !(
		b1 === b2 ||
		b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
		b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
		b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 ||
		b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2
	);
};

var $score = document.getElementById('score');
var displayScore = function (score) {
	$score.innerHTML = score;
};

var firstShoot = true;
var count = 0;
var canPlayerShoot = function () {
	if (count == 20) {
		return true;
	} else {
		count++;
	}
};

window.onload = function () {
	new Game('screen');
};

document.getElementById('start').addEventListener('click', function () {
	new Game('screen');
	this.blur();
});
