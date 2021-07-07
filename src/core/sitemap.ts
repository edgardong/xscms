/*
 * @Author: yishusheng
 * @Date: 2021-03-26 18:12:00
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 15:41:04
 * @LastEditors: yishusheng
 * @Description: 生成站点地图文件
 */
import * as fs from 'fs'
import * as path from 'path'
import config from '../config/config'

let baiduxml = `<?xml version="1.0" encoding="UTF-8"?><urlset>$0</urlset>`

//<?xml version="1.0" encoding="UTF-8"?>
// <loc>http://www.quzhaota.cn</loc> // 页面地址
// <lastmod>2020-01-01</lastmod>  // 上次更新时间
// <changefreq> always </ changefreq > // 页面可能发生更改的频率(选填项) 。//有效值为：always、hourly、daily、weekly、monthly、yearly、never
// <priority>1.0</priority >  // 此网页的优先级。有效值范围从 0.0 到 1.0 (选填项) 。0.0优先级最低、1.0最高。

let googlexml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.google.com/schemas/sitemap/0.84">$0</urlset>`

let xml = `
  <url>
    <loc>$0</loc>
    <lastmod>$1</lastmod>
    <changefreq> always </changefreq>
    <priority>1.0</priority >
  </url>`

let sitemapindex = `<sitemapindex>
  $0
</sitemapindex>`

// <loc>http://www.example.com/map1.xml</loc>识别Sitemap的位置(必填项)。这里提供的信息是您分割的Sitemap文件存放路径。
{
  /* <lastmod>2010-01-01</lastmod>识别相对Sitemap文件的修改时间(选填项)。格式为<lastmod>年-月-日</lastmod> */
}
//
let sitemapurl = `
<sitemap>
  <loc>$0</loc>
  <lastmod>$1</lastmod>
</sitemap>`


const generatetSitemap = (datas: { id: string; time: string }[]) => {
  let baiduTmpXml = baiduxml
  let googleTmpXml = googlexml

  let xmls = ''
  datas.forEach((data: { id: string; time: string }) => {
    xmls += xml.replace('$0', config.blog.host + data.id + '.html').replace('$1', data.time)
  });

  baiduTmpXml = baiduTmpXml.replace('$0', xmls)
  googleTmpXml = googleTmpXml.replace('$0', xmls)

  // console.log(__dirname)

  fs.writeFile(path.resolve(__dirname, '../mapTpl/baidusitemap.xml'), baiduTmpXml, {
    'flag': 'w+'
  }, function (err) {
    if (err) {
      throw err;
    }
    console.log('写入百度站点地图完成');
  });

  fs.writeFile(path.resolve(__dirname, '../mapTpl/googlesitemap.xml'), googleTmpXml, {
    'flag': 'w+'
  }, function (err) {
    if (err) {
      throw err;
    }
    console.log('写入谷歌站点地图完成');
  });

}

export default generatetSitemap