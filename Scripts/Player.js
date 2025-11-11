class Player {
  constructor(x,y,dy,dx,img){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.img = img;
    this.width = 20;
    this.height = 20;
    this.frameIndex = 0;
    this.scale = 7;
    this.ismoving = false;
    this.frameSpeed = 8;
    this.frameTimer = 0;
    this.isFacing = "right";
  }
  
  drawFrame(ct,delta){
    this.frameTimer += delta;
    
    if (this.frameTimer > (1 / this.frameSpeed)) {
      this.frameIndex++;
      this.frameTimer = 0;
    }
    let sy, maxFrames;
    if (this.ismoving) {
      sy = 41;
      maxFrames = 6;
    } else {
      sy = 21;
      maxFrames = 4;
    }
    
    if (this.frameIndex >= maxFrames) this.frameIndex = 0;
    ct.save();
    if (this.isFacing === "left") {
    ct.translate(this.x + this.width * this.scale, this.y);
    ct.scale(-1,1);
    ct.drawImage(this.img,this.frameIndex * this.width,sy,this.width, this.height,0,0, this.width * this.scale, this.height * this.scale);
    }else{
      ct.drawImage(this.img,this.frameIndex * this.width,sy,this.width, this.height,this.x,this.y, this.width * this.scale, this.height * this.scale);
    }
    ct.restore();
  }
}
export { Player };