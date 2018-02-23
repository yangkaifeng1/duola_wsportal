import React, { Component } from 'react';
import { Card, Col, Icon, Spin} from 'antd';
import UserApis from '../../lib/userInfo';
import datas from '../../lib/settings';

const dealerRest = datas.public.dealerRest;

class BigCompany extends Component{
	constructor (props) {
      	super(props);
      	this.state = {
      		status: false,
      		sonLoading: false,
      		iocnDir: "down",
      		dataSource: false,
      	}
  	}
  	judgeIcon () {
  		if (this.state.iocnDir == 'down') {
  			this.getSon();
  		} else{
  			this.setState({
  				iocnDir: "down",
  				status: !this.state.status,
  				sonLoading: false
  			})
  		}
  	}
  	getSon () {
  		this.setState({
  			iocnDir: "up",
  			status: !this.state.status,
  			sonLoading: true
  		})
  		let that = this;
  		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.companySon;
		let data = {
			method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
            	page: 1,
	    		pageSize: 5
            })
		};
		fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response);
        		that.setState({
        			sonLoading: false  
        		})
        		if (response.info && response.info.length) {
        			that.setState({
	        			dataSource: response.info
	        		})
        		} else {
        			that.setState({
	        			dataSource: false,
	        		})
        		}
        	}
        })
  	}

	render () {
		console.log(this.props);
		const data = this.props.data || '';
		let dataSource = this.state.dataSource;
		console.log(dataSource)
		return(
			<div>
				<Card className="company_box">
					<Col span={9}>
						<div className="company_left">公司名称</div>
						<div className="company_con">我的公司</div>
						<div className="company_left">独立时间</div>
						<div className="company_con">{data.createdAt}</div>
						<div className="company_left">企业支付宝账号</div>
						<div className="company_con">131232431</div>
					</Col>
					<Col span={15}>
						<div className="company_right">独立时总活跃人数(人)：1111</div>
						<div className="company_right">当前总活跃人数(人)：111</div>
						<div className="company_right">独立时累计使用三个月以上会员数(人)：111</div>
						<div className="company_right">当前累计使用三个月以上会员数(人)：11</div>
						<div className="company_right">已获得目标奖(元)：11111</div>
						<div className="company_right">旗下分公司数量(个)：22</div>
						<div className="see_son" onClick={()=>this.judgeIcon()}>查看<Icon type={this.state.iocnDir} /></div>
					</Col>
				</Card>
					
						{this.state.status?
									
											<div className="sec_big_box">
												<SonCompany/>									
												<SonCompany/>									
												<SonCompany/>									
											</div>
									
							: ""
						}
			</div>
		)
	}
}

class SonCompany extends Component{
	constructor (props) {
      	super(props);
  	}
	render () {
		const data = this.props.data;
		console.log(this.props)
		return(
			<div>
				<Card className="soncompany_box">
					<Col span={9}>
						<div className="company_left">公司名称</div>
						<div className="company_con">多啦衣梦啊</div>
						<div className="company_left">独立时间</div>
						<div className="company_con">2018.11.11</div>
					</Col>
					<Col span={15}>
						<div className="company_right">独立时总活跃人数(人)：11</div>
						<div className="company_right">当前总活跃人数(人)：11</div>
						<div className="company_right">独立时累计使用三个月以上会员数(人)：11</div>
						<div className="company_right">当前累计使用三个月以上会员数(人)：11</div>
						<div className="company_right">已获得目标奖(元)：11</div>
						<div className="company_right">旗下分公司数量(个)：11</div>

					</Col>
				</Card>
			</div>
		)
	}
}

class Company extends Component {
	constructor (props) {
      	super(props);
      	this.state = {
      	  dataSource: [],
      	  totalCount: 0,
      	  page: 1,
      	  pageSize: 6,
      	  loading: false
      	}
  	}

	getCompanyInfo () {
		let that = this;
		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.company;
		let data = {
			method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
            	page: this.state.page,
	    		pageSize: this.state.pageSize
            })
		};
		that.setState({loading: true});
		fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response);
        		let dataSource = that.state.dataSource || [];
        		that.setState({
        			dataSource: dataSource.concat(response.info),
        			totalCount: response.info.totalCount,
        			loading: false
        		})
        		let totalCount = this.state.totalCount;
    			
        	}
        })	
	}

	componentDidMount () {
		this.getCompanyInfo();
		document.title = "我的公司";
	}

	render () {
		const dataSource = this.state.dataSource || "";
		const totalCount = this.state.totalCount || "";
		console.log(dataSource);
		return(
			<div>
				<BigCompany/>
			</div>	
		)
		
	}
}

export default Company;