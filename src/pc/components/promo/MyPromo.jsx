import React, { Component } from 'react';
import { Table, Button} from 'antd';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';

let dealerRest = datas.public.dealerRest;

class MyPromo extends Component {
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
		  childList: []
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
            	page: that.state.pagination.current,
	    		pageSize: that.state.pagination.pageSize
            })
		};
		that.setState({loading: true});
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
		this.getReferList();
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

	// // 导出Excel
	// tableExport(event){
 //        event.preventDefault();
 //        var tables = $('.data-table').clone().attr('id', 'download-table');
 //        var div = "<div id='table-export' style='display: none'></div>";
 //        $('body').append(div);
 //        $('#table-export').append(tables);
 //        $('#download-table .ant-table-selection-column').remove();
 //        $('#download-table .ant-pagination').remove();
 //        $('#download-table').battatech_excelexport({
 //            containerid: "download-table",
 //            datatype: 'table'
 //        });
 //        $('#table-export').empty();
 //    }

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
					title: '姓名',
					dataIndex: 'realName',
					// key: 'realName'
				},
				{
					title: '电话',
					dataIndex: 'mobile',
					
				},
				{
					title: '当月下单衣服数',
					dataIndex: 'orders',
					// key: 'orders'
				},
				{
					title: '注册时间',
					dataIndex: 'createdAt',
					
				},
				{
					title: '到期时间',
					dataIndex: 'dueTime',
					// key: 'dueTime',
					
				},
				{
					title: '当前状态',
					dataIndex: 'status'
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
	      	<div className="table-operations">
	           <Button  type="primary">导出EXCEL</Button>
	        </div>
	        <Table 
		      	dataSource={dataSource} 
		      	columns={settings.columns}
		      	pagination={this.state.pagination}
		      	loading={this.state.loading}
		      	onChange={this.handleTableChange.bind(this)}
		      	className="data-table"
	        />
	      </div> 
	    );
	}
}
export default MyPromo;