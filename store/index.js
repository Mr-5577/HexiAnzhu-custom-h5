import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        scope:'weixin',//权限范围
		applic:'custom',//授权认证token
		// baseUrl:'http://192.168.10.179/',
		baseUrl:'http://woa.hexianzhu.com/',
		qiniuData: '', //服务端七牛云数据
		accessTokens:{},//
		searchPro:[],
		sharePerson:'',//共享人
		project_id:'',//项目id
		cuid:'',
		customerType:'',//筛选客户 我负责的
		customerInfo:'',
		groupSaleDatas:'',//设置共享人
		default_pid:'',
		stareStr:'',
		defaultActiveProject:'',//已选择项目
		defaultActiveCustom:3,
		uploadQiNiuName:'custom',//图片上传
		userInfo:'',//用户信息
		record: '', //多少天
    },
    mutations: {
		setRecord(state,data){
			state.record = data;
		},
		setUerInfo(state,data){
			state.userInfo = data;
		},
		setDefaultActiveCustom(state,data){
			state.defaultActiveCustom = data;
		},
		setStareStr(state,data){
			state.stareStr = data;
		},
		setDefaultActiveProject(state,data){
			state.defaultActiveProject = data;
		},
		setDefaultPid(state,data){
			state.default_pid = data;
		},
		setGroupSaleData(state,data){
			state.groupSaleDatas = data;
		},
		setCuid(state,data){
			state.cuid = data;
		},
        loginToken(state,data){
			console.log("data: " + JSON.stringify(data));
		},
		setQiniuData(state,data){
			state.qiniuData = data;
		},
		accessToken(state,data){
			state.accessTokens = data;
		},
		setSearchPro(state,data){
			state.searchPro = data;
		},
		setSharePerson(state,data){
			state.sharePerson = data;
		},
		setProjectId(state,data){
			state.project_id = data;
		},
		setCustomerType(state,data){
			state.customerType = data;
		},
		setCustomerInfo(state,data){
			state.customerInfo = data;
		}
    }
})

export default store
