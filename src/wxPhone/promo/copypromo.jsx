import React, { Component } from 'react';
import { Card, Col, Icon, Spin, Tabs, Pagination} from 'antd';
import UserApis from '../../lib/userInfo';
import datas from '../../lib/settings';
import BorderStyle from '../../lib/BorderStyle';

const TabPane = Tabs.TabPane;
const dealerRest = datas.public.dealerRest;

class PromoListContent extends Component {
	constructor (props) {
      	super(props);
      	this.state = {
      		dataSource: false,
      		status: false,
      		iconStatus: "down",
      		secondLoading: false,
      		borderColor: "promo_box"
      	}
  	}
  	judgeIcon (id) {
  		if (this.state.iconStatus === 'down') {
  			this.getSecond(id);
  		} else{
  			this.setState({
  				iconStatus: "down",
  				status: !this.state.status,
  				secondLoading: false
  			})
  		}
  	}
  	getSecond (id) {
  		console.log(id);
  		let that = this;
  		that.setState({
  			status: !this.state.status,
  			iconStatus: "up",
  			secondLoading: true
  		})
		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.referList;
		let data = {
			method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
            	refer: id,
            	page: 1,
	    		pageSize: 5
            })
		};
		fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response);
        		that.setState({
        			secondLoading: false  
        		})
        		if (response.info.list && response.info.list.length) {
        			let list = response.info.list;
        			let data = list.map(function (item) {
			          	item.BorderName = BorderStyle[item.status];
			          	return item;
			        })
        			that.setState({
	        			dataSource: data
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
		const data = this.props.data;
		let dataSource = this.state.dataSource;
		console.log(data);
		return (
			<div>
				<Card className={data.BorderName}>
					<Col span={6} className="light_border first">
						<div>{data.realName || '暂无'}</div>
						<div>{data.mobile || '暂无'}</div>
						<div className="top_distance">会员剩余</div>
						<div>{data.remainingDays}天</div>
					</Col>
					<Col span={7} className="light_border">
						<Col span={15}>
							<div>一级会员</div>
							<div>{data.referInfo.level1.total}</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>{data.referInfo.level1.active}</div>
						</Col>
					</Col>
					<Col span={7} className="light_border">
						<Col span={15}>
							<div>二级会员</div>
							<div>{data.referInfo.level2.total}</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>{data.referInfo.level2.active}</div>
						</Col>
					</Col>
					<Col span={4} className="nolight_border">
						<div>总活跃</div>
						<div>{data.referInfo.active}</div>
					</Col>
					<Col span={18} className="nolight_border top_distance">
						<div>总推荐：{data.referInfo.total}</div>
						<div><span>首次下单：{data.firstOrder || '暂无'}</span><span> 当月下单量：{data.orders || '0'}</span></div>
						<div className="see_second" onClick={()=>this.judgeIcon(data._id)}>查看<Icon type={this.state.iconStatus} /></div>
					</Col>
				</Card>
				
				<Spin spinning={this.state.secondLoading}>
					{this.state.status?
						(dataSource? (dataSource.map((data, k) => {
							return(
								<div className="sec_big_box">
									<SecondPromoListContent data={data} key={k}/>									
									
								</div>
							)
							},<Pagination size="small" total={50} />)
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

class SecondPromoListContent extends Component {
	constructor (props) {
      	super(props);
  	}
	render () {
		const data = this.props.data;
		console.log(this.props)
		return (
			<div className="second_box">
				<Card className={data.BorderName}>
					<Col span={6} className="light_border">
						<div>{data.realName || '暂无'}</div>
						<div>{data.mobile || '暂无'}</div>
						<div className="top_distance">会员剩余:{data.remainingDays}天</div>
						
					</Col>
					<Col span={6} className="light_border">
						<Col span={15}>
							<div>一级会员</div>
							<div>{data.referInfo.level1.total}</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>{data.referInfo.level1.active}</div>
						</Col>
					</Col>
					<Col span={6} className="light_border">
						<Col span={15}>
							<div>二级会员</div>
							<div>{data.referInfo.level2.total}</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>{data.referInfo.level2.active}</div>
						</Col>
					</Col>
					<Col span={6} className="light_border">
						<Col span={12}>
							<div>总活跃</div>
							<div>{data.referInfo.active}</div>
						</Col>
						<Col span={12}>
							<div>总推荐</div>
							<div>{data.referInfo.total}</div>
						</Col>
					</Col>
					<Col span={18} className="nolight_border top_distance">
						<div><span>首次下单：{data.firstOrder}</span><span>当月下单量：{data.orders}</span></div>
					</Col>
				</Card>
			</div>
		)
	}
}


class PromoList extends Component {
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

	getReferList () {
		let that = this;
		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.referList;
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
        		let list = dataSource.concat(response.info.list);
        		let data = list.map(function (item) {
		          item.BorderName = BorderStyle[item.status];
		          return item;
		        })
        		that.setState({
        			dataSource: data,
        			totalCount: response.info.totalCount,
        			loading: false
        		})
        		let totalCount = this.state.totalCount;
    			document.title = `我的会员(${totalCount})`;
        	}
        })	
	}

	componentDidMount () {
		this.getReferList();
	} 

	getMore () {
		let pageNum = (++this.state.page);
		this.setState({
			page: pageNum,
			loading: true
		})
		this.getReferList();
	}

	render () {
		const dataSource = this.state.dataSource || "";
		const totalCount = this.state.totalCount || "";
		console.log(dataSource);
		return(
			<div className="promo">
				<Tabs defaultActiveKey="1" className="promo_style">
				    <TabPane tab="全部" key="1" className="promo_style">全部</TabPane>
				    <TabPane tab="活跃用户" key="2" className="promo_style">活跃用户</TabPane>
				    <TabPane tab="非活跃用户" key="3" className="promo_style">非活跃用户</TabPane>
				    <TabPane tab="未缴费用户" key="4" className="promo_style">未缴费用户</TabPane>
				    <TabPane tab="到期用户" key="5" className="promo_style">到期用户</TabPane>
				</Tabs>
				<Spin spinning={this.state.loading} className="data_loading">
					{dataSource? (
						dataSource.map((data, k) => {
								return(
									<PromoListContent data={data} key={k}/>
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
export default PromoList;