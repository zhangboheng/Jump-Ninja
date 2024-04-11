import {
  drawRoundedRect,
  drawImageBtn
} from '../../utils/button';
import {
  drawDialog
} from '../../utils/dialog';
import { menuButtonInfo, scaleX, scaleY } from '../../utils/global';
export default class Startup {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.customAd = '';
    /* 常量设置区域开始 */
    this.showDialogOrNot = false;
    /* 常量设置区域结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    this.planningImage = new Image();
    this.planningImage.src = 'image/planning.png';
    this.settingsImage = new Image();
    this.settingsImage.src = 'image/settings.png';
    this.rankImage = new Image();
    this.rankImage.src = 'image/rank.png';
    /* 图片加载区域结束 */
    /* 按钮设置开始 */
    this.insBtn = '';
    this.settingsBtn = '';
    this.rankBtn = '';
    this.buttonWidth = 180 * scaleX;
    this.buttonHeight = 50 * scaleY;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = this.canvas.height - 120 * scaleY;
    /* 按钮设置结束 */
    this.closeButton = '';
    this.drawAd();
  }
  // 绘制广告
  drawAd() {
    this.customAd = wx.createCustomAd({
      adUnitId: 'adunit-fa3274eb8d1fb6ce',
      style: {
          left: menuButtonInfo.right - 60,
          top: menuButtonInfo.bottom + 10,
          width: 60
      }
    });
    this.customAd.show();
    this.customAd.onError(err => {
      console.error(err.errMsg)
    });
  }
  // 绘制背景图
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 绘制排行榜提示框
  drawRankDialog() {
    // 获取历史分数
    let getHistoryRank = wx.getStorageSync('historyRank');
    this.dialogOptions = {
      width: 240 * scaleX,
      height: 350 * scaleY,
      backgroundColor: '#f5d659',
      scores: getHistoryRank,
      fontSize: `${20 * scaleX}px`
    };
    if (this.showDialogOrNot) {
      this.closeButton = drawDialog(this.context, '历史成绩榜', this.dialogOptions);
    }
  }
  // 绘制玩法说明图片
  drawInstruction() {
    this.insBtn = drawImageBtn(this.context, this.planningImage, 10, menuButtonInfo.top, scaleX, scaleY, '说明', '#000');
  }
  // 绘制设置图片
  drawSettingsImage() {
    this.settingsBtn = drawImageBtn(this.context, this.settingsImage, 10, menuButtonInfo.top + 42 * scaleY + 10 * scaleX, scaleX, scaleY, '设置', '#000');
  }
  // 绘制排行榜
  drawRankImage() {
    this.rankBtn = drawImageBtn(this.context, this.rankImage, 10, menuButtonInfo.top + 84 * scaleY + 20 * scaleX, scaleX, scaleY, '排行榜');
  }
  // 绘制按钮
  drawStartBtn() {
    this.context.save();
    // 开始按钮
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#f5d65999', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('开始游戏', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2 + 2 * scaleY);
    this.context.restore();
  }
  // 绘制健康游戏公告
  drawPublish() {
    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.font = `${10 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    const text = '《健康游戏忠告》\n抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。';
    // 将文本按\n分割成多行
    const lines = text.split('\n');
    // 计算文本开始绘制的Y坐标
    const lineHeight = 14 * scaleY; // 行高，根据需要调整
    const startY = this.canvas.height - 50 * scaleY
    // 绘制每一行文本
    lines.forEach((line, index) => {
      const x = this.canvas.width / 2;
      const y = startY + lineHeight * index;
      this.context.fillText(line, x, y);
    });
    this.context.restore();
  }
  // 绘制行为
  draw() {
    // 绘制背景图
    this.drawBackground();
    // 绘制玩法说明图片
    this.drawInstruction();
    // 绘制设置图片
    this.drawSettingsImage();
    // 绘制排行榜
    this.drawRankImage();
    // 绘制按钮
    this.drawStartBtn();
    // 绘制健康游戏公告
    this.drawPublish();
    // 绘制排行榜提示框
    this.drawRankDialog();
  }
  // 玩家点击事件
  touchHandler(e) {
    const touch = e.touches[0];
    // 点击开始按钮
    if (touch.clientX >= this.buttonX && touch.clientX <= this.buttonX + this.buttonWidth &&
      touch.clientY >= this.buttonY && touch.clientY <= this.buttonY + this.buttonHeight && !this.showDialogOrNot) {
      this.game.switchScene(new this.game.choose(this.game));
    }
    // 检测是否点击了说明按钮
    if (touch.clientX >= this.insBtn.x && touch.clientX <= this.insBtn.x + this.insBtn.width &&
      touch.clientY >= this.insBtn.y && touch.clientY <= this.insBtn.y + this.insBtn.height && !this.showDialogOrNot) {
      this.game.switchScene(new this.game.instruction(this.game));
    }
    // 检测是否点击了设置按钮
    if (touch.clientX >= this.settingsBtn.x && touch.clientX <= this.settingsBtn.x + this.settingsBtn.width &&
      touch.clientY >= this.settingsBtn.y && touch.clientY <= this.settingsBtn.y + this.settingsBtn.height && !this.showDialogOrNot) {
      this.game.switchScene(new this.game.settings(this.game));
    }
    // 判断点击是否在成绩榜区域内
    if (touch.clientX >= this.rankBtn.x && touch.clientX <= this.rankBtn.x + this.rankBtn.width && touch.clientY >= this.rankBtn.y && touch.clientY <= this.rankBtn.y + this.rankBtn.height && !this.showDialogOrNot) {
      this.showDialogOrNot = true;
      // 点击在图片区域内
      this.drawRankDialog();
    }
    // 点击关闭按钮
    if (touch.clientX >= this.closeButton.closeButtonX - this.closeButton.closeButtonSize && touch.clientX <= this.closeButton.closeButtonX && touch.clientY >= this.closeButton.closeButtonY && touch.clientY <= this.closeButton.closeButtonY + this.closeButton.closeButtonSize) {
      this.showDialogOrNot = false;
    }
  }
  // 页面销毁机制
  destroy() {
    this.customAd.destroy();
    this.customAd = '';
    // 清理图像资源
    this.backgroundImage.src = '';
    this.insBtn = '';
    this.settingsBtn = '';
    this.rankBtn = '';
  }
}