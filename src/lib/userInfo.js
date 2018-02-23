
let UserApis = {
	setUser: (user) => {
		user = JSON.stringify(user);
		localStorage.setItem("user", user);
	},

	getUser: () => {
		return JSON.parse(localStorage.getItem("user")) || {};
	},

	loginOut: (that) => {
		localStorage.removeItem("user");
		localStorage.removeItem("dealer");
		localStorage.removeItem("rewards");
		localStorage.removeItem("wsploginToken");
	},

	setDealer: (dealer) => {
		dealer = JSON.stringify(dealer);
		localStorage.setItem("dealer", dealer);	
	},

	getDealer: () => {
		return JSON.parse(localStorage.getItem("dealer"));
	},

	setRewards: (rewards) => {
		rewards = JSON.stringify(rewards);
		localStorage.setItem("rewards", rewards);	
	},

	getRewards: () => {
		return JSON.parse(localStorage.getItem("rewards"));
	},

	getToken: () => {
		return localStorage.getItem("wsploginToken") ;
	},

	setToken: (token) => {
		return localStorage.setItem("wsploginToken", token);
	},
	//保存用户真实姓名
	setIdentity: (identity) => {
		return localStorage.setItem("identity", identity);
	},

	getIdentity: () => {
		return localStorage.getItem("identity");
	},
	// 保存用户身份证号
	setCardnum: (cardnum) => {
		return localStorage.setItem("cardnum", cardnum);
	},

	getCardnum: () => {
		return localStorage.getItem("cardnum");
	},
	// 保存用户电话
	setPhone: (phone) => {
		return localStorage.setItem("phone", phone);
	},

	getPhone: () => {
		return localStorage.getItem("phone");
	},
    //保存用户支付宝账号 
    setAccount: (account) => {
    	return localStorage.setItem("account", account);
    },

    getAccount: ()=> {
    	return localStorage.getItem("account");
    },

    setPower: ()=>{
    	return localStorage.setItem("wxrestadmin", true);
    },

    getPower: ()=>{
    	return localStorage.getItem("wxrestadmin");
    },

    setSearchUserMobile: (name)=>{
    	return localStorage.setItem("searchUserMobile", name);
    },

    getSearchUserMobile: ()=>{
    	return localStorage.getItem("searchUserMobile");
    },

    serSearchUserCreate: (time)=>{
    	return localStorage.setItem("searchUserCreate", time);
    },

    getSearchUserCreate: ()=>{
    	return localStorage.getItem("searchUserCreate");
    }

}

export default UserApis;