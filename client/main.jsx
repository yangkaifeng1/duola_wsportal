import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {_} from "lodash";
import { Router, Route, hashHistory, IndexRedirect, browserHistory} from 'react-router';

import config from "./lib/MenuConfiger";
import App from './layout/App.jsx';
import Login from './layout/Login.jsx';
import Dealership from "./component/dealership/Dealership.jsx";
import Dealeryes from "./component/dealership/Dealeryes.jsx";
import LoginPass from "./layout/LoginPass.jsx";
import searchAdmin from "./component/searchAdmin/searchAdmin.jsx";
import secondPromo from "./component/promo/secondPromo.jsx";
import searchResult from "./component/searchAdmin/searchResult.jsx";
import changeAlipay from "./layout/changeAlipay.jsx";

// Meteor.subscribe("current_users");

let { Promseify, UserApis } = DORA;
let menuItems = [];
_.map(config.MenuConfig, function (doc) { //仅支持1级 二级菜单
  if (doc.children) {
    menuItems = menuItems.concat(doc.children);
  } else {
    menuItems = menuItems.concat(doc);
  }
});

// 后期可用来做权限验证，当前未登则跳转到登陆页面
const requireAuth = (nextState, replace) => {
  if (!Meteor.userId()) {
    replace({ pathname: '/login' })
  }
  return true;
}

const requireAuth1 = (nextState, replace) => {
  if (!UserApis.getIdentity() && !UserApis.getPhone() && !UserApis.getCardnum() && !UserApis.getAccount()) {
    replace({ pathname: '/login' })
  }
  return true;
}

Meteor.startup(() => {
  render(
  	(<Router history={hashHistory}>
  		<Route path="/" component={App}>
        {
          menuItems.map( function ({component, roles}) {
            return (<Route path={roles} component={component} onEnter={requireAuth}/>)
          })
        }
        <IndexRedirect to="home" />
  		</Route>

      <Route path="login" component={Login}/>
      <Route path="dealership" component={Dealership}/>
      <Route path="dealeryes" component={Dealeryes} onEnter={requireAuth1}/>
      <Route path="loginpass" component={LoginPass}/>
      <Route path="searchAdmin" component={searchAdmin}/>
      <Route path="my_promo/secondPromo/:id" component={secondPromo}/>
      <Route path="searchResult/:id" component={searchResult}/>
      <Route path="changeAlipay" component={changeAlipay}/>
	</Router>), document.getElementById('app'));
});