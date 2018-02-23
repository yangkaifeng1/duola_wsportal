import React, { Component } from 'react';
import {Col} from 'antd';
class PhoneRules extends Component {
	componentDidMount () {
	    document.title = '奖励规则'
	}
	render() {
	    return (
	      <div className="phone_rule_box">
	      	<div className="rule_title first"><span className="title_icon"></span>用户定义</div>
	      	<div className="user_box"><Col className="user_title" span={5}>有效用户:</Col><Col span={19}>开通了会员，产生过有效订单并且不处于冻结状态的未过期用户。</Col></div>
	      	<div className="user_box"><Col className="user_title" span={5}>直推会员:</Col><Col span={19}>B扫A的优惠码成为了有效用户，则B是A的直推会员。</Col></div>
	      	<div className="user_box"><Col className="user_title" span={5}>二级会员:</Col><Col span={19}>如果C是B的直推会员，B又是A的直推会员，则C是A的二级会员。</Col></div>
	      	<div  className="rule_title"><span className="title_icon"></span>推荐奖 </div>
	      	<div  className="user_box">有效用户A每新增一个直推会员，A可获得100元的推荐奖。</div>
	      	<div  className="rule_title"><span className="title_icon"></span>维护奖</div>
	      	<div  className="user_box">有效用户A的每个直推会员每月续费并下单，A均可获得30元维护奖。如果A的直推会员为季费或更长，则从开通会员并使用的次月起计算维护费，有效使用一个月给一个月的维护费。</div>
	      	<div  className="rule_title"><span className="title_icon"></span>教育奖</div>
	      	<div  className="user_box">有效用户A的所有直推会员所获得的每笔推荐奖和维护奖，系统都会自动乘以A当前有效直推会员所对应的教育奖提成比例，作为教育奖发放给A。</div>
	      	<div  className="user_box">A的当前有效直推会员人数为1-4时，提0%</div>
			<div  className="user_box">A的当前有效直推会员人数为5-9时，提30%</div>
			<div  className="user_box">A的当前有效直推会员人数为10-19时，提40%</div>
			<div  className="user_box">A的当前有效直推会员人数为20-39时，提45%</div>
			<div  className="user_box">A的当前有效直推会员人数为40-59时，提50%</div>
			<div  className="user_box">A的当前有效直推会员人数为60-99时，提55%</div>
			<div  className="user_box">A的当前有效直推会员人数为100及以上时，提60%</div>
			<div  className="user_box">（A的当前有效直推会员人数以系统后台动态记录为准）</div>
			<div  className="user_box weight">注：目标奖和目标培训奖是针对独立公司的额外奖励，达到标准与公司签约后方可进行对公结算，以上所有奖励细则最终解释权归公司所有。</div>

	      </div> 
	    );
	}
}
export default PhoneRules;