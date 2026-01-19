const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x202020
});

document.body.appendChild(app.view);

// Create ball
const ballRadius = 15;
const ball = new PIXI.Graphics();

ball.beginFill(0xff4d4d);
ball.drawCircle(0, 0, ballRadius);
ball.endFill();

ball.x = app.screen.width / 2;
ball.y = app.screen.height / 2;

app.stage.addChild(ball);

// Velocity
let vx = 4;
let vy = 3;

// Game loop
app.ticker.add(() => {
  ball.x += vx;
  ball.y += vy;

  // Bounce left/right
  if (ball.x <= ballRadius || ball.x >= app.screen.width - ballRadius) {
    vx *= -1;
  }

  // Bounce top/bottom
  if (ball.y <= ballRadius || ball.y >= app.screen.height - ballRadius) {
    vy *= -1;
  }
});
