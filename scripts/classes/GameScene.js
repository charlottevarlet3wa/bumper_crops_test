import StaticPlatform from "./StaticPlatform.js";
import ControllablePlatform from "./ControllablePlatform.js";
import Ball from "./Ball.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.balls = [];
    this.score = 0;
    this.acceptedTypes = { left: "apple", right: "raspberry" }; // Types acceptés par chaque panier
    this.spawnPaused = false; // Contrôle pour interrompre temporairement la génération de balles
  }

  preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("apple", "assets/images/apple.png");
    this.load.image("raspberry", "assets/images/raspberry.png");
    this.load.image("staticPlatform", "assets/images/platformRedLong.png");
    this.load.image("controllablePlatform", "assets/images/platformBlue.png");
  }

  create() {
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

    // Texte de code PHP au centre
    this.phpCodeText = this.add
      .text(
        400,
        50,
        "$fruit = 'apple';\n$$fruit = 'raspberry';\n$$$fruit = 'apple';",
        {
          fontSize: "24px",
          fill: "#FFF",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Texte dynamique pour les paniers
    this.leftBasketText = this.add.text(100, 540, "$fruit", {
      fontSize: "24px",
      fill: "#FFF",
    });
    this.rightBasketText = this.add.text(700, 540, "$$fruit", {
      fontSize: "24px",
      fill: "#FFF",
    });

    // Création des paniers de détection en bas de l'écran
    this.createDetectionZones();

    // Minuterie pour alterner les types de fruits acceptés toutes les 10 secondes
    this.time.addEvent({
      delay: 10000, // 10 secondes
      callback: this.manageBasketAndSpawn,
      callbackScope: this,
      loop: true,
    });

    // Minuterie pour générer une balle toutes les deux secondes
    this.time.addEvent({
      delay: 2000, // Délai de 2 secondes
      callback: this.spawnBall,
      callbackScope: this,
      loop: true, // Répéter l'événement indéfiniment
    });

    // Affichage du score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFF",
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

  createDetectionZones() {
    this.appleZone = this.matter.add.rectangle(100, 580, 200, 20, {
      isStatic: true,
    });
    this.raspberryZone = this.matter.add.rectangle(700, 580, 200, 20, {
      isStatic: true,
    });
  }

  manageBasketAndSpawn() {
    console.log(this.balls);
    // Interrompt le spawn de balles
    this.spawnPaused = true;

    // Attendre que toutes les balles soient triées
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.balls.length === 0) {
          // Change le type de fruits acceptés une fois toutes les balles triées
          this.alternateBasketTypes();

          // Attendre 2 secondes après le changement pour reprendre le spawn
          this.time.delayedCall(2000, () => {
            this.spawnPaused = false;
          });
        } else {
          console.log("manage again");
          // Si toutes les balles ne sont pas encore triées, vérifier à nouveau dans 100ms
          this.manageBasketAndSpawn();
        }
      },
      callbackScope: this,
    });
  }

  alternateBasketTypes() {
    // Alterne les types de fruits acceptés
    if (this.acceptedTypes.left === "apple") {
      this.acceptedTypes.left = "raspberry";
      this.acceptedTypes.right = "apple";
      this.leftBasketText.setText("$$$fruit");
      this.rightBasketText.setText("$fruit (for 'raspberry')");
    } else {
      this.acceptedTypes.left = "apple";
      this.acceptedTypes.right = "raspberry";
      this.leftBasketText.setText("$fruit (for 'apple')");
      this.rightBasketText.setText("$$fruit");
    }

    // Interrompt temporairement le spawn de balles pendant 1 seconde
    this.spawnPaused = true;
    this.time.delayedCall(5000, () => {
      this.spawnPaused = false;
    });
  }

  spawnBall() {
    if (this.spawnPaused) return; // Arrête le spawn si la génération est temporairement en pause

    const isApple = Math.random() < 0.5;
    const x = isApple ? 50 : 450;
    const type = isApple ? "apple" : "raspberry";
    const ball = new Ball(this, x, 50, type);
    ball.direction = isApple ? -1 : 1;
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
          ball.destroy(); // Supprime la balle
          this.balls.splice(index, 1); // Retire la balle de l'array
        }

        if (
          (pair.bodyA === ball.sprite.body &&
            pair.bodyB === this.raspberryZone) ||
          (pair.bodyB === ball.sprite.body && pair.bodyA === this.raspberryZone)
        ) {
          this.updateScore(ball.type === this.acceptedTypes.right ? 1 : -1);
          ball.destroy();
          this.balls.splice(index, 1); // Retire la balle de l'array
        }
      });
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }
}
