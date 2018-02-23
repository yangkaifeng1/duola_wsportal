import React, { Component } from 'react';
import { Table, Button} from 'antd';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';

let dealerRest = datas.public.dealerRest;

class SecondPromo extends Component {
	constructor (props) {
      	super(props);
      	this.state = {
      	  dataSource: [],
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
		  childList: [],
		  secondId: window.location.hash.split("/")[window.location.hash.split("/").length-1]
      	}
  	}

	getSecondReferInfo () {
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
            	refer: that.state.secondId,
            	page: that.state.pagination.current,
	    		pageSize: that.state.pagination.pageSize
            })
		};
		that.setState({loading: true});
		debugger
		fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		let pagination = {  
		    		current: that.state.pagination.current, 
				    pageSize: that.state.pagination.pageSize, 
				    total:  response.info.totalCount,  
				    showSizeChanger: true, 
				    size: "small",
				    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
				    showTotal(total) {
	    				return `共 ${total} 条`;
					}
				}

        		console.log(response);
        		that.setState({
        			dataSource: response.info.list,
        			loading: false,
        			pagination
        		})
        	}
        })
	}

	componentDidMount () {
		this.getSecondReferInfo();
	} 

	handleTableChange (pagination, filters, sorter) {
	    const pager = this.state.pagination;
	    pager.current = pagination.current;
	    pager.pageSize = pagination.pageSize;
	    this.setState({
	      	pagination: pager
	    });
	    this.getReferList({
	      	results: pagination.pageSize,
	      	page: pagination.current,
	      	sortField: sorter.field,
	      	sortOrder: sorter.order,
	      	...filters,
	    });
	}

	render() {

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
			        ]

				}
			]
		}

	    return (
	      <div>
	      	<div className="table-operations">
	           <Button  type="primary" >导出EXCEL</Button>
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
}

export default SecondPromo;