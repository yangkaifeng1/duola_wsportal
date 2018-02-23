import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import stores from '../lib/store';
import UserApis from '../lib/userInfo';
import datas from '../lib/settings';
import MD5 from 'crypto-js/md5';

let restful = datas.public.restful;
let dealerRest = datas.public.dealerRest;
const FormItem = Form.Item; 

class NormalLogin extends Component {
  constructor (props) {
      super(props);
      this.state = {
          showTips: "获取验证码", //验证，码提示文字
          verifyBtn: false // 设定验证码不能重复点击
      }
  }

  getVerifyCode () {
    let that = this;
    let mobile = this.props.form.getFieldValue("mobile");
    let url = dealerRest.url+dealerRest.dealership;
    if (!stores.verifyMobile(mobile)) {
      return;
    }
    fetch(
      url,
      {
        method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile
                })
      }
    ).then(res=>res.json()).then(response=>{
      if (response.statusCode === 200) {
        console.log(response);
        stores.getVcCode(mobile);
      } else{
        message.error(response.msg, 1.5);
        that.props.router.push('/dealership');
        return;
      }
    })
    
  }  

  checkVcCode (mobile, veriCode) {
    let that = this;
    let url = restful.restUrl+restful.vUrl;
    let loginUrl = restful.loginUrl;
    let appkey = restful.appkey;
    let sign = MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString();
    let data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mobile: mobile,
            veriCode: veriCode,
            sign: sign
        })
    };
    fetch(url, data).then(res=>res.json()).then(response=>{
      console.log(response);
      return response;
    }).then(response=>{
      let url = restful.restUrl+restful.loginUrl;
      let authKey = response.authKey;
      let data = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              mobile: mobile,
              authKey: authKey
          })
      };
      fetch(url, data).then(res=>res.json()).then(response=>{
        if (response.statusCode === 200) {
          console.log(response);
          let token = response.data.token;
          let user = response.data.user;
          UserApis.setToken(token);
          UserApis.setUser(user);
          stores.getAlipayInfo();
          that.props.router.push('/home');
        }
      })    
    })  
  }



  handleSubmit () {
    let veriCode = this.props.form.getFieldValue("verifyCode");
    let mobile = this.props.form.getFieldValue("mobile");
    this.checkVcCode(mobile, veriCode);
  }

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
          btnMessage: "发送验证码",
          htmlType: "button",
          key: 1
        },
        {
          name: "verifyCode",
          label: "验证码",
          message: "请输入验证码",
          btnType: "primary",
          btnFn: that.handleSubmit,
          btnMessage: "登录",
          htmlType: "submit",
          disabled: false,
          key: 2
        }
      ]
    }
    
	  return (
	  	<Row type="flex" justify="space-around" align="middle" className="login-box">
  	      <Col xs={16} sm={16} md={8} lg={8} className="little-loginbox">
  	    	<Form className="login-form">
  	    	  <Row gutter={8} >
              <Col span={12} offset={6}>
                <h2>推广系统</h2>
              </Col>
            </Row>
            {
              form.options.map( (doc)=> {
                return (
                  <FormItem  key={doc.key}>
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
                          htmlType={doc.htmlType}  
                          onClick={doc.btnFn && doc.btnFn.bind(this)}
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
            <a href="#/loginpass"><Button type="primary">密码登录</Button></a>
          </Col>
  	    </Col>
  	  </Row>
	  );
	}
};

const Login = Form.create()(NormalLogin);
export default Login;