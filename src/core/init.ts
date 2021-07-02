declare global {
  namespace NodeJS {
    interface Global {
      config,
      errs
    }
  }
}

import KoaRouter from '../app/api/Router'
import * as requireDirectory from 'require-directory'
import { Model } from '../app/models/baseModel'
import { createDB, initDB } from './db'

class InitManager {
  static app: any
  static initCore(app: any) {
    InitManager.app = app
    InitManager.initEntity()
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()

    // createDB()

    initDB()
  }

  static initEntity() {
    const modelDirectory = `${process.cwd()}/src/app/entity`
    requireDirectory(module, modelDirectory, {
      visit: whenLoadModel,
      extensions: ['ts']
    })

    function whenLoadModel(obj: { prototype: any; initData: () => any }) {
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
    // const apiDirectory = `${process.cwd()}/src/app/api/router`
    // requireDirectory(module, apiDirectory, {
    //   visit: whenLoadModule,
    // })
    // function whenLoadModule(obj: { routes: () => any }) {
    //   // console.log('whenLoadModule', obj)
    //   if (obj instanceof Router) {
    //     InitManager.app.use(obj.routes())
    //   }
    // }


    const apiDirectory = `${process.cwd()}/src/app/api/router/`
    requireDirectory(module, apiDirectory, {
      visit: (obj: { routes: () => any, default: KoaRouter }) => {
        if (obj.default instanceof KoaRouter) {
          InitManager.app.use(obj.default.routes())
        }
      },
      extensions: ['ts']
    })
    // function whenLoadModule(obj: { routes: () => any }) {
    //   // console.log('whenLoadModule', obj)
    //   if (obj instanceof Router) {
    //     InitManager.app.use(obj.routes())
    //   }
    // }
  }

  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }

  /**
   * load global config
   * @param {*} path
   */
  static loadConfig(path: any = '') {
    const configPath = path || process.cwd() + '/src/config/config.ts'
    const config = require(configPath)
    global.config = config
  }
}

export default InitManager
