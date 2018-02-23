import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import stores from '../lib/store';
import UserApis from '../lib/userInfo';
import datas from '../lib/settings';
import SHA256 from 'crypto-js/sha256';

let restful = datas.public.restful;
let dealerRest = datas.public.dealerRest;

const FormItem = Form.Item;

class NormalLoginPass extends Component{
	loginWihDigest (mobile, digest, style) {
		let that = this;
		debugger;
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
        	console.log(response);
        	let token = response.data.token;
    		let user = response.data.user;
    		UserApis.setToken(token);
    		UserApis.setUser(user);
    		if (style === 'pc') {
    			debugger
    			that.props.router.push('/home');
    		}
        })
	}

	checkDealership (mobile, digest, style) {
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
	        that.loginWihDigest(mobile, digest, style);  
	      } else{
	        message.error(response.msg, 1.5);
	        that.props.router.push('/dealership');
	        return;
	      }
	    })
	}

	handleSubmit  (e) {
		let that = this;
	    e.preventDefault();
	    that.props.form.validateFieldsAndScroll((err, values) => {
	      	let username = values.userAccount;
	      	let digest = values.password;
	      	that.checkDealership(username, digest, 'pc');  
	    });
	}
	
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
	  	    	<Form className="login-form">
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
	                    })(<Input />)
	                }
                </FormItem>  
                <FormItem {...formItemLayout} label="密码" hasFeedback>
                    {getFieldDecorator('password', {
		                    rules: [{
		                        required: true, message: '您好，请输入您的密码',
		                    }],
	                    })(<Input type="password"/>)
	                }
                </FormItem>  
	            	<FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={()=>this.handleSubmit()} size="large">登录</Button>
                </FormItem>
	  	    	</Form>
	  	    </Col>
	  	  </Row>
	  )
	}
};

const LoginPass = Form.create()(NormalLoginPass);
export default LoginPass;