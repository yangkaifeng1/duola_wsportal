import Collections from "/lib/collections/collections.js";
import { Random } from 'meteor/random';
const DDPConnection = (function () {
    return DDP.connect(Meteor.settings.public.oss.ddpAddress);
})();

Meteor.methods({
	// 检查用户是否存在
	'existUser': function (mobile) {
		let existUser = Meteor.users.findOne({mobile: mobile});
		if (!existUser) {
			throw new Meteor.Error('existUser== User is not find', '您还没有账号呢，快去注册吧');
		}
	},
	//实名认证检查
	'checkDealership': function (mobile) {
		// check(mobile, String);
		let dealership = Meteor.users.findOne({mobile: mobile, dealership: {$exists: true}});
		if (!dealership) {
			throw new Meteor.Error("checkDealership== dealership id not find", "该账号未实名认证");
		}
	},
	'checkById': function (id) {
		let dealership = Meteor.users.findOne({_id: id, dealership: {$exists: true}});
		if (!dealership) {
			throw new Meteor.Error("checkDealership== dealership id not find", "该账号未实名认证");
		}
		return dealership;
	},
	// 检查用户是否拥有管理员权限
	'checkUserPower': function (id) {
		let wxrestadmin = Meteor.users.findOne({_id: id, restAdmin: {$exists: true}});
		if (!wxrestadmin) {
			throw new Meteor.Error("checkDealership== wxrestadmin id not find", "该账号不具备此权限");
		}
		return wxrestadmin;
	},
	// 实名认证接口连接
	'getUserUrl': function (data) {
        let {url} = Meteor.settings.public.realCheck;
		let apiCall = Async.runSync(function (done) {
            HTTP.call("POST", `${url}`, {data}, function (err, res) {
	            done(err, res);
	        })
        });
        return apiCall.result;
	},
	// 修改用户支付宝账号
	'aliAccountChange': function (data) {
		let res = Meteor.users.update({"mobile": data.mobile}, {$set: {"alipayInfo.account": data.alipayAccount}});
		return res;
	},
	// 获取用户支付宝信息
	'getAliInfo': function (id) {
		let res = Meteor.users.findOne({'_id': id}, {fields: {'alipayInfo.account': 1}})
		return res;
	},
	// 用户芝麻分接口连接
	'getzmScore': function (data, updateData) {

        let {getScore} = Meteor.settings.public.realCheck;
		let apiCall = Async.runSync(function (done) {
            HTTP.call("POST", `${getScore}`, {data}, function (err, res) {
	            done(err, res);
	        })
        });
        let res = apiCall.result;
        let info = JSON.parse(res.content);
        let creditScore = '';
        if (info.code == "000") {
        	creditScore = info.data.zm_score;
        } else {
        	let res = info.message;
        	return res;
        }
        let cardNum = DDPConnection.call('rsaEncrypt', updateData.cardNum);
		let {CreditInfo} = Collections;
		let _id = Random.id(17);
        if (updateData._id == ''){
			let res = Meteor.users.update({"mobile": updateData.phone}, {$set: {"dealership": new Date(), "secfile.creditScore": creditScore, "alipayInfo.name": updateData.name, "alipayInfo.account": updateData.alipayAccount}});
			let userId = Meteor.users.findOne({'mobile': updateData.phone})._id;
			let dataInsert = {
				_id: _id,
				userId: userId,
				name: updateData.name,
				certNo: cardNum,
				creditScore: creditScore,
				createdAt: new Date()
			}
			let ins = CreditInfo.insert(dataInsert);
			if(res && ins){
	        	return res;
			}
        }else{
			let res = Meteor.users.update({"_id": updateData._id}, {$set: {"dealership": new Date(), "secfile.creditScore": creditScore, "alipayInfo.name": updateData.name, "alipayInfo.account": updateData.alipayAccount}})
        	let dataInsert = {
				_id: _id,
				userId: updateData._id,
				name: updateData.name,
				certNo: cardNum,
				creditScore: creditScore,
				createdAt: new Date()
			}
			let ins = CreditInfo.insert(dataInsert);
			if(res && ins){
	        	return res;
			}
        }
	}

})