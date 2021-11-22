import React from 'react'
import { TopNav, LeftNav, Content, Bread } from '@admin/components/Layout'
import style from '@admin/assets/less/main.less'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      // <div>main  pages...</div>
      <div>
        <div className={style.pageBox}>
          <TopNav />
          <div className={style.contentBox}>
            <LeftNav />
            <div className={style.rightBottomBox}>
              <Bread />
              <Content className={style.content} {...this.props} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
