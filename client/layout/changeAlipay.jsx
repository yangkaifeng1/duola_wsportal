import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Spin } from 'antd';
let {Promseify, UserApis} = DORA;
const FormItem = Form.Item;
let sign;

let changeAlipay = Form.create()(React.createClass ({
  getInitialState: function () {
    return {
      showTips: "获取验证码", //验证，码提示文字
      verifyBtn: false // 设定验证码不能重复点击
    }
  },

  contextTypes: {
      router: React.PropTypes.object
  },

  verifyMobile: (mobile) => {
    reg = /^0?1[3|4|7|5|6|8|9|][0-9]\d{8}$/;
    if (!reg.test(mobile)){
      message.error("您必须输入正确的电话号码",  1.5);
      return false;
    }
    return true;
  },

  // 获取验证码
  getCode () {
    let mobile = this.props.form.getFieldValue("mobile"),
      {appkey, restUrl, vcUrl, loginUrl} = Meteor.settings.public.restful,
      data, 
      that = this;
    if (!that.verifyMobile(mobile)) {
      return;
    }
      
    that.setState({showTips: "已发送", verifyBtn: "disabled"});
    sign = CryptoJS.MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString()
    data = {
      mobile: mobile,
      url:  loginUrl,
      sign: sign,
      sendToBound: true
    }
    Promseify.HTTPpromise("POST", `${restUrl}${vcUrl}`, {data}).then(function (res) {
      let content = JSON.parse(res.content)|| {};
      if (content.statusCode !== 200) {
        message.error(`发送验证码错误: ${content.msg}`,  1.5);
        that.setState({loading: false});
      }

    }, function (error){
    });
          
  },
// 提交修改结果
  handleSubmit  (e) {
    let that = this;
      e.preventDefault();
      that.props.form.validateFieldsAndScroll((err, values) => {
            let aliAccount = values.aliAccount,
            mobile = values.mobile,
            veriCode = values.code,
            data = {},
            {restUrl, vUrl, loginUrl} = Meteor.settings.public.restful, authKey, expiredAt;

          if (!aliAccount) {
            message.error("您必须输入支付宝账号",  1.5);
            return;
          }

          if (!that.verifyMobile(mobile)) {
            return;
          }
          if (!code) {
            message.error("您必须输入验证码",  1.5);
            return;
          }
          data = {mobile, veriCode, sign}

          Promseify.HTTPpromise("POST", `${restUrl}${vUrl}`, {data}).then(function (res) {

            let content = JSON.parse(res.content)|| {};
            if (content.statusCode !== 200) {
              message.error(`验证码错误: ${content.msg}`,  1.5);
              return;
            } else {
              let data = {
                mobile: mobile,
                alipayAccount: aliAccount
              } 
              Meteor.call ("aliAccountChange", data, function (error, response) {
                if (response) {
                  UserApis.setAccount(aliAccount);
                  that.context.router.push('/home');
                } else {
                  message.error(`修改失败`,  1.5);
                }
              })  
            }
          })
      });
  },
  
  render(){
    const users = UserApis.getUser() || {};
    const userMobile = users.mobile;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 14,
            offset: 6,
          },
        },
      };
      return (
      <Row type="flex" justify="space-around" align="middle" className="login-box">
            <Col xs={16} sm={16} md={8} lg={8} className="little-loginbox">
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Row gutter={8} >
                  <Col span={12} offset={6}>
                      <h2>推广系统</h2>
                  </Col>
                </Row>
                <FormItem {...formItemLayout} label="支付宝账号" hasFeedback>
                    {getFieldDecorator('aliAccount', {
                      rules: [{
                        required: true, message: ' 您好，请输入您要修改的支付宝账号',
                      }]
                    })
                    (
                      <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="电话号码" hasFeedback>
                    {getFieldDecorator('mobile', {
                      initialValue: userMobile
                    })
                    (
                      <Input disabled="disabled"/>
                    )}
                </FormItem>  
                <FormItem {...formItemLayout} label="验证码" hasFeedback>
                  <Row gutter={8}>
                    <Col span={12}>  
                      {getFieldDecorator('code', {
                        rules: [{
                          required: true, message: '您好，请输入验证码',
                        }],
                      })(
                        <Input type="text"/>
                      )}
                    </Col>
                    <Col span={12}>
                      <Button onClick={this.getCode} disabled={this.state.verifyBtn}>{this.state.showTips}</Button>
                    </Col>
                  </Row>   
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
          </Col>
        </Row>
    )
  }
}));

export default changeAlipay;