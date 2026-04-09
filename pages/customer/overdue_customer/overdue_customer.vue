<template>
	<view v-show="showItem">
		<view>
			<!-- 头部 -->
			<view class="bg-df-blue">
				<view class="cu-bar search ">
					<view class="search-form round uni-cell-80">
						<text class="cuIcon-search"></text>
						<input
							v-model="requestData.keyword"
							@input="InputBlur"
							:adjust-position="false"
							type="text"
							placeholder="请输入客户房号、姓名、电话"
							confirm-type="search"
						/>
					</view>
					<view class="uni-cell-20 text-white text-cut" @click="chooseProject">
						{{ default_pname }}
						<text class="cuIcon-right text-white"></text>
					</view>
				</view>
				<view class=" flex solid-bottom padding justify-between ">
					<!-- 房屋类型 -->
					<view class="selects">
						<picker class="flex justify-center" :class="showSelect == 'tid' ? 'text-white' : ''" :range="tidData" range-key="name" @change="changeTid">
							<text class="text-sm">{{ tidData[tidIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
					<!-- 逾期类型 -->
					<view class=" selects">
						<picker class="flex justify-center" :range="overTypeData" range-key="name" :class="showSelect == 'overType' ? 'text-white' : ''" @change="changeOverType">
							<view class="flex text-cut">
								<text class="text-sm">{{ overTypeData[overTypeIndex].name }}</text>
								<text class="text-lg padding-left-xs cuIcon-unfold"></text>
							</view>
						</picker>
					</view>
					<!-- 是否超期 -->
					<view class=" selects">
						<picker class="flex justify-center" :range="stateData" range-key="name" :class="showSelect == 'state' ? 'text-white' : ''" @change="changeState">
							<text class="text-sm">{{ stateData[stateIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
					<!-- 排序 -->
					<view class=" selects">
						<picker class="flex justify-center" :range="sortData" range-key="name" :class="showSelect == 'sort' ? 'text-white' : ''" @change="changeSort">
							<text class="text-sm">{{ sortData[sortIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
				</view>
			</view>
			<!-- 数据 -->
			<view class="padding">
				<view class="text-grey padding-bottom">共{{ total }}条数据</view>
				<view class=" margin-bottom radius bg-white flex justify-between" v-for="(items, index) in customerList" :key="index" @click="detail(items)">
					<view class="uni-cell-20 flex justify-center align-center">
						<view class="cu-avatar round lg bg-blue text-white ">{{ cName(items.cname) }}</view>
					</view>
					<view class="content uni-cell-50 padding-sm">
						<view>
							<text class="text-cut text-bold">{{ items.cname }}</text>
							<text class="padding-left-sm text-gray">{{ items.ctel }}</text>
						</view>
						<view class="text-gray text-sm flex padding-top-xs">
							<view>
								<text>{{ items.p_name }}</text>
								<text class="padding-left-xs">{{ items.roomnum }}</text>
							</view>
						</view>
						<view class="text-grey padding-top-xs">负责人 {{ items.u_name }}</view>
					</view>
					<view class="uni-cell-30 padding text-right">
						<view>
							<text style="color: #f07b63;">超期{{ items.overday }}天</text>
						</view>
						<view class="padding-top-xl">
							<text class="padding-left-xs">{{ items.ptname }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="more-data" v-show="current_page < last_page">{{ moreData }}</view>
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
			showItem: false,
			ChooseProject: [],
			showCustomer: true,
			isSingle: false,
			moreData: '加载更多数据...',
			mode: false,
			scrollLeft: 0,
			TabCur: -2,
			pixelRatio: 1,
			textarea: '',
			total: 0,
			isAllChoose: false,
			customerList: [],
			requestData: {
				over_type: '', //逾期类型（1-定金，2-购房款，3-物业借款，4-网签，5-银行签字
				type: '', //按客户归属查询（1我负责的，2共享给我的，3我管理的,4-共池客户）
				keyword: '', //按客户房号、名称和电话关键字进行查询
				tid: '', //房屋类型 (1-住宅，2-商业，3-别墅，4-车位)
				sort: '', //进行排序（1：按创建时间正叙，2：按创建时间倒叙）
				pid: '', //	按项目进行查询
				state: '', //是否超期（0-全部,1-未超期，2-超期）
				page: 1
			},
			allProject: [],
			overTypeData: [
				//逾期类型
				{ value: '2', name: '购房款', checked: true },
				{ value: '1', name: '定金', checked: false },
				{ value: '3', name: '物业借款', checked: false },
				{ value: '4', name: '网签', checked: false },
				{ value: '5', name: '银行签字', checked: false }
			],
			tidData: [
				//	房屋类型
				{ value: '0', name: '全部', checked: true },
				{ value: '1', name: '住宅', checked: true },
				{ value: '2', name: '商业', checked: false },
				{ value: '3', name: '别墅', checked: false },
				{ value: '4', name: '车位', checked: false }
			],
			sortData: [
				//进行排序
				{ value: '1', name: '正序', checked: true },
				{ value: '2', name: '倒序', checked: false }
			],
			stateData: [
				//是否超期
				{ value: '0', name: '全部', checked: false },
				{ value: '1', name: '超期', checked: true },
				{ value: '2', name: '未超期', checked: false }
			],
			tidIndex: 0,
			stateIndex: 1,
			sortIndex: 0,
			overTypeIndex: 0,
			per_page: 0, //一页多少条数据；
			current_page: 1, //当前页数；
			last_page: 0, //一共多少页；
			default_pname: '',
			showSelect: ''
		};
	},
	computed: {
		defaultActiveCustomType() {
			return this.$store.state.defaultActiveCustom;
		}
	},

	onLoad(option) {
		_self = this;
		this.getBigareacustomapi();
		this.requestData.over_type = this.overTypeData[this.overTypeIndex].value;
		this.requestData.type = this.defaultActiveCustomType;
		const dap = this.$store.state.defaultActiveProject;
		if (option.pid) {
			this.ChooseProject = [];
			if (option.p_name.search('Code=200') != -1) {
				option.p_name = option.p_name.substr(0, option.p_name.length - 9);
			}
			let data = { p_id: option.pid, p_name: option.p_name, isactive: true };
			this.ChooseProject.push(data);
			this.requestData.pid = option.pid;
			this.customerList = [];
			this.getCustomerList();
			return;
		}

		if (dap.length == 0) {
			this.getUser();
		} else {
			this.ChooseProject = dap;
			let pids = [];
			if (dap.length != 0) {
				dap.forEach(res => {
					pids.push(res.p_id);
				});
			}
			let datas = [];
			this.allProject.forEach(res => {
				res.project.forEach(resp => {
					datas.push(resp.p_id);
				});
			});
			if (datas.length == dap.length) {
				this.default_pname = '全部项目';
			} else {
				this.default_pname = dap[0].p_name;
			}
			this.requestData.pid = this.$tools.toStrings(pids);
			this.customerList = [];
			this.getCustomerList();
		}
	},
	onReachBottom: function() {
		if (this.current_page < this.last_page) {
			this.current_page = this.current_page + 1;
			this.requestData.page = this.current_page;
			this.getCustomerList();
		}
	},
	methods: {
		//客户
		changeTid(e) {
			this.tidIndex = e.detail.value;
			this.requestData.type = this.tidData[this.tidIndex].value;
			this.showSelect = 'tid';
			this.firstReq();
		},
		// 选择逾期类型
		changeOverType(e) {
			this.overTypeIndex = e.detail.value;
			this.requestData.over_type = this.overTypeData[this.overTypeIndex].value;
			this.showSelect = 'over_type';
			this.firstReq();
		},
		// 是否超期
		changeState(e) {
			this.stateIndex = e.detail.value;
			this.requestData.state = this.stateData[this.stateIndex].value;
			this.showSelect = 'state';
			this.firstReq();
		},
		//客户排序
		changeSort(e) {
			this.sortIndex = e.detail.value;
			this.requestData.sort = this.sortData[this.sortIndex].value;
			this.showSelect = 'sort';
			this.firstReq();
		},

		firstReq() {
			this.requestData.page = 1;
			this.customerList = [];
			this.getCustomerList();
		},

		getUser() {
			this.$api.Getuserinfobookingapi({}).then(res => {
				if (res.code == 1000) {
					this.ChooseProject = [];
					this.$store.commit('setDefaultPid', res.data.default_pid);
					this.requestData.pid = res.data.default_pid;
					this.default_pname = res.data.default_pname;
					let data = { p_id: res.data.default_pid, p_name: res.data.default_pname, isactive: true };
					this.ChooseProject.push(data);
					this.customerList = [];
					this.getCustomerList();
				}
			});
		},

		cName(name) {
			return this.$tools.cName(name);
		},
		//根据权限获取大区和大区下的项目
		getBigareacustomapi() {
			this.$api.customGetbigareacustomapi({}, res => {
				if (res.code == 1000) {
					if (res.data.length != 0) {
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

		detail(items) {
			uni.navigateTo({
				url: '/pages/customer/overdue_customer/overdue_customer_detail?crp_id=' + items.id + '&ptid=' + items.ptid
			});
		},
		InputFocus() {},
		InputBlur() {
			this.customerList = [];
			this.getCustomerList();
		},
		confirms(data) {
			if (data.pid.length == 0) {
				this.getUser();
			} else {
				this.ChooseProject = [];
				//多项目
				let AP = [];
				this.allProject.forEach(res => {
					res.project.forEach(resp => {
						AP.push(resp);
					});
				});
				//当所有项目和所选项目相等时
				if (AP.length == data.pid.length) {
					this.default_pname = '全部项目';
					this.ChooseProject = AP;
				} else {
					
					this.allProject.forEach(res => {
						res.project.forEach(resp => {
							data.pid.forEach(p => {
								if (resp.p_id == p) {
									this.ChooseProject.push(resp);
								}
							});
						});
					});
					this.default_pname = this.ChooseProject[0].p_name;
				}
				this.$store.commit('setDefaultActiveProject', this.ChooseProject);
				this.requestData.pid = this.$tools.toStrings(data.pid);
				this.customerList = [];
				this.getCustomerList();
			}
		},
		toggleTab(str) {
			this.$refs[str].show();
		},
		chooseProject() {
			this.$store.commit('setDefaultActiveProject', this.ChooseProject);
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
		tabSelect(item, index) {
			this.TabCur = index;
			this.singleCharts = [];
			this.customerList = [];
			this.scrollLeft = (index - 1) * 100;
			this.pid = item.p_id;
			this.requestData.pid = item.p_id;
			this.types = 'single';
			this.getCustomerList();
		},
		getCustomerList() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.getOverduelistcustomapi(this.requestData, res => {
				res.data.data.forEach(resp => {
					this.customerList.push(resp);
				});
				this.per_page = res.data.per_page; //一页多少条数据；
				this.current_page = res.data.current_page; //当前页数；
				this.last_page = res.data.last_page; //一共多少页；
				this.total = res.data.total; //总条数
			});
		}
	}
};
</script>

<style lang="less" scoped>
.more-data {
	height: 120upx;
	width: 100%;
	line-height: 120upx;
	text-align: center;
	color: #888888;
}
.cu-avatar {
	font-size: 34upx;
}
.text-bage {
	padding: 4px;
	height: 40upx;
	line-height: 40upx;
	margin: 5upx;
}
.border-blue {
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

.selects {
	height: 60upx;
	border-radius: 10upx;
	line-height: 50upx;
	margin: 5upx;
	padding: 5upx;
	width: 200upx;
	color: rgba(255, 255, 255, 0.6);
	text-align: center;
}
.padding {
	padding: 20upx;
}
</style>
