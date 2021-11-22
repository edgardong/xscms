export const modules = {
  token: [['用户模块'], '/api/common/v1/token/'],
  user: [['用户模块'], '/api/common/v1/user/']
}

type Module = 'token' | 'user'

/**
 * @param module:string 模块
 */
export interface PropertyDecorlator {
  module: Module;
  method?: string;
  url: string;
  desc: string;
  body?: any;
  tags?: any;
  query?: any;
  path?: any;
}

