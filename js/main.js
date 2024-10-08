import Episode from './scene/episode.js';
import Startup from './scene/startup.js';
import Choose from './scene/choose.js';
import Select from './scene/select.js';
import Settings from './scene/settings.js';
import Instruction from './scene/instruction.js';
import TrailFirst from './scene/trailFirst.js';
import TrailSecond from './scene/trailSecond.js';
import TrailThird from './scene/trailThird.js';
import TrailFourth from './scene/trailFourth.js';
import TrailFifth from './scene/trailFifth.js';
import TrailSixth from './scene/trailSixth.js';
import TrailSeventh from './scene/trailSeventh.js';
import TrailEighth from './scene/trailEighth.js';
import Tutorial from './scene/tutorial.js';
import { systemInfo } from '../utils/global';
export default class Game {
  constructor() {
    this.initSettings();
    this.canvas = wx.createCanvas();
    this.context = canvas.getContext('2d');
    this.canvas.width = systemInfo.screenWidth;
    this.canvas.height = systemInfo.screenHeight;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    this.episode = Episode;
    this.startup = Startup;
    this.choose = Choose;
    this.select = Select;
    this.trailfirst = TrailFirst;
    this.trailsecond = TrailSecond;
    this.trailthird = TrailThird;
    this.trailfourth = TrailFourth;
    this.trailfifth = TrailFifth;
    this.trailsixth = TrailSixth;
    this.trailseventh = TrailSeventh;
    this.traileighth = TrailEighth;
    this.tutorial = Tutorial;
    this.settings = Settings;
    this.instruction = Instruction;
    this.currentScene = new this.episode(this);
    this.instanceList = [Tutorial, TrailFirst, TrailSecond, TrailThird, TrailFourth, TrailFifth, TrailSixth, TrailSeventh, TrailEighth]
    canvas.addEventListener('touchstart', (e) => {
      this.currentScene.touchHandler(e);
    });
    // ios端音频不能在静音下播放处理
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      success: function (res) {
        console.log("开启静音模式下播放音乐的功能");
      },
      fail: function (err) {
        console.log("静音设置失败");
      },
    });
    // 启用分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeLine']
    });
    // 设置默认分享信息
    wx.onShareAppMessage(() => {
      return {
        title: '跃影忍者！太难了吧',
        imageUrl: 'image/background.jpg' // 分享图片的路径
      };
    });
    this.boundLoop = this.loop.bind(this);
    this.loop();
  }
  // 初始化信息
  initSettings() {
    let getMusicState = wx.getStorageSync('musicEnabled');
    let getBackgroundMusic = wx.getStorageSync('backgroundMusicEnabled');
    let getHistoryRank = wx.getStorageSync('historyRank');
    if (getMusicState == ''){
      wx.setStorageSync('musicEnabled', true)
    }
    if (getHistoryRank == ''){
      let scores = JSON.stringify(['99:59:59','99:59:59','99:59:59','99:59:59','99:59:59','99:59:59','99:59:59','99:59:59','99:59:59','99:59:59']);
      wx.setStorageSync('historyRank', scores);
    }
    if (getBackgroundMusic == ''){
      wx.setStorageSync('backgroundMusicEnabled', true)  
    }
  }
  loop() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene.draw();
    this.instanceList.forEach(item=>this.currentScene instanceof item ? this.currentScene.update(): '')
    requestAnimationFrame(this.boundLoop);
  }
  // 切换页面方法
  switchScene(newScene) {
    // 页面销毁后需要将就页面的资源和监听器进行清理
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }
    this.currentScene = newScene;
  }
}