class Gun {
  constructor(gun){
    this.isShooting = false;
    this.gun = gun;
    this.bobTimer = 0;
  }
  draw(ct,player,delta) {
    let offsetY = 0;
    
    if (!player.ismoving) {
      this.bobTimer += delta;
      offsetY = Math.sin(this.bobTimer * 10) * 5; 
    } else {
      this.bobTimer = 0;
    }
    ct.save();
    if (player.isFacing === "left"){
      ct.translate(player.x + player.width * player.scale, player.y);
      ct.scale(-1, 1);
      ct.drawImage(this.gun, 0 + 75, 35 + offsetY, 150, 75);
    } else {
      ct.drawImage(this.gun, player.x + 75, player.y + 35 + offsetY, 150, 75);
    }
    ct.restore();
  }
}

export { Gun };