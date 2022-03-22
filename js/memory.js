
// setting
let score = 1;
let init = false;
let gameEnd = false;
let cardSize = 60;
let cardMargin = 6;
const cardSource = [
	{"id": 1, "img": "1"},
	{"id": 2, "img": "1"},
	{"id": 3, "img": "1"},
	{"id": 4, "img": "1"},
	{"id": 5, "img": "1"},
	{"id": 6, "img": "1"},
	{"id": 7, "img": "1"},
	{"id": 8, "img": "1"},
	{"id": 9, "img": "1"},
	{"id": 10, "img": "1"},
	{"id": 11, "img": "1"},
	{"id": 12, "img": "1"},
	{"id": 13, "img": "1"},
	{"id": 14, "img": "1"},
	{"id": 15, "img": "1"},
	{"id": 16, "img": "1"},
	{"id": 17, "img": "1"},
	{"id": 18, "img": "1"},
	{"id": 19, "img": "1"},
	{"id": 20, "img": "1"}
];
let cardsArray = [];
let answers = [];

const gameContainer = document.querySelector('#memo-game');
const app = new PIXI.Application({ 
	backgroundColor: 0xFFFFFF, 
	width: 375, 
	height: 667,
	antialias: true, 
	resolution: window.devicePixelRatio,
	autoDensity: true
});
gameContainer.appendChild(app.view);

let grid = new PIXI.Container();
grid.x = 27;
grid.y = 90;
app.stage.addChild(grid);

function generationCards(){
	let array1 = shuffleCards(cardSource);
	let array2 = shuffleCards(cardSource);
	let resultArray = array1.concat(array2);
	resultArray.forEach((element) => {
		let item = new PIXI.Container();
		item.interactive = true;
		item.buttonMode = true;
		let option = {
			'id': element.id,
			'selected': false,
			'bgTexture': new PIXI.Texture.from(`./assets/img/memo/bg.svg`),
			'bgTextureHover': new PIXI.Texture.from(`./assets/img/memo/bg-hover.svg`),
			'imgTexture': new PIXI.Texture.from(`./assets/img/memo/${element.img}.svg`),
			'imgTextureHover': new PIXI.Texture.from(`./assets/img/memo/${element.img}-hover.svg`),
		}
		let bg = new PIXI.Sprite.from(option.bgTexture);
		let img = new PIXI.Sprite.from(option.imgTexture);
		img.x = 12.5;
		img.y = 12.5;
		let text = new PIXI.Text(element.id);
		text.style.fill = 0xff1010;
		text.style.fontSize = 16;
		item.addChild(bg);
		item.addChild(img);
		item.addChild(text);
		grid.addChild(item);

		cardsArray.push(item);
		item.on('pointerdown', ()=>{selectCard(item, option)});
	});
}
generationCards();
function shuffleCards(array) {
	var counter = array.length, temp, index;
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}
drawGrid(cardsArray,5);
function drawGrid(arr , col){
	let len = arr.length;
	let box;
	for(var j = 0 ; j < len ;j++){
	  box = arr[j];
	  box.x = (j % col) * (cardSize + cardMargin);
	  box.y = parseInt(j / col) * (cardSize + cardMargin);
	}
  }

function selectCard(item, option){
	if(!option.selected){
		item.getChildAt(0).texture = option.bgTextureHover;
		item.getChildAt(1).texture = option.imgTextureHover;
	}else{
		item.getChildAt(0).texture = option.bgTexture;
		item.getChildAt(1).texture = option.imgTexture;
	}
	option.selected = !option.selected;
}