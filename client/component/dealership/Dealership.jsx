import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message} from 'antd';
let {Promseify, UserApis} = DORA;

const FormItem = Form.Item;

let Dealership = Form.create()(React.createClass({
  handleSubmit  (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        let {account, password, callback, callbackfailure} = Meteor.settings.public.realCheck;
        let absoluteUrl = Meteor.absoluteUrl();
        let callbackUrl = `${absoluteUrl}${callback}`;
        let callbackFailureUrl = `${absoluteUrl}${callbackfailure}`;
        let data = {
          "account": account,
          "password": password,
          "name": values.name,
          "certNo": values.cardNum,
          "callback": callbackUrl,
          "callbackfailure": callbackFailureUrl
        };    
        UserApis.setIdentity(values.name);
        UserApis.setPhone(values.phone);
        UserApis.setCardnum(values.cardNum);
        UserApis.setAccount(values.alipayAccount);

        Meteor.call("getUserUrl", data, function(err, res){
            let checkUrl=JSON.parse(res.content).data.url;
            window.location.href = checkUrl;
        });
      }
    });
  },

  verifyMobile ( rule, value, callback) {
    reg = /^0?1[3|4|7|5|6|8|9|][0-9]\d{8}$/;
    if (!reg.test(value)){
      callback('请你输入正确的电话号码');
    }
    callback();
  },
	render () {
    const { getFieldDecorator } = this.props.form;
    let that = this;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };

		return(
			<Row type="flex" justify="space-around" align="middle" className="login-box">
	  	      <Col xs={16} sm={16} md={8} lg={8} className="little-loginbox">
	  	    	<Form onSubmit={this.handleSubmit} className="login-form">
	  	    	  	<Row gutter={8} >
		             	<Col span={12} offset={6}>
		                	<h2>推广系统账户注册</h2>
		              </Col>
	            	</Row>
                <FormItem {...formItemLayout} label="电话" hasFeedback>
                    {getFieldDecorator('phone', {
                      rules: [{
                        required: true, message: '您好'
                      }, {
                        validator: this.verifyMobile,
                      }]
                    })
                    (
                      <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="支付宝账号" hasFeedback>
                    {getFieldDecorator('alipayAccount', {
                      rules: [{
                        required: true, message: ' 您好，请输入您的支付宝账号',
                      }]
                    })
                    (
                      <Input />
                    )}
                </FormItem>  
                <FormItem {...formItemLayout} label="姓名" hasFeedback>
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '您好，请输入您的真实姓名',
                      }],
                    })(
                      <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="身份证号码" hasFeedback>
                    {getFieldDecorator('cardNum', {
                      rules: [{
                        required: true, message: '您好，请输入您的身份证号码',
                      }],
                    })(
                      <Input />
                    )}
                </FormItem>  
	            	<FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">认证</Button>
                </FormItem>
	  	    	</Form>
	  	    </Col>
	  	  </Row>
		)
	}
}))

export default Dealership;