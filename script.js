const flipSound = new Audio('assets/sounds/flip.mp3');
const matchSound = new Audio('assets/sounds/match.mp3');
const wrongSound = new Audio('assets/sounds/wrong.mp3');

const emojis = ['🎯', '🎨', '⚽', '🎵', '🚀', '🍕', '🌟', '🎮'];
const cardValues = [...emojis, ...emojis]; // 8 pairs = 16 cards

let flippedCards = [];
let matchedPairsCount = 0;
let moveCounter = 0;
let timerInterval = null;
let secondsElapsed = 0;
let bestScore = null;
let gameStarted = false;


const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const bestScoreDisplay = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const victoryModal = document.getElementById('victory-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');


// Fisher–Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    timerDisplay.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function loadBestScore() {
    bestScore = localStorage.getItem('bestScore');
    bestScoreDisplay.textContent = bestScore ? bestScore : '--';
}

function saveBestScore() {
    if (!bestScore || moveCounter < bestScore) {
        bestScore = moveCounter;
        localStorage.setItem('bestScore', bestScore);
    }
}

function createCards(shuffledEmojis) {
    gameBoard.innerHTML = '';

    shuffledEmojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;

        card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${emoji}</div>
        <div class="card-back">?</div>
      </div>
    `;

        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
}

function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    if (
        clickedCard.classList.contains('flipped') ||
        clickedCard.classList.contains('matched') ||
        flippedCards.length === 2
    ) {
        return;
    }

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);
    flipSound.currentTime = 0;
    flipSound.play();

    if (flippedCards.length === 2) {
        moveCounter++;
        movesDisplay.textContent = moveCounter;
        checkMatch();
    }

}

function checkMatch() {
    const [cardOne, cardTwo] = flippedCards;

    if (cardOne.dataset.value === cardTwo.dataset.value) {
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');

        matchSound.currentTime = 0;
        matchSound.play();

        matchedPairsCount++;
        flippedCards = [];

        if (matchedPairsCount === cardValues.length / 2) {
            endGame();
        }

    } else {
        cardOne.classList.add('shake');
        cardTwo.classList.add('shake');

        wrongSound.currentTime = 0;
        wrongSound.play();

        setTimeout(() => {
            cardOne.classList.remove('flipped', 'shake');
            cardTwo.classList.remove('flipped', 'shake');
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    stopTimer();
    saveBestScore();
    loadBestScore();

    finalTimeDisplay.textContent = formatTime(secondsElapsed);
    finalMovesDisplay.textContent = moveCounter;

    victoryModal.classList.add('show');
}

function initGame() {
    flippedCards = [];
    matchedPairsCount = 0;
    moveCounter = 0;
    secondsElapsed = 0;
    gameStarted = false;

    clearInterval(timerInterval);

    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';
    victoryModal.classList.remove('show');

    const shuffledCards = shuffle([...cardValues]);
    createCards(shuffledCards);

    loadBestScore();
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);


function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}



initGame();


