
let score = 0;
let timeLeft = 30;
let gameInterval;
let heartInterval;
let hueShift = 0;

const frases = [
  "Você é meu ponto fraco 😳",
  "Mais um e meu coração é seu 💘",
  "Tô ficando boba com isso 😍",
  "Ai ai... 💓",
  "Você sabe que eu te adoro, né?",
  "Assim você me ganha! 😚",
  "Não para não 💞",
  "Você tá me fazendo ficar vermelha! 😳",
  "Coração acelerado! 💓",
  "Coraçãozinho batendo forte! 💓"
];

const poopFrases = [
  "Eca! 💩",
  "Isso não é um coração! 😖",
  "Cuidado onde clica! 🤢",
  "Que nojo! 💩",
  "Você perdeu pontos! 😔",
  "Não era isso que você queria, né? 😅"
];

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("finalScore");
const loveLevel = document.getElementById("loveLevel");
const gameArea = document.getElementById("gameArea");
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");

function startGame() {
  score = 0;
  timeLeft = 30;
  hueShift = 0;
  scoreDisplay.textContent = "Pontuação: 0";
  timerDisplay.textContent = "Tempo: 30";
  menuScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  gameScreen.classList.add("active");

  bgMusic.volume = 0.2;
  bgMusic.play().catch(() => {
    const playButton = document.createElement("button");
    playButton.textContent = "Tocar Música 🎵";
    playButton.style.position = "absolute";
    playButton.style.top = "10px";
    playButton.style.left = "50%";
    playButton.style.transform = "translateX(-50%)";
    playButton.style.zIndex = "1000";
    playButton.addEventListener("click", () => {
      bgMusic.play();
      playButton.remove();
    });
    document.body.appendChild(playButton);
  });

  gameInterval = setInterval(updateTimer, 1000);
  heartInterval = setInterval(spawnHeart, 800);
  setInterval(spawnPoop, 3000);
  setInterval(spawnSuperHeart, 10000);
  setInterval(() => createFloatingHeart(), 1200);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = "Tempo: " + timeLeft;
  if (timeLeft <= 0) endGame();
}

function spawnHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.top = Math.floor(Math.random() * 90) + "%";
  heart.style.left = Math.floor(Math.random() * 90) + "%";
  heart.style.filter = `hue-rotate(${hueShift}deg)`;

  heart.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = "Pontuação: " + score;
    heart.remove();
    clickSound.play();
    hueShift += 40;
    showVoice();
    messageBubble(randomItem(frases));
  });

  gameArea.appendChild(heart);
  setTimeout(() => { if (heart.parentElement) heart.remove(); }, 1500);
}

function spawnPoop() {
  const poop = document.createElement("div");
  poop.textContent = "💩";
  poop.style.position = "absolute";
  poop.style.fontSize = "2.5em";
  poop.style.top = Math.floor(Math.random() * 90) + "%";
  poop.style.left = Math.floor(Math.random() * 90) + "%";
  poop.style.cursor = "pointer";
  poop.style.zIndex = "10";
  poop.style.animation = "pulse 1.2s infinite";

  poop.addEventListener("click", () => {
    score--;
    scoreDisplay.textContent = "Pontuação: " + score;
    poop.remove();
    clickSound.play();
    messageBubble(randomItem(poopFrases));
  });

  gameArea.appendChild(poop);
  setTimeout(() => { if (poop.parentElement) poop.remove(); }, 2000);
}

function spawnSuperHeart() {
  const superHeart = document.createElement("div");
  superHeart.textContent = "💛";
  superHeart.style.position = "absolute";
  superHeart.style.fontSize = "3em";
  superHeart.style.top = Math.floor(Math.random() * 90) + "%";
  superHeart.style.left = Math.floor(Math.random() * 90) + "%";
  superHeart.style.cursor = "pointer";
  superHeart.style.zIndex = "10";
  superHeart.style.animation = "pulse 1.2s infinite";

  superHeart.addEventListener("click", () => {
    score += 5;
    scoreDisplay.textContent = "Pontuação: " + score;
    superHeart.remove();
    clickSound.play();
    messageBubble("Você ganhou 5 pontos! 🌟");
  });

  gameArea.appendChild(superHeart);
  setTimeout(() => { if (superHeart.parentElement) superHeart.remove(); }, 3000);
}

function createFloatingHeart() {
  const float = document.createElement("div");
  float.classList.add("floating-heart");
  float.style.left = Math.floor(Math.random() * 90) + "%";
  float.style.bottom = "-20px";
  gameArea.appendChild(float);
  setTimeout(() => float.remove(), 6000);
}

function messageBubble(text) {
  const bubble = document.createElement("div");
  bubble.textContent = "Thay: " + text;
  bubble.style.position = "absolute";
  bubble.style.bottom = "10px";
  bubble.style.left = "50%";
  bubble.style.transform = "translateX(-50%)";
  bubble.style.background = "rgba(255,255,255,0.8)";
  bubble.style.color = "#000";
  bubble.style.padding = "8px 14px";
  bubble.style.borderRadius = "12px";
  bubble.style.fontSize = "1em";
  bubble.style.zIndex = "999";
  gameScreen.appendChild(bubble);
  setTimeout(() => bubble.remove(), 2000);
}

function showVoice() {
  const voice = Math.random() < 0.5 ? document.getElementById("voz1") : document.getElementById("voz2");
  voice.pause();
  voice.currentTime = 0;
  voice.play();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(heartInterval);
  gameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");
  finalScoreDisplay.textContent = "Você fez " + score + " pontos!";
  loveLevel.textContent = getLoveLevel(score);
  gameArea.innerHTML = "";
  saveHighScore();
}

function getLoveLevel(score) {
  if (score < 10) return "Nível de amor: 💔 tímido ainda...";
  if (score < 20) return "Nível de amor: 💗 tá aquecendo os corações!";
  if (score < 30) return "Nível de amor: 💖 apaixonou a Thay!";
  return "Nível de amor: 💘 Thay quer casar contigo!";
}

function saveHighScore() {
  const highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    alert("Novo recorde! 🏆");
  }
}

function showHighScore() {
  const highScore = localStorage.getItem("highScore") || 0;
  alert("Recorde atual: " + highScore + " pontos! 🏅");
}

function goToMenu() {
  gameOverScreen.classList.remove("active");
  menuScreen.classList.add("active");
}

function showCredits() {
  alert("Feito com amor por Hannah 💖");
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
