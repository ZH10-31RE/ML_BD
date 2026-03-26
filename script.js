const game = document.getElementById("game");
const gameWidth = game.clientWidth;
const gameHeight = game.clientHeight;
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const missDisplay = document.getElementById("miss");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closePopupBtn = document.getElementById("close-popup");

const moods = {
  normal: "data/normal.jpg",
  happy: "data/happy.jpg",
  sad: "data/sad.jpg"
};

const itemTypes = [
  "data/thing1.jpg",
  "data/thing2.jpg",
  "data/thing3.jpg",
  "data/thing4.jpg",
  "data/thing5.png"
];

let playerX = gameWidth / 2 - player.offsetWidth / 2;
let score = 0;
let miss = 0;
let fallingItems = [];
let moodTimeout = null;
let winShown = false;

function setMood(mood) {
  player.src = moods[mood];
}

function showMoodTemporarily(mood) {
  clearTimeout(moodTimeout);
  setMood(mood);

  moodTimeout = setTimeout(() => {
    setMood("normal");
  }, 400);
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove("hidden");
}

closePopupBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
})

function createItem() {
  const item = document.createElement("img");
  item.classList.add("falling");

  const imageSrc = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  item.src = imageSrc;

  const x = Math.random() * (game.clientWidth - 55);
  item.style.left = x + "px";
  item.style.top = "0px";

  game.appendChild(item);

  fallingItems.push({
    el: item,
    x: x,
    y: 60,
    speed: 0.7 + Math.random() * 0.8
  });
}

function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function updateItems() {
  const playerRect = player.getBoundingClientRect();

  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += item.speed;
    item.el.style.top = item.y + "px";

    const itemRect = item.el.getBoundingClientRect();

    if (isColliding(playerRect, itemRect)) {
      item.el.remove();
      fallingItems.splice(i, 1);
      score++;
      scoreDisplay.textContent = `Caught: ${score}`;
      showMoodTemporarily("happy");
      if (score === 9 && !winShown) {
        winShown = true;
        showPopup("恭喜聪明的吗冷成功击败了世界上99.9%的玩家，这里是第二关：qccyb://yq04313.prcqdk.rx/wrqjxhj/");
      }
      continue;
    }

    const itemHeight = item.el.offsetHeight;

    if (item.y + item.el.offsetHeight >= game.clientHeight) {
      item.el.remove();
      fallingItems.splice(i, 1);
      miss++;
      missDisplay.textContent = `Miss: ${miss}`;
      showMoodTemporarily("sad");
    }
  }
}

function gameLoop() {
  updatePlayerMovement();
  updateItems();
  requestAnimationFrame(gameLoop);
}

const keys = {
  left: false,
  right: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    keys.left = true;
  } else if (e.key === "ArrowRight") {
    keys.right = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    keys.left = false;
  } else if (e.key === "ArrowRight") {
    keys.right = false;
  }
});

function updatePlayerMovement() {
  const moveSpeed = 5;

  if (keys.left) {
    playerX -= moveSpeed;
  }
  if (keys.right) {
    playerX += moveSpeed;
  }

  if (playerX < 0) playerX = 0;
  if (playerX > game.clientWidth - player.offsetWidth) {
    playerX = game.clientWidth - player.offsetWidth;
  }

  player.style.left = playerX + "px";
}

setMood("normal");
setInterval(createItem, 3000);
gameLoop();
