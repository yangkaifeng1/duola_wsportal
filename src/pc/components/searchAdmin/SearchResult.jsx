import React, { Component } from 'react';
import { Table, Input, Button, Col, Icon, Card, Spin, Row, Form, InputNumber} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
let {url, user, referList, dealerUrl, rewardsUrl} = Meteor.settings.public.dealerRest;
let {Promseify, UserApis, Sys} = DORA;

class searchResult extends Component{
	getInitialState() {
	    return {
	      dataSource: [],
	      sortedInfo: false,
	      loading: false,
	      listNum: 10,
	      pagination: {
	      	current: 1,
	      	pageSize: 10,
	      	showSizeChanger: true,
	      	showTotal(total) {
                return `共 ${total} 条`;
            },
	      	size: "small",
	      	pageSizeOptions: ['10', '20', '30', '40', '50', '100']
	      },
	      filteredInfo: null,
		  sortedInfo: null,
		  childList: [],
		  searchId: window.location.hash.split("/")[window.location.hash.split("/").length-1],
		  searchDealer: {},
		  searchRewards: {}
	    };
	},

	loadData () {
		let that = this; 
		let token = UserApis.getToken();
    	let option = {
    		userId: that.state.searchId,
			page: that.state.pagination.current,
			pageSize: that.state.pagination.pageSize
    	}
    	that.setState({loading: true});
    	Promseify.HTTPpromise ("POST", `${url}${referList}`, {headers: {token: token}, data: option}).then( function (data) {
    		let info = JSON.parse(data.content) || {};
	    	let totalCount = AppGlobal.getDataByPath(info, "info.totalCount");
	    	pagination = {  
	    		pageSize: option.pageSize, 
			    current: option.page, 
			    total: totalCount,  
			    showSizeChanger: true, 
			    size: "small",
			    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
			    showTotal (total) {
    				return `共 ${total} 条`;
				}
			}
	    	console.log(info);
	    	that.setState({
	    		dataSource: Sys.getDataByPath(info, "info.list"),
	    		loading: false,
	    		pagination
	    	})
    	})
	},
	componentDidMount(){
		this.getSearchDealerInfo();
    	this.getSearchRewardsInfo();
	    this.loadData();
	},
	// 导出Excel
	tableExport(event){
        event.preventDefault();
        var tables = $('.data-table').clone().attr('id', 'download-table');
        var div = "<div id='table-export' style='display: none'></div>";
        $('body').append(div);
        $('#table-export').append(tables);
        $('#download-table .ant-table-selection-column').remove();
        $('#download-table .ant-pagination').remove();
        $('#download-table').battatech_excelexport({
            containerid: "download-table",
            datatype: 'table'
        });
        $('#table-export').empty();
    },
	
	handleTableChange (pagination, filters, sorter) {
	    const pager = this.state.pagination;

	    pager.current = pagination.current;
	    pager.pageSize = pagination.pageSize;
	    this.setState({
	      	pagination: pager,
	      	filteredInfo: filters,
	        sortedInfo: sorter,
	    });
	    this.loadData({
	      	results: pagination.pageSize,
	      	page: pagination.current,
	      	sortField: sorter.field,
	      	sortOrder: sorter.order,
	      	...filters,
	    });
	},

	getSearchDealerInfo () {
	    let that = this;
	    that.setState({searchDealerLoading: true})
	    let user = UserApis.getUser(),
	        userId = user._id,
	        token = UserApis.getToken();
	    let option = {
	    	userId: that.state.searchId
	    };
	    Promseify.HTTPpromise("POST", `${url}${dealerUrl}`, {headers: {token: token}, data: option}).then( function (data) {
	      let  info = Sys.getDataByPath(JSON.parse(data.content), "info");
	      if (info) {
	        that.setState({searchDealerLoading: false});
	        that.setState({searchDealer: info});
	      } else{
	        message.error("请求数据错误，请重试！",1.5)
	      }
	    });
	    return false;
	  },

	getSearchRewardsInfo () {
	  	let that = this;
	    that.setState({searchRewardsLoading: true});
	    let user = UserApis.getUser(),
	      	userId = user._id,
	      	token = UserApis.getToken();
	    let option = {
	    	userId: that.state.searchId
	    };
	    Promseify.HTTPpromise("POST", `${url}${rewardsUrl}`, {headers: {token: token}, data: option}).then( function (data) {
		    debugger
		    let  info = Sys.getDataByPath(JSON.parse(data.content), "info");
		    if (info) {
		        that.setState({searchRewards: info});
		        that.setState({searchRewardsLoading: false});
		    } else {
		        message.error("请求数据错误，请重试！")
		    }
	    });
	    return false;
	},

	render () {
		let searchUserMobile = UserApis.getSearchUserMobile();
		let searchUserCreate = UserApis.getSearchUserCreate();
		let dealer = this.state.searchDealer || {};
    	let rewards = this.state.searchRewards || {};
    	let oldTime = moment().format('YYYY-MM-DD');

		const { getFieldDecorator } = this.props.form;

		let { sortedInfo, filteredInfo } = this.state;
		filteredInfo = filteredInfo || {};
		sortedInfo = sortedInfo || {};

		let dataSource = this.state.dataSource || [];
		if (dataSource) {
            dataSource.map(function(v,k){
                v.key = k;
            }
        )}
            
		let settings = {
			columns: [
				{
					title: '姓名',
					dataIndex: 'realName',
					// key: 'realName'
				},
				{
					title: '电话',
					dataIndex: 'mobile',
					// key: 'mobile',
					sorter: (a, b) => a.mobile - b.mobile
				},
				{
					title: '当月下单衣服数',
					dataIndex: 'orders',
					// key: 'orders'
				},
				{
					title: '注册时间',
					dataIndex: 'createdAt',
					// key: 'createdAt',
					sorter: (a, b) => a.createdAt - b.createdAt
				},
				{
					title: '到期时间',
					dataIndex: 'dueTime',
					// key: 'dueTime',
					sorter: (a, b) => a.dueTime - b.dueTime
				},
				{
					title: '当前状态',
					dataIndex: 'status',
					// key: 'status',
					filters: [
		        		{ text: '活跃', value: '活跃' },
			        	{ text: '非活跃', value: '非活跃' },
			        	{ text: '到期', value: '到期' },
			        	{ text: '冻结', value: '冻结' },
			        ],
			        filteredValue: filteredInfo.status || null,
				    onFilter: (value, record) =>  record.status.includes(value),
				    sorter: (a, b) => a.status.length - b.status.length,
				    sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order

				},
				{
					title: '直推会员',
					key: 'childList',
					render(text){
						let url = `#/my_promo/secondPromo/${text._id}`;
						return(
							<a href={url}>点击查看</a>
						)
					}
				}
			]
		}


		return (
			<div>
				<Row className="search-header" justify="space-around" gutter= {10}>
					<Col span={6} xs={24} sm={6} md={6} lg={6} >
			          <Card title="个人资料" extra={<a href="#"></a>}>
			            <p>账号： {searchUserMobile}</p>
			            <p>注册时间：{searchUserCreate}</p>
			          </Card>
			        </Col>
					<Col span={9} xs={24} sm={9} md={9} lg={9}>
			          <Card title="活跃会员数量" extra={<a ><Icon onClick={this.getSearchDealerInfo} type="reload" /></a>}>
			            <Spin spinning={this.state.searchDealerLoading}>
			              <p><span>一级活跃会员： {AppGlobal.getDataByPath(dealer,"level1.active")}</span></p>
			              <p><span>二级活跃会员： {AppGlobal.getDataByPath(dealer,"level2.active")}</span></p>
			              <p><span>总活跃会员（时间截止至 {oldTime} 5:00）： {dealer.active}</span></p>
			            </Spin>
			          </Card>
			        </Col>

			        <Col span={9} xs={24} sm={9} md={9} lg={9} >
			          <Card title="奖励明细" extra={<a ><Icon onClick={this.getSearchRewardsInfo} type="reload" /></a>}>
			            <Spin spinning={this.state.searchRewardsLoading}>
			              <p>推荐奖（请在APP我的优惠券中提现）： <span className="cash-num">￥{rewards.refer}</span></p>
			              <p>维护奖： <span className="cash-num">￥{rewards.renew}</span></p>
			              <p>教育奖： <span className="cash-num">￥{rewards.education}</span></p>
			              <p>目标奖： <span className="cash-num">￥{rewards.target}</span></p>
			              <p>目标培训奖： <span className="cash-num">￥{rewards.eduTarget}</span></p>
			            </Spin> 
			          </Card>
			        </Col>
				</Row>
	  	    	<div>
	  	    		<div className="table-operations">
			           <Button  type="primary" onClick={this.tableExport}>导出EXCEL</Button>
			        </div>
			      	<Table 
				      	dataSource={this.state.dataSource} 
				      	columns={settings.columns}
				      	pagination={this.state.pagination}
				      	loading={this.state.loading}
				      	onChange={this.handleTableChange}
				      	className="data-table"
				    />
				</div> 
			</div>			
		)
	}
}))

export default searchResult;