import React, { Component } from 'react';
import { Icon, Col} from 'antd';

class Menulist extends Component {
 componentDidMount () {
   document.title = '菜单'
 }
 render () {
   return (
     <div id="tas">
       <Col span={18} offset={3} className="register_box">
          <div className="icon_box">
            <a href="#/myinfo">
              <Icon type="user" className="icon_pos"/>
              <div className="login_input has_icon">我的账户</div>
              <Icon type="right"  className="icon_right" />
            </a>
          </div>
          <div className="icon_box">
            <a href="#/promolist">
              <Icon type="star-o" className="icon_pos"/>
              <div className="login_input has_icon">我的会员</div>
              <Icon type="right"  className="icon_right" />
            </a>
          </div>
          <div className="icon_box">
            <a href="#/phonerewards">
              <Icon type="red-envelope" className="icon_pos"/>
              <div className="login_input has_icon">我的奖励</div>
              <Icon type="right"  className="icon_right" />
            </a>
          </div>
          <div className="icon_box">
            <a href="#/phonerules">
              <Icon type="schedule" className="icon_pos"/>
              <div className="login_input has_icon">奖励规则</div>
              <Icon type="right"  className="icon_right" />
            </a>
          </div>
          <div className="icon_box">
            <a href="#/company">
              <Icon type="team" className="icon_pos"/>
              <div className="login_input has_icon">我的公司</div>
              <Icon type="right"  className="icon_right" />
            </a>
          </div>
       </Col>  
     </div>
   )
 }
}
export default Menulist;