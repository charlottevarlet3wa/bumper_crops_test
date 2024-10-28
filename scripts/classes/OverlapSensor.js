export default class OverlapSensor {
  constructor(scene, platform) {
    this.scene = scene;
    this.platform = platform;
    this.sensor = scene.matter.add.rectangle(
      platform.sprite.x,
      //   platform.sprite.y - platform.sprite.height / 2 - 10, // Position au-dessus de la plateforme
      platform.sprite.y - platform.sprite.height + 10, // Position au-dessus de la plateforme
      platform.sprite.width,
      10, // Hauteur du capteur
      { isSensor: true, isStatic: true } // Capteur statique et sensoriel
    );

    // Synchronise l'angle et la position du capteur avec la plateforme
    this.sensor.angle = platform.sprite.angle;
  }

  // Détection de collision avec la balle
  checkOverlap(ball) {
    const { x, y } = ball.sprite;
    const sensorBounds = this.sensor.bounds;

    return (
      x > sensorBounds.min.x &&
      x < sensorBounds.max.x &&
      y > sensorBounds.min.y &&
      y < sensorBounds.max.y
    );
  }
}
