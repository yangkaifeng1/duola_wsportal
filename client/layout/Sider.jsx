import React, { Component, PropTypes } from 'react';
import { Menu, Icon, Button} from "antd";
import { Link, Router, Route, hashHistory  } from 'react-router';
import config from "../lib/MenuConfiger";

let Sider = React.createClass ({
	getInitialState() {
	    return {
	      current: '1',
	    };
	},
  
  	handleClick(e) {
	    this.setState({
	        current: e.key
	    });
	},

	render() {
		let that = this;
	    return (
	      <div className="layout-aside">
	      	<Menu theme="light" 
	      	onClick={this.handleClick} 
	      	defaultOpenKeys={['sub1']}
	        selectedKeys={[this.state.current]}
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
	      					return (<Menu.SubMenu key= {item.roles + index} 
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
})
export default Sider;