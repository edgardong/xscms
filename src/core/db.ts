import { createConnection } from 'typeorm'
// import config1 from '../config/config'
import * as path from 'path'

// const options = {
//   type: dbType,
//   host,
//   port,
// logging: false,
// timezone: '+08:00',
// charset: 'utf8',
// collate: 'utf8_general_ci',
// define: {
//   timestamps: true,
//   paranoid: true,
//   createdAt: 'create_time',
//   updatedAt: 'update_time',
//   deletedAt: 'delete_time',
//   underscored: true,
// },
// // 添加这个配置
// dialectOptions: {
//   charset: 'utf8mb4',
//   dateStrings: true,
//   typeCast: true,
// },
// }



function initDB() {
  // let sequelize = new Sequelize('', user, password, options)

  // sequelize
  //   .query(
  //     ` CREATE DATABASE IF NOT EXISTS ${dbName}
  //       DEFAULT CHARACTER SET utf8
  //       DEFAULT COLLATE utf8_general_ci`
  //   )
  //   .then(function (data) {
  //     // code to run after successful creation.
  //     console.log('create database success', data)
  //   })
  //   .catch(function (err) {
  //     console.log('create database error: ', err.original.code)
  //   })
  let database = {
    dbType: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'edgardong',
    dbName: 'xscms1'
  }

  createConnection({
    type: 'mysql',
    host: database.host,
    port: database.port,
    username: database.user,
    password: database.password,
    database: database.dbName,
    logging: false,
    entities: [path.join(__dirname, "../app/entity/user.ts")],
    synchronize: true,
  }).then((connection) => {
    // 这里可以写实体操作相关的代码

  }).catch((error) => console.log(error));
}

function createDB() {
  const dbName = 'xscms1'
  // get the client
  const mysql = require('mysql2')
  // create the connection
  const con = mysql.createConnection(
    { host: 'localhost', user: 'root', database: '', password: 'edgardong' }
  )
  const sql = `CREATE DATABASE IF NOT EXISTS ${dbName}
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;`
  // console.log(sql)
  con.promise().query(sql)
    .then(function (data) {
      console.log('create database success', data)
    })
    .catch(function (err) {
      console.log('create database error: ', err)
    })
    .then(() => con.end());

}

export {
  initDB,
  createDB
}
