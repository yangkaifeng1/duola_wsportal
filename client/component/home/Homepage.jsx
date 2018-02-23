import React, { Component, PropTypes } from 'react';
import { Row, Col, Card, Button} from 'antd';

export default class Homepage extends Component {
  render() {
    return (
    	<Row gutter={10}>
			<Col xs={24} sm={24} md={24} lg={24}>
				<Card title={"欢迎登陆"}>
					<h1>欢迎登陆推广系统</h1>
				</Card>
			</Col>
	    </Row>
    );
  }
}