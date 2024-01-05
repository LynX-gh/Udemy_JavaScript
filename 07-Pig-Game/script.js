'use strict';
const scoreDOM = document.querySelectorAll('.score'),
  currScoreDOM = document.querySelectorAll('.current-score'),
  playerDOM = document.querySelectorAll('.player'),
  diceDOM = document.querySelector('.dice');

let scores = [0, 0],
  currentScore = 0,
  currentPlayer = 0,
  playing = true;

const reset = function () {
  scoreDOM.forEach(element => (element.textContent = 0));
  currScoreDOM.forEach(element => (element.textContent = 0));
  diceDOM.textContent = 0;

  scores = [0, 0];
  currentScore = 0;
  playing = true;

  diceDOM.classList.add('hidden');
  playerDOM.forEach(element => element.classList.remove('player--winner'));

  if (currentPlayer != 0) {
    switchPlayer();
    currentScore = 0;
  }
};

const switchPlayer = function () {
  playerDOM.forEach(element => element.classList.toggle('player--active'));
  currentPlayer = currentPlayer ? 0 : 1;
};

const updateCurr = function (num) {
  currentScore += num;
  if (num == 1) currentScore = 0;
  currScoreDOM[currentPlayer].textContent = currentScore;
  if (num == 1) switchPlayer();
};

const roll = function () {
  if (playing) {
    let randNum = Math.trunc(Math.random() * 6) + 1;

    updateCurr(randNum);

    diceDOM.classList.remove('hidden');
    diceDOM.src = `dice-${randNum}.png`;
  }
};

const hold = function () {
  if (playing) {
    scores[currentPlayer] += currentScore;
    scoreDOM[currentPlayer].textContent = scores[currentPlayer];
    if (scores[currentPlayer] >= 100) {
      playerDOM.classList.add('player--winner');
      playing = false;
      return;
    }
    updateCurr(1);
  }
};

document.querySelector('.btn--roll').addEventListener('click', roll);

document.querySelector('.btn--new').addEventListener('click', reset);

document.querySelector('.btn--hold').addEventListener('click', hold);
