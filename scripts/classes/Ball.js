export default class Ball {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      restitution: 0, // Désactiver le rebond automatique
    });

    this.sprite.setCircle(); // Forme circulaire pour les collisions
    this.sprite.setFriction(0.005); // Friction faible par défaut pour glisser
    this.velocityY = -10; // Vélocité initiale pour le rebond vertical
    this.velocityX = 0; // Vélocité horizontale initiale
    this.isBouncing = false;
    this.bounciness = 1;
    this.direction = -1;
  }

  setFriction(value) {
    this.sprite.setFriction(value); // Appliquer la friction directement sur le sprite
  }

  //   applyCustomBounce(direction) {
  //     // `direction` indique si la plateforme est inclinée à gauche (-1) ou à droite (1)
  //     if (!this.isBouncing) {
  //       this.velocityX = 5 * direction; // Ajuster la vélocité horizontale en fonction de la direction
  //       this.sprite.setVelocity(this.velocityX, this.velocityY); // Appliquer les vitesses X et Y
  //       this.isBouncing = true;
  //     }
  //   }
  applyCustomBounce(directionMultiplier) {
    if (!this.isBouncing) {
      this.velocityX = 5 * directionMultiplier; // Ajuster la vélocité en fonction de la direction
      this.sprite.setVelocity(this.velocityX, this.velocityY);
      this.isBouncing = true;
    }
  }

  update() {
    // Réduire la vélocité progressivement pour simuler un amortissement
    if (this.isBouncing) {
      this.velocityY += 0.3; // Réduit la vélocité verticale à chaque frame
      this.velocityX *= 0.98; // Amortir progressivement la vélocité horizontale
      if (this.velocityY > 0) {
        this.velocityY = 0;
        this.isBouncing = false;
      }
      this.sprite.setVelocity(this.velocityX, this.velocityY); // Appliquer la vélocité amortie
    }
  }
}
