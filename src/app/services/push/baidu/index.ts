const axios = require('axios')


/**
* 百度推送-普通推送文章
* @prams urls 推送的地址
*/
const pushPost = (data) => {
	let url = 'http://data.zz.baidu.com/urls?site=https://www.quzhaota.cn&token=sbMzXfyG0Oy8q2D7'
	axios.post(url,data).then(resp=> {
		console.log('pushPost结果: ', resp)
	})
}

module.exports = {
	pushPost
}