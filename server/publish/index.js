// import Collections from '../../lib/collections/collections';

// Meteor.publish("current_users", function () {
//     if (this.userId) {
//         return Collections.Users.find(
//             {_id: this.userId},
//             {
//                 fields: {
//                     "mobile": 1,
//                     "store": 1,
//                     "staff": 1,
//                     "roles": 1
//                 }
//             }
//         );
//     } else {
//         this.ready();
//     }
// });
