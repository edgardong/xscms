var util = {

  //把金额转为分
  getmoney: function (money) {
    return parseFloat(money) * 100;
  },

  // 随机字符串产生函数
  createNonceStr: function () {
    return Math.random().toString(36).substr(2, 15);
  },

  // 时间戳产生函数
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + '';
  },

  //签名加密算法
  paysignjsapi: function (appid, openid, body, mch_id, nonce_str, notify_url, out_trade_no, total_fee, trade_type, mchkey) {
    var ret = {
      appid,
      openid,
      mch_id,
      nonce_str,
      body,
      notify_url,
      out_trade_no,
      total_fee,
      trade_type
    };
    // console.log('ret==', ret);
    var string = raw(ret);
    var key = mchkey;
    string = string + '&key=' + key;
    // console.log('string=', string);
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },
  //签名加密算法,第二次的签名
  paysignjsapifinal: function (appid, mch_id, prepayid, noncestr, timestamp, mchkey,signType) {
    var ret = {
      appId: appid,
      package: 'prepay_id=' + prepayid,
      nonceStr: noncestr,
      timeStamp: timestamp,
      signType:signType
    };
    console.log('retretret==', ret);
    var string = raw(ret);
    var key = mchkey;
    string = string + '&key=' + key;
    // console.log('stringstringstring=', string);
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },
  getXMLNodeValue: function (xml) {
    const xmlreader = require('xmlreader')
    // var tmp = xml.split("<"+node_name+">");
    // console.log('tmp',tmp);
    // var _tmp = tmp[1].split("</"+node_name+">");
    // console.log('_tmp',_tmp);
    // return _tmp[0];
    return new Promise(function (resolve, reject) {
      xmlreader.read(xml, function (errors, response) {
        if (null !== errors) {
          reject(errors)
        }
        console.log('长度===', response.xml.prepay_id.text().length);
        var prepay_id = response.xml.prepay_id.text();
        console.log('解析后的prepay_id==', prepay_id);
        resolve(prepay_id)
      });
    })
  },
  getXMLNodeValueByKey: function (xml, key) {
    const xmlreader = require('xmlreader')
    return new Promise(function (resolve, reject) {
      xmlreader.read(xml, function (errors, resp) {
        if (null !== errors) {
          reject(errors)
        }
        console.log('长度===', resp.xml[key].text().length);
        var data = resp.xml[key].text();
        console.log('解析后的prepay_id==', data);
        resolve(data)
      });
    })
  }

}

function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

module.exports = util