import React, { Component } from 'react';
import { Form, Input, Button, Row, Col} from 'antd';
import stores from '../../../lib/store';
import UserApis from '../../../lib/userInfo';

const FormItem = Form.Item;

class NormalDealership extends Component{
  handleSubmit (e) {
      let that = this;
      e.preventDefault();
      that.props.form.validateFieldsAndScroll((err, values) => {
          if (values.alipayAccount && values.name && values.mobile && values.cardNum) {
            let account = values.alipayAccount;
            let name = values.name;
            let mobile = values.mobile;
            let cardNum = values.cardNum;
            UserApis.setAccount(account);
            UserApis.setPhone(mobile);
            UserApis.setCardnum(cardNum);
            UserApis.setIdentity(name);
            stores.goDealership(name, cardNum);
          } 
          return;
      });
  }


  verifyMobile ( rule, value, callback) {
    let reg = /^0?1[3|4|7|5|6|8|9|][0-9]\d{8}$/;
    if (!reg.test(value)){
      callback('请你输入正确的电话号码');
    }
    callback();
  }
	render () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };

		return(
			<Row type="flex" justify="space-around" align="middle" className="login-box">
	  	      <Col xs={24} sm={20} md={8} lg={8} className="little-loginbox">
	  	    	<Form className="login-form">
	  	    	  	<Row gutter={8} >
		             	<Col span={12} offset={6}>
		                	<h2>推广系统账户注册</h2>
		              </Col>
	            	</Row>
                <FormItem {...formItemLayout} label="电话" hasFeedback>
                  {getFieldDecorator('mobile', {
                    rules: [{
                      required: true, message: '您好'
                      }, {
                        validator: this.verifyMobile,
                      }]
                    })(<Input />)
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="支付宝账号" hasFeedback>
                  {getFieldDecorator('alipayAccount', {
                      rules: [{
                        required: true, message: ' 您好，请输入您的支付宝账号',
                      }]
                    })(<Input />)
                  }
                </FormItem>  
                <FormItem {...formItemLayout} label="姓名" hasFeedback>
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '您好，请输入您的真实姓名',
                      }],
                    })(
                      <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="身份证号码" hasFeedback>
                    {getFieldDecorator('cardNum', {
                      rules: [{
                        required: true, message: '您好，请输入您的身份证号码',
                      }],
                    })(
                      <Input />
                    )}
                </FormItem>  
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={()=>this.handleSubmit()} size="large">认证</Button>
                </FormItem>
	  	    	</Form>
	  	    </Col>
	  	  </Row>
		)
	}
}

const Dealership = Form.create()(NormalDealership);
export default Dealership;