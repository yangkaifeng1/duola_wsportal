import React, { Component } from 'react';
import { Button, message, Spin } from 'antd';
let { Promseify, UserApis } = DORA;

let Dealeryes = React.createClass ({
	getInitialState() {
	    return {
	      loading: false
	    };
	},
	handleClick (e) {
		let that = this;
		that.setState({loading: true})
		let {account, password, getScore, login} = Meteor.settings.public.realCheck;
        let absoluteUrl = Meteor.absoluteUrl();
        let loginUrl = `${absoluteUrl}${login}`;
        let _id = localStorage.getItem("Meteor.userId") || ''; 
		let name = UserApis.getIdentity();
		let phone = UserApis.getPhone();
		let cardNum = UserApis.getCardnum();
		let alipayAccount = UserApis.getAccount();
		let data = {
			"account": account,
            "password": password,
            "name": name,
            "certNo": cardNum
		}
		let updateData = {_id, name, phone, cardNum, alipayAccount};
		Meteor.call("getzmScore", data, updateData, function(err, res){
           	if (res == '1') {
        		window.location.href = loginUrl;
        	} else {
        		that.setState({loading: false})
        		message.error(res, 1.5)
        	}
        })
	},

	render () {
		return(
			<div className="dealeryes">
				<div><Spin size="large" tip="loading..." spinning={this.state.loading}/></div>
				<p className="success-msg">您已经实名认证成功，点击返回到登录页面</p>
				<div>
					<Button type="primary" size="large" className="back-login"  onClick={this.handleClick}>
						<span className="ret-size">返回</span>
					</Button>
				</div>
			</div>
		)
	}
})

export default Dealeryes;
