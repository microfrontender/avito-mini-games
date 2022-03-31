const Heart = function(selector) {
    // Начальные данные

    const ASSETS_PATH = './assets/img/';

    const cardSize = 22;
    const cardMargin = 2;
    const cardsSource = [
        [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
        [2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    let score,
        interactive,
        cardsArray = [],
        answers = [],
        answerCounter,
        blackCardCounter,
        playerColumn,
        isFocus = false,
        shootCount,
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

    // Проверка фокуса на данном canvas

    gameContainer.querySelector('canvas').addEventListener('click', () => {
        isFocus = true;
        document.addEventListener('click', checkFocus);
    });

    function checkFocus(e) {
        if (e.target === gameContainer.querySelector('canvas')) {
            isFocus = true;
        } else {
            isFocus = false;
            document.removeEventListener('click', checkFocus, false);
        }
    }

    // Создание контейнера сетки карточек

    let grid = new PIXI.Container();
    grid.x = 33;
    grid.y = 121;
    app.stage.addChild(grid);

    // Создание контейнера счета

    let scoreWrap = new PIXI.Container();
    let scoreText = new PIXI.Text('SCORE');
    let scoreValue = new PIXI.Text(score);
    app.stage.addChild(scoreWrap);
    scoreWrap.addChild(scoreText);
    scoreWrap.addChild(scoreValue);

    // Создание контейнера навигации

    let nav = new PIXI.Container();
    nav.x = 0;
    nav.y = 594;
    app.stage.addChild(nav);

    // Создание контейнера снаряда

    let battleground = new PIXI.Container();
    let bullet;
    battleground.x = 0;
    battleground.y = 0;

    app.stage.addChild(battleground);

    // Создание игрока

    let player = new PIXI.Sprite.from(`${ASSETS_PATH}player.svg`);

    app.stage.addChild(player);

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
        generationCards();
        drawGrid(cardsArray, cardsSource[0].length);
        drawScore();
        drawNav();
        drawPlayer();
        interactive = true;
        answers = [];
        answerCounter = 0;
        score = 0;
        playerColumn = 6;
        endScreen.interactive = false;
        screenBtn.interactive = false;
        gameEnded = false;
        shootCount = 0;
        battleground.children = [];
    }
    init();

    // Отрисовка счета

    function drawScore() {
        scoreValue.style.fill = 0x242424;
        scoreValue.style.fontSize = 40;
        scoreValue.style.fontFamily = 'DisposableDroid BB';
        scoreValue.text = `000`;
        scoreValue.y = 6;
        scoreValue.x = 315;
        scoreText.style.fill = 0x242424;
        scoreText.style.fontSize = 40;
        scoreText.style.fontFamily = 'DisposableDroid BB';
        scoreText.y = 6;
        scoreText.x = 10;
        scoreText.style.textTransform = 'uppercase';
    }

    // Отрисовка кнопок

    function drawBtn(imgsrc, imgx, imgy, imgwidth, imgheight, x, _fun) {
        let btn = new PIXI.Container();
        let graph = new PIXI.Graphics();
        let image = new PIXI.Sprite.from(`${ASSETS_PATH}${imgsrc}.png`);
        graph.beginFill(0xfde033);
        graph.drawRect(0, 0, 121, 74);
        graph.endFill();
        image.x = imgx;
        image.y = imgy;
        image.width = imgwidth;
        image.height = imgheight;
        btn.x = x;
        btn.y = 0;
        nav.addChild(btn);
        btn.addChild(graph);
        btn.addChild(image);
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on('pointerdown', () => {
            if (!gameEnded) {
                _fun();
            }
        });
    }

    // Отрисовка навигации

    function drawNav() {
        nav.children = [];
        new drawBtn('left-arrow', 51, 23, 19.2, 32, 0, moveLeft);
        new drawBtn('circle-2', 45, 23, 32, 32, 127, shoot);
        new drawBtn('right-arrow', 55, 23, 19.2, 32, 254, moveRight);
    }


    // Навигация по нажатию стрелочек

    let isPressed = false;
    document.addEventListener('keydown', function(event) {
        if (!isPressed && isFocus && !gameEnded) {
            isPressed = true;

            switch (event.key) {
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowUp':
                    shoot();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;

                default:
                    break;
            }
        }
    });
    document.addEventListener('keyup', function(event) {
        isPressed = false;
    });

    // Генерация снаряда

    function shoot() {
        if (shootCount < 5) {
            bullet = new PIXI.Graphics();
            bullet.beginFill(0x242424);
            bullet.drawRect(0, 0, 11, 11);
            bullet.endFill();
            bullet.x = player.x + 22;
            bullet.y = player.y;
            battleground.addChild(bullet);
            bulletMove(bullet, shootCount);
            shootCount += 1;
        }
    }

    // Анимация снаряда

    function bulletMove(bullet) {

        // Сортировка индесов в текущей колонке массива

        let indexArray = [];
        for (let i = 0; i < cardsSource.length; i++) {
            let index = i * cardsSource[0].length + playerColumn;
            indexArray.push(index);
        }

        let existsIndex = indexArray.filter((index) => {
            return index <= cardsArray.length;
        });

        function animationUpdate(delta) {

            // Для анимации игра должна быть не закончена
            if (!gameEnded) {
                // Крайний не уничтоженный блок в колонке полета снаряда

                let undestroyedCards = existsIndex.filter((index) => {
                    if (!cardsArray[index].isDestroyed) {
                        return true;
                    } else {
                        return false;
                    }
                });
                let nearbyCard = cardsArray[undestroyedCards[undestroyedCards.length - 1]];
                let nearbyCardY = 0;
                if (nearbyCard !== undefined) {
                    nearbyCardY = nearbyCard.y + nearbyCard.height + grid.y;
                }
                bullet.y -= 5 * delta;

                // Просчет столкновения

                if (undestroyedCards.length > 0 && bullet.y <= nearbyCardY) {
                    nearbyCard.isDestroyed = true;

                    if (nearbyCard.id === 1) {
                        nearbyCard.alpha = 0;
                        gameEnd('loss');
                        destroyBullet();
                        battleground.children = [];
                    } else if (nearbyCard.id === 2) {
                        nearbyCard.alpha = 0;
                        updateScore();
                        destroyBullet();
                    }
                } else if (bullet.y <= 2) {
                    destroyBullet();
                }
            } else {
                app.ticker.remove(animationUpdate);
            }
        }
        app.ticker.add(animationUpdate);

        function destroyBullet() {
            app.ticker.remove(animationUpdate);
            bullet.destroy();
            shootCount -= 1;
        }
    }
    // Движение игрока влево

    function moveLeft() {
        if (player.x >= 18) {
            playerColumn -= 1;
            player.x -= 24;
        }
    }

    // Движение игрока вправо

    function moveRight() {
        if (player.x <= 300) {
            playerColumn += 1;
            player.x += 24;
        }
    }

    // Отрисовка Игрока

    function drawPlayer() {
        player.x = 160;
        player.y = 532;
        player.width = 55;
    }

    // Создание коллекции карточек и загрузка в сетку

    function generationCards() {
        grid.children = [];
        cardsArray = [];
        blackCardCounter = 0;
        for (let i = 0; i < cardsSource.length; i++) {
            for (let j = 0; j < cardsSource[i].length; j++) {
                let item = new PIXI.Container();
                let graph = new PIXI.Graphics();
                item.id = cardsSource[i][j];
                item.isDestroyed = false;
                if (cardsSource[i][j] === 2) {
                    graph.beginFill(0x242424);
                    blackCardCounter += 1;
                } else if (cardsSource[i][j] === 1) {
                    graph.beginFill(0xfde033);
                } else {
                    graph.beginFill(0xffffff);
                }
                graph.drawRect(0, 0, cardSize, cardSize);
                graph.endFill();
                item.addChild(graph);
                grid.addChild(item);
                cardsArray.push(item);
            }
        }
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
        if (score === blackCardCounter) {
            gameEnd();
        }
    }

    // Игра пройдена

    function gameEnd(result) {
        interactive = false;
        gameEnded = true;


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