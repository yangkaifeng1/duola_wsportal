// 菜单
// import Homepage from "../layout/Homepage.jsx";
import CashList from "../component/cash/CashList.jsx";
import MyPromo from "../component/promo/MyPromo.jsx";
import Rules from "../component/rules/Rules.jsx";
import Homepage from "../component/home/Homepage.jsx";


let config = {
	MenuConfig: [
		{
			name: "首页", //名字
			roles: "home", //权限
			path: "home", // 路由
			url: "./layout", //相对于main.jsx的路径
			componentName: "Homepage", //组件名称,
			component: Homepage,
			group: "main", //分组
			orders: 1 //排序号
		},
		{
			name: "我的推广",
			group: "promo",
			roles: "my_promo",
			url: "./component/promo/",
			component: MyPromo,
			componentName: "MyPromo",
			orders: 2
		},
		{
			name: "提现",
			group: "cash",
			roles: "cash",
			url: "./component/cash/",
			component: CashList,
			componentName: "CashList",
			orders: 3
		},
		{
			name: "奖励规则",
			group: "rules",
			roles: "rules",
			url: "./component/rules/",
			component: Rules,
			componentName: "Rules",
			orders: 4
		}
		// { 支持二级菜单
		// 	name: "订单管理",
		// 	group: "orders",
		// 	roles: "orders",
		// 	children: [
		// 		{
		// 			name: "当前订单",
		// 			roles: "orders_current",
		// 			url: "./component/orders/",
		// 			component: CurrentOrders,
		// 			componentName: "CurrentOrders",
		// 			orders: 2
		// 		},
		// 		{
		// 			name: "历史订单",
		// 			roles: "orders_history",
		// 			url: "./component/orders/", 
		// 			componentName: "HistoryOrders",
		// 			component: HistoryOrders,
		// 			orders: 3
		// 		}
		// 	]
		// },
	]
}
export default config;