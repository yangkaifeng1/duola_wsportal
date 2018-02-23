import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Spin } from 'antd';
import {LoginMessage} from '../lib/constant';

let {Promseify, UserApis} = DORA;

const FormItem = Form.Item;
let sign;


let Login = Form.create()(React.createClass ({
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

	handleSubmit(e) {
	  e.preventDefault();

	  let that = this,
      veriCode = this.props.form.getFieldValue("verifyCode"),
      mobile = this.props.form.getFieldValue("mobile"),
      data = {},
      {restUrl, vUrl, loginUrl} = Meteor.settings.public.restful, authKey, expiredAt;

    if (!that.verifyMobile(mobile)) {
      return;
    }

    if (!veriCode) {
      message.error("您必须输入验证码",  1.5);
      return;
    }
    data = {mobile, veriCode, sign}

    Promseify.HTTPpromise("POST", `${restUrl}${vUrl}`, {data}).then(function (res) {
      let content = JSON.parse(res.content)|| {};
      if (content.statusCode !== 200) {
        // message.error(`验证码错误: ${content.msg}`,  1.5);
        return;
      } else {
        return content;
      }
    }).then( function (doc) {
      if (!doc) {
        // message.error(`验证错误`,  1.5);
        return;
      } else {
        authKey = doc.authKey;
        expiredAt= doc.expiredAt;
        return Promseify.HTTPpromise("POST",`${restUrl}${loginUrl}`, {data: {mobile, authKey}});
      } 
    }).then(function (res) {
      if(!res) {
        message.error(`登录错误！`,  1.5);
        return;
      }
      resInfo = (JSON.parse(res.content)|| {}).data;
      let {token, tokenExpires, user} = resInfo;

      if (!user) {
        message.error(`用户查询错误: ${content.msg}`,  1.5);
      }
      let {_id} = user;
      if(user._id){
        Meteor.call ('getAliInfo', _id, function(err, res){
          if (res) {
            let aliAccount =  AppGlobal.getDataByPath(res, "alipayInfo.account");
            UserApis.setAccount(aliAccount);
          }
        })
        Meteor.call('checkUserPower', user._id, function(res){
          if(!res){
            UserApis.setPower();
          }
          that.context.router.push('/home');
        })
      }

      UserApis.setUser(user);
      UserApis.setToken(token);
      Accounts.makeClientLoggedIn(_id, token, new Date(tokenExpires));
    });
	},

  getVerifyCode(e) {
    localStorage.clear();
    let mobile = this.props.form.getFieldValue("mobile"),
      {appkey, restUrl, vcUrl, loginUrl} = Meteor.settings.public.restful,
      data, 
      that = this;

    if (!that.verifyMobile(mobile)) {
      return;
    }

    // 检查用户是否存在
    Meteor.call('existUser', mobile, function(err, res){
      if (err) {
        message.error('您还没有账号呢，快去注册吧', 2);
        return;
      }else{
        // 检查用户是否已实名认证
        Meteor.call("checkDealership", mobile, function(err, res){
          if (err) {
            message.error('您还没有实名认证，请先去实名认证', 2);
            that.context.router.push('/dealership');
            return;
          }else{
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
          }
        })
      }
    })    
  },

  loginPass(){
    localStorage.clear();
    this.context.router.push('/loginpass');
  },

	render() {
	  const { getFieldDecorator } = this.props.form;
    let that = this;
    let form = {
      style: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      options: [
        {
          name: "mobile",
          label: "电话号码",
          message: "请输入电话号码",
          btnType: "default",
          btnFn: that.getVerifyCode,
          btnMessage: that.state.showTips,
          htmlType: "button",
          disabled: that.state.verifyBtn
        },
        {
          name: "verifyCode",
          label: "验证码",
          message: "请输入验证码",
          btnType: "primary",
          btnFn: false,
          btnMessage: "登录",
          htmlType: "submit",
          disabled: false
        }
      ]
    }
    
	  return (
	  	<Row type="flex" justify="space-around" align="middle" className="login-box">
  	      <Col xs={16} sm={16} md={8} lg={8} className="little-loginbox">
  	    	<Form onSubmit={this.handleSubmit} className="login-form">
  	    	  <Row gutter={8} >
              <Col span={12} offset={6}>
                <h2>推广系统</h2>
              </Col>
            </Row>
            {
              form.options.map(function (doc) {
                return (
                  <FormItem  >
                    <label>{doc.label}</label>
                    <Row gutter={8}>
                      <Col span={16}>
                        {getFieldDecorator(doc.name, {
                          rules: [{ required: true, message: doc.message }],
                        })(
                          <Input size="large" />
                        )}
                      </Col>
                      <Col span={8}>
                        <Button 
                          size="large"
                          type={doc.type} 
                          htmlType={doc.htmlType}  
                          onClick={doc.btnFn}
                          disabled={doc.disabled}
                          type="primary"
                        >{doc.btnMessage}</Button>
                      </Col>
                    </Row>
                  </FormItem>
                )
              })
            }
            
  	    	</Form>
          <Col >
            <Button type="primary" onClick={this.loginPass}>密码登录</Button>
          </Col>
  	    </Col>
  	  </Row>
	  );
	}
}));

export default Login;