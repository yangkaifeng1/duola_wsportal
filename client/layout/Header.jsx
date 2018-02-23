import React, { Component } from 'react';
import { Menu, Row, Col, Icon, Dropdown, Link, Card, Button, message, Spin } from 'antd';
let {UserApis, Sys, Promseify} = DORA;
let {url, rewardsUrl, dealerUrl} = Meteor.settings.public.dealerRest;

let Header = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState () {
    let user = UserApis.getUser();
    return {
      title: "推广系统",
      staff: user.staff || {},
      menu: "menu-fold",
      dealer: false,
      rewards: false,
      dealerLoading: false,
      rewardsLoading: false
    };
  },

  ToggleMenu () {
    if (this.state.menu === "menu-fold") {
      this.setState({menu: "menu-unfold"});
      this.props.callbackParent(false);
    } else {
      this.setState({menu: "menu-fold"});
      this.props.callbackParent(true);
    }
  },

  logout (e) {
    UserApis.loginOut();
    this.context.router.push('/login');
  },

  changeAlipay () {
    this.context.router.push('/changeAlipay');
  },

  getDealerInfo () {
    let that = this;
    that.setState({dealerLoading: true})
    let user = UserApis.getUser(),
        userId = user._id,
        token = UserApis.getToken();
    Promseify.HTTPpromise("POST", `${url}${dealerUrl}`, {"headers":{"token":token}}).then( function (data) {
      let  info = Sys.getDataByPath(JSON.parse(data.content), "info");
      if (info) {
        that.setState({dealerLoading: false});
        that.setState({dealer: info});
        UserApis.setDealer(info);  
      } else{
        message.error("请求数据错误，请重试！",1.5)
      }
    });
    return false;
  },

  getRewardsInfo () {
    let that = this;
    that.setState({rewardsLoading: true});
    let user = UserApis.getUser(),
      userId = user._id,
      token = UserApis.getToken();
      Promseify.HTTPpromise("POST", `${url}${rewardsUrl}`, {headers: {token: token}}).then( function (data) {
      that.setState({loading: false})
      let  info = Sys.getDataByPath(JSON.parse(data.content), "info");
      if (info) {
        that.setState({rewards: info});
        UserApis.setRewards(info);
        that.setState({rewardsLoading: false});
      } else{
        message.error("请求数据错误，请重试！")
      }
    });
    return false;
  },

  componentDidMount(){
    this.getDealerInfo();
    this.getRewardsInfo();
  },

  render() {
    let that = this;
    let name = Sys.getDataByPath(this, "state.staff").name;
    let user = UserApis.getUser() || {};
    let dealer = UserApis.getDealer() || that.state.dealer || {};
    let rewards = UserApis.getRewards() || that.state.rewards || {};
    let level1Total = AppGlobal.getDataByPath(dealer,"level1.total");
    let level2Total = AppGlobal.getDataByPath(dealer,"level2.total");
    let level1Num = AppGlobal.getDataByPath(dealer,"level1.active");
    let level2Num = AppGlobal.getDataByPath(dealer,"level2.active");
    let oldTime = moment().format('YYYY-MM-DD');
    let aliAccount = UserApis.getAccount() || {};

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.changeAlipay}>修改支付宝账号</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.logout}>退出账户</a>
        </Menu.Item>  
      </Menu>
    )

    return (
      <Row className="header-row" justify="space-around" gutter= {10}>
        <Col span={6} xs={24} sm={6} md={6} lg={6} >
          <Card title="个人资料" extra={
            <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  账户操作<Icon type="down" />
                </a>
            </Dropdown>}>
            <p>账号： {user.mobile}</p>
            <p>支付宝账号：{aliAccount}</p>
            <p>注册时间： {user.createdAt}</p>
            
          </Card>
        </Col>

        <Col span={9} xs={24} sm={9} md={9} lg={9}>
          <Card title="活跃会员数量" extra={<a ><Icon onClick={this.getDealerInfo} type="reload" /></a>}>
            <Spin spinning={this.state.dealerLoading}>
              <p><span>一级活跃会员： {AppGlobal.getDataByPath(dealer,"level1.active")}</span></p>
              <p><span>二级活跃会员： {AppGlobal.getDataByPath(dealer,"level2.active")}</span></p>
              <p><span>总活跃会员（时间截止至 {oldTime} 5:00）： {dealer.active}</span></p>
            </Spin>
          </Card>
        </Col>

        <Col span={9} xs={24} sm={9} md={9} lg={9} >
          <Card title="奖励明细" extra={<a ><Icon onClick={this.getRewardsInfo} type="reload" /></a>}>
            <Spin spinning={this.state.rewardsLoading}>
              <p>推荐奖（请在APP我的优惠券中提现）： <span className="cash-num">￥{rewards.refer}</span></p>
              <p>维护奖： <span className="cash-num">￥{rewards.renew}</span></p>
              <p>教育奖： <span className="cash-num">￥{rewards.education}</span></p>
              <p>目标奖： <span className="cash-num">￥{rewards.target}</span></p>
              <p>目标培训奖： <span className="cash-num">￥{rewards.eduTarget}</span></p>
            </Spin> 
          </Card>
        </Col>
      </Row>
    );
  }
})
export default Header;
