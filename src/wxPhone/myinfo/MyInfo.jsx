import React, { Component } from 'react';
import { Col, Row, Button} from 'antd';
import UserApis from '../../lib/userInfo';
import moment from 'moment';
import stores from '../../lib/store';

class MyInfo extends Component {
	componentDidMount () {
	    document.title = '我的账号';
	 	stores.getAlipayInfo();
	}
	render () {
		console.log(moment);
		let user = UserApis.getUser() || {};
		console.log(user);
		let mobile = user.mobile || '';
    	let aliAccount = UserApis.getAccount() || '';
    	const dates = user.createdAt || '';
    	let creatTime = moment(dates).format('YYYY-MM-DD');
		return (
			<Row>
		      <Col span={12} className="info_top">
		      	<div className="info_top_num">500</div>
		      	<div className="info_top_words">总活跃人数 </div>
		      </Col>
		      <Col span={12} className="info_top">
		      	<div className="info_top_num">50000</div>
		      	<div className="info_top_words">总金额（元）</div>
		      </Col>
		      <Col span={20} offset={2} className="info_bigbox">
		      	<div className="info_box">
		      		<span className="info_name">手机号码</span><span className="info_content">{mobile}</span>
		      	</div>
		      </Col>
		      <Col span={20} offset={2} className="info_bigbox">
		      	<div className="info_box">
		      		<span className="info_name">支付宝账号</span><span className="info_content">{aliAccount}</span>
		      	</div>
		      </Col>
		      <Col span={20} offset={2} className="info_bigbox">
		      	<div className="info_box">
		      		<span className="info_name">注册时间</span><span className="info_content">{creatTime}</span>
		      	</div>
		      </Col>		      
		      <Col span={12} className="change_box">
		      	<a href="#/updateaccount"><Button className="change_info">修改支付宝</Button></a>
		      </Col>
		      <Col span={12} className="change_box">
		      	<Button className="change_info">退出登录</Button>
		      </Col>
		    </Row>
		)
	} 
}

export default MyInfo;