export default {
  wecnode: {
    cwd: `/home/webserver/wecnode/`,
    script: 'pm2 restart app',
    branch: 'master',
  },
  vueblog: {
    secret:'319c4c06003bc400cd615f1c6ad09b59',
    cwd: `/home/website/wecblog-vue/`,
    script: 'pm2 restart vueblog',
    branch: 'master',
  },
  wecadmin: {
    secret:'319c4c06003bc400cd615f1c6ad09b59',
    cwd: `/home/website/wecadmin`,
    script: '',
    branch: 'master',
  }
}
