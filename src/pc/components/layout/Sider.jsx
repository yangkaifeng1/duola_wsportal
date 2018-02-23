import React, { Component } from 'react';
import { Menu, Icon} from "antd";
import { Link} from 'react-router';
import config from "../../../lib/MenuConfiger";

class Sider extends Component {
	

	render() {
	    return (
	      <div className="layout-aside">
	      	<Menu theme="light" 
	      	onClick={this.handleClick} 
	      	defaultOpenKeys={['sub1']}
	        mode="inline">
	      		{
	      			config.MenuConfig.map( function (item, index) {

	      				if (!item.children) {
	      					return (
	      						<Menu.Item key={item.roles + index}>
	      							<Link to={item.roles}>{item.name}</Link>
	      						</Menu.Item>
	      					)
	      				} else {
	      					return (<Menu.SubMenu key={item.roles + index} 
	      						title={<span><Icon type="mail" /><span>{item.name}</span></span>}
	      					>
	      						{
	      							item.children.map( function (subItem, index) {
	      								return (
	      									<Menu.Item key={subItem.roles + index}>
	      										<Link to={subItem.roles}>{subItem.name}</Link>
	      									</Menu.Item>
	      								)
	      							})
	      						}
	      					</Menu.SubMenu>)
	      				}
	      			})
	      		}
	      	</Menu>
	      </div> 
	    );
	}
}
export default Sider;