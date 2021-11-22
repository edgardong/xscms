import React from 'react'

import style from '@admin/assets/less/common.less'
import notFoundImg from '@admin/assets/image/4041.png'

export default class NotFound extends React.Component {
  render() {
    return <img className={style.centerImage} src={notFoundImg}></img>
  }
}
