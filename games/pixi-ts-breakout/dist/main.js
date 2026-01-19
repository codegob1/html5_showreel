"use strict";
/// <reference types="pixi.js" />
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x202020
});
document.body.appendChild(app.view);
/* --------------------
   Constants
-------------------- */
const BALL_RADIUS = 8;
const START_SPEED = 1;
const SPEED_INCREMENT = 0.1;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 14;
const BLOCK_ROWS = 5;
const BLOCK_COLS = 8;
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 20;
const BLOCK_PADDING = 10;
const TOP_OFFSET = 60;
const START_LIVES = 3;
/* --------------------
   Game State
-------------------- */
let vx = 0;
let vy = 0;
let lives = START_LIVES;
let blocks = [];
let gameActive = true;
/* --------------------
   Paddle
-------------------- */
const paddle = new PIXI.Graphics();
paddle.beginFill(0xffffff);
paddle.drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
paddle.endFill();
app.stage.addChild(paddle);
/* --------------------
   Ball
-------------------- */
const ball = new PIXI.Graphics();
ball.beginFill(0xff5252);
ball.drawCircle(0, 0, BALL_RADIUS);
ball.endFill();
app.stage.addChild(ball);
/* --------------------
   UI Text
-------------------- */
const messageText = new PIXI.Text("", {
    fill: 0xffffff,
    fontSize: 48,
    align: "center"
});
messageText.anchor.set(0.5);
messageText.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(messageText);
const livesText = new PIXI.Text("", {
    fill: 0xffffff,
    fontSize: 18
});
livesText.position.set(10, 10);
app.stage.addChild(livesText);
/* --------------------
   Setup / Reset
-------------------- */
function resetBall() {
    ball.x = app.screen.width / 2;
    ball.y = app.screen.height / 2;
    vx = START_SPEED;
    vy = -START_SPEED;
}
function createBlocks() {
    blocks.forEach(b => app.stage.removeChild(b));
    blocks = [];
    for (let row = 0; row < BLOCK_ROWS; row++) {
        for (let col = 0; col < BLOCK_COLS; col++) {
            const block = new PIXI.Graphics();
            block.beginFill(0x4caf50);
            block.drawRect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
            block.endFill();
            block.x = col * (BLOCK_WIDTH + BLOCK_PADDING) + 35;
            block.y = row * (BLOCK_HEIGHT + BLOCK_PADDING) + TOP_OFFSET;
            blocks.push(block);
            app.stage.addChild(block);
        }
    }
}
function startGame() {
    lives = START_LIVES;
    gameActive = true;
    messageText.text = "";
    paddle.x = (app.screen.width - PADDLE_WIDTH) / 2;
    paddle.y = app.screen.height - 40;
    resetBall();
    createBlocks();
}
/* --------------------
   Input
-------------------- */
window.addEventListener("mousemove", e => {
    const rect = app.view.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddle.x = mouseX - PADDLE_WIDTH / 2;
    paddle.x = Math.max(0, Math.min(app.screen.width - PADDLE_WIDTH, paddle.x));
});
window.addEventListener("mousedown", () => {
    if (!gameActive) {
        startGame();
    }
});
/* --------------------
   Game Loop
-------------------- */
app.ticker.add(() => {
    livesText.text = `Lives: ${lives}`;
    if (!gameActive)
        return;
    ball.x += vx;
    ball.y += vy;
    /* Wall collisions */
    if (ball.x <= BALL_RADIUS || ball.x >= app.screen.width - BALL_RADIUS) {
        vx *= -1;
    }
    if (ball.y <= BALL_RADIUS) {
        vy *= -1;
    }
    /* Paddle collision */
    if (ball.y + BALL_RADIUS >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + PADDLE_WIDTH &&
        vy > 0) {
        vy *= -1;
        ball.y = paddle.y - BALL_RADIUS;
    }
    /* Block collisions */
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (ball.x >= block.x &&
            ball.x <= block.x + BLOCK_WIDTH &&
            ball.y - BALL_RADIUS <= block.y + BLOCK_HEIGHT &&
            ball.y + BALL_RADIUS >= block.y) {
            vy *= -1;
            app.stage.removeChild(block);
            blocks.splice(i, 1);
            // speed up slightly
            vx += vx > 0 ? SPEED_INCREMENT : -SPEED_INCREMENT;
            vy += vy > 0 ? SPEED_INCREMENT : -SPEED_INCREMENT;
            break;
        }
    }
    /* Ball lost */
    if (ball.y > app.screen.height) {
        lives--;
        if (lives <= 0) {
            gameActive = false;
            messageText.text = "GAME OVER\nClick to Restart";
        }
        else {
            resetBall();
        }
    }
    /* Win condition */
    if (blocks.length === 0) {
        gameActive = false;
        messageText.text = "YOU WIN!\nClick to Restart";
    }
});
/* --------------------
   Start
-------------------- */
startGame();
