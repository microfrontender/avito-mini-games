
const Memo = function (selector) {

	// Начальные данные
	
	const cardSize = 60;
	const cardMargin = 6;
	const cardSource = [
		{ id: 1, img: '1' },
		{ id: 2, img: '1' },
		{ id: 3, img: '1' },
		{ id: 4, img: '1' },
		{ id: 5, img: '1' },
		{ id: 6, img: '1' },
		{ id: 7, img: '1' },
		{ id: 8, img: '1' },
		{ id: 9, img: '1' },
		{ id: 10, img: '1' },
		{ id: 11, img: '1' },
		{ id: 12, img: '1' },
		{ id: 13, img: '1' },
		{ id: 14, img: '1' },
		{ id: 15, img: '1' },
		{ id: 16, img: '1' },
		{ id: 17, img: '1' },
		{ id: 18, img: '1' },
		{ id: 19, img: '1' },
		{ id: 20, img: '1' },
	];
	let score = 0;
	let interactive = true;
	let cardsArray = [];
	let answers = [];
	let answerCounter = 0;

	// Инициализация PIXI

	const gameContainer = document.querySelector(selector);
	const app = new PIXI.Application({
		backgroundColor: 0xffffff,
		width: 375,
		height: 667,
		antialias: true,
		resolution: window.devicePixelRatio,
		autoDensity: true,
	});
	gameContainer.appendChild(app.view);

	// Создание контейнера сетки карточек

	let grid = new PIXI.Container();
	grid.x = 27;
	grid.y = 90;
	app.stage.addChild(grid);

	// Создание контейнера счета

	let scoreWrap = new PIXI.Container();
	let scoreText = new PIXI.Text('SCORE');
	let scoreValue = new PIXI.Text(score);
	app.stage.addChild(scoreWrap);
	scoreWrap.addChild(scoreText);
	scoreWrap.addChild(scoreValue);

	// Создание финального экрана с кнопкой рестарта

	let winScreen = new PIXI.Container();
	winScreen.width = 375;
	winScreen.height = 667;
	winScreen.alpha = 0;
	let winScreenImg = new PIXI.Sprite.from('./assets/img/win-screen.svg');
	let screenBtn= new PIXI.Sprite.from('./assets/img/restart-btn.svg');
	app.stage.addChild(winScreen);
	winScreen.addChild(winScreenImg);

	winScreen.addChild(screenBtn);
	screenBtn.x = 147;
	screenBtn.y = 525;
	screenBtn.buttonMode = true;
	screenBtn.on('pointerdown', () => {
		init();
		fadeOut(winScreen);
	});

	// Инициализация(рестар) игры

	function init(){
		generationCards();
		drawGrid(cardsArray, 5);
		drawScore();
		interactive = true;
		answers = [];
		answerCounter = 0;
		score = 0;
		winScreen.interactive = false;
		screenBtn.interactive = false;
	}
	init();


	// Отрисовка счета

	function drawScore() {
		scoreValue.style.fill = 0x000000;
		scoreValue.style.fontSize = 40;
		scoreValue.style.fontFamily = 'DisposableDroid BB';
		scoreValue.text = `000`;
		scoreValue.y = 6;
		scoreValue.x = 315;
		scoreText.style.fill = 0x000000;
		scoreText.style.fontSize = 40;
		scoreText.style.fontFamily = 'DisposableDroid BB';
		scoreText.y = 6;
		scoreText.x = 10;
		scoreText.style.textTransform = 'uppercase';
	}

	// Создание коллекции карточек и загрузка в сетку
	
	function generationCards() {	
		grid.children = [];
		cardsArray = [];
		let array1 = shuffleCards(cardSource);
		let array2 = shuffleCards(cardSource);
		let resultArray = array1.concat(array2);
		resultArray.forEach((element, index) => {
			let item = new PIXI.Container();
			item.interactive = true;
			item.buttonMode = true;
			item.id = element.id;
			item.answerId = null;
			item.option = {
				selected: false,
				bgTexture: new PIXI.Texture.from(`./assets/img/memo/bg.svg`),
				bgTextureHover: new PIXI.Texture.from(`./assets/img/memo/bg-hover.svg`),
				imgTexture: new PIXI.Texture.from(
					`./assets/img/memo/${element.img}.png`
				),
				imgTextureHover: new PIXI.Texture.from(
					`./assets/img/memo/${element.img}-hover.png`
				),
			};
			let bg = new PIXI.Sprite.from(item.option.bgTexture);
			let img = new PIXI.Sprite.from(item.option.imgTexture);
			img.x = 12;
			img.y = 13;
			img.width = 35;
			img.height = 35;
			let text = new PIXI.Text(element.id);
			text.style.fill = 0x26EEFB;
			text.style.fontSize = 16;
			item.addChild(bg);
			item.addChild(img);
			item.addChild(text);
			grid.addChild(item);
			cardsArray.push(item);
			item.on('pointerdown', () => {
				selectCard(item, index);
			});
		});
		
	}
		
	// Перемешивание карточек

	function shuffleCards(array) {
		let counter = array.length,
			temp,
			index;
		while (counter > 0) {
			index = Math.floor(Math.random() * counter);
			counter--;
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
		return array;
	}

	// Отрисовка сетки 

	function drawGrid(arr, col) {
		let len = arr.length;
		let box;
		for (let j = 0; j < len; j++) {
			box = arr[j];
			box.x = (j % col) * (cardSize + cardMargin);
			box.y = parseInt(j / col) * (cardSize + cardMargin);
		}
	}

	// Выбор карты

	function selectCard(item, index) {
		if (interactive) {
			if (!item.option.selected) {
				item.getChildAt(0).texture = item.option.bgTextureHover;
				item.getChildAt(1).texture = item.option.imgTextureHover;
				item.answerId = answerCounter;
				answers[item.answerId] = item;
				answerCounter += 1;
			} else {
				item.getChildAt(0).texture = item.option.bgTexture;
				item.getChildAt(1).texture = item.option.imgTexture;
				answers.splice(item.answerId, 1);
				item.answerId = null;
				answerCounter -= 1;
			}
			item.option.selected = !item.option.selected;
			if (answerCounter >= 2) {
				comparison();
			}

		}
	}

	// Сравнение выбранных карт

	function comparison() {
		interactive = false;
		setTimeout(() => {
			if (answers.length>0 && answers[0].id === answers[1].id) {
				answers.forEach((item) => {
					item.interactive = false;
					item.buttonMode = false;
					item.answerId = null;
					item.option.selected = false;
					fadeOut(item);
				});

				updateScore();
			} else {
				answers.forEach((item) => {
					item.getChildAt(0).texture = item.option.bgTexture;
					item.getChildAt(1).texture = item.option.imgTexture;
					item.answerId = null;
					item.option.selected = false;
				});
			}
			answers = [];
			answerCounter = 0;
			interactive = true;
		}, 500);
	}
	
	// Обновление счета

	function updateScore() {
		score += 1;
		let displayScore;
		if(score >= 10){
			displayScore = `0${score}`;
		}else{
			displayScore = `00${score}`;
		}
		scoreValue.text = displayScore;
		if (score === cardSource.length) {
			gameWin();
		}
	}

	// Игра пройдена

	function gameWin() {
		interactive = false;
		setTimeout(() => {
			
			fadeIn(winScreen);
			winScreen.interactive = true;
			screenBtn.interactive = true;
		}, 1000);
		
		
	}

	// Анимационные эффекты

	function fadeOut(item) {
		item.alpha = 1;
		function animationUpdate() {
			item.alpha -= 0.05;
			if (item.alpha <= 0) {
				app.ticker.remove(animationUpdate);
			}
		}
		app.ticker.add(animationUpdate);
	}
	function fadeIn(item) {
		item.alpha = 0;
		function animationUpdate() {
			item.alpha += 0.05;
			if (item.alpha >= 1) {
				app.ticker.remove(animationUpdate);
			}
		}
		app.ticker.add(animationUpdate);
	}

};

