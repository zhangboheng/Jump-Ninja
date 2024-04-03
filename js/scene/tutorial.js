import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
import {
  showBoxMessage
} from '../../utils/dialog';
import {
  menuButtonInfo,
  backgroundMusic,
  soundManager,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Tutorial {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/begin.mp3');
    backgroundMusic.playBackgroundMusic();
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    /* 加载音乐音效管理器结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/background.jpg';
    this.backButton = '';
    this.backgroundMirrorImage = new Image();
    this.backgroundMirrorImage.src = 'image/backgroundmirror.jpg';
    this.scoreImage = new Image();
    this.scoreImage.src = 'image/uparrow.png';
    this.groundImage = new Image();
    this.groundImage.src = 'image/yard.jpg';
    this.successTipsImage = new Image();
    this.successTipsImage.src = 'image/gamecompletetips.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png';
    this.ivyImage = new Image();
    this.ivyImage.src = 'image/ivy.png';
    this.iceImage = new Image();
    this.iceImage.src = 'image/ice.png';
    this.metalImage = new Image();
    this.metalImage.src = 'image/endflag.png';
    this.glassImage = new Image();
    this.glassImage.src = 'image/glass.png';
    this.cloudImage = new Image();
    this.cloudImage.src = 'image/cloud.png';
    this.clockImage = new Image();
    this.clockImage.src = 'image/clock.png';
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
      leftTrack: '', // 跟踪忍者踩到左侧的位置
      rightTrack: '', // 跟踪忍者踩到右侧的位置
      currentNinjaFrame: 0,
      currentNinjaRightFrame: 0,
      currentNinjaLeftFrame: 0,
      isJumpDown: false,
      isBoardCaught: false,
      downRank: 1,
      groundY: 0, // 视角追踪Y坐标
    };
    // 木板集合
    this.boardsLeft = [{
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 500 * scaleY,
        width: 11 * scaleX,
        height: 200 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 100 * scaleX,
        y: this.canvas.height - 800 * scaleY,
        width: 9 * scaleX,
        height: 120 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 60 * scaleX,
        y: this.canvas.height - 1100 * scaleY,
        width: 8 * scaleX,
        height: 80 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 120 * scaleX,
        y: this.canvas.height - 1600 * scaleY,
        width: 13 * scaleX,
        height: 150 * scaleY,
        type: 'ice',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 90 * scaleX,
        y: this.canvas.height - 1900 * scaleY,
        width: 12 * scaleX,
        height: 100 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 2428 * scaleY,
        width: 18 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: true
      },
      {
        x: this.canvas.width / 2 - 108 * scaleX,
        y: this.canvas.height - 2828 * scaleY,
        width: 18 * scaleX,
        height: 125 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 0,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 3228 * scaleY,
        width: 12 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 90 * scaleX,
        y: this.canvas.height - 3428 * scaleY,
        width: 12 * scaleX,
        height: 166 * scaleY,
        type: 'wood',
        smooth: 0,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      }
    ];
    this.boardsRight = [{
        x: this.canvas.width / 2 + 80 * scaleX,
        y: this.canvas.height - 350 * scaleY,
        width: 9 * scaleX,
        height: 100 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 600 * scaleY,
        width: 12 * scaleX,
        height: 180 * scaleY,
        type: 'ice',
        smooth: 8,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 900 * scaleY,
        width: 13 * scaleX,
        height: 150 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 1300 * scaleY,
        width: 12 * scaleX,
        height: 90 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 1700 * scaleY,
        width: 10 * scaleX,
        height: 220 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 2100 * scaleY,
        width: 10 * scaleX,
        height: 120 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 72 * scaleX,
        y: this.canvas.height - 2000 * scaleY,
        width: 8 * scaleX,
        height: 120 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 80 * scaleX,
        y: this.canvas.height - 2428 * scaleY,
        width: 18 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: true
      },
      {
        x: this.canvas.width / 2 + 108 * scaleX,
        y: this.canvas.height - 2628 * scaleY,
        width: 18 * scaleX,
        height: 175 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 0,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 3028 * scaleY,
        width: 20 * scaleX,
        height: 150 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 3500 * scaleY,
        width: 10 * scaleX,
        height: 320 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 100 * scaleX,
        y: this.canvas.height - 3400 * scaleY,
        width: 10 * scaleX,
        height: 220 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 110 * scaleX,
        y: this.canvas.height - 3300 * scaleY,
        width: 10 * scaleX,
        height: 120 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      }
    ]
    this.boards = this.boardsLeft.concat(this.boardsRight);
    this.score = 0;
    this.countTime = 0;
    // 是否显示循环
    this.showCycle = false;
    // 是否允许统计
    this.canCycleCount = true;
    // 统计显示数据
    this.showCycleCount = 0;
    // 跟踪循环图片位置
    this.trackCyclePosition = 0;
    // 添加长按状态相关属性
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
    this.angle = 0;
    // 是否显示钟表图标
    this.showClock = false;
    // 跟踪记录钟表显示位置
    this.trackClockPosition = 0;
    // 统计钟表图标出现的时间
    this.showClockTimeCount = 0;
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
    let count = Math.floor(this.ninja.groundY / this.canvas.height) + 1;
    if (count >= 1) {
      if (this.backgroundMirrorImage.complete) {
        this.context.drawImage(this.backgroundMirrorImage, 0, -this.canvas.height * (count - 1) + this.ninja.groundY, this.canvas.width, this.canvas.height);
      }
      if (this.backgroundMirrorImage.complete) {
        this.context.drawImage(this.backgroundMirrorImage, 0, -this.canvas.height * count + this.ninja.groundY, this.canvas.width, this.canvas.height);
      }
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
    if (this.displayMessageTime > 0) {
      showBoxMessage(this.context, "Let's GO!", this.canvas.width / 2, this.canvas.height / 2, '#f5d659', 'black', 20 * scaleX);
      setTimeout(() => {
        this.displayMessageTime--
      }, 500);
    }
  }
  // 绘制时钟显示
  drawClock() {
    if (this.clockImage.complete && this.showClock) {
      this.context.save();
      this.context.translate(this.canvas.width / 2, this.trackClockPosition + 50 * scaleY + this.ninja.groundY);
      this.context.rotate(this.angle);
      this.context.drawImage(this.clockImage, -this.clockImage.width * scaleY / 2, -this.clockImage.height * scaleY / 2, this.clockImage.width * scaleY, this.clockImage.height * scaleY);
      this.context.restore();
      // 增加角度以实现旋转
      this.angle += 0.02;
    }
  }
  // 更新钟表计时
  updateClock() {
    if (this.showClock) {
      this.showClockTimeCount = this.showClockTimeCount + 0.002
      if (this.showClockTimeCount > 2) {
        this.boardsLeft = this.boardsLeft.map((board, index) => {
          if (this.boardsLeft.indexOf(this.ninja.leftTrack) == index || index - this.boardsLeft.indexOf(this.ninja.leftTrack) >= 1 && index - this.boardsLeft.indexOf(this.ninja.leftTrack) <= 3) {
            const processedBoard = {
              ...board
            };
            processedBoard.clockLimit = 2;
            processedBoard.showClock = false;
            return processedBoard;
          } else {
            return board;
          }
        });
        this.boardsRight = this.boardsRight.map((board, index) => {
          if (this.boardsRight.indexOf(this.ninja.rightTrack) == index || index - this.boardsRight.indexOf(this.ninja.rightTrack) >= 1 && index - this.boardsRight.indexOf(this.ninja.rightTrack) <= 3) {
            const processedBoard = {
              ...board
            };
            processedBoard.clockLimit = 2;
            processedBoard.showClock = false;
            return processedBoard;
          } else {
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
    const iconSize = 32 * scaleY; // 图标大小
    const iconPadding = 10 * scaleX; // 图标与分数之间的间距
    this.context.save();
    // 计算分数文本的宽度
    const textWidth = this.context.measureText(this.score).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
    // 绘制图标
    if (this.scoreImage.complete) {
      this.context.drawImage(this.scoreImage, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.fillStyle = 'black';
    this.context.font = `${24 * scaleX}px Arial`; // 确保设置的字体与绘制时相同
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score, scoreX, scoreY);
    this.context.restore();
  }
  // 绘制循环标志
  drawCycleLogo() {
    if (this.cycleImage.complete && this.showCycle) {
      this.context.save();
      this.context.translate(this.canvas.width / 2, this.trackCyclePosition + 50 * scaleY + this.ninja.groundY);
      this.context.rotate(this.angle);
      this.context.drawImage(this.cycleImage, -this.cycleImage.width * scaleY / 2, -this.cycleImage.height * scaleY / 2, this.cycleImage.width * scaleY, this.cycleImage.height * scaleY);
      this.context.restore();
      // 增加角度以实现旋转
      this.angle += 0.02;
    }
  }
  // 更新循环图标显示状态
  updateCycleLogo() {
    if (this.showCycle) {
      this.boardsLeft = this.boardsLeft.map((board, index) => {
        if (this.boardsLeft.indexOf(this.ninja.leftTrack) == index || index - this.boardsLeft.indexOf(this.ninja.leftTrack) >= 1 && index - this.boardsLeft.indexOf(this.ninja.leftTrack) <= 3) {
          const processedBoard = {
            ...board
          };
          processedBoard.showLimit = processedBoard.showLimit + this.showCycleCount;
          return processedBoard;
        } else {
          return board;
        }
      });
      this.boardsRight = this.boardsRight.map((board, index) => {
        if (this.boardsRight.indexOf(this.ninja.rightTrack) == index || index - this.boardsRight.indexOf(this.ninja.rightTrack) >= 1 && index - this.boardsRight.indexOf(this.ninja.rightTrack) <= 3) {
          const processedBoard = {
            ...board
          };
          processedBoard.showLimit = processedBoard.showLimit + this.showCycleCount;
          return processedBoard;
        } else {
          return board
        }
      });
      this.boards = this.boardsLeft.concat(this.boardsRight)
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
        this.showClock = false;
        this.showCycle = false;
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
      for (const board of this.boardsRight.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
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
          this.ninja.rightTrack = board;
          this.ninja.fly = false;
          if (board.showClock) {
            this.showClock = board.showClock;
            this.trackClockPosition = board.y
          }
          this.showCycle = board.showLogo;
          if (this.canCycleCount && this.showCycle) {
            this.showCycleCount++;
            this.canCycleCount = false;
            this.trackCyclePosition = board.y;
          }
          if (!this.showCycle) {
            this.showCycleCount = 0
          }
          let getIndex = this.boardsRight.indexOf(board);
          if (this.score < 2 * (getIndex + 1) - 1) {
            this.score = 2 * (getIndex + 1) - 1
          }
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
        this.showClock = false;
        this.showCycle = false;
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
      for (const board of this.boardsLeft.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
        if (
          this.ninja.x <= board.x + board.width &&
          this.ninja.x + this.ninja.width - 5 * scaleX >= board.x + board.width &&
          this.ninja.y + this.ninja.height - 20 * scaleY >= board.y &&
          this.ninja.y + 25 * scaleY <= board.y + board.height
        ) {
          this.ninja.x = board.x + board.width - 10 * scaleX;
          this.ninja.stopPoint = board.y + board.height - 20 * scaleY - this.ninja.y;
          this.ninja.isBoardCaught = true;
          this.ninja.downRank = board.smooth;
          this.ninja.velocityX = 0;
          this.ninja.velocityY = 0;
          this.ninja.leftTrack = board;
          this.ninja.fly = false;
          if (board.showClock) {
            this.showClock = board.showClock;
            this.trackClockPosition = board.y
          }
          this.showCycle = board.showLogo;
          if (this.canCycleCount && this.showCycle) {
            this.showCycleCount++;
            this.canCycleCount = false;
            this.trackCyclePosition = board.y;
          }
          if (!this.showCycle) {
            this.showCycleCount = 0
          }
          let getIndex = this.boardsLeft.indexOf(board);
          if (this.score < 2 * (getIndex + 1)) {
            this.score = 2 * (getIndex + 1)
          }
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
    for (const board of this.boards.filter(item => item.clockLimit >= 2 && item.isShow && item.showLimit >= 8)) {
      if (board.type == 'wood') {
        this.context.drawImage(this.ivyImage, board.x, board.y + this.ninja.groundY, board.width, board.height);
      }
      if (board.type == 'ice') {
        this.context.drawImage(this.iceImage, board.x, board.y + this.ninja.groundY, board.width, board.height);
      }
      if (board.type == 'metal') {
        this.context.drawImage(this.metalImage, board.x, board.y + this.ninja.groundY, board.width, board.height);
      }
      if (board.type == 'glass') {
        this.context.drawImage(this.glassImage, board.x, board.y + this.ninja.groundY, board.width, board.height);
      }
    }
  }
  // 更新木板
  updateBoard() {
    //更新踩到木板的位置
    if (this.ninja.fly) {
      this.boardsLeft = this.boardsLeft.map(item => {
        if (item == this.ninja.leftTrack && item.type == 'glass') {
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
        if (item == this.ninja.rightTrack && item.type == 'glass') {
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
    if (this.cloudImage.complete) {
      const cloudSpeed = 1 * scaleX; // 云朵的移动速度
      const cloudOffset = (Date.now() / 1000) * cloudSpeed; // 根据时间计算云朵的偏移量
      const cloudX = cloudOffset % this.canvas.width; // 根据偏移量计算云朵的当前 X 坐标
      this.context.drawImage(this.cloudImage, cloudX, -150 * scaleY + this.ninja.groundY, this.cloudImage.width * scaleX, this.cloudImage.height * scaleY);
    }
  }
  // 绘制终点图标
  drawGoal() {
    if (this.boardsLeft[8].clockLimit >= 2) {
      if (this.endImage.complete) {
        this.context.drawImage(this.endImage, this.canvas.width / 2 - 96 * scaleX, this.canvas.height - 3428 * scaleY - this.endImage.height * scaleY + this.ninja.groundY, this.endImage.width * scaleX, this.endImage.height * scaleY);
      }
    }
  }
  // 绘制时间变动
  drawTimer() {
    const hours = Math.floor(this.countTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((this.countTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (this.countTime % 60).toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    this.context.save();
    // 绘制时间文本
    if (this.ninja.y > 120 * scaleY) {
      this.context.fillStyle = 'white';
    } else {
      this.context.fillStyle = 'black';
    }
    this.context.font = `${20 * scaleX}px Arial`;
    this.context.textAlign = 'center'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(timeString, this.canvas.width / 2, this.canvas.height - menuButtonInfo.top - 20 * scaleY);
    this.context.restore();
    // 增加总秒数
    if (!this.isGameOver) {
      this.countTime++;
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制榻榻米
    this.drawTatami();
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
    // 绘制时钟显示
    this.drawClock();
    // 绘制循环标志
    this.drawCycleLogo();
    // 绘制终点图标
    this.drawGoal();
    // 绘制开局提示消息
    this.drawMessageBox();
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
      this.updateCycleLogo();
    } else {
      if (this.ninja.downRank == 0) {
        if (this.successTipsImage.complete) {
          this.context.drawImage(this.successTipsImage, (this.canvas.width - this.successTipsImage.width * scaleX) / 2, (this.canvas.height - this.successTipsImage.height * scaleY) / 2 - this.successTipsImage.height * scaleY / 2, this.successTipsImage.width * scaleX, this.successTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonNextInfo = drawIconButton(this.context, "返回选关", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      } else {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonNextInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      }
    }
    // 更新时间显示变化
    this.drawTimer();
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
    this.backButton = '';
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
      leftTrack: '', // 跟踪忍者踩到左侧的位置
      rightTrack: '', // 跟踪忍者踩到右侧的位置
      currentNinjaFrame: 0,
      currentNinjaRightFrame: 0,
      currentNinjaLeftFrame: 0,
      isJumpDown: false,
      isBoardCaught: false,
      downRank: 1,
      groundY: 0, // 视角追踪Y坐标
    };
    // 木板集合
    this.boardsLeft = [{
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 500 * scaleY,
        width: 11 * scaleX,
        height: 200 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 100 * scaleX,
        y: this.canvas.height - 800 * scaleY,
        width: 9 * scaleX,
        height: 120 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 60 * scaleX,
        y: this.canvas.height - 1100 * scaleY,
        width: 8 * scaleX,
        height: 80 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 120 * scaleX,
        y: this.canvas.height - 1600 * scaleY,
        width: 13 * scaleX,
        height: 150 * scaleY,
        type: 'ice',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 90 * scaleX,
        y: this.canvas.height - 1900 * scaleY,
        width: 12 * scaleX,
        height: 100 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 2428 * scaleY,
        width: 18 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: true
      },
      {
        x: this.canvas.width / 2 - 108 * scaleX,
        y: this.canvas.height - 2828 * scaleY,
        width: 18 * scaleX,
        height: 125 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 0,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 80 * scaleX,
        y: this.canvas.height - 3228 * scaleY,
        width: 12 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 - 90 * scaleX,
        y: this.canvas.height - 3428 * scaleY,
        width: 12 * scaleX,
        height: 166 * scaleY,
        type: 'wood',
        smooth: 0,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      }
    ];
    this.boardsRight = [{
        x: this.canvas.width / 2 + 80 * scaleX,
        y: this.canvas.height - 350 * scaleY,
        width: 9 * scaleX,
        height: 100 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 600 * scaleY,
        width: 12 * scaleX,
        height: 180 * scaleY,
        type: 'ice',
        smooth: 8,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 900 * scaleY,
        width: 13 * scaleX,
        height: 150 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 1300 * scaleY,
        width: 12 * scaleX,
        height: 90 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 1700 * scaleY,
        width: 10 * scaleX,
        height: 220 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 60 * scaleX,
        y: this.canvas.height - 2100 * scaleY,
        width: 10 * scaleX,
        height: 120 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 72 * scaleX,
        y: this.canvas.height - 2000 * scaleY,
        width: 8 * scaleX,
        height: 120 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 80 * scaleX,
        y: this.canvas.height - 2428 * scaleY,
        width: 18 * scaleX,
        height: 150 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: false,
        clockLimit: 1,
        showLimit: 8,
        isShow: true,
        showLogo: true
      },
      {
        x: this.canvas.width / 2 + 108 * scaleX,
        y: this.canvas.height - 2628 * scaleY,
        width: 18 * scaleX,
        height: 175 * scaleY,
        type: 'wood',
        smooth: 1,
        showClock: false,
        clockLimit: 2,
        showLimit: 0,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 3028 * scaleY,
        width: 20 * scaleX,
        height: 150 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 90 * scaleX,
        y: this.canvas.height - 3500 * scaleY,
        width: 10 * scaleX,
        height: 320 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 100 * scaleX,
        y: this.canvas.height - 3400 * scaleY,
        width: 10 * scaleX,
        height: 220 * scaleY,
        type: 'glass',
        smooth: 6,
        showClock: false,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      },
      {
        x: this.canvas.width / 2 + 110 * scaleX,
        y: this.canvas.height - 3300 * scaleY,
        width: 10 * scaleX,
        height: 120 * scaleY,
        type: 'metal',
        smooth: 0.01,
        showClock: true,
        clockLimit: 2,
        showLimit: 8,
        isShow: true,
        showLogo: false
      }
    ]
    this.boards = this.boardsLeft.concat(this.boardsRight);
    this.score = 0;
    this.countTime = 0;
    this.angle = 0;
    // 是否显示循环
    this.showCycle = false;
    // 是否允许统计
    this.canCycleCount = true;
    // 统计显示数据
    this.showCycleCount = 0;
    // 跟踪循环图片位置
    this.trackCyclePosition = 0;
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
    this.ivyImage.src = '';
    this.iceImage.src = '';
    this.metalImage.src = '';
    this.glassImage.src = '';
    this.cycleImage.src = '';
    this.clockImage.src = '';
    this.cloudImage.src = '';
    this.endImage.src = '';
    this.ninjaImages.forEach(img => img = null);
    this.ninjaRightImages.forEach(img => img = null);
    this.ninjaLeftImages.forEach(img => img = null);
    this.ninjaJumpImage.src = '';
    this.ninjaJumpMirrorImage.src = '';
  }
}