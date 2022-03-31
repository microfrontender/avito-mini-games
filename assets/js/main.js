if(window.innerWidth < 768){
	// Чтоб игры на моблике всегда были по высоте экрана
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


new Memo('#memo-game');
new Heart('#heart-game');
new Shapes('#shapes-game');
