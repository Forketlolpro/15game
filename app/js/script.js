class Game {
	BAR_WIDTH = 110;
	DEFAULT_SIDE_SIZE = 4;
	_key_code;
	_side;
	_barCount;
	_barArray;
	_zeroIndex;

	constructor() {
		if (Game.instance) {
			return Game.instance;
		}
	    this._initialize(this.DEFAULT_SIDE_SIZE);
	    this._bindEvents();
	    return Game.instance = this;
	}

	_initialize (side = 4) {
		this._side = side;
		document.querySelector('h1').innerText = 'Игра в 15';
		this.key_code = {ArrowLeft: 1, ArrowUp: this._side, ArrowRight: -1, ArrowDown: -this._side};
		this._barCount = this._side**2;
		this._barArray = new Array(this._barCount - 1);
		for (let i = 0; i < this._barCount - 1; ++i) {
			this._barArray[i]=i+1;
		}
	}

	_refreshGame () {
		document.getElementById('game').innerHTML ='';
		let side = document.querySelector('input').value;
		if (side > 10 || side < 2) {
			side = this.DEFAULT_SIDE_SIZE;
		}
		this._initialize(side || this.DEFAULT_SIDE_SIZE);
		this._generateRandomField();
		this._generateHtml();
	}

	_generateRandomField() {
		for (let i = this._barArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this._barArray[i], this._barArray[j]] = [this._barArray[j], this._barArray[i]];
		}
		this._barArray.push(0);
		this._zeroIndex = this._barCount - 1;
		if (!this._gameIsWinable()) {
			var tmp = this._barArray[0]; 
			this._barArray[0] = this._barArray[1]; 
			this._barArray[1] = tmp;
		}
	}


	_gameIsWinable() {
		let summ = 0
		for ( let i = 1; i < this._barArray.length - 1; i++) {
			for (let j = i-1; j >= 0; j--) {
				if (this._barArray[j] > this._barArray[i]) {
					summ++;
				}
			}
		}
	  	return !(summ % 2); 
	}

	_generateHtml() {
		let wrapper = document.getElementById('game');
		wrapper.style.width = this._side * this.BAR_WIDTH + 'px';
		for (let i = 0; i < this._barCount; i++) {
			let elem = document.createElement('div');
			elem.innerText = this._barArray[i];
			elem.classList.toggle('zero', this._barArray[i] === 0);
			wrapper.appendChild(elem);
		}
	}

	_bindEvents() {
		document.querySelector('button').addEventListener('click', ()=> this._refreshGame());
		document.addEventListener('keydown', (e) =>{
			if(this.key_code[e.key]) {
				this._move(this.key_code[e.key]);
				if (this._checkIsWin()) {
					document.querySelector('h1').innerText = 'Вы выиграли!';
				}
			}
		})
	}

	_move(zeroDeltaIndex) {
		let newZeroIndex = this._zeroIndex + +zeroDeltaIndex;
		if (!this._barArray[newZeroIndex]) {
			return false;
		}

		if (zeroDeltaIndex === 1 && (!(newZeroIndex % this._side) && this._zeroIndex % this._side)) {
			return false;
		}

		if (zeroDeltaIndex === -1 && (!(this._zeroIndex % this._side) && newZeroIndex % this._side)) {
			return false;
		}

		var tmp = this._barArray[newZeroIndex]; 
		this._barArray[newZeroIndex] = this._barArray[this._zeroIndex]; 
		this._barArray[this._zeroIndex] = tmp;
		this._zeroIndex = newZeroIndex;
		this._refreshGameFields();
	}

	_refreshGameFields () {
		let childNodes = document.getElementById('game').children;

		for (let i = 0; i < this._barCount; i++) {
			childNodes[i].innerText = this._barArray[i];
			childNodes[i].classList.toggle('zero', this._barArray[i] === 0);
		}

	}

	_checkIsWin () {
		return !this._barArray.some(function(item, i) { 
			return item > 0 && item-1 !== i; 
		});
	}
	
	start() {
		this._generateRandomField();
		this._generateHtml();
	}
}

let game = new Game();
game.start();