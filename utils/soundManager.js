class SoundManager {
  constructor() {
    this.sounds = {
      done: new Audio('audio/welldone.mp3'),
      breath: new Audio('audio/chow.mp3'),
      wind: new Audio('audio/wind.mp3'),
      down: new Audio('audio/down.mp3'),
      yell: new Audio('audio/yell.mp3')
    };
    // 初始化音乐播放状态
    this.musicEnabled = this.getMusicState();
  }
  getMusicState() {
    // 使用微信API从本地存储获取音乐播放状态
    const state = wx.getStorageSync('musicEnabled');
    return state ? true : state; // 如果没有状态，默认为 true
  }
  setMusicState(state) {
    // 使用微信API保存音乐播放状态到本地存储
    wx.setStorageSync('musicEnabled', state);
    this.musicEnabled = state;
  }
  play(soundName, delay = 0) {
    if (!this.musicEnabled) return; // 如果音乐被禁用，则不播放
    const sound = this.sounds[soundName];
    if (sound) {
      setTimeout(() => {
        sound.currentTime = 0; // 重置音频时间
        sound.play();
      }, delay);
    }
  }
}

export default SoundManager