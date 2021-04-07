import React from 'react'
import { Input, Button } from 'antd'

class Install extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      step: 1, // 1 用户协议 2 数据库信息 3 超级管理员信息 4 完成安装
      dbdata: {
        dbType: 'mysql',
        dbName: 'xs-cms',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'edgardong',
      },
      userdata: {
        username: '',
        email: '',
        password: '',
      },
    }
  }

  handleWirteDbInfo() {
    // dbType: 'mysql',
    // dbName: 'xs-cms',
    // host: 'localhost',
    // port: 3306,
    // user: 'root',
    // password: 'edgardong'
    // 填写config文件中的数据库类型、数据库名、链接地址、端口号、数据库用户名、密码
  }

  render() {
    return <div>这里是安装页面</div>
  }
}

export default Install
