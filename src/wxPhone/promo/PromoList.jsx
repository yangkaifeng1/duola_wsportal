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
  	judgeIcon () {
  		if (this.state.iconStatus === 'down') {
  			this.getSecond();
  		} else{
  			this.setState({
  				iconStatus: "down",
  				status: !this.state.status,
  				secondLoading: false
  			})
  		}
  	}
  	getSecond () {
  		let that = this;
  		that.setState({
  			status: !this.state.status,
  			iconStatus: "up",
  			secondLoading: true,
  			dataSource: '2'
  		})
		// let token = UserApis.getToken();
		// let url = dealerRest.url + dealerRest.referList;
		// let data = {
		// 	method: "POST",
  //           headers: {
  //               "Content-Type": "application/json",
  //               token: token
  //           },
  //           body: JSON.stringify({
  //           	refer: id,
  //           	page: 1,
	 //    		pageSize: 5
  //           })
		// };
		// fetch(url, data).then(res=>res.json()).then(response=>{
  //       	if (response.statusCode === 200) {
  //       		console.log(response);
  //       		that.setState({
  //       			secondLoading: false  
  //       		})
  //       		if (response.info.list && response.info.list.length) {
  //       			let list = response.info.list;
  //       			let data = list.map(function (item) {
		// 	          	item.BorderName = BorderStyle[item.status];
		// 	          	return item;
		// 	        })
  //       			that.setState({
	 //        			dataSource: data
	 //        		})
  //       		} else {
  //       			that.setState({
	 //        			dataSource: false,
	 //        		})
  //       		}
  //       	}
  //       })
  	}
	render () {
		const data = this.props.data;
		let dataSource = this.state.dataSource;
		console.log(data);
		return (
			<div>
				<Card  className="promo_box2">
					<Col span={6} className="light_border first">
						<div>小米</div>
						<div>18888880000</div>
						<div className="top_distance">会员剩余</div>
						<div>11天</div>
					</Col>
					<Col span={7} className="light_border">
						<Col span={15}>
							<div>一级会员</div>
							<div>11</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>11</div>
						</Col>
					</Col>
					<Col span={7} className="light_border">
						<Col span={15}>
							<div>二级会员</div>
							<div>11</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>11</div>
						</Col>
					</Col>
					<Col span={4} className="nolight_border">
						<div>总活跃</div>
						<div>111</div>
					</Col>
					<Col span={18} className="nolight_border top_distance">
						<div>总推荐：11</div>
						<div><span>首次下单：11</span><span> 当月下单量：11</span></div>
						<div className="see_second" onClick={()=>this.judgeIcon()}>查看<Icon type={this.state.iconStatus} /></div>
					</Col>
				</Card>
				{this.state.status?
							<div className="sec_big_box">
								<SecondPromoListContent/>									
								<SecondPromoListContent/>									
								<SecondPromoListContent/>									
								
							</div>
						:""
				}
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
				<Card className="promo_box3">
					<Col span={6} className="light_border">
						<div>小米</div>
						<div>18888880000</div>
						<div className="top_distance">会员剩余:11天</div>
						
					</Col>
					<Col span={6} className="light_border">
						<Col span={15}>
							<div>一级会员</div>
							<div>11</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>11</div>
						</Col>
					</Col>
					<Col span={6} className="light_border">
						<Col span={15}>
							<div>二级会员</div>
							<div>11</div>
						</Col>
						<Col span={9}>
							<div>活跃</div>
							<div>11</div>
						</Col>
					</Col>
					<Col span={6} className="light_border">
						<Col span={12}>
							<div>总活跃</div>
							<div>11</div>
						</Col>
						<Col span={12}>
							<div>总推荐</div>
							<div>11</div>
						</Col>
					</Col>
					<Col span={18} className="nolight_border top_distance">
						<div><span>首次下单：11</span><span>当月下单量：11</span></div>
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

	// componentDidMount () {
	// 	this.getReferList();
	// } 

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
				<PromoListContent/>
				<PromoListContent/>
				<PromoListContent/>
				<PromoListContent/>
				<PromoListContent/>
			</div>
		)
		// return(
		// 	<div className="promo">
		// 		<Spin spinning={this.state.loading} className="data_loading">
		// 			{dataSource? (
		// 				dataSource.map((data, k) => {
		// 						return(
		// 							<PromoListContent data={data} key={k}/>
		// 						)
		// 					})
		// 				):(<Col span={24}>
		//                 <p>暂无数据</p>
		//             	</Col>)
		// 			}
		// 			{totalCount>=8? (<Col span={24} className="get_more" onClick={()=>this.getMore()}>点击加载更多</Col>): ""}
		// 		</Spin>
		// 	</div>	
		// )
		
	}
}
export default PromoList;