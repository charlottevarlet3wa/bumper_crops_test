export default class StaticPlatform {
  constructor(scene, x, y, texture, angle) {
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      isStatic: true, // La plateforme est fixe et n'incline pas
    });
    this.sprite.setAngle(angle); // Change l'angle visuel de la plateforme
    this.sprite.setRotation(Phaser.Math.DegToRad(angle)); // Ajuste également l'angle pour la physique
  }
}
