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
    // 设置提示关注
    this.showTips = wx.getStorageSync('showTips') !== false; // 如果没有设置，默认显示提示
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 绘制训练封面
    this.rectImage = new Image();
    this.rectImage.src = 'image/gameone.jpg';
    // 绘制出发封面
    this.rectImageTwo = new Image();
    this.rectImageTwo.src = 'image/gametwo.jpg';
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
    if (!this.showTips) return; // 如果用户选择不显示提示，则跳过
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
    this.context.fillText('点击加入我的小程序', rectX + rectWidth / 2, rectY + rectHeight / 2 + 2); 
  }
  // 绘制第一关
  drawGameOne() {
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectMaxWidth = 480; // 矩形的最大宽度
    const rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth); // 矩形的宽度
    const rectX = (this.canvas.width - rectWidth) / 2;;
    const rectY = this.backButton.y + this.backButton.height + rectMargin;
    const rectHeight = 190; // 根据需要调整矩形高度
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    // 在矩形中绘制图像
    const imageMargin = 10;
    const imageX = rectX + imageMargin;
    const imageY = rectY + imageMargin;
    const imageWidth = rectWidth - 2 * imageMargin;
    const imageHeight = rectHeight - 40; // 留出空间给文字，根据需要调整
    if (this.rectImage.complete) {
      this.context.drawImage(this.rectImage, imageX, imageY, imageWidth, imageHeight);
    }
    // 给图像添加黑色描边
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3; // 描边宽度，根据需要调整
    this.context.strokeRect(imageX, imageY, imageWidth, imageHeight);
    // 在图片下方绘制文字
    const text = '训练';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight - 12);
  }
  // 绘制第二关
  drawGameTwo() {
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectHeight = 190; // 根据需要调整矩形高度
    const rectMaxWidth = 480; // 矩形的最大宽度
    const rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth); // 矩形的宽度
    const rectX = (this.canvas.width - rectWidth) / 2;;
    const rectY = this.backButton.y + this.backButton.height  + rectHeight + rectMargin * 2;
    this.context.fillStyle = '#f5d659';
    this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    // 在矩形中绘制图像
    const imageMargin = 10;
    const imageX = rectX + imageMargin;
    const imageY = rectY + imageMargin;
    const imageWidth = rectWidth - 2 * imageMargin;
    const imageHeight = rectHeight - 40; // 留出空间给文字，根据需要调整
    if (this.rectImageTwo.complete) {
      this.context.drawImage(this.rectImageTwo, imageX, imageY, imageWidth, imageHeight);
    }
    // 给图像添加黑色描边
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3; // 描边宽度，根据需要调整
    this.context.strokeRect(imageX, imageY, imageWidth, imageHeight);
    // 在图片下方绘制文字
    const text = '出发';
    this.context.fillStyle = 'black';
    this.context.font = 'bold 16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, this.canvas.width / 2, rectY + rectHeight - 12);
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制加入我的小程序提示
    this.drawTips();
    // 绘制第一关
    this.drawGameOne();
    // 绘制第二关
    this.drawGameTwo();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      return
    }
    // 绘制居中的矩形
    const rectMargin = 10;
    const rectMaxWidth = 480; // 矩形的最大宽度
    this.rectWidth = Math.min(this.canvas.width - 20, rectMaxWidth);; // 矩形的宽度
    this.rectX = (this.canvas.width - this.rectWidth) / 2; // 矩形的X坐标
    this.rectY = this.backButton.y + this.backButton.height + rectMargin; // 矩形的Y坐标
    this.rectHeight = 190; // 矩形的高度
    // 检查触摸点是否在训练内
    if (touchX >= this.rectX && touchX <= this.rectX + this.rectWidth &&
      touchY >= this.rectY && touchY <= this.rectY + this.rectHeight) {
      const getTrailGame = wx.getStorageSync('trailNumber')
      if(getTrailGame == '') {
        this.game.switchScene(new this.game.trailfirst(this.game));
      }else if(getTrailGame + 1 == 2) {
        this.game.switchScene(new this.game.trailsecond(this.game));
      }else if(getTrailGame + 1 == 3) {
        this.game.switchScene(new this.game.trailthird(this.game));
      }else if(getTrailGame + 1 == 4) {
        this.game.switchScene(new this.game.trailfourth(this.game));
      }else if(getTrailGame + 1 == 5) {
        this.game.switchScene(new this.game.trailfifth(this.game));
      }else if(getTrailGame + 1 == 6) {
        this.game.switchScene(new this.game.trailsixth(this.game));
      }else if(getTrailGame + 1 == 7) {
        this.game.switchScene(new this.game.trailseventh(this.game));
      }else{
        this.game.switchScene(new this.game.traileighth(this.game));
      }
    }
    // 检查触摸点是否在出发内
    if (touchX >= this.rectX && touchX <= this.rectX + this.rectWidth &&
      touchY >= this.rectY + 200 && touchY <= this.rectY + 200 + this.rectHeight) {
      this.game.switchScene(new this.game.tutorial(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
  }
}