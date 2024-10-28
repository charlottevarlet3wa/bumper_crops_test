export default class StaticPlatform {
  constructor(scene, x, y, texture, angle) {
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      isStatic: true, // La plateforme est fixe
    });
    this.sprite.setAngle(angle); // Inclinaison de la plateforme pour que les balles glissent
  }
}
