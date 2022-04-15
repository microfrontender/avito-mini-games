const Shapes = function(selector) {
    // Начальные данные
    const ASSETS_PATH = './assets/img/';

    const objectsCount = 20;
    const objectsSource = [{
            "img": "triangle",
            "width": 43,
            "height": 37
        },
        {
            "img": "circle",
            "width": 37,
            "height": 37
        },
        {
            "img": "romb",
            "width": 42,
            "height": 42
        }
    ];
    let score,
        interactive,
        answers = [],
        answerCounter,
        currentBtn,
        finishRight,
        objectLast,
        gameStarted,
        speed,
        gameEnded;

    // Инициализация PIXI

    const gameContainer = document.querySelector(selector);
    const app = new PIXI.Application({
        backgroundColor: 0xffffff,
        width: 375,
        height: 667,
        antialias: true,
        resolution: 3,
        autoDensity: true,
    });
    gameContainer.appendChild(app.view);

    app.renderer.plugins.interaction.autoPreventDefault = false;
    app.renderer.view.style.touchAction = 'auto';

    // Создание финиша

    let finish = new PIXI.Container();
    let finishImgMain = new PIXI.Texture.from(`${ASSETS_PATH}finish.png`);
    let finishImgRight = new PIXI.Texture.from(`${ASSETS_PATH}finish-right.png`);
    let finishImg = new PIXI.Sprite.from(finishImgMain);
    finishImg.x = 0;
    finishImg.y = 495;
    finishImg.width = 375;
    finishImg.height = 55;
    app.stage.addChild(finish);
    finish.addChild(finishImg);

    // Создание контейнера сетки карточек

    let grid = new PIXI.Container();
    grid.x = 0;
    grid.y = 0;
    app.stage.addChild(grid);

    // Создание контейнера счета

    let scoreWrap = new PIXI.Container();
    let scoreText = new PIXI.Text('SCORE');
    let scoreValue = new PIXI.Text(score);
    let scoreBg = new PIXI.Graphics();
    scoreBg.beginFill(0xFFFFFF);
    scoreBg.drawRect(0, 0, 375, 50);
    scoreBg.endFill();
    app.stage.addChild(scoreWrap);
    scoreWrap.addChild(scoreBg);
    scoreWrap.addChild(scoreText);
    scoreWrap.addChild(scoreValue);

    // Создание контейнера навигации

    let nav = new PIXI.Container();

    nav.x = 0;
    nav.y = 594;
    app.stage.addChild(nav);

    // Создание кнопки старт

    let startBtn = new PIXI.Sprite.from(`${ASSETS_PATH}start-btn.png`);
    startBtn.x = 41;
    startBtn.y = 259;
    startBtn.width = 285;
    startBtn.height = 56;
    startBtn.on('pointerdown', () => {
        generationObjects();
        startBtn.alpha = 0;
        startBtn.buttonMode = false;
        startBtn.interactive = false;
        gameStarted = true;
    });
    app.stage.addChild(startBtn);

    // Создание финального экрана с кнопкой рестарта

    let endScreen = new PIXI.Container();
    endScreen.width = 375;
    endScreen.height = 667;
    endScreen.alpha = 0;
    let endScreenWin = new PIXI.Texture.from(`${ASSETS_PATH}win-screen.png`);
    let endScreenLoss = new PIXI.Texture.from(`${ASSETS_PATH}loss-screen.png`);
    let endScreenImg = new PIXI.Sprite.from(endScreenWin);
    endScreenImg.width = 375;
    endScreenImg.height = 667;
    let screenBtn = new PIXI.Sprite.from(`${ASSETS_PATH}restart-btn.png`);
    screenBtn.width = 82;
    screenBtn.height = 82;
    app.stage.addChild(endScreen);
    endScreen.addChild(endScreenImg);

    endScreen.addChild(screenBtn);
    screenBtn.x = 147;
    screenBtn.y = 525;
    screenBtn.buttonMode = true;
    screenBtn.on('pointerdown', () => {
        init();
        fadeOut(endScreen);
    });

    // Инициализация(рестар) игры

    function init() {
        // generationObjects();
        drawScore();
        drawNav();
        interactive = true;
        answers = [];
        grid.children = [];
        answerCounter = 0;
        score = 0;
        endScreen.interactive = false;
        screenBtn.interactive = false;
        gameEnded = false;
        currentBtn = null;
        objectLast = objectsCount - 1;
        finishRight = false;
        startBtn.alpha = 1;
        startBtn.buttonMode = true;
        startBtn.interactive = true;
        speed = 1;
    }
    init();



    // Отрисовка счета

    function drawScore() {
        scoreValue.style.fill = 0x242424;
        scoreValue.style.fontSize = 40;
        scoreValue.style.fontFamily = 'DisposableDroid BB';
        scoreValue.text = `000`;
        scoreValue.y = 6;
        scoreValue.x = 308;
        scoreText.style.fill = 0x242424;
        scoreText.style.fontSize = 40;
        scoreText.style.fontFamily = 'DisposableDroid BB';
        scoreText.y = 6;
        scoreText.x = 10;
        scoreText.style.textTransform = 'uppercase';

    }

    // Отрисовка кнопок


    function drawBtn(imgsrc, imgx, imgy, imgwidth, imgheight, x, id) {
        let btn = new PIXI.Container();

        let graph = new PIXI.Graphics();
        btn.imageMain = new PIXI.Texture.from(`${ASSETS_PATH}${imgsrc}.png`);
        btn.imageInvert = new PIXI.Texture.from(`${ASSETS_PATH}${imgsrc}-invert.png`);
        btn.image = new PIXI.Sprite.from(btn.imageMain);
        btn.id = id;
        graph.beginFill(0xFFFFFF);
        graph.drawRect(0, 0, 121, 74);
        graph.endFill();
        btn.image.x = imgx;
        btn.image.y = imgy;
        btn.image.width = imgwidth;
        btn.image.height = imgheight;
        btn.x = x;
        btn.y = 0;
        nav.addChild(btn);
        btn.addChild(graph);
        btn.addChild(btn.image);
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on('pointerdown', pressBtn);
    }

    // Нажатие на кнопку

    function pressBtn() {
        if (gameStarted && !gameEnded) {
            let id = this.id;
            if (currentBtn !== null && currentBtn !== this) {
                currentBtn.image.texture = currentBtn.imageMain;
            }
            currentBtn = this;
            currentBtn.image.texture = currentBtn.imageInvert;
            checkNearbyObject(id);
        }

    }

    function checkNearbyObject(id) {

        if (id == [grid.children[objectLast].id]) {
            finishImg.texture = finishImgRight;
        } else {
            finishImg.texture = finishImgMain;
        }
    }
    // Отрисовка навигации

    function drawNav() {
        nav.children = [];
        let navBg = new PIXI.Graphics();
        navBg.beginFill(0xFFFFFF);
        navBg.drawRect(0, -44, 375, 118);
        navBg.endFill();
        nav.addChild(navBg);
        new drawBtn('triangle', 37, 12, 42, 37, 0, 0);
        new drawBtn('circle', 44, 12, 37, 37, 127, 1);
        new drawBtn('romb', 41, 8, 42, 42, 254, 2);
    }


    // Создание коллекции карточек и загрузка в сетку

    function generationObjects() {
        let idArray = [0, 1, 2];
        let ySumm = 0;
        grid.children = [];
        let currentArray = shuffle(idArray);
        let idCounter = 0;
        for (let i = 0; i < objectsCount; i++) {
            let currentId;
            if (idCounter > 2) {
                idCounter = 0;
                currentArray = shuffle(idArray);
            }
            currentId = currentArray[idCounter];
            let item = new PIXI.Sprite.from(`${ASSETS_PATH}${objectsSource[currentId].img}.png`);
            item.id = currentId;
            item.width = objectsSource[currentId].width;
            item.height = objectsSource[currentId].height;
            item.isDestroyed = false;
            item.x = getRandom((30 + 100 * idCounter), (90 + 100 * idCounter));
            item.y = ySumm;

            ySumm += getRandom(100, 200) + item.height;
            grid.addChild(item);
            idCounter++;
        }
        grid.y = -ySumm + 500;

        moveGrid();
    }


    function moveGrid() {
        function animationUpdate(delta) {
            grid.y += speed * delta;
            if (grid.y - finishImg.y - finishImg.height - grid.children[0].y - grid.children[0].height > 0) {
                app.ticker.remove(animationUpdate);
            }
            comparison(animationUpdate);
        }
        app.ticker.add(animationUpdate);

    }

    // Сравнение выбранного объекта и пересекаемого финишную черту

    function comparison(animationUpdate) {
        if (objectLast >= 0 && grid.y + grid.children[objectLast].y + grid.children[objectLast].height - 11 - finishImg.y > 0) {
            if (currentBtn !== null) {
                if (grid.children[objectLast].id === currentBtn.id) {
                    updateScore();
                    speed += 0.1;
                } else {
                    app.ticker.remove(animationUpdate);
                    gameEnd('loss');
                }
                resetBtn();
            } else {
                app.ticker.remove(animationUpdate);
                gameEnd('loss');
            }

            objectLast--;

        }

    }

    function resetBtn() {
        currentBtn.image.texture = currentBtn.imageMain;
        finishImg.texture = finishImgMain;
        currentBtn = null;
    }
    // Рандом

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    // Перемешивание

    function shuffle(array) {
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
    // Обновление счета

    function updateScore() {
        score += 1;
        let displayScore;
        if (score >= 10) {
            displayScore = `0${score}`;
        } else {
            displayScore = `00${score}`;
        }
        scoreValue.text = displayScore;
        if (score === objectsCount) {

            gameEnd();
        }
    }

    // Игра пройдена

    function gameEnd(result) {
        interactive = false;
        gameEnded = true;
        gameStarted = false;

        if (result === 'loss') {
            endScreenImg.texture = endScreenLoss;
        } else {
            endScreenImg.texture = endScreenWin;
        }
        fadeIn(endScreen);
        endScreen.interactive = true;
        screenBtn.interactive = true;
    }

    // Анимационные эффекты

    function fadeOut(item) {
        item.alpha = 1;

        function animationUpdate(delta) {
            item.alpha -= 0.15 * delta;
            if (item.alpha <= 0) {
                app.ticker.remove(animationUpdate);
            }
        }
        app.ticker.add(animationUpdate);
    }

    function fadeIn(item) {
        item.alpha = 0;

        function animationUpdate(delta) {
            item.alpha += 0.15 * delta;
            if (item.alpha >= 1) {
                app.ticker.remove(animationUpdate);
            }
        }
        app.ticker.add(animationUpdate);
    }
};