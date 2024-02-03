import Episode from './scene/episode.js';
export default class Game {
  constructor() {
    this.initSettings();
    this.canvas = wx.createCanvas();
    this.context = canvas.getContext('2d');
    this.episode = Episode;
    this.currentScene = new this.episode(this);
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
        title: '小恐龙不要停！太难了吧',
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
    if (getMusicState == ''){
      wx.setStorageSync('musicEnabled', true)
    }
    if (getBackgroundMusic == ''){
      wx.setStorageSync('backgroundMusicEnabled', true)  
    }
  }
  loop() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene.draw();
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