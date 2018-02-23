import React, { Component } from 'react';
import { Table, InputNumber, Button, Select, message } from 'antd';
import Constant from "/lib/constant/constant";
let {url, cash, doCash, channel } = Meteor.settings.public.dealerRest;
let {Promseify, UserApis, Sys} = DORA;

let CashList = React.createClass ({
	getInitialState() {
	    return {
	        dataSource: [],
	        loading: false,
	        pagination: {
		      	current: 1,
		        pageSize: 10
	        },
		    amount: 0,
			cashable: 0,
			cashed: 0,
			pending: 0,
			filteredInfo: null,
			sortedInfo: null
	    }
	},

	handleTableChange (pagination, filters, sorter) {
	    const pager = this.state.pagination;
	    pager.current = pagination.current;
	    this.setState({
	      	pagination: pager,
	      	filteredInfo: filters,
	      	sortedInfo: sorter
	    });
	    this.loadData({
	      	results: pagination.pageSize,
	      	page: pagination.current,
	      	sortField: sorter.field,
	      	sortOrder: sorter.order,
	      	...filters
	    });
	},

	onChange (value) {
  		this.setState ({"listNum": value});
	},
	// 提交信息显示的数量
	subNum () {
		const pager = this.state.pagination;
		pager.pageSize = this.state.listNum;
		this.setState({
			pagination: pager
		});
		this.loadData();
	},

	// 提现
	getCash () {
		let user = UserApis.getUser(), 
			token = UserApis.getToken();
		Promseify.HTTPpromise("POST", `${url}${doCash}`, {headers: {token: token}, data: {channel: channel}}).then( function (data) {
			let info = JSON.parse(data.content);
			message.info(info.msg, 1.5);
		})
	},

	// 获取数据
	loadData(){
		let user = UserApis.getUser(), 
			token = UserApis.getToken();
	    let that = this;
	    let option = {
	    	page: that.state.pagination.current,
	    	pageSize: that.state.pagination.pageSize
	    };
	    that.setState({ loading: true });
	    Promseify.HTTPpromise("POST", `${url}${cash}`, {headers: {token: token}, data: option}).then( function (data) {
	    	let info = JSON.parse(data.content) || {};
	    	let totalCount = AppGlobal.getDataByPath(info, 'info.totalCount');
	    	let infoList = AppGlobal.getDataByPath(info, 'info.list');
	    	pagination = {pageSize: option.pageSize, current: option.page, total: totalCount}
	   		let list = _.map(infoList, function (item) {
	    		item.typeTransfer = Constant.Reword[item.type];
	    		item.statusTransfer = Constant.Restatus[item.status];
	    		if(!item.status){
	    			item.statusTransfer = "可提现"
	    		}
	    		return item;
	    	});
	    	
	    	that.setState({
	    		dataSource: list,
	    		loading: false,
	    		amount: AppGlobal.getDataByPath(info, 'info.summary.amount'),
				cashable: AppGlobal.getDataByPath(info, 'info.summary.cashable'),
				cashed: AppGlobal.getDataByPath(info, 'info.summary.cashed'),
				pending: AppGlobal.getDataByPath(info, 'info.summary.pending'),
	    		pagination
	    	});
	    })
	},

	componentDidMount(){
	    this.loadData();
	},

	// 导出Excel
	tableExport(event){
        event.preventDefault();
        var tables = $('.cash-table').clone().attr('id', 'download-table');
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

	render() {
		let { sortedInfo, filteredInfo } = this.state;
		filteredInfo = filteredInfo || {};
		sortedInfo = sortedInfo || {};
		let settings = {
			dataSource: this.state.dataSource || [],
			columns: [
				{
					title: '奖励类型',
					dataIndex: 'typeTransfer',
					key: 'typeTransfer'
				},
				{
					title: '奖励来源',
					dataIndex: 'mobile',
					key: 'mobile',
					sorter: (a, b) => a.mobile - b.mobile
				},
				{
					title: '奖励金额',
					dataIndex: 'amount',
					key: 'amount'
				},
				{
					title: '发券时间',
					dataIndex: 'createdAt',
					key: 'createdAt',
					sorter: (a, b) => a.createdAt - b.createdAt
				},
				{
					title: '当前状态',
					dataIndex: 'statusTransfer',
					key: 'statusTransfer',
					filters: [
		        		{ text: '可提现', value: '可提现' },
			        	{ text: '提现成功', value: '提现成功' },
			        	{ text: '提现中', value: '提现中' },
			        	{ text: '提现失败', value: '提现失败' },
			        ],
			        filteredValue: filteredInfo.statusTransfer || null,
				    onFilter: (value, record) =>  record.statusTransfer.includes(value),
				    sorter: (a, b) => a.statusTransfer.length - b.statusTransfer.length,
				    sortOrder: sortedInfo.columnKey === 'statusTransfer' && sortedInfo.order
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
				},
				onSelect: (record, selected, selectedRows) => {
				},
				onSelectAll: (selected, selectedRows, changeRows) => {
				},
				getCheckboxProps: record => ({
					disabled: record.name === 'Disabled User',    // Column configuration not to be checked
				}),
			}
		}

	    return (
	      <div>
	      	<div className="table-operations">
	      	   <span>当前页面显示的信息数量</span>
	      	   <InputNumber min={1} max={50} defaultValue={10} onChange={this.onChange} />
	           <Button  type="primary"  onClick={this.subNum} >提交</Button>
	           
	           <Button  type="danger" onClick={this.getCash}>提现</Button>
	           <Button  type="primary" onClick={this.tableExport}>导出EXCEL</Button>
	        </div>
	        <div className="cash-box">
	        	<span className="cashes">总金额：<span className="cash-num">￥{this.state.amount}</span></span>
	        	<span className="cashes">可提现金额：<span className="cash-num">￥{this.state.cashable}</span></span>
	        	<span className="cashes">提现中：<span className="cash-num">￥{this.state.pending}</span></span>
	        	<span className="cashes">已提现金额：<span className="cash-num">￥{this.state.cashed}</span></span>
	        </div>
	      	<Table 
	      	dataSource={settings.dataSource} 
	      	columns={settings.columns}
	      	pagination={this.state.pagination}
	      	loading={this.state.loading}
	      	onChange={this.handleTableChange}
	      	className="cash-table"
	      />
	      </div>
	    );
	}
})
export default CashList;