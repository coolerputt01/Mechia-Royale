class Camera{
  constructor(x,y,canvasWidth,canvasHeight,worldWidth,worldHeight){
    this.x = x;
    this.y = y;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.marginX = canvasWidth * 0.01; 
    this.marginY = canvasHeight * 0.1; 
  }
  
  followPlayer(player,scale) {
    const leftEdge = this.x + this.marginX;
    const rightEdge = this.x + this.canvasWidth/0.5 - this.marginX;
    const topEdge = this.y + this.marginY;
    const bottomEdge = this.y + this.canvasHeight - this.marginY;
    
    if (player.x < leftEdge) this.x = player.x - this.marginX;
    else if (player.x + player.width > rightEdge) {this.x = player.x - this.canvasWidth/0.5 + this.marginX;}
    
    if (player.y < topEdge) this.y = player.y - this.marginY;
    else if (player.y + player.height > bottomEdge) this.y = player.y - this.canvasHeight + this.marginY;
    
    this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.canvasWidth));
    this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.canvasHeight));
    
  }
    drawDeadzone(ct, zoom = 1) {
    ct.save();
    ct.setTransform(zoom, 0, 0, zoom, -this.x * zoom, -this.y * zoom);
    ct.strokeStyle = 'yellow';
    ct.lineWidth = 25;
    ct.strokeRect(
    this.x + this.canvasWidth * 0.3,
    this.y + this.canvasHeight * 0.3,
    this.canvasWidth * 0.4,
    this.canvasHeight * 0.4
    );
    ct.restore();
  }
  drawWorldBorder(ct, zoom = 1) {
    ct.save();
    ct.setTransform(zoom, 0, 0, zoom, -this.x * zoom, -this.y * zoom);
    ct.strokeStyle = 'green';
    ct.lineWidth = 25;
    ct.strokeRect(0, 0, this.worldWidth, this.worldHeight);
    ct.restore();
  }
}

export { Camera };