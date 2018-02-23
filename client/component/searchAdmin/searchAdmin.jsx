import React, { Component } from 'react';
import { Table, Input, Button, Col, Icon, Card, Spin, Row, Form, InputNumber} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
let {url, user, referList} = Meteor.settings.public.dealerRest;
let {Promseify, UserApis, Sys} = DORA;

let searchAdmin =  Form.create()(React.createClass ({
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
		  keywords: '',
	    };
	},

	onSearch (value) {
		localStorage.setItem('keywords', value);
		this.loadData();
	},

	loadData () {
		let token = UserApis.getToken();
	    let that = this;
	    let option = {
	    	keywords: localStorage.getItem("keywords"),
	    	page: that.state.pagination.current,
	    	pageSize: that.state.pagination.pageSize
	    };
	    that.setState ({ loading: true });
	    Promseify.HTTPpromise ("POST", `${url}${user}`, {headers: {token: token}, data: option}).then( function (data) {
	    	let info = JSON.parse(data.content) || {};
	    	let totalCount = Sys.getDataByPath(info, "list.totalCount");
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
	    	if (info.statusCode == 200) {
	    		let source = Sys.getDataByPath(info, "list.list");
	    		
	    		that.setState({
	    			dataSource: source,
		    		loading: false,
		    		pagination 
	    		})
	    	} else {
	    		return;
	    	}
	    })
	},
	componentDidMount(){
		if (localStorage.getItem("keywords")) {
	    	this.loadData();
		}
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

	setMsg (mobile, createdAt) {
		UserApis.setSearchUserMobile(mobile);
	    UserApis.serSearchUserCreate(createdAt);
	},

	render () {
		let that = this;
		const { getFieldDecorator } = that.props.form;

		let { sortedInfo, filteredInfo } = that.state;
		filteredInfo = filteredInfo || {};
		sortedInfo = sortedInfo || {};

		let dataSource = that.state.dataSource || [];
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
					title: '注册时间',
					dataIndex: 'startTime',
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
					title: '查看详情',
					key: 'childList',
					render(text){
						let url = `#/searchResult/${text._id}`;
						return(
							<a href={url} onClick={that.setMsg(text.mobile, text.startTime)}>点击查看</a>
						)
					}
				}
			]
		}

		return (
			<div>
	  	    	<Search
				    placeholder="请输入您要搜索的账号或姓名"
				    onSearch={that.onSearch}
				/>
	  	    	<div>
			      	<Table 
				      	dataSource={that.state.dataSource} 
				      	columns={settings.columns}
				      	pagination={that.state.pagination}
				      	loading={that.state.loading}
				      	onChange={that.handleTableChange}
				    />
				</div> 
			</div>
	
		)
	}
}))

export default searchAdmin;