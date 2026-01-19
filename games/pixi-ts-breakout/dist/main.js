"use strict";
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x202020
});
document.body.appendChild(app.view);
/* Constants */
const BALL_RADIUS = 8;
const BALL_SPEED = 5;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 14;
const BLOCK_ROWS = 5;
const BLOCK_COLS = 8;
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 20;
const BLOCK_PADDING = 10;
const TOP_OFFSET = 60;
/* Paddle */
const paddle = new PIXI.Graphics();
paddle.beginFill(0xffffff);
paddle.drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
paddle.endFill();
paddle.x = (app.screen.width - PADDLE_WIDTH) / 2;
paddle.y = app.screen.height - 40;
app.stage.addChild(paddle);
/* Ball */
const ball = new PIXI.Graphics();
ball.beginFill(0xff5252);
ball.drawCircle(0, 0, BALL_RADIUS);
ball.endFill();
ball.x = app.screen.width / 2;
ball.y = app.screen.height / 2;
app.stage.addChild(ball);
let vx = BALL_SPEED;
let vy = -BALL_SPEED;
/* Blocks */
const blocks = [];
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
/* Input */
window.addEventListener("mousemove", (e) => {
    const rect = app.view.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddle.x = mouseX - PADDLE_WIDTH / 2;
    paddle.x = Math.max(0, Math.min(app.screen.width - PADDLE_WIDTH, paddle.x));
});
/* Game Loop */
app.ticker.add(() => {
    ball.x += vx;
    ball.y += vy;
    if (ball.x <= BALL_RADIUS || ball.x >= app.screen.width - BALL_RADIUS) {
        vx *= -1;
    }
    if (ball.y <= BALL_RADIUS) {
        vy *= -1;
    }
    if (ball.y + BALL_RADIUS >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + PADDLE_WIDTH) {
        vy *= -1;
        ball.y = paddle.y - BALL_RADIUS;
    }
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (ball.x >= block.x &&
            ball.x <= block.x + BLOCK_WIDTH &&
            ball.y - BALL_RADIUS <= block.y + BLOCK_HEIGHT &&
            ball.y + BALL_RADIUS >= block.y) {
            vy *= -1;
            app.stage.removeChild(block);
            blocks.splice(i, 1);
            break;
        }
    }
    if (ball.y > app.screen.height) {
        ball.x = app.screen.width / 2;
        ball.y = app.screen.height / 2;
        vy = -BALL_SPEED;
    }
});
