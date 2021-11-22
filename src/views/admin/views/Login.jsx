import React from 'react'
import { connect } from 'react-redux'
import { Input, Button } from 'antd'
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
import { addToken } from '../redux/user.redux'
import loginStyle from '@admin/assets/less/login.less'
import userApi from '@admin/api/system/user'

@connect(state => state.user, { addToken })
class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: 'admin001',
      password: 'P@ssw0rd',
      type: 201
    }

    this.handleLogin = this.handleLogin.bind(this)
  }

  handleInputChange(key, e) {
    this.setState({
      [key]: e.target.value
    })
  }

  handleLogin() {
    userApi.login(this.state).then(resp => {
      console.log('登录结果', resp)
      if (resp.token) {
        console.log(this.props)
        this.props.addToken(resp)

        this.props.history.replace('/main')
      }
    })
  }

  render() {
    return (
      <div>
        <div className={loginStyle.inputWrapper}>
          {/* <div className={loginStyle.title}>雅文破冰后台管理系统</div> */}
          <div className={loginStyle.space}></div>
          <Input
            defaultValue={this.state.username}
            onChange={e => this.handleInputChange('username', e)}
            placeholder="用户名"
            prefix={<UserOutlined></UserOutlined>}
          />
          <div className={loginStyle.space}></div>
          <Input.Password
            defaultValue={this.state.password}
            onChange={e => this.handleInputChange('password', e)}
            placeholder="密码"
            prefix={<UnlockOutlined />}
          />
          <div className={loginStyle.space}></div>

          <Button onClick={this.handleLogin} block type="primary">
            登录
          </Button>
          <div className={loginStyle.space}></div>
        </div>

        <div className={loginStyle.modal}></div>
        <img
          className={loginStyle.bg}
          src={require('../assets/image/login-bg.jpeg')}
        ></img>
      </div>
    )
  }
}

export default Login
