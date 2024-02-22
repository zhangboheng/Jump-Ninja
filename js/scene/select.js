import {
  createBackButton,
  drawRoundedRectWithTail
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/houseback.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.choose(this.game));
    });
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 带有透明度的白色背景
    this.context.fillStyle = '#00000099';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制加入我的小程序提示
  drawTips(){
    // 提示框属性
    const rectWidth = 140;
    const rectHeight = 30;
    const borderRadius = 10;
    const tailWidth = 20; // 尾巴的宽度
    const tailHeight = 28; // 尾巴的高度
    const rectX = menuButtonInfo.right - menuButtonInfo.width - rectWidth - tailWidth;
    const rectY = menuButtonInfo.top; // 可以根据需要调整
    // 绘制半透明矩形
    this.context.fillStyle = '#f5d659'; // 增加透明度
    drawRoundedRectWithTail(this.context, rectX, rectY, rectWidth, rectHeight, borderRadius, tailWidth, tailHeight, 'right');
    this.context.fill();
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    drawRoundedRectWithTail(this.context, rectX, rectY, rectWidth, rectHeight, borderRadius, tailWidth, tailHeight);
    this.context.stroke();
    // 绘制提示文本
    this.context.fillStyle = 'black';
    this.context.font = '14px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('请选择试炼关卡', rectX + rectWidth / 2, rectY + rectHeight / 2 + 2); 
  }
  // 绘制矩形集合
  drawSquareBox() {
    const getTrailGame = wx.getStorageSync('trailNumber')
    // 定义矩形格子数量和尺寸
    const gridCount = 4; // 4x4的格子
    const gapSize = 10; // 定义格子之间的间隔大小
    const gridSize = (systemInfo.screenWidth - (gridCount + 1) * gapSize) / gridCount;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < gridCount; col++) {
        const x = col * (gridSize + gapSize) + gapSize;
        const y = row * (gridSize + gapSize) + gapSize;
        // 渲染数字
        const fontSize = gridSize / 2.5;
        const number = row * gridCount + col + 1;
        // 渲染矩形格子
        this.context.fillStyle = number <= getTrailGame + 1 ? '#f5d659' : '#e0e0e0';
        this.context.fillRect(x, y + menuButtonInfo.bottom, gridSize, gridSize);
        // 渲染描边
        this.context.strokeStyle = '#000000';
        this.context.lineWidth = 3;
        this.context.strokeRect(x - 1, y + menuButtonInfo.bottom - 1, gridSize + 2, gridSize + 2);
        this.context.fillStyle = '#000000';
        this.context.font = `${fontSize}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        // 计算数字的中心坐标
        const centerX = x + gridSize / 2;
        const centerY = y + gridSize / 2;
        this.context.fillText(number.toString().padStart(2, '0'), centerX, centerY + menuButtonInfo.bottom);
      }
    }
  }
  // 绘制行为
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制加入我的小程序提示
    this.drawTips();
    // 绘制矩形集合
    this.drawSquareBox();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    // 定义矩形格子数量和尺寸
    const gridCount = 4; // 4x4的格子
    const gapSize = 10; // 定义格子之间的间隔大小
    const gridSize = (systemInfo.screenWidth - (gridCount + 1) * gapSize) / gridCount;
    const btn = this.backButton;
    const getTrailGame = wx.getStorageSync('trailNumber')
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      return
    }
    // 点击判断哪个格子
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < gridCount; col++) {
        const startX = col * (gridSize + gapSize) + gapSize;
        const endX = startX + gridSize;
        const startY = row * (gridSize + gapSize) + gapSize;
        const endY = startY + gridSize;
        if (touchX >= startX && touchX <= endX && touchY >= startY + menuButtonInfo.bottom && touchY <= endY + menuButtonInfo.bottom) {
          // 输出当前格子的数字
          const number = row * gridCount + col + 1;
          if (number <= getTrailGame + 1){
            if (number == 1){
              this.game.switchScene(new this.game.trailfirst(this.game))
            }else if(number == 2){
              this.game.switchScene(new this.game.trailsecond(this.game))
            }else if(number == 3){
              this.game.switchScene(new this.game.trailthird(this.game))
            }else if(number == 4){
              this.game.switchScene(new this.game.trailfourth(this.game))
            }else if(number == 5){
              this.game.switchScene(new this.game.trailfifth(this.game))
            }else if(number == 6){
              this.game.switchScene(new this.game.trailsixth(this.game))
            }else if(number == 7){
              this.game.switchScene(new this.game.trailseventh(this.game))
            }else if(number == 8){
              this.game.switchScene(new this.game.traileighth(this.game))
            }
          }
          return;
        }
      }
    }    
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}