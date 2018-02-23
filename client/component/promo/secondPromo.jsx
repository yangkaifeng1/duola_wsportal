import React, { Component } from 'react';
import { Table, InputNumber, Button} from 'antd';
import { Router, Route} from 'react-router';
let {url, referList} = Meteor.settings.public.dealerRest;
let {Promseify, UserApis, Sys} = DORA;

let secondPromo = React.createClass ({
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
		  secondId: window.location.hash.split("/")[window.location.hash.split("/").length-1]
	    };
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

	loadData(){
		let user = UserApis.getUser(), 
			token = UserApis.getToken();
	    let that = this;
	    let option = {
	    	refer: that.state.secondId,
	    	page: that.state.pagination.current,
	    	pageSize: that.state.pagination.pageSize
	    };
	    that.setState({ loading: true });
	    Promseify.HTTPpromise("POST", `${url}${referList}`, {headers: {token: token}, data: option}).then( function (data) {
	    	let info = JSON.parse(data.content) || {};
	    	let totalCount = AppGlobal.getDataByPath(info, "info.totalCount");
	    	pagination = {  
	    		pageSize: option.pageSize, 
			    current: option.page, 
			    total: totalCount,  
			    showSizeChanger: true, 
			    size: "small",
			    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
			    showTotal(total) {
    				return `共 ${total} 条`;
				}
			}
	    	that.setState({
	    		dataSource: Sys.getDataByPath(info, "info.list"),
	    		loading: false,
	    		pagination
	    	})
	    })
	},
	componentDidMount(parms){
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

	render() {
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

				}
			]
		}

	    return (
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
	    );
	}
})
export default secondPromo;