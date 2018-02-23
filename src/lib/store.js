import datas from './settings';
import UserApis from './userInfo';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';
import { message } from 'antd';

let restful = datas.public.restful;
let dealerRest = datas.public.dealerRest;
let stores = {
	verifyMobile: (mobile) => {
	    let reg = /^0?1[3|4|7|5|6|8|9|][0-9]\d{8}$/;
	    if (!reg.test(mobile)){
	      message.error("您必须输入正确的电话号码",  1.5);
	      return false;
	    }
	    return true;
	},

	getVcCode: function (mobile) {
		let url = restful.restUrl+restful.vcUrl;
		let loginUrl = restful.loginUrl;
		let appkey = restful.appkey;
		let sign = MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString();
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: mobile,
	            url:  loginUrl,
	            sign: sign,
	            sendToBound: true
            })
        };
		fetch(url, data).then(res=>res.json()).then(response=>{
			console.log(response);
		})
	},

	checkVcCode: function (mobile, veriCode) {
		let url = restful.restUrl+restful.vUrl;
		let loginUrl = restful.loginUrl;
		let appkey = restful.appkey;
		let sign = MD5(`appkey=${appkey}&mobile=${mobile}&url=${loginUrl}`).toString();
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: mobile,
                veriCode: veriCode,
                sign: sign
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	// console.log(response);
        })	
	},

	loginWihCode: function (mobile, authKey) {
		let url = restful.restUrl+restful.loginUrl;
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: mobile,
                authKey: authKey
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response);
        		let token = response.data.token;
        		let user = response.data.user;
        		UserApis.setToken(token);
        		UserApis.setUser(user);
        		this.getAlipayInfo();
        	}
        })		
	},

	loginWihDigest: function (mobile, digest, style) {
		let url = restful.restUrl+restful.digest;
		let digests = SHA256(digest).toString();
		console.log(digests);
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: mobile,
                digest: digests
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	console.log(response);
        	let token = response.data.token;
    		let user = response.data.user;
    		UserApis.setToken(token);
    		UserApis.setUser(user);
        })
	},

	getMoney: function () {
		debugger
		let url = dealerRest.url+dealerRest.doCash;
		let channel = dealerRest.channel;
		let token = UserApis.getToken();
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({
                channel: channel
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		message.success(response.msg, 1.5)
        	} else {
        		message.error(response.msg, 1.5)
        	}
        })
	},

	getAlipayInfo: function () {
		let url = restful.restUrl + restful.alipayInfo;
		let token = UserApis.getToken();
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            }
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		let aliAccount = response.alipayInfo.account;
        		UserApis.setAccount(aliAccount);
        	}
        })
	}, 
	
	goZMDealership: function (name, cardNum, urls, style) {
		debugger
		let url = dealerRest.url + dealerRest.givepower;
		let data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
	            name: name,
	            certNo: cardNum,
	            giveUrl: urls,
                style: style	
            })
        };
        fetch(url, data).then(res=>res.json()).then(response=>{
        	if (response.statusCode === 200) {
        		console.log(response.result.content);
                if (response.result.code === "000") {
                    window.location.href = response.result.data.url;
                } else {
                     message.error(response.result.message, 1.5);
                }
        		// let aliAccount = response.alipayInfo.account;
        		// UserApis.setAccount(aliAccount);
        	} else {
                message.error(response.msg, 1.5);
            }
        })
	},

}

export default stores;