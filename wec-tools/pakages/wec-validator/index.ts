import WecRule from '../rule'
import WecException from '../exception'
import validator from 'validator'

// 方法名前缀
const prefix = 'validate'
/**
 * 验证器类
 */
class WecValidator {
  validators: { vals: string[]; funs: string[] }
  data: {}
  errors: {}

  constructor() {
    this.validators = {
      vals: [],
      funs: []
    }
    // 数据集合
    this.data = {}
    // 错误信息对象集合
    this.errors = {}
  }

  /**
   * 校验所有的参数
   * @param {Object} ctx 需要校验的对象上下文
   * @param {Object} alias 别名对象(仅支持属性替换) {校验规则属性:字段属性}
   */
  async validate(ctx: { request: { header: any; query: any; body: any }; params: any }, alias: any) {
    // 获取所有参数,组成一个集合
    this.data = Object.assign(ctx.request.header, ctx.params, ctx.request.query, ctx.request.body)
    this.data = this.exceptBaseAttr(this.data)
    // 所有的自定义验证方法
    this.validators.funs = this.getAllMethodNames(this)
    // 所有的自定义属性
    this.validators.vals = this.getAllProperties(this, alias)

    // console.log('validate.js/index.js', this.validators.vals, this.errors, this.data)
    // 处理校验
    await this.handleCheck(alias)
    if (Object.keys(this.errors).length > 0) {
      throw new WecException(this.errors.toString(), 40004)
    }
    return this.data
  }

  /**
   * 处理验证
   * @param {Object} alias 验证别名 ids -> id
   */
  async handleCheck(alias) {
    let _this = this
    let vals = this.validators.vals
    if (vals.length > 0) {
      vals.forEach(key => {
        // key id
        let ruleValue = _this.data[key] //获取该字段的输入值
        // if (alias && _this.data[key]) {
        //   key = alias[key]
        // }
        // 获取到rules
        let rules = _this[key] // 获取所有需要验证的规则
        let defaultValue = ''
        let isOptional = rules[0].valiateFunction === 'isOptional'
        if (isOptional) {
          defaultValue = rules[0].options
          rules.splice(0, 1)
          if (ruleValue !== null && ruleValue !== undefined && ruleValue !== '') {
            rules.forEach(rule => {
              check(rule.valiateFunction, ruleValue, rule.options, key, rule.msg)
            })
          } else {
            _this.data[key] = defaultValue
          }
        } else {
          if (ruleValue === null || ruleValue === undefined || ruleValue === '') {
            _this.setErrors(key, ruleValue + '不能为空')
          } else {
            rules.forEach((rule: { valiateFunction: string; options: any; msg: string }) => {
              check(rule.valiateFunction, ruleValue, rule.options, key, rule.msg)
            })
          }
        }
      })
    }

    /**
     * 校验是否符合规则
     * @param {String} valiateFunction 校验方式，参考validator.js
     * @param {String} value 校验值
     * @param {Object} options 校验选项
     * @param {String} key 校验的字段
     * @param {Stirng} msg 校验错误的信息
     */
    function check(valiateFunction: string, value: string, options: any, key: string, msg: string) {
      if (!validator[valiateFunction](value + '', options || {})) {
        _this.setErrors(key, msg)
      } else if (valiateFunction == 'isInt') {
        _this.data[key] = parseInt(value)
      }
    }

    // 校验所有的自定义校验方法
    let funs = this.validators.funs
    if (funs.length > 0) {
      funs.forEach(fun => {
        let key = fun.replace(prefix, '')
        try {
          this[fun](_this.data)
        } catch (error) {
          _this.setErrors(key, error.message)
        }
      })
    }
  }

  /**
   * 设置错误信息
   * @param {String} key 错误字段
   * @param {String} msg 错误信息
   */
  setErrors(key: string, msg: string) {
    if (!this.errors[key]) {
      this.errors[key] = [key + ' ' + msg]
    } else {
      this.errors[key].push(key + ' ' + msg)
    }
  }

  /**
   * 获取对象下所有需要验证的属性
   * @param {Object} obj 实例对象
   * @param {Object} alias 别名对象
   */
  getAllProperties(obj, alias) {
    let _this = this
    if (alias) {
      let aliasKeys = Object.keys(alias)
      aliasKeys.forEach(aliasKey => {

        let _newKey = aliasKey
        let _oldKey = alias[aliasKey]
        console.log('------', obj)
        if (_this.data[_oldKey]) {
          // obj[_newKey] = obj[_oldKey]
          _this.data[_newKey] = _this.data[_oldKey]
          // delete obj[_oldKey]
          // delete _this.data[_oldKey]
        }
      })
    }
    let keys = Object.keys(obj)
    // console.log(keys)
    return keys.filter((k, index) => {
      let key = this[k]
      if (key instanceof Array) {
        if (key.length == 0) {
          return false
        } else {
          for (const it of key) {
            if (!(it instanceof WecRule)) {
              throw new Error('Every item must be a instance of WecRule');
            }
          }
          return true;
        }
      } else {
        return key instanceof WecRule
      }
    })
  }

  /**
   * 获取某个实例类的所有方法
   * @param {Object} obj 实例类对象
   */
  getAllMethodNames(obj: any): string[] {
    let methods = new Set();
    while ((obj = Reflect.getPrototypeOf(obj))) {
      let keys = Reflect.ownKeys(obj);
      keys.forEach((k: string) => methods.add(k));
    }
    let keys = Array.from(methods.values());
    keys = keys.filter((k: string) => {
      return k.startsWith(prefix) && k !== prefix
    })
    return <string[]>keys
  }

  exceptBaseAttr(data: {}) {
    let base = ['cookie', 'accept-encoding', 'user-agent', 'sec-fetch-dest', 'content-length', 'referer', 'accept-language', 'sec-fetch-mode', 'sec-fetch-site', 'content-type', 'origin', 'accept', 'connection', 'host']
    let result = JSON.parse(JSON.stringify(data))
    base.forEach(b => {
      delete result[b]
    })
    return result
  }

}

export default WecValidator