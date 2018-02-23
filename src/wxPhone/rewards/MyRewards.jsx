import React, { Component } from 'react';
import {  Row, Col, Card, Icon, Spin } from 'antd';
import UserApis from '../../lib/userInfo';
import datas from '../../lib/settings';

let dealerRest = datas.public.dealerRest;

class MyRewardsChild extends Component {
	constructor (props) {
      	super(props);
  	}
  	componentDidMount () {
	    document.title = '我的奖励'
	}
	render () {
      	const data = this.props.data;
      	const cashData = this.props.cashData;
		console.log(this.props)
		return(
			<div>
			    <Row>
			      <Col span={24} className="back_name headers">
			      	<div className="cash_num">{cashData.cashable}</div>	
			      	<div className="cash_able">可提现金额（元）</div>	
			      	<div className="total_cash">总金额{cashData.amount}</div>	
			      </Col>
			      <Col span={12} className="back_name left">
			      	<p>{cashData.pending}</p>
			      	<p>正在提现（元）</p>
			      </Col>
			      <Col span={12} className="back_name right">
			      	<p>{cashData.cashed}</p>
			      	<p>已提现（元）</p>
			      </Col>
			      <Col span={24} className="back_name detail">
			      	<span>奖励明细</span>
			      	<a href="#/phonecashlist" className="cash_detail"><Icon type="right"/></a>
			      </Col>
			    </Row>

			    <Row>
			    	<Col span={24} className="rewards_type">奖励类型<span className="get_money">（推荐奖请在APP我的账号优惠券中提现）</span></Col>
			    	<Col span={24}>
			    		<Card className="money_detail">
			    			<div className="more_detail">推荐奖： ￥{data.refer}</div>
			    			<div className="more_detail">维护奖： ￥{data.renew}</div>
			    			<div className="more_detail">教育奖： ￥{data.education}</div>
			    			<div className="more_detail">目标奖： ￥{data.target}</div>
			    			<div className="more_detail">目标培训奖： ￥{data.eduTarget}</div>
			    		</Card>
			    	</Col>
			    </Row>
			</div>
		)
		
	} 
}
class MyRewards extends Component {
	constructor (props) {
	    super(props);
	    this.state = {
	        data: {
	        	eduTarget:"0",
		        education:"0",
		        refer:"0",
		        renew:"0",
		        target:"0"
	        },
	        cashData: {
	        	amount: '0',
				cashable: '0',
				cashed: '0',
				pending:'0'
	        },
	        loading: false
	    }
	}
	getCashInfo () {
		let that = this;
		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.cash;
		let data = {
			method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
            	page: 1,
	    		pageSize: 1
            })
		};
		that.setState({loading: true});
		fetch(url, data).then(res=>res.json()).then(response=>{
			this.setState({
				loading: false
			})
        	if (response.statusCode === 200) {
        		console.log(response);
        		that.setState({
        			cashData: {
        				amount: response.info.summary.amount,
						cashable: response.info.summary.cashable,
						cashed: response.info.summary.cashed,
						pending: response.info.summary.pending
        			}
        		})
        	}
        })
	}	
	getRewardsInfo () {
	    let that = this;
	    let token = UserApis.getToken();
	    let url = dealerRest.url + dealerRest.rewardsUrl;
	    let data = {
	        method: "POST",
	        headers: {
	            "Content-Type": "application/json",
	            token: token
	        }
	    };
	    this.setState({loading: true})
	    fetch(url, data).then(res=>res.json()).then(response=>{
	    	this.setState({
				loading: false
			})
	      	console.log(response);
	        if (response.statusCode === 200) {
	            that.setState({
	              	data: response.info
	            })
	        }
	    })
	}

	componentDidMount () {
	    this.getRewardsInfo();
	    this.getCashInfo();
	} 

	render () {
		return(
			// <Spin spinning={this.state.loading}>
				<MyRewardsChild data={this.state.data} cashData={this.state.cashData}/>
			// </Spin>
		)
	}

}
export default MyRewards;