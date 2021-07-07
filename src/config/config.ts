

interface dbModel {
  dbType: 'mysql' | 'sqlite';
  dbName: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

const database: dbModel = {
  dbType: 'mysql',
  dbName: 'xscms-1',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'edgardong'
}

export {
  database
}

export default {
  enviroment: 'dev',
  blog: {
    // host: 'https://www.quzhaota.cn/',
    // 一定要加上最后的/
    host: 'http://localhost:8000/',
  },
  host: 'http://localhost',
  security: {
    secretKey: 'edgarhao.cn',
    // expiresIn: 60 * 60 * 24 * 30
    expiresIn: 60 * 60 * 24 * 30 * 1000
  },
  miniProgram: {
    appid: 'wx9ba5117f7cbce76d',
    appSecret: '29a7809bc04fac72d8af77033eb8fafd',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  imagePrefix: 'https://www.edgarhao.cn/icestore/wecstore/public/images',
  pay: {
    wechat: {
      mch_id: '1532347941',
      mch_key: 'Fe78L7NUJxNI11AOJ2QGsV5HolodnfDh',
      notify_url: 'http://store.free.idcfengye.com/api/store/v1/pay/notify'
    }
  }
}