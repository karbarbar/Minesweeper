const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
document.body.appendChild(wrapper);

const title = document.createElement('h1');
title.innerText = 'Minesweeper';
wrapper.appendChild(title);

const navigation = document.createElement('div');
navigation.className = 'navigation';
wrapper.appendChild(navigation);

const menu = document.createElement('div');
menu.className = 'menu';
navigation.appendChild(menu);

const spanOneMenu = document.createElement('span');
spanOneMenu.className = 'span-menu';
menu.appendChild(spanOneMenu);

const spanTwoMenu = document.createElement('span');
spanTwoMenu.className = 'span-menu';
menu.appendChild(spanTwoMenu);

const spanThreeMenu = document.createElement('span');
spanThreeMenu.className = 'span-menu';
menu.appendChild(spanThreeMenu);

const nav = document.createElement('nav');
nav.className = 'nav';
navigation.appendChild(nav);

const navList = document.createElement('ul');
navList.className = 'nav-list';
nav.appendChild(navList);

const navItems = ['Easy', 'Medium', 'Hard'];
navItems.forEach((item) => {
  const navItem = document.createElement('li');
  navItem.innerText = item;
  if (item === 'Easy') {
    navItem.className = 'nav-item-easy';
  } else if (item === 'Medium') {
    navItem.className = 'nav-item-medium';
  } else if (item === 'Hard') {
    navItem.className = 'nav-item-hard';
  }
  navList.appendChild(navItem);
});
const navItemEasy = document.querySelector('.nav-item-easy');
const navItemMedium = document.querySelector('.nav-item-medium');
const navItemHard = document.querySelector('.nav-item-hard');



const container = document.createElement('div');
container.className = 'container';
wrapper.appendChild(container);

const divGameOver = document.createElement('div');
divGameOver.className = 'game-over';
divGameOver.id = 'game-over';
wrapper.appendChild(divGameOver);

const gameOverButton = document.createElement('button');
gameOverButton.className = 'game-over-button';
gameOverButton.innerText = 'Game over! \nPlay again';
divGameOver.appendChild(gameOverButton);

const gameHeader = document.createElement('div');
gameHeader.className = 'game-header';
container.appendChild(gameHeader);

const gameCountSpan = document.createElement('div');
gameCountSpan.className = 'game-header-count';
gameCountSpan.innerText = '0';
gameHeader.appendChild(gameCountSpan);

const gameEmoji = document.createElement('div');
gameEmoji.className = 'game-header-emoji';
gameHeader.appendChild(gameEmoji);

const gameTimer = document.createElement('div');
gameTimer.className = 'game-header-timer';
gameHeader.appendChild(gameTimer);

const gameTimerSpan = document.createElement('span');
gameTimerSpan.className = 'game-header-timer-span';
gameTimerSpan.innerText = '0';
gameTimer.appendChild(gameTimerSpan);

const game = document.createElement('div');
game.className = 'game-board';
game.id = 'game-board';
container.appendChild(game);

const colorsGameBoard = document.createElement('button');
colorsGameBoard.className = 'colors-game-board';
colorsGameBoard.id = 'colors-game';
colorsGameBoard.innerText = 'Dark mode';
wrapper.appendChild(colorsGameBoard);

let bombsIndexes = [];
let audio = new Audio('clickButton.mp3');
let timer = 0;
const click = 0;
let timerInterval = 0;
let closedCells;

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    gameTimerSpan.innerText = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

let clickCounter = 0;

function setClickCounter() {
  clickCounter++;
  gameCountSpan.innerText = clickCounter;
}

function playAudio() {
  audio.play();
}

function isValidClick(row, col) {
  return (row >= 0) && (row < boardHeight) && (col >= 0) && (col < boardWidth);
}

function checkBomb(row, col) {
  if (!isValidClick(row, col)) return false;
  const index = row * boardWidth + col;
  return bombsIndexes.includes(index);
}

function calculateBombsAround(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i >= boardHeight || j < 0 || j >= boardWidth) {
        continue;
      }
      if (checkBomb(i, j)) {
        count++;
      }
    }
  }
  return count;
}

function openCell(row, col, buttonArray) {
  closedCells = boardWidth * boardHeight;

  playAudio();
  if (!isValidClick(row, col)) return;

  if (!timerInterval) startTimer();

  const index = row * boardWidth + col;
  const cell = buttonArray[index];
  if (cell.disabled === true) return;
  cell.disabled = true;
  cell.style.backgroundColor = 'lightgrey';

  if (checkBomb(row, col)) {
    const image = document.querySelector('.game-header-emoji');
    audio = new Audio('gameOver.mp3');
    playAudio();
    cell.innerHTML = '💣';
    cell.style.backgroundColor = 'red';
    const GameOver = document.querySelector('.game-over');
    GameOver.classList.add('active');
    stopTimer();
    const gameOverButton = document.querySelector('.game-over-button');
    gameOverButton.onclick = () => {
      location.reload();
    };
    return;
  }

  const countBombsAround = calculateBombsAround(row, col);

  if (countBombsAround !== 0) {
    cell.innerHTML = countBombsAround;
    return;
  }

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i >= boardHeight || j < 0 || j >= boardWidth) {
        continue;
      }
      if (i === row && j === col) {
        continue;
      }
      if (buttonArray[i * boardWidth + j]?.disabled) {
        continue;
      }
      openCell(i, j, buttonArray);
    }
  }
}

function startGame() {
  const gameBoard = document.getElementById('game-board');
  const cellsCount = boardWidth * boardHeight;
  gameBoard.innerHTML = '<button id="button-field" class="game-board-button"></button>'.repeat(cellsCount);
  const buttonArray = gameBoard.children; // помещаем кнопки в массив
  const handleCellClick = (event) => {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    const index = Array.from(buttonArray).indexOf(event.target); // получаем индекс ячейки в массиве
    const col = index % boardWidth; // получаем колонку
    const row = Math.floor(index / boardWidth); // получаем строку
    setClickCounter();
    openCell(row, col, buttonArray);
    // check if game is over
    let countNotOpenedCells = 0;
    for (let i = 0; i < buttonArray.length; i++) {
      if (buttonArray[i].disabled === false) {
        countNotOpenedCells++;
      }
    }
    let bombExloaded = false;
    for (let i = 0; i < bombsIndexes.length; i++) {
      if (buttonArray[bombsIndexes[i]].disabled === true) {
        bombExloaded = true;
      }
    }
    if (bombExloaded) {
      audio = new Audio('gameOver.mp3');
      playAudio();
      const GameOver = document.querySelector('.game-over');
      GameOver.classList.add('active');
      stopTimer();
      const gameOverButton = document.querySelector('.game-over-button');
      gameOverButton.onclick = () => {
        location.reload();
      };
    } else if (bombsIndexes.length === countNotOpenedCells) {
      audio = new Audio('you_win.mp3');
      playAudio();
      const GameOver = document.querySelector('.game-over');
      GameOver.classList.add('active');
      stopTimer();
      const gameOverButton = document.querySelector('.game-over-button');
      gameOverButton.innerText = 'You Win! \nPlay again';
      gameOverButton.onclick = () => {
        location.reload();
      };
    }
  };

  gameBoard.addEventListener('click', handleCellClick);
}

const domContentLoadedCallback = function () {
  boardWidth = 10;
  boardHeight = 10;
  const bombsInGame = 10;
  const cellsInGame = boardWidth * boardHeight;
  bombsIndexes = Array.from({ length: cellsInGame }, (_, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsInGame); // utworzenie tablicy z bombami, rozłożonych losowo w komórkach

  startGame();
};
document.addEventListener('DOMContentLoaded', domContentLoadedCallback);

const gameBoard = document.getElementById('game-board');
navItemEasy.addEventListener('click', () => {
  gameBoard.classList.remove('game-board-medium');
  gameBoard.classList.remove('game-board-hard');
  gameBoard.classList.add('game-board-easy');
  document.removeEventListener('DOMContentLoaded', domContentLoadedCallback);
  boardWidth = 10;
  boardHeight = 10;
  const bombsInGame = 10;
  const cellsInGame = boardWidth * boardHeight;
  bombsIndexes = Array.from({ length: cellsInGame }, (_, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsInGame); // создаем массив с бомбами, рандомно распределяя их по ячейкам
  startGame();
});

navItemMedium.addEventListener('click', () => {
  boardWidth = 15;
  boardHeight = 15;
  const bombsInGame = 30;
  gameBoard.classList.remove('game-board-easy');
  gameBoard.classList.remove('game-board-hard');
  gameBoard.classList.add('game-board-medium');
  document.removeEventListener('DOMContentLoaded', domContentLoadedCallback);

  const cellsInGame = boardWidth * boardHeight;
  bombsIndexes = Array.from({ length: cellsInGame }, (_, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsInGame); // создаем массив с бомбами, рандомно распределяя их по ячейкам
  startGame();
});

navItemHard.addEventListener('click', () => {
  boardWidth = 25;
  boardHeight = 25;
  const bombsInGame = 60;
  gameBoard.classList.remove('game-board-medium');
  gameBoard.classList.remove('game-board-easy');
  gameBoard.classList.add('game-board-hard');
  document.removeEventListener('DOMContentLoaded', domContentLoadedCallback);
  const cellsInGame = boardWidth * boardHeight;
  bombsIndexes = Array.from({ length: cellsInGame }, (_, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsInGame); // создаем массив с бомбами, рандомно распределяя их по ячейкам
  startGame();
});

const darkLightMode = document.getElementById('colors-game');
const { body } = document;
let darkMode = true;

body.style.backgroundColor = '#333';
body.style.color = '#ddd';

darkLightMode.addEventListener('click', () => {
  const elements = document.querySelectorAll(' button');
    if (darkMode) {
      darkMode = false;
      for (const element of elements) {
        element.style.backgroundColor = '#333';
        element.style.color = '#808080';
        darkLightMode.innerText = 'Light Mode';
      }
    } else {
        darkMode = true;
        for (const element of elements) {
            element.style.backgroundColor = '#ddd';
            element.style.color = '#333';
            darkLightMode.innerText = 'Dark Mode';
        }
    }
});

const navMenu = document.querySelector('.nav');
const menuMobile = document.querySelector('.menu');

if (menuMobile) {
    menuMobile.addEventListener('click', function () {
        menuMobile.classList.toggle('active_menu');
        navMenu.classList.toggle('active_navigation');
    });
}
const links = document.querySelectorAll('li');
links.forEach((link) => {
    link.addEventListener('click', closeMenu);
});
function closeMenu() {
    menuMobile.classList.remove('active_menu');
    navMenu.classList.remove('active_navigation');
}
