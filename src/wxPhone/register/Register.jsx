import React, { Component } from 'react';
import {Form, Button, Icon, Col} from 'antd';
import stores from '../../lib/store';
import UserApis from '../../lib/userInfo';

const FormItem = Form.Item;
class NormalRegister extends Component {
  componentDidMount () {
    document.title = '推广系统注册'
  }
  handleSubmit () {
    let that = this;
    that.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          let account = values.account;
          let name = values.name;
          let mobile = values.mobile;
          let cardNum = values.cardNum;
          let url = window.location.origin;
          UserApis.setAccount(account);
          UserApis.setPhone(mobile);
          UserApis.setCardnum(cardNum);
          UserApis.setIdentity(name);
          stores.goZMDealership(name, cardNum, url, 'phone');
        } 
        return;
    });
  }
 render () {
   const { getFieldDecorator } = this.props.form;
   return (
     <div id="tas">
       <Col span={18} offset={3} className="register_box">
          <Form>
            <FormItem>
              <Icon type="user" className="icon_pos"/>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入真实姓名" }],
              })(
                <input size="large" className="login_input has_icon" placeholder="真实姓名"/>
              )}
            </FormItem>
            <FormItem>
              <Icon type="idcard" className="icon_pos"/>
              {getFieldDecorator("cardNum", {
                rules: [{ required: true, message: "请输入身份证号码" }],
              })(
                <input size="large"  className="login_input has_icon" placeholder="身份证号码"/>
              )}
            </FormItem>
            <FormItem>
              <Icon type="mobile" className="icon_pos"/>
              {getFieldDecorator("mobile", {
                rules: [{ required: true, message: "请输入手机号码" }],
              })(
                <input size="large"  className="login_input has_icon" placeholder="手机号码"/>
              )}
            </FormItem>
            <FormItem>
              <Icon type="pay-circle-o" className="icon_pos"/>
              {getFieldDecorator("account", {
                rules: [{ required: true, message: "请输入支付宝账号" }],
              })(
                <input size="large"  className="login_input has_icon"  placeholder="支付宝账号"/>
              )}
            </FormItem>
            <FormItem>
              <Button className="login_input sub_btn"  onClick={()=>this.handleSubmit()}>确认注册</Button>
            </FormItem>             
          </Form>
       </Col>  
     </div>
   )
 }
}
const Register = Form.create()(NormalRegister);
export default Register;