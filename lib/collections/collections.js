import { Mongo } from 'meteor/mongo';
let Collections =  {
	Users: Meteor.users,
	CreditInfo: new Mongo.Collection("credit_info")
}

// console.log(Collections)

export default Collections;