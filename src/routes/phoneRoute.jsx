import React from 'react'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';

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

export default (
    <Router history={ hashHistory }>
        <Route path="/" component={ Menulist }>
          	<IndexRedirect to="menu" />
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
    </Router>
)