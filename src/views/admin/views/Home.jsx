import React from 'react'
import { Button, Row, Col, Card } from 'antd'
import { withRouter } from 'react-router-dom'

import baseApi from '@admin/api/system/base'
import moment from 'moment'

import echarts from 'echarts'

import homeStyle from '@admin/assets/less/home.less'
import ButtonGroup from 'antd/lib/button/button-group'

const dataOptions = [
  {
    id: 0,
    name: '已下单',
    color: '#DC143C',
  },
  {
    id: 1,
    name: '已发货',
    color: '#0000FF',
  },
  {
    id: 2,
    name: '已收货',
    color: '#00BFFF',
  },
  {
    id: 3,
    name: '已完成',
    color: '#008000',
  },
  {
    id: 4,
    name: '已取消',
    color: '#FF0000',
  },
  {
    id: 5,
    name: '已签收',
    color: '#4472c4',
  },
]

@withRouter
class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      order_count: 0,
      cancel_count: 0, // 取消的单数
      cancel_money: 0, // 取消单赚取的钱
      total_money: 0,
      sysh_money: 0,
      total_desc: 0,
      other_desc: 0,
      today_count: 0,
      count_obj: null,
      COUNTOBJ: null,
      countStatus: 'week',
      status_obj: null,
    }
  }

  formatFloat = function (f, digit) {
    var m = Math.pow(10, digit)
    return Math.round(f * m, 10) / m
  }

  componentDidMount() {
    let todayStr = moment(new Date()).format('YYYY-MM-DD')

    // console.log(todayStr)
    baseApi.getAll('xyorder', { order: `date_asc` }).then((resp) => {
      let order_count = resp.data.length
      let cancel_count = resp.data.filter((o) => o.order_status == 4).length
      let total_money = 0
      let cancel_money = 0
      let sysh_money = 0
      let total_desc = 0
      let other_desc = 0
      let today_count = 0 // 今日单数
      let count_obj = {}
      let status_obj = {}
      dataOptions.forEach((o) => {
        status_obj[o.name] = 0
      })

      resp.data.forEach((or) => {
        let status_item = dataOptions.find((dop) => dop.id == or.order_status)
        if (status_item) {
          // console.log(status_item)
          status_obj[status_item.name] += 1
        }

        // 已取消的单子不做统计
        if (or.order_status == 4) {
          cancel_money = this.accAdd(
            cancel_money,
            this.accAdd(this.accAdd(or.profix, or.sysh_profix), or.other_profix)
          )
          return
        }
        sysh_money = this.accAdd(Number(or.sysh_profix), Number(sysh_money)) // 生于生活 总和
        total_money = this.accAdd(or.profix || 0, total_money || 0) // 差价利润 总和
        other_desc += Number(or.other_profix) // 其他总和
        let key = moment(or.date).format('YYYY-MM-DD')
        let today_profix = this.accAdd(
          this.accAdd(or.profix, or.sysh_profix),
          or.other_profix
        )
        // Number(
        //   Number(or.profix || 0) +
        //     Number(or.sysh_profix || 0) +
        //     Number(or.other_profix || 0)
        // ).toFixed(2) // 今日利润

        let keys = Object.keys(count_obj)
        if (keys.indexOf(key) <= -1) {
          count_obj[key] = {}
          count_obj[key].count = 1 //今日数量
          count_obj[key].sysh_profix = this.accAdd(or.sysh_profix, 0) // 今日生于生活利润
          count_obj[key].profix = this.accAdd(today_profix, 0) // 今日总利润
          count_obj[key].chajia_profix = this.accAdd(or.profix, 0) // 今日差价利润
        } else {
          count_obj[key].count += 1
          count_obj[key].profix = this.accAdd(
            Number(count_obj[key].profix),
            today_profix
          )
          count_obj[key].sysh_profix = this.accAdd(
            Number(count_obj[key].sysh_profix),
            or.sysh_profix
          )
          // 差价利润
          count_obj[key].chajia_profix = this.accAdd(
            Number(count_obj[key].chajia_profix),
            or.profix
          )
        }

        // 统计今日单量
        if (or.date && key === todayStr) {
          today_count += 1
        }
      })
      // 预计总盈亏
      // console.log('总盈亏的东西', total_money, sysh_money, other_desc)
      total_desc = this.accAdd(this.accAdd(total_money, sysh_money), other_desc)
      sysh_money = Number(sysh_money).toFixed(2)

      this.setState({
        order_count,
        cancel_count,
        total_money,
        cancel_money,
        sysh_money,
        other_desc,
        total_desc,
        today_count,
        count_obj,
        COUNTOBJ: count_obj,
        status_obj,
      })
      // 初始化利润统计
      this.handleTypeChange(this.state.countStatus)
      // 初始化单据状态统计
      this.initStatusCharts()
    })
  }

  //加法
  accAdd(arg1, arg2, n) {
    var r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return ((arg1 * m + arg2 * m) / m).toFixed(n || 2)
  }

  initCountCharts() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('count_charts'))
    let xAxisArr = Object.keys(this.state.count_obj)
    let yAxisArr = Object.values(this.state.count_obj)
    let barWidth = '16%'
    // console.log(yAxisArr)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '每日单量及利润统计',
      },
      legend: {
        data: ['单量', '今日利润', '差价利润', '生于生活'],
      },
      color: ['#3682be', '#45a776', '#f05326', '#eed777'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisArr,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '单量',
          type: 'bar',
          barWidth,
          data: yAxisArr.map((c) => c.count),
          label: {
            show: true,
            position: 'inside',
          },
        },
        {
          name: '今日利润',
          type: 'bar',
          barWidth,
          data: yAxisArr.map((c) => c.profix),
          label: {
            show: true,
            position: 'inside',
          },
        },
        {
          name: '差价利润',
          type: 'bar',
          barWidth,
          data: yAxisArr.map((c) => c.chajia_profix),
          label: {
            show: true,
            position: 'inside',
          },
        },
        {
          name: '生于生活',
          type: 'bar',
          barWidth,
          data: yAxisArr.map((c) => c.sysh_profix),
          label: {
            show: true,
            position: 'inside',
          },
        },
      ],
    })
  }

  handleTypeChange(type) {
    let count_obj = {}
    let origion = JSON.parse(JSON.stringify(this.state.COUNTOBJ))
    let keys = Object.keys(origion)
    let startDate = 0
    let endDate = 0

     //获取本年
  // const startDate = moment().year(moment().year()).startOf('year').valueOf();
  // const endDate = moment().year(moment().year()).endOf('year').valueOf();
  //获取本日
  // const startDate = moment().format('YYYY-MM-DD'); 
  // const startDate = moment().format('YYYY-MM-DD');

    if (type === 'all') {
      count_obj = origion
    } else if (type === 'week') {
      //获取本周
      startDate = moment().valueOf()-7*24*60*60*1000 //这样是年月日的格式
      endDate = moment().valueOf() //这样是时间戳的格式
    } else if (type === 'month') {
      //获取本月
      startDate = moment().month(moment().month()).startOf('month').valueOf()
      endDate = moment().month(moment().month()).endOf('month').valueOf()
    }

    keys.forEach((k) => {
      let kTime = moment(k).valueOf()
      if (kTime >= startDate && kTime <= endDate) {
        count_obj[k] = origion[k]
      }
    })
    this.setState({
      count_obj,
      countStatus: type,
    })

    setTimeout(() => {
      this.initCountCharts()
    })
  }

  initStatusCharts() {
    // 基于准备好的dom，初始化echarts实例
    let _this = this
    var myChart = echarts.init(document.getElementById('status_charts'))
    let status_obj = this.state.status_obj
    let xAxisArr = Object.keys(this.state.status_obj)
    let yAxisArr = xAxisArr.map((x) => ({ name: x, value: status_obj[x] }))
    // let  shadowColor = ['#95a2ff','#fa808','#ffc076','#fae768','#87e885','#3cb9fc','#73abf5','#cb9bff','#434348','#90ed7d','#f7a35c','#8085e9'​​​​​​​]
    // console.log(this.state.status_obj)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '单据状态统计',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        top: '10%',
        left: 'left',
        data: xAxisArr,
      },
      color: [
        '#4B7CF3',
        '#01C2F9',
        '#F4CB29',
        '#ed7d31',
        '#70ad47',
        '#ffc000',
        '#4472c4',
        '#91d024',
        '#b235e6',
        '#02ae75',
      ],
      series: [
        {
          name: '单据数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          label: {
            show: true,
            formatter: '{b} : {c} ({d}%)',
          },
          data: yAxisArr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }

  render() {
    const gutter = 24
    const span = 3
    const {countStatus} = this.state;
    return (
      <div>
        <div style={{ background: '#ECECEC', padding: '8px' }}>
          <Row gutter={gutter}>
            <Col span={span}>
              <Card title="总单数" bordered={false}>
                {this.state.order_count}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="今日单数" bordered={false}>
                {this.state.today_count}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="取消单数" bordered={false}>
                {this.state.cancel_count}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="取消金额" bordered={false}>
                {this.state.cancel_money}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="预估总盈利" bordered={false}>
                {this.state.total_desc}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="生于生活返现" bordered={false}>
                {this.state.sysh_money}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="总差价" bordered={false}>
                {this.state.total_money}
              </Card>
            </Col>
            <Col span={span}>
              <Card title="其他返现" bordered={false}>
                {this.state.other_desc}
              </Card>
            </Col>
          </Row>
        </div>

        <div>
          <div className={homeStyle.buttonGroup}>
            <ButtonGroup>
              <Button
                type={countStatus == 'all' ? 'primary' : ''}
                onClick={(e) => this.handleTypeChange('all', e)}
              >
                全部
              </Button>
              <Button
                onClick={(e) => this.handleTypeChange('week', e)}
                type={countStatus == 'week' ? 'primary' : ''}
              >
                本周
              </Button>
              <Button
                type={countStatus == 'month' ? 'primary' : ''}
                onClick={(e) => this.handleTypeChange('month', e)}
              >
                本月
              </Button>
            </ButtonGroup>
          </div>
          <div className={homeStyle.count_charts} id="count_charts"></div>

          <div className={homeStyle.status_charts} id="status_charts"></div>
        </div>
      </div>
    )
  }
}

export default Home
