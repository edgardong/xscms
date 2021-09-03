
import { getManager } from "typeorm"
import ThirdApp from '../entity/thirdApp'
import util from '../../core/util'

const manager = getManager()
class ThirdAppModel  {
  static async getAppToken(params) {
    const app = await manager.findOne(ThirdApp,{
      where: {
        app_id: params.ac,
        app_secret: params.se
      }
    })

    if (app) {
      return util.generateToken(app.id, app.scope)
    }

    return ''
  }
}

export default ThirdAppModel