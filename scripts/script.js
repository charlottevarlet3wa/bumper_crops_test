import GameScene from "./classes/GameScene.js";

// Configuration de base de Phaser avec Matter.js
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 },
      debug: true,
    },
  },
  scene: [GameScene], // Utilisation de GameScene
};

const game = new Phaser.Game(config);
