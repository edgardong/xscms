/*
 * @Author: yishusheng
 * @Date: 2021-04-13 18:40:20
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 17:41:02
 * @LastEditors: yishusheng
 * @Description: 项目初始化文件
 */
declare global {
  namespace NodeJS {
    interface Global {
      config: { miniProgram: { loginUrl: any; appid: any; appSecret: any }; pay: { wechat: { mch_id: any; mch_key: any; notify_url: any } }; security: { secretKey: Secret; expiresIn: any }; enviroment: string },
      errs: { AuthFailed: new (arg0: string) => any; Forbidden: new (arg0: string | undefined) => any }
    }
  }
}

import KoaRouter from '../app/api/Router'
import * as requireDirectory from 'require-directory'
// import { Model } from '../app/models/baseModel'
import { createDB, initDB } from './db'
import { Secret } from 'jsonwebtoken'

class InitManager {
  static app: any
  static initCore(app: any) {
    InitManager.app = app
    // InitManager.initEntity()
    InitManager.initLoadRouters()
    InitManager.initAPIs()
    InitManager.loadHttpException()
    InitManager.loadConfig()
    initDB()
  }

  static initEntity() {
    const modelDirectory = `${process.cwd()}/src/app/entity`
    requireDirectory(module, modelDirectory, {
      visit: whenLoadModel,
      extensions: ['ts']
    })

    function whenLoadModel(obj: { prototype: any; initData: () => any }) {
      // if (obj && obj.prototype && obj.prototype instanceof Model) {
      //   // console.log('到这里来了', obj.name)
      //   obj.initData && obj.initData()
      // }
    }

    // console.log('执行完毕了')

    // const relations = require('../app/models/index')
    // relations.init && relations.init()

  }

  /**
   * init All routers
   */
  static initLoadRouters() {

    const apiDirectory = `${process.cwd()}/src/router/`
    requireDirectory(module, apiDirectory, {
      visit: (obj: { routes: () => any, default: KoaRouter }) => {
        if (obj.default instanceof KoaRouter) {
          InitManager.app.use(obj.default.routes())
        }
      },
      extensions: ['ts']
    })
  }


  /**
   * init All routers
   */
  static initAPIs() {

    const apiDirectory = `${process.cwd()}/src/app/api/`
    requireDirectory(module, apiDirectory, {
      visit: (obj: { routes: () => any, default: KoaRouter }) => {
        if (obj.default instanceof KoaRouter) {
          InitManager.app.use(obj.default.routes())
        }
      },
      extensions: ['ts']
    })
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
