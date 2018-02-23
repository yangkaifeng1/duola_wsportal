import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import stores from '../../../lib/store';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';
import MD5 from 'crypto-js/md5';

let restful = datas.public.restful;
  
const FormItem = Form.Item;

class NormalChangeAlipay extends Component{
  constructor (props) {
      super(props);
      this.state = {
          showTips: "获取验证码", //验证，码提示文字
          verifyBtn: false // 设定验证码不能重复点击
      }
  }

  getCode (mobile) {
    stores.getVcCode (mobile);
  }

  handleSubmit () {
      let that = this;
      that.props.form.validateFieldsAndScroll((err, values) => {
        let url = restful.restUrl + restful.setAccount;
        let mobile = values.mobile;
        let loginUrl = restful.loginUrl;
        let appkey = restful.appkey;
        let token = UserApis.getToken();
        let sign = MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString();
        let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
                account: values.account,
                name: values.name,
                veriCode: values.veriCode,
                mobile: mobile,
                sign: sign
            })
        }
        fetch(url, data).then(res=>res.json()).then(response=>{
          console.log(response);
          if (response.statusCode === 200) {
            stores.getAlipayInfo();
            that.props.router.push('/home');
          } else {
            message.error(response.msg, 1.5)
          }
        })
      })
  }

  render(){
    let userMobile = UserApis.getUser().mobile || ''; 
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
            <Form  className="login-form">
                <Row gutter={8} >
                  <Col span={12} offset={6}>
                      <h2>推广系统</h2>
                  </Col>
                </Row>
                <FormItem {...formItemLayout} label="姓名" hasFeedback>
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: ' 您好，请输入您的真实姓名',
                        }]
                      })(<Input />)
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="支付宝账号" hasFeedback>
                    {getFieldDecorator('account', {
                        rules: [{
                          required: true, message: ' 您好，请输入您要修改的支付宝账号',
                        }]
                      })(<Input />)
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="电话号码" hasFeedback>
                    {getFieldDecorator('mobile', {
                        initialValue: userMobile
                      })(<Input disabled="disabled"/>)
                    }
                </FormItem>  
                <FormItem {...formItemLayout} label="验证码" hasFeedback>
                  <Row gutter={8}>
                    <Col span={12}>  
                      {getFieldDecorator('veriCode', {
                        rules: [{
                          required: true, message: '您好，请输入验证码',
                        }],
                      })(
                        <Input type="text"/>
                      )}
                    </Col>
                    <Col span={12}>
                      <Button onClick={()=>{this.getCode(userMobile)}} disabled={this.state.verifyBtn}>{this.state.showTips}</Button>
                    </Col>
                  </Row>   
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={()=>this.handleSubmit()} size="large">提交</Button>
                </FormItem>
            </Form>
          </Col>
        </Row>
    )
  }
}
const ChangeAlipay = Form.create()(NormalChangeAlipay);
export default ChangeAlipay;