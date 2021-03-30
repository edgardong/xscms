const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

var accessKey = 'lwKMAOMz7zkL3341bmaIl_UNURRCxEHg35WzyWaH';
var secretKey = 'pJdAcMjFL24ENIPT8gmfc3CkbPsbwP64snhbvy2y';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const bucket = 'quzhaota'

var options = {
  scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);


var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

/// 表单上传
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

// var localFile = "/Users/donghao/mystudio/code/wecnode/upload/1082.jpg";
// var key = 'test_108222.jpg';
// // 文件上传
// formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
//   respBody, respInfo) {
//   if (respErr) {
//     throw respErr;
//   }
//   if (respInfo.statusCode == 200) {
//     console.log(respBody);
//   } else {
//     console.log(respInfo.statusCode);
//     console.log(respBody);
//   }
// });



// 写入目录
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
  return false
}

// 删除文件
function removeTemImage(path) {
  fs.unlink(path, (err) => {
    if (err) {
      throw err
    }
  })
}

// 上传到本地服务器
function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../../upload/')
    const confirm = mkdirsSync(filePath)

    if (!confirm) {
      return
    }

    const reader = fs.createReadStream(file.path); // 创建可读流
    const _fileName = filePath + file.name
    const upStream = fs.createWriteStream(_fileName); // 创建可写流
    reader.pipe(upStream);
    reader.on('end', function () {
      resolve({
        path: _fileName,
        name: file.name
      })
    })

    reader.on('error', function (err) {
      console.error(err);
      reject(err)
    });

  })

}

function getSuffix(fileName) {
  return fileName.split('.').pop()
}

// 重命名
function fileRename(fileName) {
  return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName)
}


// 上传到七牛
function upToQiniu(result) {
  console.log('结果', result)
  // 文件上传
  return new Promise((resolved, reject) => {
    formUploader.putFile(uploadToken, 'quzhaota/blog/' + fileRename(result.name), result.path, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        resolved(respBody)
      } else {
        resolved(respBody)
      }
    })
  })

}




/**
 * 上传文件
 * @param {*} file 上传的文件
 */
const putFile = async (file) => {

  // 获取上存图片
  const result = await uploadFile(file)
  // 上传到七牛
  const qiniu_r = await upToQiniu(result)
  console.log('七牛', qiniu_r)
  // 上存到七牛之后 删除原来的缓存图片
  removeTemImage(result.path)
  const domain = 'http://qiniudns.quzhaota.cn/'
  return {
    url: domain + qiniu_r.key,
    name: result.name
  }

}

module.exports = {
  putFile
}