const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trex = {
  x: 50,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 1.5,
  isJumping: false,
};

const trexImg = document.createElement('img');
trexImg.src = 'lola.gif';

const cactusImages = [new Image(), new Image(), new Image()];
cactusImages[0].src = 'brahma.png';
cactusImages[1].src = 'quilmes.png';
cactusImages[2].src = 'stela.png';

const cactus = {
  x: canvas.width,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  speed: 5,
  image: cactusImages[Math.floor(Math.random() * 3)],
};

let score = 0;
let gameOver = false;

let horizonHeight;
const horizonColor = 'lightgray';

// 🌥️ Nubes de fondo
const cloudImages = [new Image(), new Image()];
cloudImages[0].src = 'cloud.png';
cloudImages[1].src = 'cloud2.png';
const clouds = [];

function createCloud() {
  clouds.push({
    x: canvas.width + Math.random() * 200, // Posición inicial fuera del canvas
    y: Math.random() * canvas.height / 2, // Altura variable
    image: cloudImages[Math.floor(Math.random() * cloudImages.length)],
    speed: Math.random() * 0.5 + 0.2, // Velocidad lenta para dar efecto de fondo
    width: 50 + Math.random() * 20, // Tamaño variable
    height: 50 + Math.random() * 20
  });
}

function drawClouds() {
  clouds.forEach(cloud => {
    ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
  });
}

function updateClouds() {
  if (clouds.length < 7 && Math.random() < 0.01) {
    createCloud();
  }
  clouds.forEach((cloud, index) => {
    cloud.x -= cloud.speed;
    if (cloud.x < -cloud.width) {
      clouds.splice(index, 1);
    }
  });
}

function drawTrex() {
  ctx.drawImage(trexImg, trex.x, trex.y, trex.width, trex.height);
}

function drawCactus() {
  ctx.drawImage(cactus.image, cactus.x, cactus.y, cactus.width, cactus.height);
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
}

function drawHorizon() {
  ctx.beginPath();
  ctx.moveTo(0, horizonHeight);
  ctx.lineTo(canvas.width, horizonHeight);
  ctx.strokeStyle = horizonColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function update() {
  if (gameOver) return;

  // Movimiento del T-Rex (salto)
  if (trex.isJumping) {
    trex.y += trex.velocityY;
    trex.velocityY += trex.gravity;
    if (trex.y >= horizonHeight - trex.height) {
      trex.y = horizonHeight - trex.height;
      trex.isJumping = false;
    }
  }

  // Movimiento del cactus
  cactus.x -= cactus.speed;
  if (cactus.x < -cactus.width) {
    cactus.x = canvas.width;
    cactus.image = cactusImages[Math.floor(Math.random() * 3)];
    score++;
  }

  // Detección de colisión
  if (
    trex.x < cactus.x + cactus.width &&
    trex.x + trex.width > cactus.x &&
    trex.y < cactus.y + cactus.height &&
    trex.y + trex.height > cactus.y
  ) {
    gameOver = true;
  }

  updateClouds(); // ✅ Actualiza las nubes
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds(); // ✅ Dibuja las nubes de fondo
  drawHorizon();
  drawTrex();
  drawCactus();
  drawScore();
  if (gameOver) drawGameOver();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// 🏃‍♂️ Evento de salto (teclado)
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !trex.isJumping && !gameOver) {
    trex.isJumping = true;
    trex.velocityY = -25;
  }
});

// 📱 Evento de salto (pantalla táctil)
canvas.addEventListener('touchstart', () => {
  if (!trex.isJumping && !gameOver) {
    trex.isJumping = true;
    trex.velocityY = -25;
  }
});

// 🚀 Cargar imágenes y comenzar el juego
Promise.all(
  [...cactusImages, ...cloudImages].map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  )
).then(() => {
  horizonHeight = trex.y + trex.height;
  // Generar nubes iniciales
  for (let i = 0; i < 5; i++) createCloud();
  gameLoop();
});
