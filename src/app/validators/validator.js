const {
  WecValidator,
  WecRule
} = require('../../wec-tools')
const {
  User
} = require('../models/user')

const {
  LoginType,
  PayType
} = require('../lib/enum')

class PositiveIntegerValidator extends WecValidator {
  constructor() {
    super()
    this.id = [
      new WecRule('isInt', '需要为正整数', {
        min: 1
      })
    ]
  }
}

class PreOrderValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }

  validatePayType(vals) {
    if (!vals.payType) {
      throw new Error('payType必须是参数')
    } else if (!PayType.isThisType(vals.payType)) {
      throw new Error('payType参数不合法')
    } else {
      return true
    }
  }
}

class WecRegisterValidator extends WecValidator {
  constructor() {
    super()

    this.email = [
      new WecRule('isOptional'),
      new WecRule('isEmail', '邮箱地址不正确', {})
    ]

    this.password1 = [
      new WecRule('isLength', '密码为6-32位', {
        min: 6,
        max: 32
      }),
      new WecRule('matches', '密码复杂度太低', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,32}$')
    ]

    this.password2 = this.password1

    this.username = [
      new WecRule('isOptional'),
      new WecRule('isLength', '用户名6-32位', {
        min: 6,
        max: 32
      })
    ]

    this.nickname = [
      new WecRule('isLength', '昵称位6-32位', {
        min: 6,
        max: 32
      })
    ]
  }

  validatePassword(vals) {
    const pass1 = vals.password1
    const pass2 = vals.password2

    if (pass1 !== pass2) {
      throw new Error('两个密码必须相同')
    } else {
      return true
    }
  }

  async validateEmail(vals) {
    const email = vals.email
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      throw new Error('Email 已存在')
    } else {
      return true
    }
  }
}

class TokenValidatar extends WecValidator {
  constructor() {
    super()

    this.account = [
      new WecRule('isLength', '账号不符合规则', {
        min: 4,
        max: 32
      })
    ]

    this.secret = [
      new WecRule('isOptional'),
      new WecRule('isLength', '至少6位字符', {
        min: 6,
        max: 128
      })
    ]

  }

  validateLoginType(vals) {
    console.log('validateLoginType', vals)
    if (!vals.type) {
      throw new Error('type必须是参数')
    } else if (!LoginType.isThisType(vals.type)) {
      throw new Error('type参数不合法')
    } else {
      return true
    }

  }
}

class NotEmptyValidator extends WecValidator {
  constructor() {
    super()
    this.token = [
      new WecRule('isLength', '不能为空', {
        min: 1
      })
    ]
  }
}

class PaginationValidator extends WecValidator {
  constructor() {
    super()

    this.page = [
      new WecRule('isOptional', '', 1),
      new WecRule('isInt', '需要为正整数', {
        min: 1
      })
    ]

    this.size = [
      new WecRule('isOptional', '', 15),
      new WecRule('isInt', '需要为正整数', {
        min: 1
      })
    ]
  }
}

class CategroyValidator extends WecValidator {
  constructor() {
    super()

    this.name = [
      new WecRule('isLength', '不能为空', {
        min: 1
      })
    ]

    this.id = [
      new WecRule('isOptional'),
      new WecRule('isInt', '需要为正整数')
    ]

    this.topic_img_id = [
      new WecRule('isOptional'),
      new WecRule('isInt', '需要为正整数')
    ]

    this.description = [
      new WecRule('isOptional'),
      new WecRule('isLength', '描述不能为空', {
        min: 1
      })
    ]

    this.is_check_show = [
      new WecRule('isBoolean', '需要为布尔类型')
    ]
  }
}

class ACLoginValidator extends WecValidator {
  constructor() {
    super()

    this.ac = [
      new WecRule('isLength', '不能为空', {
        min: 6
      })
    ]

    this.se = [
      new WecRule('isLength', '不能为空', {
        min: 6
      })
    ]
  }
}

class UserFormValidator extends WecValidator {
  constructor() {
    super()

    this.username = [
      new WecRule('isLength', '用户名不能为空', {
        min: 1
      })
    ]

    this.nickname = [
      new WecRule('isLength', '昵称不能为空', {
        min: 1
      })
    ]
  }
}

class MenuFormValidator extends WecValidator {
  constructor() {
    super()

    this.name = [
      new WecRule('isLength', '菜单名不能为空', {
        min: 1
      })
    ]

    this.code = [
      new WecRule('isLength', '编码不能为空', {
        min: 1
      })
    ]

    this.url = [
      new WecRule('isLength', '菜单地址不能为空', {
        min: 1
      })
    ]

    this.type = [
      new WecRule('isInt', '菜单类型不能为空', {
      })
    ]

    this.order = [
      new WecRule('isInt', '菜单排序不能为空', {
      })
    ]

  }
}

class TypeValidator extends WecValidator {
  constructor() {
    super()

    this.type = [
      new WecRule('isOptional'),
      new WecRule('isInt', '类型不能为空', {
      })
    ]
  }
}

class DataValidator extends WecValidator {

  constructor(){
    super()
  }
}

module.exports = {
  WecValidator,
  PositiveIntegerValidator,
  WecRegisterValidator,
  TokenValidatar,
  NotEmptyValidator,
  PaginationValidator,
  CategroyValidator,
  ACLoginValidator,
  PreOrderValidator,
  UserFormValidator,
  MenuFormValidator,
  TypeValidator,
  DataValidator
}