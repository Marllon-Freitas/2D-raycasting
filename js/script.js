import { createBoundary, createPlayer } from './gameObjects.js';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;


let gameState = {
  player: createPlayer(ctx),
  speed: 7,
  walls: [],
  acceleration: 2,
  velocity: { x: 0, y: 0 },
  keys: {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowLeft: false,
    ArrowRight: false
  }
};

function handleKeyDown(e) {
  if (gameState.keys.hasOwnProperty(e.key)) {
    gameState.keys[e.key] = true;
  }
}

function handleKeyUp(e) {
  if (gameState.keys.hasOwnProperty(e.key)) {
    gameState.keys[e.key] = false;
  }
}

function init() {
  canvas.width = width;
  canvas.height = height;

  gameState.walls.push(createBoundary(0, 0, width, 0, ctx));
  gameState.walls.push(createBoundary(width, 0, width, height, ctx));
  gameState.walls.push(createBoundary(width, height, 0, height, ctx));
  gameState.walls.push(createBoundary(0, height, 0, 0, ctx));

  gameState.walls.push(createBoundary(100, 100, 200, 100, ctx));
  gameState.walls.push(createBoundary(200, 100, 200, 200, ctx));
  gameState.walls.push(createBoundary(200, 200, 100, 200, ctx));
  gameState.walls.push(createBoundary(100, 200, 100, 100, ctx));

  gameState.walls.push(createBoundary(300, 300, 400, 300, ctx));
  gameState.walls.push(createBoundary(400, 300, 400, 400, ctx));
  gameState.walls.push(createBoundary(400, 400, 300, 400, ctx));
  gameState.walls.push(createBoundary(300, 400, 300, 300, ctx));

  gameState.walls.push(createBoundary(500, 500, 600, 500, ctx));
  gameState.walls.push(createBoundary(600, 500, 600, 600, ctx));
  gameState.walls.push(createBoundary(600, 600, 500, 600, ctx));
  gameState.walls.push(createBoundary(500, 600, 500, 500, ctx));

  gameState.walls.push(createBoundary(700, 700, 800, 700, ctx));
  gameState.walls.push(createBoundary(800, 700, 800, 800, ctx));
  gameState.walls.push(createBoundary(800, 800, 700, 800, ctx));
  gameState.walls.push(createBoundary(700, 800, 700, 700, ctx));

  gameState.walls.push(createBoundary(900, 900, 1000, 900, ctx));
  gameState.walls.push(createBoundary(1000, 900, 1000, 1000, ctx));
  gameState.walls.push(createBoundary(1000, 1000, 900, 1000, ctx));
  gameState.walls.push(createBoundary(900, 1000, 900, 900, ctx));

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  setInterval(mainLoop, 1000/60);
}

function mainLoop() {
  if (gameState.keys.w) gameState.velocity.y -= gameState.acceleration;
  if (gameState.keys.a) gameState.velocity.x -= gameState.acceleration;
  if (gameState.keys.s) gameState.velocity.y += gameState.acceleration;
  if (gameState.keys.d) gameState.velocity.x += gameState.acceleration;
  if (gameState.keys.ArrowLeft) gameState.player.rotate(-0.03);
  if (gameState.keys.ArrowRight) gameState.player.rotate(0.03);

  gameState.velocity.x = Math.max(Math.min(gameState.velocity.x, gameState.speed), -gameState.speed);
  gameState.velocity.y = Math.max(Math.min(gameState.velocity.y, gameState.speed), -gameState.speed);

  let newX = gameState.player.pos.x + gameState.velocity.x;
  let newY = gameState.player.pos.y + gameState.velocity.y;

  if (newX >= 0 && newX <= width) {
    gameState.player.pos.x = newX;
  }

  if (newY >= 0 && newY <= height) {
    gameState.player.pos.y = newY;
  }

  gameState.velocity.x *= 0.5;
  gameState.velocity.y *= 0.5;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(-gameState.player.pos.x + width / 2, -gameState.player.pos.y + height / 2);
  gameState.player.draw();
  gameState.player.look(gameState.walls);
  for (let wall of gameState.walls) {
    wall.draw();
  }

  ctx.restore();
}

init();