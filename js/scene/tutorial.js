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
    backgroundMusic.setBackgroundMusicSource('audio/begin.mp3');
    backgroundMusic.playBackgroundMusic();
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    this.backgroundMirrorImage = new Image();
    this.backgroundMirrorImage.src = 'image/backgroundmirror.jpg'
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.isGameOver = true;
      this.game.switchScene(new this.game.choose(this.game));
    });
    // 分数前图标
    this.scoreImage = new Image();
    this.scoreImage.src = 'image/uparrow.png'
    // 初始化分数
    this.score = 0;
    this.groundImage = new Image();
    this.groundImage.src = 'image/yard.jpg';
    // 加载成功图片
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png';
    // 加载失败图片
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    // 加载循环标志图片
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png';
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
    // 是否允许统计
    this.canCycleCount = true;
    // 统计显示数据
    this.showCycleCount = 0;
    // 跟踪循环图片位置
    this.trackCyclePosition = 0;
    // 木板集合
    this.boardsLeft = [
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 500, width: 11, height: 200, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 100, y: this.canvas.height - 800, width: 9, height: 120, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 60, y: this.canvas.height - 1100, width: 8, height: 80, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 120, y: this.canvas.height - 1600, width: 13, height: 150, type: 'ice', smooth: 6,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 90, y: this.canvas.height - 1900, width: 12, height: 100, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 2428, width: 18, height: 150, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 1, showLimit: 8, isShow: true, showLogo: true},
      {x: this.canvas.width / 2 - 108, y: this.canvas.height - 2828, width: 18, height: 125, type: 'wood', smooth: 1, showClock: false, clockLimit: 2, showLimit: 0, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 3228, width: 12, height: 150, type: 'metal', smooth: 0.01, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 90, y: this.canvas.height - 3428, width: 12, height: 166, type: 'wood', smooth: 1, showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false}
    ];
    this.boardsRight = [
      {x: this.canvas.width / 2 + 80, y: this.canvas.height - 350, width: 9, height: 100, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 600, width: 12, height: 180, type: 'ice', smooth: 8,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 900, width: 13, height: 150, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1300, width: 12, height: 90, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1700, width: 10, height: 220, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 2100, width: 10, height: 120, type: 'glass', smooth: 6,
      showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 72, y: this.canvas.height - 2000, width: 8, height: 120, type: 'glass', smooth: 6,
      showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 80, y: this.canvas.height - 2428, width: 18, height: 150, type: 'metal', smooth: 0.01, showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: true},
      {x: this.canvas.width / 2 + 108, y: this.canvas.height - 2628, width: 18, height: 175, type: 'wood', smooth: 1, showClock: false, clockLimit: 2, showLimit: 0, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 3028, width: 20, height: 150, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 3500, width: 10, height: 320, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 100, y: this.canvas.height - 3400, width: 10, height: 220, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 110, y: this.canvas.height - 3300, width: 10, height: 120, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false}
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
    // 玻璃图片
    this.glassImage = new Image();
    this.glassImage.src = 'image/glass.png';
    // 云朵图片
    this.cloudImage = new Image();
    this.cloudImage.src = 'image/cloud.png';
    // 钟表图片
    this.clockImage = new Image();
    this.clockImage.src = 'image/clock.png';
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
    // 是否显示钟表图标
    this.showClock = false;
    // 跟踪记录钟表显示位置
    this.trackClockPosition = 0;
    // 统计钟表图标出现的时间
    this.showClockTimeCount = 0;
    this.angle = 0;
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
  // 绘制消息提示
  drawMessageBox() {
    this.context.font = '16px Arial';
    if (this.displayMessageTime > 0) {
      showBoxMessage(this.context, "Let's GO!", this.canvas.width / 2, this.canvas.height / 2);
      setTimeout(() => {
        this.displayMessageTime--
      }, 500);
    }
  }
  // 绘制时钟显示
  drawClock() {
    let groundY = 0;
    if (this.ninja.y < this.canvas.height - 270) {
      groundY = this.canvas.height - 270 - this.ninja.y
    } else {
      groundY = 0;
    }
    if (this.showClock) {
      if (this.clockImage.complete) {
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.trackClockPosition + 50 + groundY);
        this.context.rotate(this.angle);
        this.context.drawImage(this.clockImage, - this.clockImage.width / 2, - this.clockImage.height / 2, this.clockImage.width, this.clockImage.height);
        this.context.restore();
        // 增加角度以实现旋转
        this.angle += 0.02;
      }
    }
  }
  // 更新钟表计时
  updateClock() {
    if (this.showClock) {
      this.showClockTimeCount = this.showClockTimeCount + 0.002
      if (this.showClockTimeCount > 2) {
        this.boardsLeft = this.boardsLeft.map((board, index) => {
          if(this.boardsLeft.indexOf(this.leftTrack) == index || index - this.boardsLeft.indexOf(this.leftTrack) >=1 && index - this.boardsLeft.indexOf(this.leftTrack) <= 3){
            const processedBoard = {
              ...board
            };
            processedBoard.clockLimit = 2;
            processedBoard.showClock = false;
            return processedBoard;
          }else{
            return board;
          }
        });
        this.boardsRight = this.boardsRight.map((board, index) => {
            if(this.boardsRight.indexOf(this.rightTrack) == index || index - this.boardsRight.indexOf(this.rightTrack) >=1 && index - this.boardsRight.indexOf(this.rightTrack) <= 3){
              const processedBoard = {
                ...board
              };
              processedBoard.clockLimit = 2;
              processedBoard.showClock = false;
              return processedBoard;
            }else{
              return board
            }
        });
        this.showClock = false;
        this.showClockTimeCount = 0;
        this.boards = this.boardsLeft.concat(this.boardsRight)
      }
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
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.trackCyclePosition + groundY);
        this.context.rotate(this.angle);
        this.context.drawImage(this.cycleImage, - this.cycleImage.width / 2, - this.cycleImage.height / 2, this.cycleImage.width, this.cycleImage.height);
        this.context.restore();
        // 增加角度以实现旋转
        this.angle += 0.02;
      }
    }
  }
  // 更新循环图标显示状态
  updateCycleLogo() {
    if (this.showCycle) {
      this.boardsLeft = this.boardsLeft.map((board, index) => {
        if(this.boardsLeft.indexOf(this.leftTrack) == index || index - this.boardsLeft.indexOf(this.leftTrack) >=1 && index - this.boardsLeft.indexOf(this.leftTrack) <= 3){
          const processedBoard = { ...board };
          processedBoard.showLimit = processedBoard.showLimit + this.showCycleCount;
          return processedBoard;
        }else{
          return board;
        }
      });
      this.boardsRight = this.boardsRight.map((board, index) => {
          if(this.boardsRight.indexOf(this.rightTrack) == index || index - this.boardsRight.indexOf(this.rightTrack) >=1 && index - this.boardsRight.indexOf(this.rightTrack) <= 3){
            const processedBoard = { ...board };
            processedBoard.showLimit = processedBoard.showLimit + this.showCycleCount;
            return processedBoard;
          }else{
            return board
          }
      });
      this.boards = this.boardsLeft.concat(this.boardsRight)
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
        this.showClock = false;
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
      for (const board of this.boardsRight.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
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
          if (board.showClock) {
            this.showClock = board.showClock;
            this.trackClockPosition = board.y
          }
          this.showCycle = board.showLogo;
          if (this.canCycleCount && this.showCycle){
            this.showCycleCount++;
            this.canCycleCount = false;
            this.trackCyclePosition = board.y;
          }
          if (!this.showCycle){
            this.showCycleCount = 0
          }
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
        this.showClock = false;
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
      for (const board of this.boardsLeft.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
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
          if (board.showClock) {
            this.showClock = board.showClock;
            this.trackClockPosition = board.y
          }
          this.showCycle = board.showLogo;
          if (this.canCycleCount && this.showCycle){
            this.showCycleCount++;
            this.canCycleCount = false;
            this.trackCyclePosition = board.y;
          }
          if (!this.showCycle){
            this.showCycleCount = 0
          }
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
        backgroundMusic.pauseBackgroundMusic();
        soundManager.play('lose');
      }
      // 判断是否达到最高点
      if (previousVelocityY > 0 && this.ninja.velocityY <= 0) {
        this.isJumpDown = true;
      }
    }
    // 判断是否到达终点
    if (this.ninja.downRank == 0){
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
    for (const board of this.boards.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
      if (board.type == 'wood') {
        this.context.drawImage(this.ivyImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'ice') {
        this.context.drawImage(this.iceImage, board.x, board.y + groundY, board.width, board.height);
      }
      if (board.type == 'metal') {
        this.context.drawImage(this.metalImage, board.x, board.y + groundY, board.width, board.height);
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
          };
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
          };
          processedBoard.isShow = false;
          return processedBoard;
        } else {
          return item
        }
      });
      this.boards = this.boardsLeft.concat(this.boardsRight)
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
    // 绘制开局提示消息
    this.drawMessageBox();
    // 绘制时钟显示
    this.drawClock();
    // 绘制循环标志
    this.drawCycleLogo();
  }
  update() {
    if (!this.isGameOver) {
      // 更新忍者状态
      this.updateNinja();
      // 更新木板显示状态
      this.updateBoard();
      // 更新钟表图标显示状态
      this.updateClock();
      // 更新循环图标显示状态
      this.updateCycleLogo()
    }else{
      this.context.font = '16px Arial';
      if (this.ninja.downRank == 0) {
        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width) / 2, (this.canvas.height - this.successTipsImage.height) / 2 - this.successTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonNextInfo = drawIconButton(this.context, "返回选关", this.canvas.width / 2, this.canvas.height / 2 + 110);
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
          this.game.switchScene(new this.game.choose(this.game));
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
    this.canCycleCount = true;
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
    // 是否显示循环
    this.showCycle = false;
    // 是否允许统计
    this.canCycleCount = true;
    // 统计显示数据
    this.showCycleCount = 0;
    // 跟踪循环图片位置
    this.trackCyclePosition = 0;
    // 木板集合
    this.boardsLeft = [
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 500, width: 11, height: 200, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 100, y: this.canvas.height - 800, width: 9, height: 120, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 60, y: this.canvas.height - 1100, width: 8, height: 80, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 120, y: this.canvas.height - 1600, width: 13, height: 150, type: 'ice', smooth: 6,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 90, y: this.canvas.height - 1900, width: 12, height: 100, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 2428, width: 18, height: 150, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 1, showLimit: 8, isShow: true, showLogo: true},
      {x: this.canvas.width / 2 - 108, y: this.canvas.height - 2828, width: 18, height: 125, type: 'wood', smooth: 1, showClock: false, clockLimit: 2, showLimit: 0, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 80, y: this.canvas.height - 3228, width: 12, height: 150, type: 'metal', smooth: 0.01, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 - 90, y: this.canvas.height - 3428, width: 12, height: 166, type: 'wood', smooth: 1, showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false}
    ];
    this.boardsRight = [
      {x: this.canvas.width / 2 + 80, y: this.canvas.height - 350, width: 9, height: 100, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 600, width: 12, height: 180, type: 'ice', smooth: 8,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 900, width: 13, height: 150, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1300, width: 12, height: 90, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 1700, width: 10, height: 220, type: 'wood', smooth: 1,
      showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 60, y: this.canvas.height - 2100, width: 10, height: 120, type: 'glass', smooth: 6,
      showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 72, y: this.canvas.height - 2000, width: 8, height: 120, type: 'glass', smooth: 6,
      showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 80, y: this.canvas.height - 2428, width: 18, height: 150, type: 'metal', smooth: 0.01, showClock: false, clockLimit: 1, showLimit: 8, isShow: true, showLogo: true},
      {x: this.canvas.width / 2 + 108, y: this.canvas.height - 2628, width: 18, height: 175, type: 'wood', smooth: 1, showClock: false, clockLimit: 2, showLimit: 0, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 3028, width: 20, height: 150, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 90, y: this.canvas.height - 3500, width: 10, height: 320, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 100, y: this.canvas.height - 3400, width: 10, height: 220, type: 'glass', smooth: 6, showClock: false, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false},
      {x: this.canvas.width / 2 + 110, y: this.canvas.height - 3300, width: 10, height: 120, type: 'metal', smooth: 0.01, showClock: true, clockLimit: 2, showLimit: 8, isShow: true, showLogo: false}
    ]
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
    // 是否显示钟表图标
    this.showClock = false;
    // 跟踪记录钟表显示位置
    this.trackClockPosition = 0;
    // 统计钟表图标出现的时间
    this.showClockTimeCount = 0;
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
    this.backgroundImage.src = '';
    this.backgroundMirrorImage.src = '';
    this.backButton.image.src = '';
    this.scoreImage.src = '';
    this.groundImage.src = '';
    this.successTipsImage.src = '';
    this.failTipsImage.src = '';
    this.cycleImage.src = '';
    this.ivyImage.src = '';
    this.iceImage.src = '';
    this.metalImage.src = '';
    this.glassImage.src = '';
    this.clockImage.src = '';
    this.cloudImage.src = '';
    this.ninjaJumpImage.src = '';
    this.ninjaJumpMirrorImage.src = '';
    this.ninjaImages = [];
    this.ninjaRightImages = [];
    this.ninjaLeftImages = [];
  }
}