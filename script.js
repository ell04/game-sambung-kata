// ================= LOAD WORD.JSON =================
let words = [];

const clickSound = new Audio("sounds/click.mp3");
const wrongSound = new Audio("sounds/salah.mp3");
const gameoverSound = new Audio("sounds/gameover.mp3");
const winSound = new Audio("sounds/win.mp3");
const countdownSound = new Audio("sounds/countdown.mp3");
const goSound = new Audio("sounds/go.mp3");

fetch("word.json")
  .then(res => res.json())
  .then(data => {
    words = data;
    console.log("Words loaded:", words.length);
  })
  .catch(err => console.log("Error load JSON:", err));

// ================= GLOBAL =================
let usedWords = [];
let currentWord = "";
let lastChar = "";
let timer = 10;
let interval;

let lives = 3;
let mode = "mudah";
let turnCount = 0;

// 2 PLAYER
let player1Name = "";
let player2Name = "";
let currentPlayer = 1;
let livesP1 = 3;
let livesP2 = 3;

// ================= UTIL =================
function getRandomWord() {
  if (words.length === 0) return "kata";
  return words[Math.floor(Math.random() * words.length)];
}

// ================= COUNTDOWN (FIXED) =================
function startCountdown(callback, elementId) {
  let count = 3;
  let el = document.getElementById(elementId);

  el.classList.add("countdown-show");
  el.textContent = count;

  countdownSound.currentTime = 0;
  countdownSound.play().catch(() => {});

  let cd = setInterval(() => {
    count--;

    if (count > 0) {
      el.textContent = count;
    } 
    else if (count === 0) {
      el.textContent = "0";
    } 
    else {
      el.textContent = "GO!";
      goSound.currentTime = 0;
      goSound.play().catch(() => {});
    }

    if (count < 0) {
      clearInterval(cd);

      setTimeout(() => {
        el.classList.remove("countdown-show");
        el.textContent = "";
        callback();
      }, 800);
    }

  }, 1000);
}

// ================= MODE BOT =================

function startBotGame() {
  usedWords = [];
  mode = document.getElementById("modeSelect").value;

  goToPage("pageGameBot");

  lives = 3;
  turnCount = 0;

  document.getElementById("messageBot").textContent = "";
  document.getElementById("lives").textContent = "❤️❤️❤️";
  document.getElementById("modeTitle").textContent = "Mode " + mode;

  startCountdown(() => {
    nextWordBot();
  }, "countdown");
}

function nextWordBot() {
  currentWord = getRandod("playerInput").value = "";
mWord();
  usedWords.push(currentWord);
  lastChar = currentWord.slice(-1);

  document.getElementById("currentWord").textContent = currentWord;
  document.getElementByI
  startTimerBot();
}

function startTimerBot() {
  timer = 10;
  document.getElementById("timer").textContent = timer;

  clearInterval(interval);

  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = timer;

    if (timer <= 0) {
      wrongSound.currentTime = 0;
      wrongSound.play();
      wrongAnswerBot();
    }
  }, 1000);
}

function submitWord() {
  let input = document.getElementById("playerInput");
  let word = input.value.toLowerCase().trim();

  // validasi input
  if (!word || word[0] !== lastChar || !words.includes(word)) {
  document.getElementById("messageBot").textContent = "Jawaban salah!";
  shakeInput("playerInput");

    wrongSound.currentTime = 0;
    wrongSound.play();

  return;
}

  // cek kata sudah dipakai
  if (usedWords.includes(word)) {
    document.getElementById("messageBot").textContent = "Kata telah digunakan!";
    shakeInput("playerInput");

    wrongSound.currentTime = 0;
    wrongSound.play();
    return;
  } else {
    document.getElementById("messageBot").textContent = "";
  }

  // simpan jawaban player
  usedWords.push(word);

  clearInterval(interval);

  // ================= BOT =================
  lastChar = word.slice(-1);

  // ambil semua kandidat kata yang valid
  let candidates = words.filter(w => w[0] === lastChar && !usedWords.includes(w));

  // pilih random
  let botWord = candidates[Math.floor(Math.random() * candidates.length)];

  // kalau bot tidak bisa jawab
  if (!botWord) {
    showPopup("Kamu Menang!");
    return;
  }

  // tampilkan jawaban bot
  currentWord = botWord;
  lastChar = botWord.slice(-1);
  document.getElementById("currentWord").textContent = botWord;

  // simpan kata bot
  usedWords.push(botWord);

 turnCount++;

let isWin = checkWinBot();
if (isWin) return;

startTimerBot();
input.value = "";
}

function wrongAnswerBot() {
  clearInterval(interval);

  lives--;
  updateLives();

  shakeInput("playerInput");

  if (lives <= 0) {
    showPopup("Game Over!!!");
    gameoverSound.currentTime = 0;
    gameoverSound.play();

    return;
  }

  nextWordBot();
}

function updateLives() {
  const livesEl = document.getElementById("lives");
  livesEl.textContent = "❤️".repeat(lives);

  livesEl.classList.add("lives-animate");
  setTimeout(() => {
    livesEl.classList.remove("lives-animate");
  }, 400);
}

function checkWinBot() {
  let target = mode === "mudah" ? 10 : mode === "normal" ? 25 : 50;

  if (turnCount >= target) {
    clearInterval(interval);
    showPopup("Kamu Menang!");
    winSound.currentTime = 0;
    winSound.play();
    return true;
  }

  return false;
}

// ================= MODE 2 PLAYER =================
function startTwoPlayerGame() {
  usedWords = [];
  player1Name = document.getElementById("player1").value || "Player 1";
  player2Name = document.getElementById("player2").value || "Player 2";

  livesP1 = 3;
  livesP2 = 3;
  currentPlayer = 1;

  goToPage("pageGame2");

  updateLives2();
  updateTurn();

  startCountdown(() => {
    nextWord2();
  }, "countdown2");
}

function nextWord2() {
  currentWord = getRandomWord();
  usedWords.push(currentWord);
  lastChar = currentWord.slice(-1);

  document.getElementById("currentWord2").textContent = currentWord;
  document.getElementById("playerInput2").value = "";

  startTimer2();
}

function startTimer2() {
  timer = 10;
  document.getElementById("timer2").textContent = timer;

  clearInterval(interval);

  interval = setInterval(() => {
    timer--;
    document.getElementById("timer2").textContent = timer;

    if (timer <= 0) {
      shakeInput("playerInput2");
      wrongSound.currentTime = 0;
      wrongSound.play();
      wrongAnswer2();
    }
  }, 1000);
}

function submitWord2() {
  let input = document.getElementById("playerInput2");
  let word = input.value.toLowerCase().trim();

if (!word || word[0] !== lastChar || !words.includes(word)) {
  document.getElementById("message2").textContent = "Jawaban salah!";
  shakeInput("playerInput2");

  wrongSound.currentTime = 0;
  wrongSound.play();

  return;
}

if (usedWords.includes(word)) {
  document.getElementById("message2").textContent = "Kata telah digunakan!";
  shakeInput("playerInput2");

  wrongSound.currentTime = 0;
  wrongSound.play();
  return;
} else {
  document.getElementById("message2").textContent = "";
}

usedWords.push(word);

  clearInterval(interval);

  lastChar = word.slice(-1);

  currentPlayer = currentPlayer === 1 ? 2 : 1;

  updateTurn();
  startTimer2();

  input.value = "";
}

function wrongAnswer2() {
  clearInterval(interval);

  shakeInput("playerInput2");

  if (currentPlayer === 1) {
    livesP1--;
  } else {
    livesP2--;
  }

  updateLives2();

  if (livesP1 <= 0) {
    showPopup(player2Name + " Menang!");
    winSound.currentTime = 0;
    winSound.play();
    return;
  }

  if (livesP2 <= 0) {
    showPopup(player1Name + " Menang!");
    winSound.currentTime = 0;
    winSound.play();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;

  updateTurn();
  nextWord2();
}

function updateTurn() {
  let name = currentPlayer === 1 ? player1Name : player2Name;
  document.getElementById("turnInfo").textContent = "Giliran " + name;
}

function updateLives2() {
  document.getElementById("livesP1").textContent =
    player1Name + ": " + "❤️".repeat(livesP1);

  document.getElementById("livesP2").textContent =
    player2Name + ": " + "❤️".repeat(livesP2);
}

// ================= EFFECT =================
function shakeInput(id) {
  let el = document.getElementById(id);
  el.classList.add("error");

  setTimeout(() => {
    el.classList.remove("error");
  }, 300);
}

// ================= POPUP =================
function showPopup(text) {
  clearInterval(interval);

  document.getElementById("popupText").textContent = text;
  document.getElementById("popup").classList.add("show");
}

function restartGame() {
  document.getElementById("popup").classList.remove("show");
  goToPage("page1");
}

function goToPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  document.getElementById("popup").classList.remove("show");

  clearInterval(interval);
}

// ================= ENTER TO SUBMIT =================

// Mode Bot
document.getElementById("playerInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    submitWord();
  }
});

// Mode 2 Player
document.getElementById("playerInput2").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    submitWord2();
  }
});

function showMessage(text) {
  let popup = document.getElementById("popup");
  let popupText = document.getElementById("popupText");

  popupText.textContent = text;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 1500);
}

// Sounds Game
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
})
