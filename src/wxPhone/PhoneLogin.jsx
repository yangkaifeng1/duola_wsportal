import React, { Component } from 'react';
import {Form, Button, Tabs, Col, message,Spin} from 'antd';
import '../style/phone.css';
import stores from '../lib/store';
import UserApis from '../lib/userInfo';
import datas from '../lib/settings';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';

let restful = datas.public.restful;
let dealerRest = datas.public.dealerRest;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class NormalDigestLogin extends Component {
  constructor (props) {
      super(props);
      this.state = {
          showTips: "获取验证码", //验证，码提示文字
          verifyBtn: false // 设定验证码不能重复点击
      }
  }
  loginWihDigest (mobile, digest) {
    let that = this;
    let url = restful.restUrl+restful.digest;
    let digests = SHA256(digest).toString();
    console.log(digests);
    let data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: mobile,
            digest: digests
        })
    };

    fetch(url, data).then(res=>res.json()).then(response=>{
      that.setState({
        loading: false
      })
      if (response.statusCode === 200) {
        let token = response.data.token;
        let user = response.data.user;
        UserApis.setToken(token);
        UserApis.setUser(user);
        that.props.router('/menu');
      } else {
        message.error(response.msg, 1.5)
      }
    })
  }

  checkDealership (mobile, digest) {
      let that = this;
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
          that.loginWihDigest(mobile, digest);  
        } else{
          message.error(response.msg, 1.5);
          that.props.router('/register');
          return;
        }
      })
  }

  handleSubmit () {
    let that = this;
    that.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let username = values.userAccount;
        let digest = values.password;
        that.checkDealership(username, digest); 
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return(
        <Form>
          <FormItem>
            {getFieldDecorator('userAccount', {
                rules: [{
                  required: true, message: ' 您好，请输入您的账号',
                }]
              })(<input type="text"  className="login_input"/>)
            }
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '您好，请输入您的密码',
                }],
              })(<input type="password"  className="login_input"/>)
            }
          </FormItem>
          <FormItem>
            <Button className="login_input sub_btn" onClick={()=>this.handleSubmit()}>立即登录</Button>
          </FormItem>
        </Form>
    )
  }
}

class NormalCodeLogin extends Component {
  constructor (props) {
      super(props);
      this.state = {
          showTips: "获取验证码", //验证，码提示文字
          verifyBtn: false, // 设定验证码不能重复点击
      }
  }

  getCode () {
    let that = this;
    let mobile = this.props.form.getFieldValue("mobile1");
    let url = dealerRest.url+dealerRest.dealership;
    if (!stores.verifyMobile(mobile)) {
        return;
    }
    that.setState({
      showTips: "已发送" 
    })
    let data = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          mobile: mobile
      })
    }
    fetch(url, data).then(res=>res.json()).then(response=>{
      that.setState({
        loading: false
      })
      if (response.statusCode === 200) {
        console.log(response);
        stores.getVcCode(mobile);
      } else{
        message.error(response.msg, 1.5);
        that.props.router('/register');
        return;
      }
    })
  }

  handleSubmit () {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let veriCode = this.props.form.getFieldValue("code");
        let mobile = this.props.form.getFieldValue("mobile1");
        this.checkVcCode(mobile, veriCode);
      }
    });
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
          debugger
          that.props.router('/menu');
        }
      })    
    })  
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return(
        <Form>
          <FormItem>
            {getFieldDecorator("mobile1", {
              rules: [{ required: true, message: "请输入手机号码" }],
            })(
              <input size="large" className="login_input"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("code", {
              rules: [{ required: true, message: "请输入手机号码" }],
            })(
              <input size="large"  className="login_input get_code"/>
            )}
            <Button className="get_code_btn" onClick={()=>this.getCode()}>{this.state.showTips}</Button>
          </FormItem>
          <FormItem>
            <Button className="login_input sub_btn" onClick={()=>this.handleSubmit()}>立即登录</Button>
          </FormItem>
        </Form> 
    )
  }
}

class PhoneLogin extends Component {
  componentDidMount () {
    document.title = '登录'
  }

  render () {
      console.log(this);
       return (
         <div id="tas">
           <Col span={18} offset={3}>
             <Tabs defaultActiveKey="2" className="tas">
                 <TabPane tab="手机登录" key="1" className="login-tabs">
                    <CodeLogin router={this.props.router.push}/>
                 </TabPane>
                 <TabPane tab="密码登录" key="2" className="login-tabs">
                    <DigestLogin router={this.props.router.push}/>
                 </TabPane>
             </Tabs>
           </Col>  
         </div>
       )
    }
}

const DigestLogin = Form.create()(NormalDigestLogin);
const CodeLogin = Form.create()(NormalCodeLogin);
export default PhoneLogin;