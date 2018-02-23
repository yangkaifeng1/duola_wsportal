import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Spin } from 'antd';
let {Promseify, UserApis} = DORA;
const FormItem = Form.Item;

let LoginPass = Form.create()(React.createClass ({
	contextTypes: {
	    router: React.PropTypes.object
	},

	handleSubmit  (e) {
		let that = this;
	    e.preventDefault();
	    this.props.form.validateFieldsAndScroll((err, values) => {
	      Meteor.loginWithPassword(values.userAccount, values.password,function(err,res){
	      	if(err){
	      		message.error('你的账号或密码不正确', 2);
	      		return;
	      	}
	      	let _id = localStorage.getItem("Meteor.userId");
	      	if(_id){
	      		Meteor.call("checkById", _id, function(err, res){
	      			if(err){
	      				message.error('您还没有实名认证，请先去实名认证', 2);
            			that.context.router.push('/dealership');
            			return;
	      			}else{
	      				let user = {
	      					_id: _id,
	      					mobile: res.username,
	      					createdAt: res.createdAt,
	      				}
	      				let token = localStorage.getItem("Meteor.loginToken");
	      				let tokenExpires = localStorage.getItem("Meteor.loginTokenExpires");
	      				UserApis.setUser(user);
	      				UserApis.setToken(token);
	      				Accounts.makeClientLoggedIn(_id, token, new Date(tokenExpires));

	      				if (_id) {
	      					Meteor.call ('getAliInfo', _id, function(err, res){
					          if (res) {
					            let aliAccount =  AppGlobal.getDataByPath(res, "alipayInfo.account");
					            UserApis.setAccount(aliAccount);
					          }
					        })
	      					Meteor.call ('checkUserPower', _id, function(res){
					          if(!res){
					            UserApis.setPower();
					          }
					          that.context.router.push('/home');
					        })
	      				}
	      			}
	      		})
	      	}
	      })
	    });
	},
	
	render(){
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
                <FormItem {...formItemLayout} label="账号" hasFeedback>
                    {getFieldDecorator('userAccount', {
                      rules: [{
                        required: true, message: ' 您好，请输入您的账号',
                      }]
                    })
                    (
                      <Input />
                    )}
                </FormItem>  
                <FormItem {...formItemLayout} label="密码" hasFeedback>
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true, message: '您好，请输入您的密码',
                      }],
                    })(
                      <Input type="password"/>
                    )}
                </FormItem>  
	            	<FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">登录</Button>
                </FormItem>
	  	    	</Form>
	  	    </Col>
	  	  </Row>
	  )
	}
}));

export default LoginPass;