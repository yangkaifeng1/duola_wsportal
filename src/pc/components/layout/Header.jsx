import React, { Component } from 'react';
import { Menu, Row, Col, Icon, Dropdown, Card, Spin } from 'antd';
import UserApis from '../../../lib/userInfo';
import datas from '../../../lib/settings';

let dealerRest = datas.public.dealerRest;

class Header extends Component{

  constructor (props) {
    super(props);
    this.state = {
        active: "0", 
        level1Active: "0",
        level2Active: "0",
        eduTarget:"0",
        education:"0",
        refer:"0",
        renew:"0",
        target:"0",
        dealerLoading: false,
        rewardsLoading: false
    }
  }

  getReferInfo () {
    let that = this;
    let token = UserApis.getToken();
    let url = dealerRest.url+dealerRest.dealerUrl;
    let data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: token
        }
    };
    this.setState({dealerLoading: true})
    fetch(url, data).then(res=>res.json()).then(response=>{
        if (response.statusCode === 200) {
            that.setState ({
              active: response.info.active, 
              level1Active: response.info.level1.active,
              level2Active: response.info.level2.active,
              dealerLoading: false
            })
        }
    })
  }

  getRewardsInfo () {
    let that = this;
    let token = UserApis.getToken();
    let url = dealerRest.url + dealerRest.rewardsUrl;
    let data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: token
        }
    };
    this.setState({rewardsLoading: true})
    fetch(url, data).then(res=>res.json()).then(response=>{
      console.log(response);
        if (response.statusCode === 200) {
            that.setState({
              eduTarget: response.info.eduTarget,
              education: response.info.education,
              refer: response.info.refer,
              renew: response.info.renew,
              target: response.info.target,
              rewardsLoading: false
            })
        }
    })
  }

  componentDidMount () {
    this.getReferInfo();
    this.getRewardsInfo();
  } 

  logout () {
    localStorage.clear();  
  }

  menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#/changeAccount">修改支付宝账号</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#/login" onClick={() => this.logout()}>退出账户</a>
      </Menu.Item>  
    </Menu>
  )
    
  render() {
    let user = UserApis.getUser() || {};
    console.log(user);
    let mobile = user.mobile || '';
    let aliAccount = UserApis.getAccount() || '';
    let creatTime = user.createdAt || '';

    return (
      <Row className="header-row" justify="space-around" gutter={10}>
        <Col span={6} xs={24} sm={6} md={6} lg={6} >
          <Card title="个人资料" extra={
            <Dropdown overlay={this.menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  账户操作<Icon type="down" />
                </a>
            </Dropdown>}>
            <p>账号： {mobile}</p>
            <p>支付宝账号：{aliAccount}</p>
            <p>注册时间：{creatTime}</p>
            
          </Card>
        </Col>

        <Col span={9} xs={24} sm={9} md={9} lg={9}>
          <Card title="活跃会员数量" extra={<a ><Icon type="reload" /></a>}>
              <Spin spinning={this.state.dealerLoading}>
                <p><span>一级活跃会员：{this.state.active}</span></p>
                <p><span>二级活跃会员：{this.state.level1Active}</span></p>
                <p><span>总活跃会员（时间截止至  5:00）：{this.state.level2Active}</span></p>
              </Spin>
          </Card>
        </Col>

        <Col span={9} xs={24} sm={9} md={9} lg={9} >
          <Card title="奖励明细" extra={<a ><Icon  type="reload" /></a>}>
            <Spin spinning={this.state.rewardsLoading}>
              <p>推荐奖（请在APP我的优惠券中提现）： <span className="cash-num">￥ {this.state.refer}</span></p>
              <p>维护奖： <span className="cash-num">￥{this.state.renew}</span></p>
              <p>教育奖： <span className="cash-num">￥{this.state.education}</span></p>
              <p>目标奖： <span className="cash-num">￥{this.state.target}</span></p>
              <p>目标培训奖： <span className="cash-num">￥{this.state.eduTarget}</span></p>
            </Spin>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Header;
