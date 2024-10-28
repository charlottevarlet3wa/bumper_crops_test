import OverlapSensor from "./OverlapSensor.js";

export default class ControllablePlatform {
  constructor(scene, x, y, texture, initialAngle) {
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      isStatic: true,
      angle: Phaser.Math.DegToRad(initialAngle),
    });
    this.direction = "left";
    this.sensor = new OverlapSensor(scene, this); // Associer le capteur

    this.updateSensorPosition();
  }

  setAngle(angle) {
    this.sprite.setAngle(angle);
    this.sprite.setRotation(Phaser.Math.DegToRad(angle));
    this.updateSensorPosition(); // Mettre à jour le capteur
  }

  setDirection(direction) {
    if (direction === "left") {
      this.setAngle(-20);
      this.direction = "left";
    } else if (direction === "right") {
      this.setAngle(20);
      this.direction = "right";
    }
    this.updateSensorPosition(); // Mettre à jour le capteur avec la direction
  }

  updateSensorPosition() {
    // Mettre à jour la position et l'angle du capteur en fonction de la plateforme
    this.sensor.sensor.angle = this.sprite.angle;
    this.sensor.sensor.position = {
      x: this.sprite.x,
      y: this.sprite.y - this.sprite.height / 2,
    };
  }
}
