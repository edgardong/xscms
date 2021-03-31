import React from 'react'
import { Button, Input, Form, Tree, Tag, Card, Divider } from 'antd'

// import CKEditor from 'ckeditor4-react'

// CKEditor.editorUrl = '/static/ckeditor/ckeditor.js'

import { getArticle, saveArticle, publishArticle } from '@/api/blog/article'
import categoryAPI from '@/api/blog/category'

import utils from '@/utils/utils'

import style from './style.less'

class ArticleDetail extends React.Component {
  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputConfirm = this.handleInputConfirm.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      article: null,
      readOnly: false,
      description: '',
      category: [],
      serverTags: [],
      selectedTags: [], //热门中选中的tag
      tags: [], // 文章的全部tag
      checkedKeys: [], // 分类选择的
      halfCheckedKeys: [], // 分类半选的
      inputValue: '', // 标签的输入值
    }
  }

  getHotTagsFormServer() {
    categoryAPI.getHotTag().then((resp) => {
      // console.log(resp)
      this.setState({
        serverTags: resp.data.map((d) => d.name),
      })
    })
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag)
    this.setState({ tags, selectedTags: tags })
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleTagChange(tag, checked) {
    if (checked) {
      this.handleInputConfirm(tag)
    } else {
      this.handleClose(tag)
    }
  }

  handleInputConfirm = (inValue) => {
    let inputValue =
      typeof inValue === 'string' ? inValue : this.state.inputValue
    let { tags } = this.state
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }
    this.setState({
      selectedTags: tags,
      tags,
      inputValue: '',
    })
  }

  handleDataChange(key, value, text) {
    this.setState({
      article: {
        ...this.state.article,
        [key]: value,
      },
    })
    if (text) {
      this.setState({
        description: text,
      })
    }
  }

  getCategory() {
    categoryAPI.getTree().then((resp) => {
      // console.log('分类的树', resp)
      this.setState({
        category: resp.data,
      })
    })
  }

  componentDidMount() {
    this.getCategory()
    this.getHotTagsFormServer()
    let { id } = this.props.match.params
    // console.log(this.props)
    if (id === 'new') {
      this.setState({
        article: {},
      })
      return
    }
    this.getArticleDetail(id)
  }

  getArticleDetail(id) {
    getArticle(id).then((resp) => {
      // console.log('文章详情', resp)
      let tags = resp.tags ? resp.tags.split(',') : []
      this.setState({
        article: resp,
        tags: tags,
        selectedTags: tags,
      })
    })
  }

  /**
   * 保存数据
   */
  handleSave() {
    let data = {
      article: {
        ...this.state.article,
        tags: this.state.tags,
        description:
          this.state.article.description ||
          this.state.description.substring(0, 200),
      },
      tags: this.state.tags,
      categorys: this.state.checkedKeys,
      halfcategorys: this.state.halfCheckedKeys,
    }
    saveArticle(data).then((resp) => {
      console.log('保存结果', resp)
      this.state.article.id = resp.data
      utils.successToast(resp.msg)
    })
  }

  handlePublish() {
    publishArticle(this.state.article.id).then((resp) => {
      console.log('发布结果', resp)
      utils.successToast(resp.msg)
    })
  }

  onCheck = (checkedKeys, { halfCheckedKeys }) => {
    // console.log('onCheck', checkedKeys, e.halfCheckedKeys)
    this.setState({
      article: {
        ...this.state.article,
        categorys: checkedKeys.join(','),
      },
      checkedKeys,
      halfCheckedKeys,
    })
  }

  render() {
    const article = this.state.article
    const tagsFromServer = this.state.serverTags
    const { selectedTags } = this.state
    return article ? (
      <div className={style.scrollbox1}>
        <div className={style.atricleBox}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            labelAlign="left"
          >
            <Form.Item className={style.formItem} label="文章标题">
              <Input
                onChange={(e) => this.handleDataChange('title', e.target.value)}
                placeholder="文章标题"
                value={article.title}
              ></Input>
            </Form.Item>
            <Form.Item className={style.formItem} label="关键字">
              <Input
                onChange={(e) =>
                  this.handleDataChange('keywords', e.target.value)
                }
                value={article.keywords}
                placeholder="文章关键字,多个以逗号隔开"
              ></Input>
            </Form.Item>
            <Form.Item className={style.formItem} label="文章简介">
              <Input.TextArea
                value={article.description}
                onChange={(e) =>
                  this.handleDataChange('description', e.target.value)
                }
                rows={3}
                placeholder="文章简介"
              ></Input.TextArea>
            </Form.Item>
          </Form>

          <div>
            {/* <CKEditor
              onChange={(e) =>
                this.handleDataChange(
                  'content',
                  e.editor.getData(),
                  e.editor.document.getBody().getText()
                )
              }
              data={article.content}
              readOnly={this.state.readOnly}
            /> */}
          </div>
        </div>
        <div className={style.rightBox}>
          <div className={style.buttonBox}>
            <Button.Group>
              <Button onClick={this.handleSave} type="primary">
                保存
              </Button>
              <Button onClick={this.handlePublish} type="ghost">
                发布
              </Button>
            </Button.Group>
          </div>

          {/* 文章分类部分 */}

          <div className={style.categoryBox}>
            <Card title="文章分类">
              {this.state.category.length > 0 ? (
                <Tree
                  checkable
                  checkedKeys={
                    this.state.article &&
                    this.state.article.categorys &&
                    this.state.article.categorys.length > 0
                      ? this.state.article.categorys.split(',')
                      : []
                  }
                  onCheck={this.onCheck}
                  treeData={this.state.category}
                ></Tree>
              ) : null}
            </Card>
          </div>

          {/* 文章标签部分 */}

          <div className={style.tagBox}>
            <Card title="文章标签">
              <div>
                <div style={{ marginRight: 8 }}>热门标签:</div>
                {tagsFromServer.map((tag) => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={(checked) => this.handleTagChange(tag, checked)}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
                <Divider></Divider>
                <div style={{ marginRight: 8 }}>
                  已选标签:
                  <Input
                    type="text"
                    size="small"
                    placeholder="输入新标签"
                    style={{ width: 100, marginLeft: 30 }}
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                </div>
                <div className={style.tags}>
                  {this.state.tags.length > 0
                    ? this.state.tags.map((tag, index) => (
                        <Tag
                          key={index}
                          closable
                          className={style.tagItem}
                          onClose={(e) => {
                            e.preventDefault()
                            this.handleClose(tag)
                          }}
                        >
                          {tag}
                        </Tag>
                      ))
                    : null}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    ) : null
  }
}

export default ArticleDetail
