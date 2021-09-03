import * as path from 'path'
import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter()

const swaggerOpts = {
  title: 'XSCMS接口文档',
  version: '1.0.0',
  description: '本文档适用于XSCMS系统的接口文档地址',
  host: 'http://localhos:8030',
  basePath: '/api'
}

router.swagger(swaggerOpts)
router.mapDir(path.resolve(__dirname, './src/app/api/common/v1/'))

export default router
