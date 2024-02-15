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
      this.game.switchScene(new this.game.choose(this.game));
    });
    // 分数前图标
    this.scoreImage = new Image();
    this.scoreImage.src = 'image/uparrow.png'
    // 初始化分数
    this.score = 0;
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
      downRank: 1, //下滑系数
    };
    // 木板集合
    this.boardsLeft = [
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 500, width: 11, height: 200, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 - 100, y: this.canvas.height - 800, width: 9, height: 120, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 - 60, y: this.canvas.height - 1100, width: 8, height: 80, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 - 120, y: this.canvas.height - 1600, width: 13, height: 150, type: 'ice', smooth: 6},
      {x: this.canvas.width / 2 - 90, y: this.canvas.height - 2000, width: 12, height: 250, type: 'metal', smooth: 0}
    ];
    this.boardsRight = [
      {x: this.canvas.width / 2 + 80, y: this.canvas.height - 350, width: 9, height: 100, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 600, width: 12, height: 180, type: 'ice', smooth: 6},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 900, width: 13, height: 150, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1300, width: 12, height: 90, type: 'wood', smooth: 1},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1700, width: 10, height: 220, type: 'wood', smooth: 1}
    ]
    this.boards = this.boardsLeft.concat(this.boardsRight)
    // 木板图片
    this.ivyImage = new Image();
    this.ivyImage.src = 'image/ivy.png';
    // 冰棒图片
    this.iceImage = new Image();
    this.iceImage.src = 'image/ice.png';
    // 钢铁图片
    this.metalImage = new Image();
    this.metalImage.src = 'image/endflag.png';
    // 云朵图片
    this.cloudImage = new Image();
    this.cloudImage.src = 'image/cloud.png';
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
    let count = Math.floor(groundY / this.canvas.height) + 1;
    if (count >= 1) {
      if (this.backgroundMirrorImage.complete) {
        this.context.drawImage(this.backgroundMirrorImage, 0, -this.canvas.height * (count - 1) + groundY, this.canvas.width, this.canvas.height);
      }
      if (this.backgroundMirrorImage.complete) {
        this.context.drawImage(this.backgroundMirrorImage, 0, -this.canvas.height * count + groundY, this.canvas.width, this.canvas.height);
      }
    }
    // 增加黑色遮罩
    this.context.fillStyle = `#ffffff66`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height + groundY);
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
  // 绘制分数
  drawScore() {
    const iconSize = 32; // 图标大小
    const iconPadding = 10; // 图标与分数之间的间距
    // 计算分数文本的宽度
    this.context.font = '24px Arial'; // 确保设置的字体与绘制时相同
    const textWidth = this.context.measureText(this.score).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20; // 分数的y坐标
    // 绘制图标
    if (this.scoreImage.complete) {
      this.context.drawImage(this.scoreImage, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.fillStyle = 'black';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score, scoreX, scoreY);
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
      for (const board of this.boardsRight) {
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
          let getIndex = this.boardsRight.indexOf(board);
          if (this.score < 2 * (getIndex + 1) - 1){
            this.score = 2 * (getIndex + 1) - 1
          }
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
      for (const board of this.boardsLeft) {
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
          let getIndex = this.boardsLeft.indexOf(board);
          if (this.score < 2 * (getIndex + 1)){
            this.score = 2 * (getIndex + 1)
          }
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
    // 判断是否到达终点
    if (this.ninja.downRank == 0){
      this.isGameOver = true;
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
      if (board.type == 'wood') {
        this.context.drawImage(this.ivyImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'ice') {
        this.context.drawImage(this.iceImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'metal') {
        this.context.drawImage(this.metalImage, board.x, board.y + groundY, board.width, board.height);
      }
    }
  }
  // 绘制云朵
  drawCloud() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.cloudImage.complete) {
      const cloudSpeed = 1; // 云朵的移动速度
      const cloudOffset = (Date.now() / 1000) * cloudSpeed; // 根据时间计算云朵的偏移量
      const cloudX = cloudOffset % this.canvas.width; // 根据偏移量计算云朵的当前 X 坐标
      this.context.drawImage(this.cloudImage, cloudX, 0 + groundY, this.cloudImage.width, this.cloudImage.height);
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制分数
    this.drawScore();
    // 绘制忍者
    this.drawNinja();
    // 绘制木板
    this.drawBoard();
    // 绘制云朵
    this.drawCloud();
  }
  update() {
    if (!this.isGameOver) {
      this.updateNinja();
    }else{
      this.context.font = '16px Arial';
      if (this.ninja.downRank == 0) {
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonNextInfo = drawIconButton(this.context, "前往下关", this.canvas.width / 2, this.canvas.height / 2 + 110);
      } else {
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2);
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
    this.score = 0;
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