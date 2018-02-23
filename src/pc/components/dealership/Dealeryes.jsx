import React, { Component } from 'react';
import { Button, message } from 'antd';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';

let dealerRest = datas.public.dealerRest;

class Dealeryes extends Component{
	handleClick () {
		debugger;
		let that = this;
		let url = dealerRest.url + dealerRest.keepInfo; 
		let name = UserApis.getIdentity();
		let phone = UserApis.getPhone();
		let cardNum = UserApis.getCardnum();
		let alipayAccount = UserApis.getAccount();
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: phone, 
                account: alipayAccount,
                name: name,
                certNo: cardNum
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response);
        		that.props.router.push('/login');
        	} else {
        		message.error(response.msg, 1.5);
        	}
        })
	}

	render () {
		return(
			<div className="dealeryes">
				<p className="success-msg">您已经实名认证成功，点击返回到登录页面</p>
				<div>
					<Button type="primary" size="large" className="back-login"  onClick={() => this.handleClick()}>
						<span className="ret-size">返回</span>
					</Button>
				</div>
			</div>
		)
	}
}

export default Dealeryes;
