import {
  createBackButton
} from '../../utils/button';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Settings {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 创建BackgroundMusic实例
    this.backgroundMusic = new BackgroundMusic();
    // 创建SoundManager实例
    this.soundManager = new SoundManager();
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 定义标签和对应的内容
    this.tabs = ['背景', '角色', '道具', '玩法'];
    this.paragraph = "东瀛大地，在北海道深处\n有一座被称为“跃影山”的山峰\n这座山蕴藏着古老的忍者秘技\n但其顶端从未被任何人到达\n据说，只有拥有极强跳跃能力的忍者\n才能攀登至山巅\n一位名叫上影翔的年轻忍者\n在师傅的悉心栽培下\n刻苦修炼十余年\n他已经准备好了\n决定挑战这座被誉为忍者之巅的山峰\n上影翔相信\n攀登至山巅将带给他无法想象的力量\n使他成为真正的忍者大师\n但是，这条路上并不轻松\n无尽的危险在等待他"
    // 当前选中的标签索引
    this.selectedIndex = 0;
    // 角色中的图片
    this.role = new Image();
    this.role.src = 'image/role-01.png';
    // 道具中的图片
    this.scrollKungfu = new Image();
    this.scrollKungfu.src = 'image/scroll.png';
    // 玩法中的图片
    this.clickIcon = new Image();
    this.clickIcon.src = 'image/click.png';
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
  // 绘制标签按钮
  drawTabs() {
    // 计算每个标签的宽度，考虑间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    for (let i = 0; i < this.tabs.length; i++) {
      // 计算每个标签的X坐标
      const tabX = 10 + i * (tabWidth + 10);
      const tabHeight = 40;
      const tabY = menuButtonInfo.top + tabHeight;
      // 绘制标签背景
      this.context.fillStyle = this.selectedIndex === i ? '#f5ac11' : '#f5d659';
      this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制标签文本
      this.context.fillStyle = '#000000';
      this.context.font = '16px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(this.tabs[i], tabX + tabWidth / 2, tabY + tabHeight / 2 + 2);
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    const tabContentY = menuButtonInfo.top + 90; // 设置内容区域的Y坐标
    // 计算当前选中标签的位置和宽度
    const tabWidth = this.canvas.width - 20;
    const tabX = 10;
    // 绘制选中标签下方的矩形
    this.context.fillStyle = '#f5d659'; // 标签背景颜色
    this.context.strokeStyle = 'black'; // 标签描边颜色
    if (this.selectedIndex === 0) {
      const splitSentence = this.paragraph.split("\n");
      const contentHeight = splitSentence.length * 20 + 16;
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制音效左侧文字
      const textX = tabX;
      const textY = tabContentY + 20;
      this.context.fillStyle = '#000000';
      this.context.font = `16px Arial`;
      this.context.textAlign = 'center';
      for(let i = 0; i < splitSentence.length; i++) {
        this.context.fillText(`${splitSentence[i]}`, textX + tabWidth/2, textY + i * 20);
      }
    } else if (this.selectedIndex === 1) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconY = 10;
      const iconHeight = 76;
      const iconWidth = 93;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 26;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制角色图片
      if (this.role.complete) {
        this.context.drawImage(this.role, tabX, tabContentY + iconY, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['姓名：上影翔', '年龄：未知', '练习时长：12年半', '绝技：飞檐走壁']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    } else if (this.selectedIndex === 2) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconX = 10;
      const iconHeight = 32;
      const iconWidth = 32;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 30;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.scrollKungfu.complete) {
        this.context.drawImage(this.scrollKungfu, tabX + iconX, tabContentY + this.scrollKungfu.height / 2, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['名称：瞬移卷轴', '功效：短暂瞬移功能，随机传送']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    } else if (this.selectedIndex === 3) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconX = 10;
      const iconHeight = 32;
      const iconWidth = 32;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 30;
      // 绘制矩形
      this.context.fillStyle = '#f5d659';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.clickIcon.complete) {
        this.context.drawImage(this.clickIcon, tabX + iconX, tabContentY + this.scrollKungfu.height / 2, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['操作：点击屏幕长按后松开', '功能：可以实现向上跳跃']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    }
  }
  draw() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标签按钮
    this.drawTabs();
    // 绘制选中标签的内容
    this.drawTabsContent();
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
    // 计算标签的宽度和间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和，包括两侧边缘
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    const tabHeight = 50;
    const tabY = menuButtonInfo.top + tabHeight;
    // 检查是否触摸了标签
    for (let i = 0; i < this.tabs.length; i++) {
      const tabX = 10 + i * (tabWidth + 10);
      // 检查触摸点是否在标签内
      if (touchX >= tabX && touchX <= tabX + tabWidth &&
        touchY >= tabY && touchY <= tabY + tabHeight) {
        // 更新选中的标签索引
        this.selectedIndex = i;
        break;
      }
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
  }
  // 管理音效状态
  toggleMusic() {
    const currentMusicState = this.soundManager.getMusicState();
    this.soundManager.setMusicState(!currentMusicState);
  }
  // 管理背景音乐状态
  toggleBackgroundMusic() {
    const currentMusicState = this.backgroundMusic.getBackgroundMusicState();
    this.backgroundMusic.setBackgroundMusicState(!currentMusicState);
  }
}