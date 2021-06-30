export default {
  getServerUrl: () => {
    return process.env.NODE_ENV == 'production' ? 'http://cms.quzhaota.cn/apis/' : ''
  }
}