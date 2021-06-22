var crypto = require('crypto');

class Util {
  //把金额转为分
  static getmoney = (money) => {
    return parseFloat(money) * 100;
  }

  // 随机字符串产生函数
  static createNonceStr = () => {
    return Math.random().toString(36).substr(2, 15);
  }

  // 时间戳产生函数
  static createTimeStamp = () => {
    return parseInt(new Date().getTime() / 1000) + '';
  }

  /**
   * 生成MD5加密后的字符串
   */
  static createMD5String = (str) => {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
  }
}

module.exports = Util