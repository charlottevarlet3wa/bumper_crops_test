import StaticPlatform from "./StaticPlatform.js";
import ControllablePlatform from "./ControllablePlatform.js";
import Ball from "./Ball.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Chargement des assets
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("staticPlatform", "assets/images/platformRedLong.png");
    this.load.image("controllablePlatform", "assets/images/platformBlue.png");
  }

  create() {
    // Création de la plateforme statique pour les fruits
    this.staticPlatform = new StaticPlatform(
      this,
      120,
      100,
      "staticPlatform",
      20
    );
    this.staticPlatform = new StaticPlatform(
      this,
      600,
      100,
      "staticPlatform",
      -20
    );

    // Création de la plateforme contrôlée par les touches du clavier
    this.controllablePlatform = new ControllablePlatform(
      this,
      400,
      500,
      "controllablePlatform",
      -20
    );

    // Création de la balle ou du fruit
    this.ball = new Ball(this, 100, 50, "ball");
    this.ball = new Ball(this, 600, 50, "ball");

    // Configuration des touches pour ajuster l'angle de la plateforme contrôlée
    this.input.keyboard.on("keydown-S", () =>
      this.controllablePlatform.setAngle(-20)
    );
    this.input.keyboard.on("keydown-D", () =>
      this.controllablePlatform.setAngle(20)
    );
  }

  update() {
    // Logique supplémentaire si nécessaire
  }
}
