// import React, { Component } from 'react';
// import {Form, Button, Tabs, Icon, Col, Input} from 'antd';

// let {Promseify, UserApis} = DORA;
// const FormItem = Form.Item;
// const TabPane = Tabs.TabPane;

// let phoneLogin = Form.create()(React.createClass ({
// 	render () {
// 		const tabBarStyle = {
// 			textAlign: "center",
// 			width: "50%",
// 			marginRight: "0"
// 		}
// 		return (
// 			<div className="tas">
// 				<Col span={18} offset={3}>
// 					<Tabs defaultActiveKey="2" className="tas">
// 					    <TabPane tab="手机登录" key="1">
// 					      <Form>
// 					      	<FormItem>
// 					      		<Input className="userInput"/>
// 					      	</FormItem>
// 					      	<FormItem>
// 					      		<Input className="userInput"/>
// 					      	</FormItem>
// 					      	<FormItem>
// 					      		<Input type="button" value="立即登录" className="userInput"/>
// 					      	</FormItem>
// 					      </Form>
// 					    </TabPane>
// 					    <TabPane tab="密码登录" key="2">
// 					      <Form>
// 					      	<FormItem>
// 					      		<Input prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} type="text" size="large" className="userInput"/>
// 					      	</FormItem>
// 					      	<FormItem>
// 					      		<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" size="large" className="userInput"/>
// 					      	</FormItem>
// 					      	<FormItem>
// 					      		<Input type="button" value="立即登录" className="userInput"/>
// 					      	</FormItem>
// 					      </Form>
// 					    </TabPane>
// 					</Tabs>
// 				</Col>	
// 			</div>
// 		)
// 	}
// }))

// export default phoneLogin;