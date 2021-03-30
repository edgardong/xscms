const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters(app)
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  /**
   * init All routers
   */
  static initLoadRouters() {
    // api directory absolute path
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }

  static loadHttpException() {
    const errors = require('../core/http-exception')
    global.errs = errors
  }

  /**
   * load global config
   * @param {*} path
   */
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

}

module.exports = InitManager