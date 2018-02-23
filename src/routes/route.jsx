import React from 'react'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';

import Myapp from '../pc/components/layout/Myapp.jsx';
import PhoneLogin from '../wxPhone/PhoneLogin.jsx';
import PhoneCash from '../wxPhone/cash/cashlist.jsx';
import PhoneRules from '../wxPhone/rules/PhoneRules.jsx';
import MyRewards from '../wxPhone/rewards/MyRewards.jsx';
import PromoList from '../wxPhone/promo/PromoList.jsx';
import MyInfo from '../wxPhone/myinfo/MyInfo.jsx';
import Register from '../wxPhone/register/Register.jsx';
import SuccessRegister from '../wxPhone/register/SuccessRegister.jsx';
import Menulist from '../wxPhone/menu/Menulist.jsx';
import UpdateAli from '../wxPhone/updateaccount/UpdateAli.jsx';
import Company from '../wxPhone/company/Company.jsx';

import Login from '../pc/login.jsx';
import LoginPass from '../pc/loginPass.jsx';
import config from "../lib/MenuConfiger";

import Dealership from '../pc/components/dealership/Dealership.jsx';
import Dealeryes from '../pc/components/dealership/Dealeryes.jsx';
import SecondPromo from '../pc/components/promo/SecondPromo.jsx';
import Game from '../pc/components/promo/ai.jsx';
import ChangeAlipay from '../pc/components/layout/ChangeAlipay.jsx';

let menuItems = config.MenuConfig;

export default (
    <Router history={ hashHistory }>
        
        <Route path="/" component={Myapp}>
          {
            menuItems.map( function ({component, roles, orders}) {
              return (<Route path={roles} component={component} key={orders}/>)
            })
          }
          <IndexRedirect to="home" />
        </Route>
        <Route path="/phonelogin" component={ PhoneLogin }/>
        <Route path="/phonecashlist" component={ PhoneCash }/>
        <Route path="/phonerules" component={ PhoneRules }/>
        <Route path="/phonerewards" component={ MyRewards }/>
        <Route path="/promolist" component={ PromoList }/>
        <Route path="/myinfo" component={ MyInfo }/>
        <Route path="/register" component={ Register }/>
        <Route path="/successregister" component={ SuccessRegister }/>
        <Route path="/menu" component={ Menulist }/>
        <Route path="/updateaccount" component={ UpdateAli }/>
        <Route path="/company" component={ Company }/>
        
        <Route path="/login" component={ Login }/>
        <Route path="/loginpass" component={ LoginPass }/>
        <Route path="/dealership" component={ Dealership }/>
        <Route path="/dealeryes" component={ Dealeryes }/>
        <Route path="/my_promo/secondPromo/:id" component={ SecondPromo }/>
        <Route path="/my_promo/Game" component={ Game }/>
        <Route path="/changeAccount" component={ ChangeAlipay }/>
    </Router>
)