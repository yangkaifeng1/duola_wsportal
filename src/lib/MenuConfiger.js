// 菜单
// import Homepage from "../layout/Homepage.jsx";
import CashList from "../pc/components/cash/CashList.jsx";
import MyPromo from "../pc/components/promo/MyPromo.jsx";
import Rules from "../pc/components/rules/Rules.jsx";
import Homepage from "../pc/components/home/Homepage.jsx";


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
			url: "./components/promo/",
			component: MyPromo,
			componentName: "MyPromo",
			orders: 2
		},
		{
			name: "提现",
			group: "cash",
			roles: "cash",
			url: "./components/cash/",
			component: CashList,
			componentName: "CashList",
			orders: 3
		},
		{
			name: "奖励规则",
			group: "rules",
			roles: "rules",
			url: "./components/rules/",
			component: Rules,
			componentName: "Rules",
			orders: 4
		}
	]
}
export default config;