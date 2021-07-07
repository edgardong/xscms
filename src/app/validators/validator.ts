import WecValidator, { WecRule } from '../../../wec-tools'
// import User from '../models/user'

import { LoginType, PayType } from '../lib/enum'

class PositiveIntegerValidator extends WecValidator {
  id: any[]
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
  email: any[]
  password1: any[]
  password2: any[]
  username: any[]
  nickname: any[]
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
    // const user = await User.findOne({
    //   where: {
    //     email
    //   }
    // })
    // if (user) {
    //   throw new Error('Email 已存在')
    // } else {
    //   return true
    // }
  }
}

class TokenValidatar extends WecValidator {
  account: any[]
  secret: any[]
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
  token: any[]
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
  page: any[]
  size: any[]
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
  name: any[]
  id: any[]
  topic_img_id: any[]
  description: any[]
  is_check_show: any[]
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
  ac: any[]
  se: any[]
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
  username: any[]
  nickname: any[]
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
  name: any[]
  code: any[]
  url: any[]
  type: any[]
  order: any[]
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
  type: any[]
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

  constructor() {
    super()
  }
}

export default {
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