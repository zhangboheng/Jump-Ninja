import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
import {
  showBoxMessage
} from '../../utils/dialog';
import { menuButtonInfo, backgroundMusic, soundManager, scaleX, scaleY } from '../../utils/global';
export default class TrailSecond {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/back.mp3');
    backgroundMusic.playBackgroundMusic();
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    /* 加载音乐音效管理器结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/houseback.jpg';
    this.backButton = '';
    this.groundImage = new Image();
    this.groundImage.src = 'image/tatami.jpg';
    this.ivyImage = new Image();
    this.ivyImage.src = 'image/ivy.png';
    this.endImage = new Image();
    this.endImage.src = 'image/goal.png';
    this.ninjaImages = [];
    for (let i = 0; i <= 4; i++) {
      const img = new Image();
      img.src = `image/role-0${i+1}.png`;
      this.ninjaImages.push(img);
    }
    this.ninjaRightImages = [];
    for (let i = 0; i <= 3; i++) {
      const img = new Image();
      img.src = `image/role-jump0${i+1}.png`;
      this.ninjaRightImages.push(img);
    }
    this.ninjaLeftImages = [];
    for (let i = 0; i <= 3; i++) {
      const img = new Image();
      img.src = `image/role-jumpmirror0${i+1}.png`;
      this.ninjaLeftImages.push(img);
    }
    this.ninjaJumpImage = new Image();
    this.ninjaJumpImage.src = 'image/role-jumpdown.png';
    this.ninjaJumpMirrorImage = new Image();
    this.ninjaJumpMirrorImage.src = 'image/role-jumpdownmirror.png';
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域结束 */
    /* 常量设置区域开始 */
    this.ninja = {
      x: this.canvas.width / 2 - 28 * scaleX,
      y: this.canvas.height - 200 * scaleY,
      width: 56 * scaleX,
      height: 72 * scaleY,
      stopPoint: 0, // 停歇位置
      velocityX: 0, // 水平速度
      velocityY: 0, // 垂直速度
      gravity: 0.4 * scaleY, // 重力加速度
      fly: false, // 空中飞行状态
      default: true, // 开局初始状态
      isGround: true, // 是否在地面
      toLeft: false, // 是否向左跳
      toRight: false, // 是否向右跳
      currentNinjaFrame: 0,
      currentNinjaRightFrame: 0,
      currentNinjaLeftFrame: 0,
      isJumpDown: false,
      isBoardCaught: false,
      downRank: 1,
      groundY: 0, // 视角追踪Y坐标
    };
    this.boardsLeft = [{
      x: this.canvas.width / 2 - 80 * scaleX,
      y: this.canvas.height - 350 * scaleY,
      width: 15 * scaleX,
      height: 100 * scaleY,
      type: 'wood',
      smooth: 0
    }];
    this.boardsRight = [{
      x: this.canvas.width / 2 + 80 * scaleX,
      y: this.canvas.height - 500 * scaleY,
      width: 15 * scaleX,
      height: 100 * scaleY,
      type: 'wood',
      smooth: 1
    }]
    this.boards = this.boardsLeft.concat(this.boardsRight);
    this.shortPressTimer = null; // 用于储存短按定时器
    this.isShortPress = false; // 标记是否处于短按状态
    this.longPressTimer = null; // 用于存储长按定时器
    this.isLongPress = false; // 标记是否处于长按状态
    this.touchStartTime = 0; // 记录触摸开始时间戳
    // 开局显示提示消息时间
    this.displayMessageTime = 1;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonNextInfo = "";
    // 游戏结束判断标准
    this.isGameOver = false;
    // 是否重新开始
    this.isRestart = false;
    /* 常量设置区域结束 */
    /* 事件处理监听绑定开始 */
    wx.onTouchStart(this.touchStartHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
    /* 事件处理监听绑定结束 */
  }
  // 绘制背景图片
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0 + this.ninja.groundY, this.canvas.width, this.canvas.height);
    }
    // 增加黑色遮罩
    this.context.fillStyle = `#ffffff66`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height + this.ninja.groundY);
  }
  // 绘制榻榻米
  drawTatami() {
    if (this.groundImage.complete) {
      this.context.drawImage(this.groundImage, 0, this.canvas.height - 130 * scaleY + this.ninja.groundY, this.canvas.width, 130 * scaleY);
    }
  }
  // 绘制终点图标
  drawGoal() {
    if (this.endImage.complete) {
      this.context.drawImage(this.endImage, this.canvas.width / 2 - 88 * scaleX, this.canvas.height - 350 * scaleY - this.endImage.height * scaleY + this.ninja.groundY, this.endImage.width * scaleX, this.endImage.height * scaleY);
    }
  }
  // 绘制返回按钮
  drawBack() {
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.select(this.game));
    });
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    if(this.displayMessageTime > 0) {
      showBoxMessage(this.context, '试炼 - 02', this.canvas.width / 2, this.canvas.height / 2, '#f5d659', 'black', 20 * scaleX);
      setTimeout(() => {
        this.displayMessageTime--
      }, 500);
    }
  }
  // 绘制忍者
  drawNinja() {
    let ninjaImg;
    if (this.ninja.isGround) {
      ninjaImg = this.ninjaImages[this.ninja.currentNinjaFrame]
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y, ninjaImg.width * scaleX, ninjaImg.height * scaleY)
      }
    }
    if (this.ninja.toRight) {
      ninjaImg = this.ninjaRightImages[this.ninja.currentNinjaRightFrame];
      if (this.ninja.isJumpDown) {
        ninjaImg = this.ninjaJumpImage
      }
      if (this.ninja.isBoardCaught) {
        ninjaImg = this.ninjaRightImages[3];
      }
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y + this.ninja.groundY, ninjaImg.width * scaleX, ninjaImg.height * scaleY)
      }
    }
    if (this.ninja.toLeft) {
      ninjaImg = this.ninjaLeftImages[this.ninja.currentNinjaLeftFrame]
      if (this.ninja.isJumpDown) {
        ninjaImg = this.ninjaJumpMirrorImage
      }
      if (this.ninja.isBoardCaught) {
        ninjaImg = this.ninjaLeftImages[3];
      }
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y + this.ninja.groundY, ninjaImg.width * scaleX, ninjaImg.height * scaleY)
      }
    }
  }
  // 更新忍者状态
  updateNinja() {
    // 更新 Y 视角
    if (this.ninja.y < this.canvas.height - 200 * scaleY) {
      this.ninja.groundY = this.canvas.height - 200 * scaleY - this.ninja.y
    } else {
      this.ninja.groundY = 0;
    }
    // 在地面上的状态
    if (this.isLongPress && this.ninja.isGround) {
      this.ninja.currentNinjaFrame++;
      if (this.ninja.currentNinjaFrame >= 4) {
        this.ninja.currentNinjaFrame = 4
      }
    }
    // 向右跳的状态
    if (this.ninja.toRight) {
      let previousVelocityY;
      this.ninja.currentNinjaRightFrame++;
      // 更新忍者状态
      if (this.ninja.currentNinjaRightFrame >= 3) {
        this.ninja.currentNinjaRightFrame = 3
      }
      // 抓到木板执行逻辑
      if (!this.ninja.isBoardCaught && this.ninja.stopPoint == 0) {
        // 计算水平速度的变化
        this.ninja.x += this.ninja.velocityX;
        this.ninja.velocityX += 0.1 * scaleX;
        // 计算垂直速度的变化，模拟抛物线
        previousVelocityY = this.ninja.velocityY;
        this.ninja.y -= this.ninja.velocityY;
        this.ninja.velocityY -= this.ninja.gravity;
        this.ninja.fly = true;
      } else {
        this.ninja.stopPoint -= (0.1 * scaleY) * this.ninja.downRank
        if (this.ninja.stopPoint > -0.1) {
          this.ninja.y += (0.1 * scaleY) * this.ninja.downRank;
          this.ninja.fly = false;
        } else {
          this.ninja.isBoardCaught = false;
          this.ninja.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boardsRight) {
        if (
          this.ninja.x + this.ninja.width - 5 * scaleX >= board.x &&
          this.ninja.x <= board.x + board.width &&
          this.ninja.y + this.ninja.height - 20 * scaleY >= board.y &&
          this.ninja.y + 25 * scaleY <= board.y + board.height
        ) {
          this.ninja.x = board.x - this.ninja.width + 10 * scaleX;
          this.ninja.stopPoint = board.y + board.height - this.ninja.y - 20 * scaleY;
          this.ninja.isBoardCaught = true;
          this.ninja.downRank = board.smooth;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.ninja.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
        backgroundMusic.stopBackgroundMusic();
        soundManager.play('lose');
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.ninja.isJumpDown = true;
      }
    }
    // 向左跳的状态
    if (this.ninja.toLeft) {
      let previousVelocityY;
      this.ninja.currentNinjaLeftFrame++;
      // 更新忍者状态
      if (this.ninja.currentNinjaLeftFrame >= 3) {
        this.ninja.currentNinjaLeftFrame = 3
      }
      // 抓到木板执行逻辑
      if (!this.ninja.isBoardCaught && this.ninja.stopPoint == 0) {
        // 计算水平速度的变化
        this.ninja.x -= this.ninja.velocityX;
        this.ninja.velocityX += 0.1 * scaleX;
        // 计算垂直速度的变化，模拟抛物线
        previousVelocityY = this.ninja.velocityY;
        this.ninja.y -= this.ninja.velocityY;
        this.ninja.velocityY -= this.ninja.gravity;
        this.ninja.fly = true;
      } else {
        this.ninja.stopPoint = this.ninja.stopPoint - 0.1 * this.ninja.downRank * scaleY
        if (this.ninja.stopPoint > -0.1) {
          this.ninja.y += 0.1 * this.ninja.downRank * scaleY;
          this.ninja.fly = false;
        } else {
          this.ninja.isBoardCaught = false;
          this.ninja.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boardsLeft) {
        if (
          this.ninja.x <= board.x + board.width &&
          this.ninja.x + this.ninja.width - 5 * scaleX >= board.x + board.width &&
          this.ninja.y + this.ninja.height - 20 * scaleY >= board.y &&
          this.ninja.y + 25 * scaleY <= board.y + board.height
        ) {
          this.ninja.x = board.x + board.width - 10 * scaleX;
          this.ninja.stopPoint = board.y + board.height - 20 * scaleY - this.ninja.y
          this.ninja.isBoardCaught = true;
          this.ninja.downRank = board.smooth;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.ninja.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
        backgroundMusic.stopBackgroundMusic();
        soundManager.play('lose');
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.ninja.isJumpDown = true;
      }
    }
    // 判断是否到达终点
    if (this.ninja.downRank == 0) {
      this.isGameOver = true;
      backgroundMusic.stopBackgroundMusic();
      soundManager.play('win');
    }
  }
  // 绘制木板
  drawBoard() {
    for (const board of this.boards) {
      if (board.type == 'wood') {
        this.context.drawImage(this.ivyImage, board.x, board.y + this.ninja.groundY, board.width, board.height);
      }
    }
  }
  // 绘制行为
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制榻榻米
    this.drawTatami();
    // 绘制返回按钮
    this.drawBack();
    // 绘制忍者
    this.drawNinja();
    // 绘制木板
    this.drawBoard();
    // 绘制终点
    this.drawGoal();
    // 绘制开局提示消息
    this.drawMessageBox();
  }
  // 更新行为
  update() {
    if (!this.isGameOver) {
      this.updateNinja();
    } else {
      if (this.ninja.downRank == 0) {
        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width * scaleX) / 2, (this.canvas.height - this.successTipsImage.height * scaleY) / 2 - this.successTipsImage.height * scaleY / 2, this.successTipsImage.width * scaleX, this.successTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonNextInfo = drawIconButton(this.context, "前往下关", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
        const getTrailGame = wx.getStorageSync('trailNumber')
        if (getTrailGame < 2){
          wx.setStorageSync('trailNumber', 2)
        }else{
          wx.setStorageSync('trailNumber', getTrailGame)
        }
      } else {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonNextInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      }
    }
  }
  // 通用点击事件
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
        this.isGameOver = true;
        backgroundMusic.stopBackgroundMusic();
        btn.onClick();
      return
    }
    // 游戏结束后重新开始
    if (this.isGameOver) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        this.resetGame();
      }
      if (touchX >= this.buttonNextInfo.x && touchX <= this.buttonNextInfo.x + this.buttonNextInfo.width &&
        touchY >= this.buttonNextInfo.y && touchY <= this.buttonNextInfo.y + this.buttonNextInfo.height) {
        if (this.ninja.downRank == 0){
          this.game.switchScene(new this.game.trailthird(this.game));
        }else{
          wx.shareAppMessage({
            title: '跃影忍者！太难了吧',
            imageUrl: 'image/thumbnail.jpg' // 分享图片的路径
          });
        }
      }
    }
  }
  // 本局触摸点击事件
  touchStartHandler(e) {
    if (this.isRestart) {
      return;
    }
    if (this.isGameOver) {
      return;
    }
    this.ninja.default = false;
    // 记录触摸开始时间戳
    this.touchStartTime = Date.now();
    // 处理触摸开始事件
    this.startLongPressTimer();
  }
  // 本局触摸结束事件
  touchEndHandler(e) {
    if (this.isRestart) {
      this.isRestart = false;
      return;
    }
    if (this.isGameOver || this.ninja.fly) {
      return;
    }
    // 长按情况下，根据蓄力时间设置跳跃高度和速度
    let pressDuration = Date.now() - this.touchStartTime;
    // 设置一个极限值
    if (pressDuration > 1500) {
      pressDuration = 1500;
    }
    if (this.ninja.default) {
      return;
    }
    if (this.isShortPress) {
      this.ninja.velocityY = pressDuration * 0.002 * scaleY; // 短按时垂直速度较小
    }
    if (this.isLongPress) {
      this.ninja.velocityY = pressDuration * 0.01 * scaleY; // 长按时垂直速度较大
    }
    this.ninja.isGround = false;
    this.ninja.toRight = !this.ninja.toRight;
    if (this.ninja.toRight) {
      this.ninja.toLeft = false;
    } else {
      this.ninja.toLeft = true;
    }
    this.isShortPress = false;
    this.isLongPress = false;
    this.ninja.isBoardCaught = false;
    this.ninja.isJumpDown = false;
    this.ninja.stopPoint = 0;
    this.clearLongPressTimer();
    soundManager.play('jump');
  }
  // 开始记录长按计时
  startLongPressTimer() {
    this.shortPressTimer = setTimeout(() => {
      this.isShortPress = true;
      this.isLongPress = false;
    }, 1);
    this.longPressTimer = setTimeout(() => {
      this.isShortPress = false;
      this.isLongPress = true;
    }, 500);
  }
  // 清除记录长按计时
  clearLongPressTimer() {
    clearTimeout(this.shortPressTimer);
    clearTimeout(this.longPressTimer);
  }
  resetGame() {
    backgroundMusic.playBackgroundMusic();
    this.ninja = {
      x: this.canvas.width / 2 - 28 * scaleX,
      y: this.canvas.height - 200 * scaleY,
      width: 56 * scaleX,
      height: 72 * scaleY,
      stopPoint: 0, // 停歇位置
      velocityX: 0, // 水平速度
      velocityY: 0, // 垂直速度
      gravity: 0.4 * scaleY, // 重力加速度
      fly: false, // 空中飞行状态
      default: true, // 开局初始状态
      isGround: true, // 是否在地面
      toLeft: false, // 是否向左跳
      toRight: false, // 是否向右跳
      currentNinjaFrame: 0,
      currentNinjaRightFrame: 0,
      currentNinjaLeftFrame: 0,
      isJumpDown: false,
      isBoardCaught: false,
      downRank: 1,
      groundY: 0, // 视角追踪Y坐标
    };
    this.boardsLeft = [{
      x: this.canvas.width / 2 - 80 * scaleX,
      y: this.canvas.height - 350 * scaleY,
      width: 15 * scaleX,
      height: 100 * scaleY,
      type: 'wood',
      smooth: 0
    }];
    this.boardsRight = [{
      x: this.canvas.width / 2 + 80 * scaleX,
      y: this.canvas.height - 500 * scaleY,
      width: 15 * scaleX,
      height: 100 * scaleY,
      type: 'wood',
      smooth: 1
    }]
    this.boards = this.boardsLeft.concat(this.boardsRight);
    this.shortPressTimer = null; // 用于储存短按定时器
    this.isShortPress = false; // 标记是否处于短按状态
    this.longPressTimer = null; // 用于存储长按定时器
    this.isLongPress = false; // 标记是否处于长按状态
    this.touchStartTime = 0; // 记录触摸开始时间戳
    // 开局显示提示消息时间
    this.displayMessageTime = 1;
    // 返回按钮
    this.backButton = '';
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonNextInfo = "";
    // 游戏结束判断标准
    this.isGameOver = false;
    // 是否重新开始
    this.isRestart = true;
  }
  // 页面销毁机制
  destroy() {
    wx.offTouchStart(this.touchStartHandler.bind(this));
    wx.offTouchEnd(this.touchEndHandler.bind(this));
    this.backgroundImage.src = '';
    this.backButton.image.src = '';
    this.groundImage.src = '';
    this.ivyImage.src = '';
    this.endImage.src = '';
    this.ninjaImages.forEach(img => img = null);
    this.ninjaRightImages.forEach(img => img = null);
    this.ninjaLeftImages.forEach(img => img = null);
    this.ninjaJumpImage.src = '';
    this.ninjaJumpMirrorImage.src = '';
    this.successTipsImage.src = '';
    this.failTipsImage.src = '';
  }
}