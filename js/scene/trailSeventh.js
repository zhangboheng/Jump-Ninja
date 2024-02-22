import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
import {
  showBoxMessage
} from '../../utils/dialog';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
const soundManager = new SoundManager();
const backgroundMusic = new BackgroundMusic();
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Scene1 {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 加载背景音乐
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.playBackgroundMusic();
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    // 加载背景图片
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/houseback.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.isGameOver = true;
      this.game.switchScene(new this.game.choose(this.game));
    });
    this.groundImage = new Image();
    this.groundImage.src = 'image/tatami.jpg';
    // 加载成功图片
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png'
    // 加载失败图片
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png'
    // 加载循环标志图片
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png'
    // 添加忍者对象
    this.ninja = {
      x: this.canvas.width / 2 - 46.5, // 初始 x 位置
      y: this.canvas.height - 270, // 初始 y 位置
      stopPoint: 0, // 停歇位置
      velocityX: 0, // 水平速度
      velocityY: 0, // 垂直速度
      gravity: 0.4, // 重力加速度
      fly: false, // 空中飞行状态
      default: true, // 开局初始状态
      isGround: true, // 是否在地面
      toLeft: false, // 是否向左跳
      toRight: false, // 是否向右跳
      downRank: 1, //下滑系数
    };
    // 是否显示循环
    this.showCycle = false;
    // 木板集合
    this.boardsLeft = [{
      x: this.canvas.width / 2 - 90,
      y: this.canvas.height - 650,
      width: 12,
      height: 100,
      type: 'ice',
      smooth: 0,
      isShow: true,
      showCycle: false,
    }, {
      x: this.canvas.width / 2 - 60,
      y: this.canvas.height - 800,
      width: 12,
      height: 250,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }, {
      x: this.canvas.width / 2 - 70,
      y: this.canvas.height - 800,
      width: 12,
      height: 250,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }, {
      x: this.canvas.width / 2 - 80,
      y: this.canvas.height - 800,
      width: 12,
      height: 380,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }];
    this.boardsRight = [{
      x: this.canvas.width / 2 + 110,
      y: this.canvas.height - 500,
      width: 15,
      height: 120,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: false,
    }, {
      x: this.canvas.width / 2 + 100,
      y: this.canvas.height - 700,
      width: 10,
      height: 150,
      type: 'wood',
      smooth: 1,
      isShow: true,
      showCycle: true,
    }]
    this.boards = this.boardsLeft.concat(this.boardsRight)
    // 木板图片
    this.ivyImage = new Image();
    this.ivyImage.src = 'image/ivy.png';
    // 冰棒图片
    this.iceImage = new Image();
    this.iceImage.src = 'image/ice.png';
    // 玻璃图片
    this.glassImage = new Image();
    this.glassImage.src = 'image/glass.png';
    // 终点图片
    this.endImage = new Image();
    this.endImage.src = 'image/goal.png';
    // 在地面上角色图片集合
    this.ninjaImages = [];
    for (let i = 0; i <= 4; i++) {
      const img = new Image();
      img.src = `image/role-0${i+1}.png`;
      this.ninjaImages.push(img);
    }
    this.currentNinjaFrame = 0;
    // 在空中及悬崖右侧角色图片集合
    this.ninjaRightImages = [];
    for (let i = 0; i <= 3; i++) {
      const img = new Image();
      img.src = `image/role-jump0${i+1}.png`;
      this.ninjaRightImages.push(img);
    }
    this.currentNinjaRightFrame = 0;
    // 在空中及悬崖左侧角色图片集合
    this.ninjaLeftImages = [];
    for (let i = 0; i <= 3; i++) {
      const img = new Image();
      img.src = `image/role-jumpmirror0${i+1}.png`;
      this.ninjaLeftImages.push(img);
    }
    this.currentNinjaLeftFrame = 0;
    // 跳下去的时候图片
    this.ninjaJumpImage = new Image();
    this.ninjaJumpImage.src = 'image/role-jumpdown.png';
    this.ninjaJumpMirrorImage = new Image();
    this.ninjaJumpMirrorImage.src = 'image/role-jumpdownmirror.png';
    this.isJumpDown = false;
    // 检查是否成功抓住木板
    this.isBoardCaught = false;
    // 添加长按状态相关属性
    this.shortPressTimer = null; // 用于储存短按定时器
    this.isShortPress = false; // 标记是否处于短按状态
    this.longPressTimer = null; // 用于存储长按定时器
    this.isLongPress = false; // 标记是否处于长按状态
    this.touchStartTime = 0; // 记录触摸开始时间戳
    // 添加触摸事件监听
    wx.onTouchStart(this.touchStartHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
    // 开局显示提示消息时间
    this.displayMessageTime = 1;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonNextInfo = "";
    // 跟踪忍者踩到的右位置
    this.rightTrack = "";
    // 跟踪忍者踩到的左位置
    this.leftTrack = "";
    // 游戏结束判断标准
    this.isGameOver = false;
    // 是否重新开始
    this.isRestart = false;
  }
  // 绘制背景图片
  drawBackground() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0 + groundY, this.canvas.width, this.canvas.height);
    }
    // 增加黑色遮罩
    this.context.fillStyle = `#ffffff66`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height + groundY);
    if (this.groundImage.complete) {
      this.context.drawImage(this.groundImage, 0, this.canvas.height - 200 + groundY, this.canvas.width, 200);
    }
  }
  // 绘制终点图标
  drawGoal() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.endImage.complete) {
      this.context.drawImage(this.endImage, this.canvas.width / 2 - 95, this.canvas.height - 650 - this.endImage.height + groundY, this.endImage.width, this.endImage.height);
    }
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    this.context.font = '16px Arial';
    if (this.displayMessageTime > 0) {
      showBoxMessage(this.context, '试炼 - 07', this.canvas.width / 2, this.canvas.height / 2);
      setTimeout(() => {
        this.displayMessageTime--
      }, 500);
    }
  }
  // 绘制循环标志
  drawCycleLogo() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.showCycle) {
      if (this.cycleImage.complete) {
        this.context.drawImage(this.cycleImage, this.canvas.width / 2, this.canvas.height - 700 + groundY, this.cycleImage.width, this.cycleImage.height);
      }
    }
  }
  // 绘制忍者
  drawNinja() {
    let ninjaImg;
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.ninja.isGround) {
      ninjaImg = this.ninjaImages[this.currentNinjaFrame]
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y)
      }
    }
    if (this.ninja.toRight) {
      ninjaImg = this.ninjaRightImages[this.currentNinjaRightFrame];
      if (this.isJumpDown) {
        ninjaImg = this.ninjaJumpImage
      }
      if (this.isBoardCaught) {
        ninjaImg = this.ninjaRightImages[3];
      }
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y + groundY)
      }
    }
    if (this.ninja.toLeft) {
      ninjaImg = this.ninjaLeftImages[this.currentNinjaLeftFrame]
      if (this.isJumpDown) {
        ninjaImg = this.ninjaJumpMirrorImage
      }
      if (this.isBoardCaught) {
        ninjaImg = this.ninjaLeftImages[3];
      }
      if (ninjaImg.complete) {
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y + groundY)
      }
    }
  }
  // 更新忍者状态
  updateNinja() {
    // 在地面上的状态
    if (this.isLongPress && this.ninja.isGround) {
      this.currentNinjaFrame++;
      if (this.currentNinjaFrame >= 4) {
        this.currentNinjaFrame = 4
      }
    }
    // 向右跳的状态
    if (this.ninja.toRight) {
      let previousVelocityY;
      this.currentNinjaRightFrame++;
      // 更新忍者状态
      if (this.currentNinjaRightFrame >= 3) {
        this.currentNinjaRightFrame = 3
      }
      // 抓到木板执行逻辑
      if (!this.isBoardCaught && this.ninja.stopPoint == 0) {
        // 计算水平速度的变化
        this.ninja.x += this.ninja.velocityX;
        this.ninja.velocityX += 0.1;
        // 计算垂直速度的变化，模拟抛物线
        previousVelocityY = this.ninja.velocityY;
        this.ninja.y -= this.ninja.velocityY;
        this.ninja.velocityY -= this.ninja.gravity;
        this.ninja.fly = true;
        this.showCycle = false;
      } else {
        this.ninja.stopPoint = this.ninja.stopPoint - 0.1 * this.ninja.downRank
        if (this.ninja.stopPoint > -0.1) {
          this.ninja.y += 0.1 * this.ninja.downRank;
          this.ninja.fly = false;
        } else {
          this.isBoardCaught = false;
          this.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boardsRight.filter(item => item.isShow)) {
        if (
          this.ninja.x + 73 <= board.x + board.width &&
          this.ninja.x + 73 >= board.x &&
          this.ninja.y + 50 <= board.y + board.height &&
          this.ninja.y + 50 >= board.y
        ) {
          this.ninja.stopPoint = board.y + board.height - 20 - this.ninja.y
          this.isBoardCaught = true;
          this.ninja.downRank = board.smooth;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          this.rightTrack = board;
          this.ninja.fly = false;
          this.showCycle = board.showCycle;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
        backgroundMusic.pauseBackgroundMusic();
        soundManager.play('lose');
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.isJumpDown = true;
      }
    }
    // 向左跳的状态
    if (this.ninja.toLeft) {
      let previousVelocityY;
      this.currentNinjaLeftFrame++;
      // 更新忍者状态
      if (this.currentNinjaLeftFrame >= 3) {
        this.currentNinjaLeftFrame = 3
      }
      // 抓到木板执行逻辑
      if (!this.isBoardCaught && this.ninja.stopPoint == 0) {
        // 计算水平速度的变化
        this.ninja.x -= this.ninja.velocityX;
        this.ninja.velocityX += 0.1;
        // 计算垂直速度的变化，模拟抛物线
        previousVelocityY = this.ninja.velocityY;
        this.ninja.y -= this.ninja.velocityY;
        this.ninja.velocityY -= this.ninja.gravity;
        this.ninja.fly = true;
        this.showCycle = false;
      } else {
        this.ninja.stopPoint = this.ninja.stopPoint - 0.1 * this.ninja.downRank
        if (this.ninja.stopPoint > -0.1) {
          this.ninja.y += 0.1 * this.ninja.downRank;
          this.ninja.fly = false;
        } else {
          this.isBoardCaught = false;
          this.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boardsLeft.filter(item => item.isShow)) {
        if (
          this.ninja.x + 23 >= board.x &&
          this.ninja.x + 23 <= board.x + board.width &&
          this.ninja.y + 50 >= board.y &&
          this.ninja.y + 50 <= board.y + board.height
        ) {
          this.ninja.stopPoint = board.y + board.height - 20 - this.ninja.y
          this.isBoardCaught = true;
          this.ninja.downRank = board.smooth;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          this.leftTrack = board;
          this.ninja.fly = false;
          this.showCycle = board.showCycle;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
        backgroundMusic.pauseBackgroundMusic();
        soundManager.play('lose');
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.isJumpDown = true;
      }
    }
    // 判断是否到达终点
    if (this.ninja.downRank == 0) {
      this.isGameOver = true;
      backgroundMusic.pauseBackgroundMusic();
      soundManager.play('win');
    }
  }
  // 绘制木板
  drawBoard() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    for (const board of this.boards.filter(item => item.isShow)) {
      if (board.type == 'wood') {
        this.context.drawImage(this.ivyImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'ice') {
        this.context.drawImage(this.iceImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'glass') {
        this.context.drawImage(this.glassImage, board.x, board.y + groundY, board.width, board.height);
      }
    }
  }
  // 更新木板
  updateBoard() {
    //更新踩到木板的位置
    if (this.ninja.fly) {
      this.boardsLeft = this.boardsLeft.map(item => {
        if (item == this.leftTrack && item.type == 'glass') {
          const processedBoard = {
            ...item
          }; // 创建一个副本，以免修改原始对象
          processedBoard.isShow = false;
          return processedBoard;
        } else {
          return item
        }
      });
      this.boardsRight = this.boardsRight.map(item => {
        if (item == this.rightTrack && item.type == 'glass') {
          const processedBoard = {
            ...item
          }; // 创建一个副本，以免修改原始对象
          processedBoard.isShow = false;
          return processedBoard;
        } else {
          return item
        }
      });
      this.boards = this.boardsLeft.concat(this.boardsRight)
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
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
    // 绘制循环标志
    this.drawCycleLogo()
  }
  update() {
    if (!this.isGameOver) {
      this.updateNinja();
      this.updateBoard();
    } else {
      this.context.font = '16px Arial';
      if (this.ninja.downRank == 0) {
        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width) / 2, (this.canvas.height - this.successTipsImage.height) / 2 - this.successTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonNextInfo = drawIconButton(this.context, "前往下关", this.canvas.width / 2, this.canvas.height / 2 + 110);
        const getTrailGame = wx.getStorageSync('trailNumber')
        if (getTrailGame < 7){
          wx.setStorageSync('trailNumber', 7)
        }
      } else {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width) / 2, (this.canvas.height - this.failTipsImage.height) / 2 - this.failTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonNextInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110);
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
      btn.onClick();
      backgroundMusic.pauseBackgroundMusic();
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
        if (this.ninja.downRank == 0) {
          this.game.switchScene(new this.game.traileighth(this.game));
        } else {
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
    const touch = e.touches[0];
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
      this.ninja.velocityY = pressDuration * 0.002; // 短按时垂直速度较小
    }
    if (this.isLongPress) {
      this.ninja.velocityY = pressDuration * 0.01; // 长按时垂直速度较大
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
    this.isBoardCaught = false;
    this.isJumpDown = false;
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
    this.ninja = {
      x: this.canvas.width / 2 - 46.5, // 初始 x 位置
      y: this.canvas.height - 270, // 初始 y 位置
      stopPoint: 0, // 停歇位置
      velocityX: 0, // 水平速度
      velocityY: 0, // 垂直速度
      gravity: 0.4, // 重力加速度
      fly: false, // 空中飞行状态
      default: true, // 开局初始状态
      isGround: true, // 是否在地面
      toLeft: false, // 是否向左跳
      toRight: false, // 是否向右跳
      downRank: 1, //下滑系数
    };
    // 是否显示循环
    this.showCycle = false;
    // 木板集合
    this.boardsLeft = [{
      x: this.canvas.width / 2 - 90,
      y: this.canvas.height - 650,
      width: 12,
      height: 100,
      type: 'ice',
      smooth: 0,
      isShow: true,
      showCycle: false,
    }, {
      x: this.canvas.width / 2 - 60,
      y: this.canvas.height - 800,
      width: 12,
      height: 250,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }, {
      x: this.canvas.width / 2 - 70,
      y: this.canvas.height - 800,
      width: 12,
      height: 250,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }, {
      x: this.canvas.width / 2 - 80,
      y: this.canvas.height - 800,
      width: 12,
      height: 380,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: true,
    }];
    this.boardsRight = [{
      x: this.canvas.width / 2 + 110,
      y: this.canvas.height - 500,
      width: 15,
      height: 120,
      type: 'glass',
      smooth: 6,
      isShow: true,
      showCycle: false,
    }, {
      x: this.canvas.width / 2 + 100,
      y: this.canvas.height - 700,
      width: 10,
      height: 150,
      type: 'wood',
      smooth: 1,
      isShow: true,
      showCycle: true,
    }]
    this.boards = this.boardsLeft.concat(this.boardsRight)
    backgroundMusic.playBackgroundMusic();
    this.currentNinjaFrame = 0;
    this.currentNinjaRightFrame = 0;
    this.currentNinjaLeftFrame = 0;
    this.isJumpDown = false;
    // 检查是否成功抓住木板
    this.isBoardCaught = false;
    // 添加长按状态相关属性
    this.shortPressTimer = null; // 用于储存短按定时器
    this.isShortPress = false; // 标记是否处于短按状态
    this.longPressTimer = null; // 用于存储长按定时器
    this.isLongPress = false; // 标记是否处于长按状态
    this.touchStartTime = 0; // 记录触摸开始时间戳
    // 开局显示提示消息时间
    this.displayMessageTime = 1;
    // 跟踪忍者踩到的右位置
    this.rightTrack = "";
    // 跟踪忍者踩到的左位置
    this.leftTrack = "";
    // 游戏结束判断标准
    this.isGameOver = false;
    // 游戏重启
    this.isRestart = true;
  }
  // 页面销毁机制
  destroy() {
    // 移除触摸事件监听器
    wx.offTouchStart(this.touchStartHandler.bind(this));
    wx.offTouchEnd(this.touchEndHandler.bind(this));
    // 清理资源，如图片
    this.backgroundImage.src = '';
    this.backButton.image.src = '';
    this.groundImage.src = '';
    this.successTipsImage.src = '';
    this.failTipsImage.src = '';
    this.cycleImage.src = '';
    this.ivyImage.src = '';
    this.iceImage.src = '';
    this.glassImage.src = '';
    this.endImage.src = '';
    this.ninjaJumpImage.src = '';
    this.ninjaJumpMirrorImage.src = '';
    this.ninjaImages = [];
    this.ninjaRightImages = [];
    this.ninjaLeftImages = [];
  }
}