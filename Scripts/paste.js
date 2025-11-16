window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    canvasSize = resizeCanvas();
    
    // DO NOT TOUCH MAP SIZE
    camera.canvasWidth = canvasSize.width;
    camera.canvasHeight = canvasSize.height;
    
    controller.x = 230;
    controller.y = canvasSize.height;
    
    // reset camera transform only
    camera.x = Math.max(0, Math.min(player.x - camera.canvasWidth / 2, worldWidth - camera.canvasWidth));
    camera.y = Math.max(0, Math.min(player.y - camera.canvasHeight / 2, worldHeight - camera.canvasHeight));
  }, 300);
});