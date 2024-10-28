import StaticPlatform from "./StaticPlatform.js";
import ControllablePlatform from "./ControllablePlatform.js";
import Ball from "./Ball.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.balls = [];
  }

  preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("staticPlatform", "assets/images/platformRedLong.png");
    this.load.image("controllablePlatform", "assets/images/platformBlue.png");
  }

  create() {
    // Création de plateformes statiques
    this.staticPlatform1 = new StaticPlatform(
      this,
      120,
      100,
      "staticPlatform",
      20
    );
    this.staticPlatform2 = new StaticPlatform(
      this,
      600,
      100,
      "staticPlatform",
      -20
    );

    // Création de plateformes contrôlées
    this.controllablePlatform = new ControllablePlatform(
      this,
      350,
      500,
      "controllablePlatform",
      -20
    );

    // Création de plusieurs balles
    // this.spawnBall();
    // this.spawnBall();
    // this.spawnBall();

    // Minuterie pour générer une balle toutes les deux secondes
    this.time.addEvent({
      delay: 2000, // Délai de 2 secondes
      callback: this.spawnBall,
      callbackScope: this,
      loop: true, // Répéter l'événement indéfiniment
    });

    // Configuration des touches pour ajuster l'angle de la plateforme contrôlée
    this.input.keyboard.on("keydown-S", () =>
      this.controllablePlatform.setDirection("left")
    );
    this.input.keyboard.on("keydown-D", () =>
      this.controllablePlatform.setDirection("right")
    );

    // Configuration des collisions
    this.matter.world.on("collisionstart", (event) =>
      this.handleCollision(event)
    );
  }

  spawnBall() {
    const x = Math.random() < 0.5 ? 50 : 450;
    const ball = new Ball(this, x, 50, "ball");
    this.balls.push(ball);
  }

  handleCollision(event) {
    event.pairs.forEach((pair) => {
      this.balls.forEach((ball) => {
        if (
          (pair.bodyA === ball.sprite.body &&
            pair.bodyB === this.staticPlatform1.sprite.body) ||
          (pair.bodyB === ball.sprite.body &&
            pair.bodyA === this.staticPlatform1.sprite.body) ||
          (pair.bodyA === ball.sprite.body &&
            pair.bodyB === this.staticPlatform2.sprite.body) ||
          (pair.bodyB === ball.sprite.body &&
            pair.bodyA === this.staticPlatform2.sprite.body)
        ) {
          ball.setFriction(0.005);
        }
        if (
          (pair.bodyA === ball.sprite.body &&
            pair.bodyB === this.controllablePlatform.sprite.body) ||
          (pair.bodyB === ball.sprite.body &&
            pair.bodyA === this.controllablePlatform.sprite.body)
        ) {
          const directionMultiplier =
            this.controllablePlatform.direction === "left" ? -1 : 1;
          ball.applyCustomBounce(directionMultiplier);
        }
      });
    });
  }
}
