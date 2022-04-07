

# Основная установка

1. Импортировать в js или подключить в html файлы ***pixi.min.js***, ***memory.js***, ***heart.js***, ***shapes.js***.
2. Содержимое ***img*** в ***assets/img*** можно расположить по тому же относительному пути, либо в любое место, но нужно будет изменить константу **ASSETS_PATH** в ***memory.js, heart.js, shapes.js*** на нужный путь:

```
const ASSETS_PATH = './assets/img/';
```
3. В свой css добавить стиль для canvas *(доп1)*.
4. В свой js добавить вспомогательный код для мобилок *(доп2)*.
5. Инициализировать игры в обертках по id:  ***new Memo(id)***, ***new Heart(id)***, ***new Shapes(id)***.

# Дополнение к коду

1. ***style.css*** по большей части нужен только для демонстрации. Они не нужны в проекте, кроме стилей для *canvas* в мобильной версии. В данном случае ***.game canvas{...}***
    
    ***.game*** - любой селектор, где будет инициализированна игра
    
2. ***main.js*** - так же демонстрационный скрипт. Его подключать не нужно. Из него стоит взять вот этот код:
```
if(window.innerWidth < 768){
	function fullHeight() {
		let vh = window.innerHeight * 0.01;
		let canvases = document.querySelectorAll('.game');
		canvases.forEach(canvas => {
			canvas.style.setProperty('--vh', `${vh}px`);
		});
	}
	fullHeight();
	window.addEventListener('resize', () => {
		fullHeight();
	});
}
```
  Он позволяет подгоднять размер *canvas* под высоту экрана мобилки с учетом интерфейса мобильного браузера. Работает в связке со стилем ***.game canvas{...}***.
