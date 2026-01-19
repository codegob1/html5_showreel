const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view);

const text = new PIXI.Text('Hello Pixi!', { fill: 0xffffff });
text.x = app.renderer.width / 2;
text.y = app.renderer.height / 2;
text.anchor.set(0.5);

app.stage.addChild(text);
