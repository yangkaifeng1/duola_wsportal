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
  		debugger;
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
						<div className="company_con">{data.alipayAccount}</div>
					</Col>
					<Col span={15}>
						<div className="company_right">独立时总活跃人数(人)：{data.baseActive}</div>
						<div className="company_right">当前总活跃人数(人)：{data.active}</div>
						<div className="company_right">独立时累计使用三个月以上会员数(人)：{data.baseRenew}</div>
						<div className="company_right">当前累计使用三个月以上会员数(人)：{data.renew}</div>
						<div className="company_right">已获得目标奖(元)：{data.amount}</div>
						<div className="company_right">旗下分公司数量(个)：{data.children}</div>
						<div className="see_son" onClick={()=>this.judgeIcon()}>查看<Icon type={this.state.iocnDir} /></div>
					</Col>
				</Card>
					<Spin spinning={this.state.sonLoading}>
						{this.state.status?
									(dataSource? (dataSource.map((data, k) => {
										return(
											<div className="sec_big_box">
												<SonCompany data={data} key={k}/>									
											</div>
										)
									})
								):(<Col span={24} className="no_data">
				                <p>暂无数据</p>
				            	</Col>)
							): ""
						}
					</Spin>
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
						<div className="company_con">{data.createdAt}</div>
					</Col>
					<Col span={15}>
						<div className="company_right">独立时总活跃人数(人)：{data.baseActive}</div>
						<div className="company_right">当前总活跃人数(人)：{data.active}</div>
						<div className="company_right">独立时累计使用三个月以上会员数(人)：{data.baseRenew}</div>
						<div className="company_right">当前累计使用三个月以上会员数(人)：{data.renew}</div>
						<div className="company_right">已获得目标奖(元)：{data.amount}</div>
						<div className="company_right">旗下分公司数量(个)：{data.children}</div>

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
				<Spin spinning={this.state.loading} className="data_loading">
					{dataSource? (
						dataSource.map((data, k) => {
								return(
									<BigCompany data={data} key={k}/>
								)
							})
						):(<Col span={24}>
		                <p>暂无数据</p>
		            	</Col>)
					}
					{totalCount>=8? (<Col span={24} className="get_more" onClick={()=>this.getMore()}>点击加载更多</Col>): ""}
				</Spin>
			</div>	
		)
		
	}
}

export default Company;