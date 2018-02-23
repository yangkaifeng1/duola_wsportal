import React, { Component } from 'react';
import { Row, Col, Card} from 'antd';
import Header from './Header.jsx'; 
import Sider from './Sider.jsx';
let {UserApis} = DORA;

let App = React.createClass({
  getInitialState() {
    return {
      title: '推广系统'
    };
  },
  render() {
    return (
      <div className="main-container">
        <Header callbackParent={this.toggleMenu}></Header>
        <Row className="down-box" justify="space-around" gutter={10} >
          <Col span={6} xs={24} sm={6} md={6} lg={6}>
            <Card title={"菜单"} extra={UserApis.getPower()? <a href="#/searchAdmin">搜索</a>:""}>
              <Sider></Sider>
            </Card>
          </Col>
          <Col span={18} xs={24} sm={18} md={18} lg={18}>
            <Card title={"详情"}>
              {this.props.children}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
});
export default App;