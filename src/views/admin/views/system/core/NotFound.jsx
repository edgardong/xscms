import React from 'react'

import style from '@/assets/less/common.less'
import notFoundImg from '@/assets/image/4041.png'

export default class NotFound extends React.Component {
  render() {
    return <img className={style.centerImage} src={notFoundImg}></img>
  }
}
