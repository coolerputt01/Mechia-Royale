function getCanvasPos(touchEvent,dc) {
  const rect = dc.getBoundingClientRect();
  return {
    x: (touchEvent.clientX - rect.left) * (dc.width / rect.width),
    y: (touchEvent.clientY - rect.top) * (dc.height / rect.height)
  };
}

class Controller {
  constructor(x,y,pad,nub){
    this.x = x;
    this.y = y;
    this.pad = pad;
    this.nub = nub;
    this.active = false;
    this.touchId = null;
    this.maxDistance = 250;
    this.nubX = this.x;
    this.nubY = this.y;
    this.moveX = 0;
    this.moveY = 0;
  }
  
  draw(ct) {
    const padHalfW = 350 / 2;
    const padHalfH = 350 / 2;
    const nubHalfW = 250 / 2;
    const nubHalfH = 250 / 2;

    ct.drawImage(this.pad, this.x - padHalfW, this.y - padHalfH, 350, 350);
    ct.drawImage(this.nub, this.nubX - nubHalfW, this.nubY - nubHalfH, 250, 250);
  }
  onTouchStart(touchEvent,dc){
    let pos = getCanvasPos(touchEvent,dc);
    const dx = pos.x - this.x;
    const dy = pos.y - this.y;
    console.log("Touch at:", pos.x, pos.y, "Pad center:", this.x, this.y);
    if (Math.sqrt(dx * dx + dy * dy) <= this.maxDistance) {
      this.active = true;
      this.touchId = touchEvent.identifier;
      this.updateNub(pos.x, pos.y);
    }
  }
  
  onTouchMove(touchEvent,dc) {
    if (this.active && touchEvent.identifier === this.touchId) {
      let pos = getCanvasPos(touchEvent,dc);
      this.updateNub(pos.x,pos.y);
    }
  }
  
  onTouchEnd(touchEvent) {
    if (this.active && touchEvent.identifier === this.touchId) {
      this.active = false;
      this.touchId = null;
      this.nubX = this.x;
      this.nubY = this.y;
    }
  }
  
  updateNub(clientX, clientY) {
    const dx = clientX - this.x;
    const dy = clientY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const clamped = Math.min(distance, this.maxDistance);
    
    this.nubX = this.x + Math.cos(angle) * clamped;
    this.nubY = this.y + Math.sin(angle) * clamped;
    this.moveX = Math.cos(angle) * (clamped / this.maxDistance);
    this.moveY = Math.sin(angle) * (clamped / this.maxDistance);
    return { dx: this.moveX, dy: this.moveY };
  }
}

export { Controller };