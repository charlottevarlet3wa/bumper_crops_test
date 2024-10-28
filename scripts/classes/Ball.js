export default class Ball {
  constructor(scene, x, y, texture) {
    // Création de la balle dans Matter.js avec rebond et friction
    this.sprite = scene.matter.add.image(x, y, texture, null, {
      restitution: 0.5, // Coefficient de rebond
    });

    this.sprite.setCircle(); // Donne une forme de cercle à la balle
    this.sprite.setFriction(0.005, 0.005, 0.005); // Réduit la friction pour que la balle glisse
    this.sprite.setBounce(0.5); // Ajuste le rebond de la balle
  }
}
