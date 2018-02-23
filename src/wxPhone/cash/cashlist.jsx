import React, { Component } from 'react';
import {Table} from 'antd';
import UserApis from '../../lib/userInfo';
import datas from '../../lib/settings';
import Constant from '../../lib/constant';

let dealerRest = datas.public.dealerRest;

class PhoneCash extends Component {
  componentDidMount () {
    document.title = '奖励明细'
  }
  constructor (props) {
        super(props);
        this.state = {
          dataSource: [],
          loading: false,
          listNum: 10,
          pagination: {
            size: "small",
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
            pageSizeOptions: ['1', '2', '30', '40', '50', '100'],
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

	render() {
    const columns = [
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
		return (
			<div>
			  <Table
			    dataSource={this.state.dataSource} 
          columns={columns}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange.bind(this)}
          className="phone_list"
			  />
			</div>
		)
	}
}

export default PhoneCash;