import React, { Component } from 'react';
import { Table, Button} from 'antd';
import stores from '../../../lib/store';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';
import Constant from '../../../lib/constant';

let dealerRest = datas.public.dealerRest;

class CashList extends Component {
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

	getCashInfo () {
		let that = this;
		let token = UserApis.getToken();
		let url = dealerRest.url + dealerRest.cash;
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
        		let list = response.info.list;
        		let data = list.map(function (item) {
		    		item.typeTransfer = Constant.Reword[item.type];
		    		item.statusTransfer = Constant.Restatus[item.status];
		    		if(!item.status){
		    			item.statusTransfer = "可提现"
		    		}
		    		return item;
		    	})
        		that.setState({
        			dataSource: data,
        			loading: false,
        			amount: response.info.summary.amount,
					cashable: response.info.summary.cashable,
					cashed: response.info.summary.cashed,
					pending: response.info.summary.pending,
        			pagination
        		})
        	}
        })
	}

	handleTableChange (pagination, filters, sorter) {
	    const pager = this.state.pagination;
	    pager.current = pagination.current;
	    pager.pageSize = pagination.pageSize;
	    this.setState({
	      	pagination: pager
	    });
	    this.getCashInfo({
	      	results: pagination.pageSize,
	      	page: pagination.current,
	    });
	}

	componentDidMount () {
		this.getCashInfo();
	} 

	doCash () {
		stores.checkByMobile('pc');
	}
	render() {
		
		let settings = {
			
			columns: [
				{
					title: '奖励类型',
					dataIndex: 'typeTransfer',
				},
				{
					title: '奖励来源',
					dataIndex: 'mobile',
				},
				{
					title: '奖励金额',
					dataIndex: 'amount',
				},
				{
					title: '发券时间',
					dataIndex: 'createdAt',
				},
				{
					title: '当前状态',
					dataIndex: 'statusTransfer',
				}
			]
		}

	    return (
	      <div>
	      	<div className="table-operations">
	           <Button  type="danger" onClick={()=>{this.doCash()}}>提现</Button>
	           <Button  type="primary" >导出EXCEL</Button>
	        </div>
	        <div className="cash-box">
	        	<span className="cashes">总金额：<span className="cash-num">￥ {this.state.amount}</span></span>
	        	<span className="cashes">可提现金额：<span className="cash-num">￥ {this.state.cashable}</span></span>
	        	<span className="cashes">提现中：<span className="cash-num">￥  {this.state.pending}</span></span>
	        	<span className="cashes">已提现金额：<span className="cash-num">￥ {this.state.cashed}</span></span>
	        </div>
	      	<Table 
	      	dataSource={this.state.dataSource} 
	      	columns={settings.columns}
	      	pagination={this.state.pagination}
	      	loading={this.state.loading}
	      	onChange={this.handleTableChange.bind(this)}
	      />
	      </div>
	    );
	}
}
export default CashList;