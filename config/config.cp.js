module.exports = {
  enviroment: 'dev',
  blog: {
    host: 'http://localhost:3000/',
  },
  database: {
    dbType: 'mysql',
    dbName: 'wecstore',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'edgardong'
  },
  security: {
    secretKey: 'edgarhao.cn',
    expiresIn: 60 * 60 * 24 * 30
  },
  miniProgram: {
    appid: '小程序的appid',
    appSecret: '小程序的appsecret',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  imagePrefix: 'https://www.edgarhao.cn/icestore/wecstore/public/images',
  pay: {
    wechat: {
      mch_id: '微信支付商户号',
      mch_key: '微信支付商户号密钥',
      notify_url: 'https://www.edgarhao.cn/'
    }
  }
}