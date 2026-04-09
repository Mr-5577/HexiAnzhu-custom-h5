<template>
	<view class="uni-flex-center" v-show="showItem">
		<view class="uni-content">
			<view class="cu-bar qiun-bg-white search">
				<view style="margin: none;height: 90upx;width: 80%;">
					<scroll-view style="margin-top: 20upx;" scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
						<view class="cu-item cu-btn " :class="TabCur == -1 ? ' bg-blue  round' : 'bg-gray round'" style="height: 60upx;line-height: 64upx;" @click="checkAll">
							全部项目
						</view>
						<view
							class="cu-item cu-btn bg-blue  round"
							style="height: 60upx;line-height: 64upx;"
							v-for="(item, index) in ChooseProject"
							:key="index"
							
							:data-id="index"
						>
							{{ item.p_name }}
						</view>
					</scroll-view>
				</view>
				<view class="action" style="width: 10%;" @click="chooseProject"><text class=" line-blue cuIcon-more border-blue" style=""></text></view>
			</view>
			<view class="cu-bar search bg-white margin-top-sm">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input  v-model="requestData.keyword" :adjust-position="false" type="text" placeholder="请输入客户房号、姓名、电话" confirm-type="search" />
				</view>
				<view class="action" ><button class="cu-btn bg-blue  round" @click="InputBlur" >搜索</button> </view>
			</view>
			<view class="bg-white flex solid-bottom padding justify-between margin-top-sm margin-xs">
				<!-- 房屋类型 -->
				<view class="selects" >
					<view class="flex justify-between "  @click="showType('tid')">
						<text class="text-sm">{{tidData[tidIndex].name}}</text>
						<text class="text-lg  cuIcon-triangledownfill"></text>
					</view>
					<view class="mask" v-show="tidMask">
						<view v-for="(item,index) in tidData" :key="item.value" @click="chooseType('tid',index)">
							<view class="title" style="padding: 0;" :class="{'text-blue' : index == tidIndex}">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<!-- 逾期类型 -->
				<view class=" selects">
					<view class="flex justify-between "  @click="showType('overType')">
						<text class="text-sm">{{overTypeData[overTypeIndex].name}}</text>
						<text class="text-lg  cuIcon-triangledownfill"></text>
					</view>
					<view class="mask" v-show="overTypeMask">
						<view v-for="(item,index) in overTypeData" :key="item.value" @click="chooseType('overType',index)">
							<view class="title" style="padding: 0;" :class="{'text-blue' : index == overTypeIndex}">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<!-- 是否超期 -->
				<view class=" selects">
					<view class="flex justify-between "  @click="showType('state')">
						<text class="text-sm">{{stateData[stateIndex].name}}</text>
						<text class="text-lg  cuIcon-triangledownfill"></text>
					</view>
					<view class="mask" v-show="stateMask">
						<view v-for="(item,index) in stateData" :key="item.value" @click="chooseType('state',index)">
							<view class="title" style="padding: 0;" :class="{'text-blue' : index == stateIndex}">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<!-- 排序 -->
				<view class=" selects" >
					<view class="flex justify-between " @click="showType('sort')"> 
						<text class="text-sm">{{sortData[sortIndex].name}}</text>
						<text class="text-lg  cuIcon-triangledownfill"></text>
					</view>
					<view class="mask" v-show="sortMask">
						<view v-for="(item,index) in sortData" @click="chooseType('sort',index)" :key="item.value">
							<view class="title" style="padding: 0;" :class="{'text-blue' : index == sortIndex}">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="text-grey padding">共{{total}}条数据</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(items, index) in customerList" :key="index" @click="detail(items)">
					<view class="cu-avatar round lg bg-blue text-white " style="">
						{{cName(items.cname)}}
					</view>
					<view class="content">
						<view class="text-grey">
							<view class="text-cut">{{items.cname}}</view>
							<view class="text-xs text-gray">（{{items.ctel}}）</view>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="text-bage text-xs" style="background: #e0f0ff; color: #7fb9e5;">{{items.p_name}}</text>
								<text class="text-bage text-xs" style="background: #feead8; color: #fcae79;">{{items.roomnum}}</text>
								<text class="text-bage text-xs" style="background: #fde6e3; color: #f07b63;">超期{{items.overday}}天</text>
								<text class="text-bage text-xs" style="background: #fef6d1; color: #f8d338;">{{items.ptname}}</text>
							</view>
						</view>
					</view>
					<view >
						<view class="text-grey text-xs text-right" >{{items.u_name}} 负责</view>
						<view class="lg  cuIcon-more text-gray text-right" style="line-height: 40upx;"></view>
					</view>
				</view>
			</view>
			<view class="more-data" v-show="current_page < last_page" > {{moreData}} </view>
		</view>
		<li-choose ref="lichoose" :showCustomer="showCustomer" :isAllChoose="isAllChoose" :isSingle="isSingle" @confirm="confirms"></li-choose>
	</view>
	
</template>

<script>
import liChoose from '@/components/li-choose/li-choose.vue';
import { isJSON } from '@/common/checker.js';
var _self;
var canvaPie = null;
export default {
	components: {
		liChoose
	},
	data() {
		return {
			showItem:false,
			ChooseProject:[],
			showCustomer:true,
			isSingle:false,
			moreData:'加载更多数据...',
			mode: false,
			scrollLeft: 0,
			TabCur: -2,
			tidMask: false,
			stateMask: false,
			overTypeMask: false,
			sortMask: false,
			pixelRatio: 1,
			textarea: '',
			total:0,
			isAllChoose:false,
			customerList:[],
			requestData:{
				over_type:'',//按客户房号、名称和电话关键字进行查询
				type:'',//按客户归属查询（1我负责的，2共享给我的，3我管理的,4-共池客户）
				keyword:'',//逾期类型（1-定金，2-购房款，3-物业借款，4-网签，5-银行签字
				tid:'',//房屋类型 (1-住宅，2-商业，3-别墅，4-车位)
				sort:'',//进行排序（1：按创建时间正叙，2：按创建时间倒叙）
				pid:'',//	按项目进行查询
				state:'',//是否超期（0-全部,1-未超期，2-超期）
				page:1
			},
			allProject:[],
			overTypeData:[//逾期类型
			    { value: '2', name: '购房款', checked: true },
				{ value: '1', name: '定金', checked: false },
				{ value: '3', name: '物业借款', checked: false },
				{ value: '4', name: '网签', checked: false },
				{ value: '5', name: '银行签字', checked: false }],
			tidData:[//	房屋类型
				{ value: '0', name: '全部', checked: true },
				{ value: '1', name: '住宅', checked: true },
				{ value: '2', name: '商业', checked: false },
				{ value: '3', name: '别墅', checked: false },
				{ value: '4', name: '车位', checked: false }],
			sortData:[//进行排序
				{ value: '1', name: '正序', checked: true },
				{ value: '2', name: '倒序', checked: false }],
			stateData:[//是否超期
			    { value: '0', name: '全部', checked: false },
				{ value: '1', name: '超期', checked: true },
				{ value: '2', name: '未超期', checked: false }],
			tidIndex:0,
			stateIndex:1,
			sortIndex:0,
			overTypeIndex:0,
		    per_page:0,//一页多少条数据；
			current_page:1,//当前页数；
			last_page:0,//一共多少页；
			default_pname:''
		};
		
	},
	computed:{
		defaultActiveCustomType(){
			return this.$store.state.defaultActiveCustom;
		}
	},
	
	onLoad() {
		_self = this;
		this.getBigareacustomapi();
		this.requestData.over_type = this.overTypeData[this.overTypeIndex].value;
		this.requestData.type = this.defaultActiveCustomType;
		const dap =  this.$store.state.defaultActiveProject;
		
		if(option.pid){
			this.ChooseProject = [];
			if(option.p_name.search("Code=200") != -1){
				option.p_name = option.p_name.substr(0,option.p_name.length - 9)
			}
			let data ={p_id:option.pid,p_name:option.p_name,isactive:true}
			this.ChooseProject.push(data);
			this.requestData.pid = option.pid;
			this.customerList =[];
			this.getCustomerList();
			return
		}
		
		if(!dap){
			this.getUser();
		}else{
			this.ChooseProject = dap;
			let pids = []
			dap.forEach(res =>{
				pids.push(res.p_id)
			})
			
			let datas = []
			this.allProject.forEach(res => {
				res.project.forEach(resp =>{
					datas.push(resp.p_id);
				})
			});
			if(datas.length == dap.length){
				this.TabCur = -1;
			}else{
				this.TabCur = -3;
			}
			
			this.requestData.pid = this.$tools.toStrings(pids);;
			this.customerList =[];
			this.getCustomerList();
		}
		
	},
	onReachBottom: function(){
		if(this.current_page < this.last_page){
			this.current_page = this.current_page + 1;
			this.requestData.page = this.current_page;
			this.getCustomerList();
		}
	},
	methods: {
		showType(type){
			switch (type){
				case 'tid':
				this.tidMask = !this.tidMask;
				this.sortMask = false;
				this.stateMask = false;
				this.overTypeMask = false;
					break;
				case 'sort':
				this.sortMask = !this.sortMask;
				this.tidMask = false;
				this.stateMask = false;
				this.overTypeMask = false;
					break;
				case 'state':
				this.stateMask = !this.stateMask;
				this.sortMask = false;
				this.tidMask = false;
				this.overTypeMask = false;
					break;
				case 'overType':
				this.overTypeMask = !this.overTypeMask;
				this.stateMask = false;
				this.sortMask = false;
				this.tidMask = false;
					break;
				default:
					break;
			}
		},
		getUser(){
			this.$api.Getuserinfobookingapi({},res =>{
				if(res.code == 1000){
					this.ChooseProject = [];
					this.$store.commit('setDefaultPid',res.data.default_pid);
					this.requestData.pid = res.data.default_pid;
					this.default_pname = res.data.default_pname;
					let data ={p_id:res.data.default_pid,p_name:res.data.default_pname,isactive:true}
					this.ChooseProject.push(data);
					this.customerList =[];
					
					this.getCustomerList();
				}
			})
		},
		
		cName(name){
			return this.$tools.cName(name);
		},
		chooseType(type,index){
			this.customerList =[];
			this.requestData.page = 1;
			switch (type){
				case 'tid':
				this.tidIndex = index;
				this.tidMask = !this.tidMask;
				this.sortMask = false;
				this.stateMask = false;
				this.overTypeMask = false;
				this.requestData.tid = this.tidData[this.tidIndex].value;
				this.getCustomerList();
					break;
				case 'sort':
				this.sortIndex = index;
				this.sortMask = !this.sortMask;
				this.tidMask = false;
				this.stateMask = false;
				this.overTypeMask = false;
				this.requestData.sort = this.sortData[this.sortIndex].value;
				this.getCustomerList();
					break;
				case 'state':
				this.stateIndex = index;
				this.stateMask = !this.stateMask;
				this.sortMask = false;
				this.tidMask = false;
				this.overTypeMask = false;
				this.requestData.state = this.stateData[this.stateIndex].value;
				this.getCustomerList();
					break;
				case 'overType':
				this.overTypeIndex = index;
				this.overTypeMask = !this.overTypeMask;
				this.stateMask = false;
				this.sortMask = false;
				this.tidMask = false;
				this.requestData.over_type = this.overTypeData[this.overTypeIndex].value;
				this.getCustomerList();
					break;
				default:
					break;
			}
		},
		//根据权限获取大区和大区下的项目
		getBigareacustomapi() {
			this.$api.customGetbigareacustomapi({}, res => {
				 if(res.code == 1000){
					 if(res.data.length != 0){
						 this.allProject = res.data;
						 res.data.forEach(res => {
						 	res.project.forEach(resp => {
						 		resp.isactive = false;
						 	});
						 });
						 this.$store.commit('setSearchPro', res.data);
					 }
					 this.showItem = true;
				}
			});
		},
		//选择全部项目
		checkAll(){
			this.isAllChoose = true;
			this.TabCur = -1;
			let datas = [];
			this.ChooseProject = [];
			this.allProject.forEach(res =>{
				res.project.forEach(resp =>{
					datas.push(resp.p_id);
					this.ChooseProject.push(resp);
				})
			})
			this.$store.commit('setDefaultActiveProject',this.ChooseProject)
			this.pid = this.$tools.toStrings(datas);
			this.requestData.pid = '';
			this.customerList =[];
			this.getCustomerList();
		},
		detail(items){
			uni.navigateTo({
				url:'/pages/customer/overdue_customer_detail?crp_id='+items.id+'&ptid='+items.ptid
			})
		},
		InputFocus() {},
		InputBlur() {
			this.customerList = [];
			this.getCustomerList();
		},
		confirms(data) {
			this.ChooseProject = [];
			if(data.pid.length == 1){
				this.TabCur = -3;
				this.default_pname = data.p_name;
				if(data.pid.length == 1){
					this.allProject.forEach(res =>{
						res.project.forEach(resp =>{
							data.pid.forEach(p =>{
								if(resp.p_id == p){
									this.ChooseProject.push(resp)
								}
							})
						})
					})
				}
				this.requestData.pid = this.$tools.toStrings(data.pid);
				this.requestData.type = data.type;
				this.customerList = [];
				this.getCustomerList();
				
			}else{
				//多项目
				let AP = [];
				this.allProject.forEach(res =>{
					res.project.forEach(resp =>{
						AP.push(resp)
					})
				})
				//当所有项目和所选项目相等时
				if(AP.length == data.pid.length){
					this.TabCur = -1;
				}else{
					this.allProject.forEach(res =>{
						res.project.forEach(resp =>{
							data.pid.forEach(p =>{
								if(resp.p_id == p){
									this.ChooseProject.push(resp)
								}
							})
						})
					})
					this.TabCur = -3;
				}
				this.requestData.pid = this.$tools.toStrings(data.pid);
				this.customerList = [];
				this.getCustomerList();
			}
			this.$store.commit('setDefaultActiveProject',this.ChooseProject)
		},
		toggleTab(str) {
			this.$refs[str].show();
		},
		chooseProject() {
			this.$store.commit('setDefaultActiveProject',this.ChooseProject)
			this.$refs.lichoose.show();
		},
		checkboxChange(e) {
			var items = this.items;
			let values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
				for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
					if (items[i].value == values[j]) {
						items[i].checked = true;
						break;
					}
				}
			}
		},
		//选择单个项目
		tabSelect(item,index) {
			this.TabCur = index;
			this.singleCharts =[];
			this.customerList =[];
			this.scrollLeft = (index - 1) * 100;
			this.pid = item.p_id;
			this.requestData.pid = item.p_id;
			this.types = 'single';
			this.getCustomerList();
			
		},
		getCustomerList(){
			uni.showLoading({
				title:'正在加载数据...'
			})
			this.$api.getOverduelistcustomapi(this.requestData,res =>{
				res.data.data.forEach(resp =>{
					this.customerList.push(resp);
				})
				this.per_page = res.data.per_page;//一页多少条数据；
				this.current_page = res.data.current_page;//当前页数；
				this.last_page = res.data.last_page;//一共多少页；
				this.total = res.data.total;//总条数
			})
		}
	}
};
</script>

<style lang="less" scoped>

.more-data{
	height: 120upx;
	width: 100%;
	line-height: 120upx;
	text-align: center;
	color: #888888;
}
.cu-avatar{
  font-size: 34upx;	
}
.text-bage{
	padding: 4px;height: 40upx;line-height: 40upx;margin: 5upx;
}
.border-blue{
	border-radius: 50%;
	border: 1px solid #007aff;
	width: 50upx;
	height: 50upx;
	text-align: center;
	line-height: 50upx;
}
.mask {
	position: absolute;
	border: 1px solid #ddd;
	border-radius: 10upx;
	top: 74upx;
	width: 22%;
	padding: 5upx;
	z-index: 997;
	text-align: center;
	background: #fff;
}
.charts {
	width: 100%;
}
.uni-flex-center {
	// background: #F4F2F2;
	width: 100%;
	height: 100%;
	.uni-content {
		width: 100%;
		height: 100%;
	}
}
.selects {
	height: 60upx;
	border: 1px solid #BBBBBB;
	border-radius: 10upx;
	line-height: 50upx;
	margin: 5upx;
	padding: 5upx;
	width: 200upx;
}
.padding {
	padding: 10upx;
}
</style>
