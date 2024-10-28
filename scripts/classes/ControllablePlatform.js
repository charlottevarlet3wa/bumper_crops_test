export default class ControllablePlatform {
  constructor(scene, x, y, texture, initialAngle) {
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      isStatic: true, // La plateforme est fixe mais l'angle est ajustable
      angle: Phaser.Math.DegToRad(initialAngle),
    });
  }

  // Méthode pour ajuster dynamiquement l'angle de la plateforme contrôlée
  setAngle(angle) {
    this.sprite.setAngle(angle); // Change l'angle visuel de la plateforme
    this.sprite.setRotation(Phaser.Math.DegToRad(angle)); // Ajuste également l'angle pour la physique
  }
}
