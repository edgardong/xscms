const Router = require('koa-router')
const requireDirectory = require('require-directory')
const { Model } = require('../app/models/baseModel')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.initEntity()
    InitManager.initLoadRouters(app)
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  static initEntity() {
    const modelDirectory = `${process.cwd()}/app/models`
    requireDirectory(module, modelDirectory, {
      visit: whenLoadModel,
    })

    function whenLoadModel(obj) {
      if (obj && obj.prototype && obj.prototype instanceof Model) {
        // console.log('到这里来了', obj.name)
        obj.initData && obj.initData()
      }
    }

    // console.log('执行完毕了')

    const relations = require('../app/models/index')
    relations.init && relations.init()

  }

  /**
   * init All routers
   */
  static initLoadRouters() {
    // api directory absolute path
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule,
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }

  static loadHttpException() {
    const errors = require('./http-exception')
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

export default InitManager
