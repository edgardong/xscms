// const { spawn, spawnSync } = require('child_process')
// const DATA = require('./data')

// // const prepareScripts = [
// //   'git add .',
// //   'git stash',
// //   'git stash clear',
// //   'git checkout {{branch}}',
// //   'git pull origin {{branch}}',
// // ]

// const prepareScripts = ['git pull']

// const build = (obj, ref) => {
//   console.log('ref', ref)
//   const branch = ref.split('/').pop()
//   if (obj && obj.branch == branch) {
//   const reg = new RegExp(`{{branch}}`, 'ig')
//   let flag = true
//   prepareScripts.map((item) => {
//     if (!flag) return
//     item = item.replace(reg, branch)
//     console.log('doing script: ' + item)
//     item = item.split(' ')
//     const result = spawnSync(item[0], item.slice(1), {
//       cwd: obj.cwd,
//       stdio: 'inherit',
//     })
//     if (result.status != 0) {
//       flag = false
//     }
//   })
//   if (flag) {
//     if (typeof obj.script == 'string') {
//       const script = obj.script.split(' ')
//       const task = spawn(script[0], script.slice(1), {
//         cwd: obj.cwd,
//         stdio: 'inherit',
//       })
//       task.on('close', (code) => {
//         if (code != 0) flag = false
//         if (flag) {
//           console.log(`task exited with code ${code}`)
//         } else {
//           console.log('build failed!')
//         }
//       })
//     } else if (Array.isArray(obj.script)) {
//       obj.script.forEach((item) => {
//         console.log(`running ${item}`)
//         item = item.split(' ')
//         const result = spawnSync(item[0], item.slice(1), {
//           cwd: obj.cwd,
//           stdio: 'inherit',
//         })
//         if (result.status != 0) {
//           console.log(`${item.join(' ')} success`)
//         } else {
//           console.log(`${item.join(' ')} failed!`)
//         }
//       })
//     }
//     } else {
//       console.log('build failed!...')
//     }
//   }
// }

// const run = (name, ref='/master') => {
//   const arr = DATA[name]
//   if (Array.isArray(arr)) {
//     arr.forEach((obj) => {
//       build(obj, ref)
//     })
//   } else if (typeof arr == 'object') {
//     build(arr, ref)
//   }
// }

// module.exports = {
//   run,
// }
