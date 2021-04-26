import Home from '@/views/Home'
import Detail from '@/views/Detail'
import UserList from '@/views/system/users/userList'
import Menu from '@/views/system/menu'
import Role from '@/views/system/role'
import Permission from '@/views/system/permission'
import CategoryList from '@/views/mall/categoryList'
import GoodsList from '@/views/mall/goodsList'
import OrderList from '@/views/mall/orderList'
import NotFound from '@/views/system/core/NotFound'

import SystemBase from '@/views/system/base'


import BtrMember from '@/views/batur/member'
import BtrOrder from '@/views/batur/order'
import BtrProject from '@/views/batur/project'
import BtrGoods from '@/views/batur/goods'

// 博客模块
import ArticleList from '@/views/blog/article/articleList'
import ArticleDetail from '@/views/blog/article/articleDetail'
import ArticleCategory from '@/views/blog/category/categoryList'
import BlogBase from '@/views/blog/base'

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
  getRoute('/mall/category', CategoryList), // 商城 - 分类
  getRoute('/mall/goods', GoodsList), // 商城 - 商品
  getRoute('/mall/order', OrderList), // 商城 - 订单

  // 博客模块路由
  getRoute('/blog/article', ArticleList),  // 博客 - 文章列表
  getRoute('/blog/article/:id', ArticleDetail), // 博客 - 文章详情
  getRoute('/blog/category', ArticleCategory),  // 博客 - 分类
  getRoute('/blog/base', BlogBase),  // 博客 - 基本信息

  // 巴图尔健康管理模块
  getRoute('/batur/member', BtrMember),  // 会员信息
  getRoute('/batur/order', BtrOrder),  // 消费信息
  getRoute('/batur/project', BtrProject),  // 项目信息
  getRoute('/batur/goods', BtrGoods),  // 商品信息

  // 基础操作模块
  getRoute('/base/:module', SystemBase),
  getRoute('/', Home),
]

export default routes
