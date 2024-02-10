import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
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
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    this.backgroundMirrorImage = new Image();
    this.backgroundMirrorImage.src = 'image/backgroundmirror.jpg'
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    this.groundImage = new Image();
    this.groundImage.src = 'image/yard.jpg';
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
    };
    // 木板集合
    this.boards = [{
        x: this.canvas.width / 2 - 80,
        y: this.canvas.height - 500,
        width: 10,
        height: 150
      },
      {
        x: this.canvas.width / 2 + 80,
        y: this.canvas.height - 350,
        width: 10,
        height: 100
      },
      {
        x: this.canvas.width / 2 + 90,
        y: this.canvas.height - 600,
        width: 10,
        height: 180
      }
    ];
    // 木板图片
    this.ivyImage = new Image();
    this.ivyImage.src = 'image/ivy.png'
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
    wx.onTouchMove(this.touchMoveHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
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
    if (this.backgroundMirrorImage.complete) {
      this.context.drawImage(this.backgroundMirrorImage, 0, -this.canvas.height + groundY, this.canvas.width, this.canvas.height);
    }
    if (this.groundImage.complete) {
      this.context.drawImage(this.groundImage, 0, this.canvas.height - 200 + groundY, this.canvas.width, 200);
    }
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制忍者
  drawNinja() {
    let ninjaImg;
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
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y)
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
        this.context.drawImage(ninjaImg, this.ninja.x, this.ninja.y)
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
      let groundY = 0;
      if (this.ninja.y < this.canvas.height - 270) {
        groundY = this.canvas.height - 270 - this.ninja.y
      } else {
        groundY = 0;
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
      } else {
        this.ninja.stopPoint = this.ninja.stopPoint - 0.1
        if (this.ninja.stopPoint + groundY > -0.1) {
          this.ninja.y += 0.1;
          this.ninja.fly = false;
        } else {
          this.isBoardCaught = false;
          this.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boards.slice(1)) {
        if (
          this.ninja.x + 73 <= board.x + board.width &&
          this.ninja.x + 73 >= board.x &&
          this.ninja.y + 60 <= board.y + board.height + groundY &&
          this.ninja.y + 60 >= board.y + groundY
        ) {
          this.ninja.stopPoint = board.y + board.height - 20 - this.ninja.y
          this.isBoardCaught = true;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
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
      let groundY = 0;
      if (this.ninja.y < this.canvas.height - 270) {
        groundY = this.canvas.height - 270 - this.ninja.y
      } else {
        groundY = 0;
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
      } else {
        this.ninja.stopPoint = this.ninja.stopPoint - 0.1
        if (this.ninja.stopPoint + groundY > -0.1) {
          this.ninja.y += 0.1;
          this.ninja.fly = false;
        } else {
          this.isBoardCaught = false;
          this.isJumpDown = true;
          this.ninja.fly = true;
          this.ninja.stopPoint = 0;
        }
      }
      // 是否抓住木板
      for (const board of this.boards.slice(0, 1)) {
        if (
          this.ninja.x + 23 >= board.x &&
          this.ninja.x + 23 <= board.x + board.width &&
          this.ninja.y + 50 >= board.y + groundY &&
          this.ninja.y + 50 <= board.y + board.height + groundY
        ) {
          this.ninja.stopPoint = board.y + board.height - 20 - this.ninja.y
          this.isBoardCaught = true;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          break;
        }
      }
      // 如果没有抓住木板，游戏结束
      if (!this.isBoardCaught && this.ninja.y > this.canvas.height) {
        this.isGameOver = true;
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.isJumpDown = true;
      }
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
    for (const board of this.boards) {
      this.context.drawImage(this.ivyImage, board.x, board.y + groundY, board.width, board.height);
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
  }
  update() {
    if (!this.isGameOver) {
      this.updateNinja();
    }else{
      this.context.font = '16px Arial';
      this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2);
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
      return
    }
    // 游戏结束后重新开始
    if (this.isGameOver) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        this.resetGame();
      }
    }
  }
  // 本局触摸点击事件
  touchStartHandler(e) {
    if (this.isRestart) {
      return;
    }
    if (this.isGameOver || this.ninja.fly) {
      return;
    }
    const touch = e.touches[0];
    this.ninja.default = false;
    // 记录触摸开始时间戳
    this.touchStartTime = Date.now();
    // 处理触摸开始事件
    this.startLongPressTimer();
  }
  // 本局触摸移动事件
  touchMoveHandler(e) {
    if (this.isRestart) {
      return;
    }
    if (this.isGameOver || this.ninja.fly) {
      return;
    }
    this.clearLongPressTimer();
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
    this.isBoardCaught = false;
    this.isJumpDown = false;
    this.ninja.stopPoint = 0;
    this.clearLongPressTimer();
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
  resetGame(){
    this.ninja = {
      x: this.canvas.width / 2 - 46.5, // 初始 x 位置
      y: this.canvas.height - 270, // 初始 y 位置
      stopPoint: 0, // 停歇位置
      velocityX: 0, // 水平速度
      velocityY: 0, // 垂直速度
      gravity: 0.4, // 重力加速度
      fly: false, // 空中飞行状态
      default: false, // 开局初始状态
      isGround: true, // 是否在地面
      toLeft: false, // 是否向左跳
      toRight: false, // 是否向右跳
    };
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
    // 游戏结束判断标准
    this.isGameOver = false;
    // 游戏重启
    this.isRestart = true;
  }
}