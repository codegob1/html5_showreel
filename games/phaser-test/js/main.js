const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#202020",
  scene: {
    preload,
    create
  }
};

const game = new Phaser.Game(config);

function preload() {
  // No assets needed for placeholder
}

function create() {
  // Card rectangle
  const card = this.add.rectangle(400, 300, 120, 180, 0x4a90e2);
  card.setStrokeStyle(4, 0xffffff);
  card.setInteractive({ draggable: true });

  // Label
  const label = this.add.text(0, 0, "CARD", {
    fontFamily: "Arial",
    fontSize: "24px",
    color: "#ffffff"
  });
  label.setOrigin(0.5);

  Phaser.Display.Align.In.Center(label, card);

  // Drag logic
  this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
    label.x = dragX;
    label.y = dragY;
  });
}
