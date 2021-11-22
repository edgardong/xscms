import Home from '@admin/views/Home'
import Detail from '@admin/views/Detail'
import UserList from '@admin/views/system/users/userList'
import Menu from '@admin/views/system/menu'
import Role from '@admin/views/system/role'
import Permission from '@admin/views/system/permission'
import NotFound from '@admin/views/system/core/NotFound'

import SystemBase from '@admin/views/system/base'

// 博客模块
import ArticleList from '@admin/views/cms/article/articleList'
import ArticleDetail from '@admin/views/cms/article/articleDetail'
import ArticleCategory from '@admin/views/cms/category/categoryList'
import BlogBase from '@admin/views/cms/base'
import BlogPage from '@admin/views/cms/page'

const getRoute = (path, component) => ({
  path,
  component,
})

const routes = [
  getRoute('/home', Home), // 主页面
  getRoute('/detail', Detail),
  getRoute('/system/user', UserList), // 系统 - 用户
  getRoute('/system/menu', Menu), // 系统 - 菜单
  getRoute('/system/role', Role), // 系统 - 角色
  getRoute('/system/permission', Permission), // 系统 - 权限
  getRoute('/system/notFound', NotFound), // 系统 - 404页面
  // getRoute('/mall/category', CategoryList), // 商城 - 分类
  // getRoute('/mall/goods', GoodsList), // 商城 - 商品
  // getRoute('/mall/order', OrderList), // 商城 - 订单

  // 博客模块路由
  getRoute('/blog/article', ArticleList),  // 博客 - 文章列表
  getRoute('/blog/article/:id', ArticleDetail), // 博客 - 文章详情
  getRoute('/blog/category', ArticleCategory),  // 博客 - 分类
  getRoute('/blog/base', BlogBase),  // 博客 - 基本信息
  getRoute('/blog/page', BlogPage),  // 博客 - 基本信息

  // 基础操作模块
  getRoute('/base/:module', SystemBase),
  getRoute('/', Home),
]

export default routes
