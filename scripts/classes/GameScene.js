import StaticPlatform from "./StaticPlatform.js";
import ControllablePlatform from "./ControllablePlatform.js";
import Ball from "./Ball.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.balls = [];
    this.score = 0;
    this.currentRound = 0;
    this.spawnPaused = false;
    this.acceptedTypes = { left: "", right: "" }; // Types acceptés par chaque panier
  }

  preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("apple", "assets/images/apple.png");
    this.load.image("raspberry", "assets/images/raspberry.png");
    this.load.image("banana", "assets/images/banana.png");
    this.load.image("kiwi", "assets/images/kiwi.png");
    this.load.image("staticPlatform", "assets/images/platformRedLong.png");
    this.load.image("controllablePlatform", "assets/images/platformBlue.png");

    // Charger le fichier JSON avec les paramètres
    this.load.json("parameters", "assets/parameters.json");
  }

  create() {
    // Charger les données JSON
    this.parameters = this.cache.json.get("parameters");

    // Création de plateformes statiques
    this.staticPlatform1 = new StaticPlatform(
      this,
      125,
      100,
      "staticPlatform",
      20
    );
    this.staticPlatform2 = new StaticPlatform(
      this,
      650,
      100,
      "staticPlatform",
      -20
    );

    // Création de plateformes contrôlées
    this.controllablePlatform = new ControllablePlatform(
      this,
      400,
      500,
      "controllablePlatform",
      -20
    );

    // Création des paniers de détection en bas de l'écran
    this.createDetectionZones();

    // Minuterie pour gérer le spawn et les changements de round toutes les 10 secondes
    this.time.addEvent({
      delay: 10000,
      callback: this.manageBasketAndSpawn,
      callbackScope: this,
      loop: true,
    });

    // Minuterie pour générer une balle toutes les deux secondes
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true,
    });

    // Affichage du score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFF",
    });

    // Texte dynamique pour les paniers
    this.leftBasketText = this.add.text(100, 540, "$fruit", {
      fontSize: "24px",
      fill: "#FFF",
    });
    this.rightBasketText = this.add.text(700, 540, "$$fruit", {
      fontSize: "24px",
      fill: "#FFF",
    });
    // Initialisation du round
    this.startRound();

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

  createDetectionZones() {
    this.appleZone = this.matter.add.rectangle(100, 580, 200, 20, {
      isStatic: true,
    });
    this.raspberryZone = this.matter.add.rectangle(700, 580, 200, 20, {
      isStatic: true,
    });
  }

  startRound() {
    this.currentRound = (this.currentRound + 1) % this.parameters.length;
    // Récupère les données du round actuel
    const roundData = this.parameters[this.currentRound];

    // Mettre à jour le code PHP central
    if (this.phpCodeText) this.phpCodeText.destroy();
    this.phpCodeText = this.add
      .text(400, 50, roundData.php, {
        fontSize: "24px",
        fill: "#FFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Assigner les types de fruits acceptés par les paniers
    this.acceptedTypes.left = roundData.types[0];
    this.acceptedTypes.right = roundData.types[1];

    // Sélectionner un texte aléatoire pour chaque panier
    this.leftBasketText.setText(
      Phaser.Utils.Array.GetRandom(roundData[this.acceptedTypes.left])
    );
    this.rightBasketText.setText(
      Phaser.Utils.Array.GetRandom(roundData[this.acceptedTypes.right])
    );

    // Incrémenter le round pour le suivant
  }

  manageBasketAndSpawn() {
    // Interrompt le spawn de balles
    this.spawnPaused = true;

    this.startRound();

    this.spawnPaused = false;

    // Attendre que toutes les balles soient triées
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.balls.length === 0) {
          // Démarre un nouveau round une fois toutes les balles triées
          // this.startRound();

          // Attendre 2 secondes après le changement pour reprendre le spawn
          this.time.delayedCall(2000, () => {
            this.spawnPaused = false;
          });
        }
      },
      callbackScope: this,
      repeat: -1,
    });
  }

  spawnBall() {
    if (this.spawnPaused) return;

    const roundData = this.parameters[this.currentRound];

    const type = Phaser.Utils.Array.GetRandom(roundData.types);
    const x = type === this.acceptedTypes.left ? 50 : 450;
    const ball = new Ball(this, x, 50, type);
    ball.direction = type === this.acceptedTypes.left ? -1 : 1;
    this.balls.push(ball);
  }

  handleCollision(event) {
    event.pairs.forEach((pair) => {
      this.balls.forEach((ball, index) => {
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

        // Collision avec la plateforme contrôlée
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

        // Collision avec les zones de détection (paniers)
        if (
          (pair.bodyA === ball.sprite.body && pair.bodyB === this.appleZone) ||
          (pair.bodyB === ball.sprite.body && pair.bodyA === this.appleZone)
        ) {
          this.updateScore(ball.type === this.acceptedTypes.left ? 1 : -1);
          ball.destroy();
          this.balls.splice(index, 1);
        }

        if (
          (pair.bodyA === ball.sprite.body &&
            pair.bodyB === this.raspberryZone) ||
          (pair.bodyB === ball.sprite.body && pair.bodyA === this.raspberryZone)
        ) {
          this.updateScore(ball.type === this.acceptedTypes.right ? 1 : -1);
          ball.destroy();
          this.balls.splice(index, 1);
        }
      });
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }
}
