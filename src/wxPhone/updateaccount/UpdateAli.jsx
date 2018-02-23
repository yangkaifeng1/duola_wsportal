import React, { Component } from 'react';
import {Form, Button, Icon, Col, message} from 'antd';
import stores from '../../lib/store';
import UserApis from '../../lib/userInfo';
import datas from '../../lib/settings';
import MD5 from 'crypto-js/md5';

let restful = datas.public.restful;
const FormItem = Form.Item;

class NormalUpdateAli extends Component {
  constructor (props) {
      super(props);
      this.state = {
          showTips: "获取验证码", //验证，码提示文字
          verifyBtn: false // 设定验证码不能重复点击
      }
  }

  getCode (mobile) {
    this.setState({
      showTips: "已发送"
    })
    stores.getVcCode (mobile);
  }
  componentDidMount () {
    document.title = '修改支付宝'
  }
  handleSubmit () {
      let that = this;
      that.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let url = restful.restUrl + restful.setAccount;
          let mobile = values.mobile;
          let loginUrl = restful.loginUrl;
          let appkey = restful.appkey;
          let token = UserApis.getToken();
          let sign = MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString();
          let data = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  token: token
              },
              body: JSON.stringify({
                  account: values.account,
                  name: values.name,
                  veriCode: values.veriCode,
                  mobile: mobile,
                  sign: sign
              })
          }
          fetch(url, data).then(res=>res.json()).then(response=>{
            console.log(response);
            if (response.statusCode === 200) {
              debugger;
              that.props.router.push('/myinfo');
            } else {
              message.error(response.msg, 1.5)
            }
          })
        }
      })
  }

 render () {
   const { getFieldDecorator } = this.props.form;
   let userMobile = UserApis.getUser().mobile || ''; 
   return (
     <div id="tas">
       <Col span={18} offset={3} className="register_box">
          <Form >
            <FormItem>
              <Icon type="user" className="icon_pos"/>
              {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: ' 您好，请输入您的真实姓名',
                  }]
                })(<input size="large" className="login_input has_icon" placeholder="真实姓名"/>)
              }
            </FormItem>
            <FormItem>
              <Icon type="idcard" className="icon_pos"/>
              {getFieldDecorator('account', {
                  rules: [{
                    required: true, message: ' 您好，请输入您要修改的支付宝账号',
                  }]
                })(<input size="large"  className="login_input has_icon" placeholder="支付宝账号"/>)
              }
            </FormItem>
            <FormItem>
              <Icon type="mobile" className="icon_pos"/>
              {getFieldDecorator('mobile', {
                  initialValue: userMobile
                })(<input size="large"  className="login_input has_icon" placeholder="手机号码"/>)
              }
            </FormItem>
            <FormItem>
              {getFieldDecorator('veriCode', {
                  rules: [{
                    required: true, message: '您好，请输入验证码',
                  }],
                })(<input size="large"  className="login_input get_code"/>)
              }
              <Button className="get_code_btn" onClick={() => this.getCode(userMobile)} disabled={this.state.verifyBtn}>{this.state.showTips}</Button>
            </FormItem>
            <FormItem>
              <Button className="login_input sub_btn" onClick={()=>this.handleSubmit()}>提交</Button>
            </FormItem>
          </Form>
       </Col>  
     </div>
   )
 }
}
const UpdateAli = Form.create()(NormalUpdateAli);
export default UpdateAli;