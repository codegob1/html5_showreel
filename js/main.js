console.log("JS running");

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

console.log("Canvas:", app.view);

const text = new PIXI.Text("Hello Pixi!", {
  fill: 0xffffff,
  fontSize: 48
});

text.anchor.set(0.5);
text.position.set(400, 300);

app.stage.addChild(text);
