<template>
	<view>
		<template>
			<view style="background-color:rgb(67,120,190) ;">
				<view class="cu-bar search ">
					<view class="search-form round uni-cell-80">
						<text class="cuIcon-search"></text>
						<input
							v-model="requestData.keyword"
							:adjust-position="false"
							@blur="InputBlur"
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
				<view class=" flex solid-bottom padding justify-between  margin-xs">
					<!-- 客户-->
					<view class="selects">
						<picker class="flex justify-center" :class="showSelect == 'tid' ? 'text-white' : ''" :range="tidData" range-key="name" @change="changeTid">
							<text class="text-sm">{{ tidData[tidIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
					<!-- 客户来源 -->
					<view class=" selects">
						<picker class="flex justify-center " :class="showSelect == 'loop_type' ? 'text-white' : ''" :range="overTypeData" range-key="name" @change="changeOverType">
							<text class="text-sm">{{ overTypeData[overTypeIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
					<!-- 客户状态 -->
					<view class=" selects">
						<picker class="flex  justify-center" :class="showSelect == 'state' ? 'text-white' : ''" :range="stateData" range-key="name" @change="changeState">
							<text class="text-sm">{{ stateData[stateIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
					<!-- 排序 -->
					<view class=" selects">
						<picker class="flex justify-center" :class="showSelect == 'sort' ? 'text-white' : ''" :range="sortData" range-key="name" @change="changeSort">
							<text class="text-sm">{{ sortData[sortIndex].name }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</picker>
					</view>
				</view>
			</view>
			<view class="flex" style="justify-content: space-between;">
				<view class="text-grey padding">共{{ total }}条数据</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item shadow-gray" v-for="(items, index) in customerList" :key="index" @click="detail(items)">
					<view class="padding-left flex justify-between padding-right-sm" style="height:84rpx;line-height: 84rpx;border-bottom: 1rpx solid rgb(235,235,235);">
						<view class="flex">
							<view class="text-center bg-blue margin-top-sm" style="height: 40rpx;width: 80rpx;line-height: 40rpx;border-radius: 4rpx;">{{ items.intention }}</view>
							<view class="text-15 padding-left-sm">
								<text class="text-cut">{{ items.cname }} ㅡ {{ items.ctel }}</text>
							</view>
						</view>
						<view class="text-cut" :class="items.diff_day < 3 ? 'text-green' : items.diff_day > 2 && items.diff_day < 30 ? 'text-orange' : 'text-red'">
							{{ items.diff_day == 0 ? '今天已跟进' : items.diff_day + '天前跟进' }}
						</view>
					</view>
					<view class="padding-top  padding-left flex ">
						<view class="cu-avatar round lg bg-blue text-white ">{{ cName(items.cname) }}</view>
						<view class="uni-cell-90 padding-left">
							<view class="text-gray text-13 flex text-cut">
								<text class="light" v-for="(itm, idx) in items.tagData" :class="idx != 0 ? 'right-line' : 'padding-right-xss'" :key="idx">{{ itm }}</text>
							</view>
							<view class="flex justify-between  text-13 padding-top-xs">
								<view class="text-cut text-gray">负责人：{{ items.sales_name ? items.sales_name : '----' }}</view>
								<view class="padding-right-sm">{{ items.defTag }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="more-data" v-show="current_page < last_page">{{ moreData }}</view>
		</template>
		<w-picker mode="range" startDate="2017" endYear="2030" :defaultVal="rangeDval" :current="false" @confirm="onConfirm" ref="range" themeColor="#f00"></w-picker>
		<li-choose ref="lichoose" :showCustomer="showCustomer" :isAllChoose="isAllChoose" @confirm="confirms"></li-choose>
		<view class="right-btn-top-page" style="font-size: 15px;" @click="promptVisible = true">
			<view>
				<view style="border-bottom: 1px solid #DDDDDD;">{{ p }}</view>
				<view>{{ last_page }}</view>
			</view>
		</view>
		<view class="right-btn-top" @click="toTop"><view class="lg text-gray cuIcon-top"></view></view>
		<view class="right-btn" @click="addCustomer"><image src="/static/images/home/add-custom.png" style="height: 38rpx;width: 34rpx;"></image></view>
		<prompt :visible.sync="promptVisible" :defaultValue="defaultValue" @confirm="clickPromptConfirm" mainColor="rgb(67,120,190)"><!-- 这里放入slot内容--></prompt>
	</view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker.vue';
import liChoose from '@/components/li-choose/li-choose.vue';
import prompt from '@/components/zz-prompt/index.vue';
import { isJSON } from '@/common/checker.js';
var _self;
var canvaPie = null;
export default {
	components: {
		wPicker,
		liChoose,
		prompt
	},
	data() {
		return {
			// 控制弹框输入框显示
			promptVisible: false,
			defaultValue: '1',
			moreData: '加载更多数据...',
			ChooseProject: [{ p_name: '' }],
			mode: false,
			showCustomer: false,
			isAllChoose: false,
			customerList: [],
			rangeDval: ['2017-10-30', '2019-12-31'],
			requestData: {
				loop_type: '', //来源类型（1-手动录入，2-人脸识别，3-微信扫码）
				type: 3, //按客户归属查询（1我负责的，2共享给我的，3全部客户，4客户共池）
				keyword: '', //搜索
				sort: '', //进行排序（1：按创建时间正叙，2：按创建时间倒叙）
				pid: '', //	按项目进行查询
				state: '', //是否超期（1未成交，2已排号，3已认购，4已网签，5新增）
				page: 1,
				record: '' //多少天以上未跟进客户
			},
			allProject: [],
			overTypeData: [
				//全部来源
				{ value: '0', name: '全部来源', checked: true },
				{ value: '1', name: '手动录入', checked: false },
				{ value: '2', name: '人脸识别', checked: false },
				{ value: '3', name: '微信扫码', checked: false }
			],
			tidData: [
				//	客户
				{ value: '3', name: '全部客户', checked: true },
				{ value: '1', name: '我负责的', checked: false },
				{ value: '2', name: '共享给我', checked: false },
				{ value: '4', name: '公池客户', checked: false }
			],
			sortData: [
				//进行排序
				{ value: '1', name: '录入正序', checked: true },
				{ value: '2', name: '录入倒序', checked: false },
				{ value: '3', name: '跟进正序', checked: false },
				{ value: '4', name: '跟进倒序', checked: false }
			],
			stateData: [
				//是否成交
				{ value: '0', name: '全部', checked: true },
				{ value: '1', name: '未成交', checked: false },
				{ value: '2', name: '已排号', checked: false },
				{ value: '3', name: '已认购', checked: false }
			],
			tidIndex: 0,
			stateIndex: 0,
			sortIndex: 0,
			overTypeIndex: 0,
			per_page: 0, //一页多少条数据；
			current_page: 1, //当前页数；
			last_page: 0, //一共多少页；
			total: 0,//总条数
			status: 'more',
			p: 1,
			default_pname: '',
			showSelect: ''
		};
	},
	onLoad(option) {
		_self = this;
		this.requestData.loop_type = this.overTypeData[this.overTypeIndex].value;
		this.getBigareacustomapi();
		if (option.record) {
			this.requestData.record = option.record;
			this.requestData.page = 1;
			this.customerList = [];
			this.p = 1;
			const dap = this.$store.state.defaultActiveProject;
			//是否有3天以上没有跟进筛选
			if (this.types == 1) {
				this.requestData.type = 1;
				this.tidIndex = 1;
			}
			if (dap.length == 0) {
				this.getUser();
			} else {
				this.ChooseProject = dap;
				let pids = [];
				dap.forEach(res => {
					pids.push(res.p_id);
				});
				let datas = [];
				this.allProject.forEach(res => {
					res.project.forEach(resp => {
						datas.push(resp.p_id);
					});
				});
				// 所选项目和所有项目相等时
				if (datas.length == dap.length) {
					this.default_pname = '全部项目';
				} else {
					this.default_pname = dap[0].p_name;
				}
				this.requestData.pid = this.$tools.toStrings(pids);
				this.requestData.page = 1;
				this.customerList = [];
				this.p = 1;
				this.getCustomerList();
			}
		}
	},
	onHide() {
		this.$store.commit('setRecord', '');
		this.$store.commit('setCustomerType', '');
	},
	// 上拉加载数据
	onReachBottom() {
		if (this.current_page < this.last_page) {
			this.current_page = this.current_page + 1;
			this.requestData.page = this.current_page;
			this.getCustomerList();
		}
	},
	onPullDownRefresh() {
		this.requestData.page = 1;
		this.customerList = [];
		this.p = 1;
		this.getCustomerList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1500);
	},
	//计算页面轮动 来计算当前多少页
	onPageScroll(e) {
		if (Math.ceil(e.scrollTop / 1100) == 0) {
			this.p = 1;
		} else {
			this.p = Math.ceil(e.scrollTop / 1300);
		}
	},
	computed: {
		// 多少天 前没跟进
		records() {
			return this.$store.state.record;
		},
		types() {
			return this.$store.state.customerType;
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
		// 选择客户来源
		changeOverType(e) {
			this.overTypeIndex = e.detail.value;
			this.requestData.loop_type = this.overTypeData[this.overTypeIndex].value;
			this.showSelect = 'loop_type';
			this.firstReq();
		},
		// 选择客户状态
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
		//第一页数据
		firstReq() {
			this.customerList = [];
			this.requestData.page = 1;
			this.getCustomerList();
		},
		// 输入页数跳转
		async clickPromptConfirm(val) {
			if (!val) {
				uni.showToast({
					icon: 'none',
					title: '不能为空'
				});
				return;
			}
			if (val > this.last_page) {
				uni.showToast({
					icon: 'none',
					title: '输入页码必须小于' + this.last_page
				});
				return;
			}
			this.p = parseInt(val);
			this.promptVisible = false;
			if (parseInt(val) != 1) {
				uni.showLoading({
					title: '正在加载数据...'
				});
				this.customerList = [];
				for (let i = 0; i < this.p; i++) {
					this.requestData.page = i + 1;
					await this.getCustomerList();
				}
				let scroll = 1380 * (parseInt(val) - 1);
				uni.pageScrollTo({
					scrollTop: scroll,
					duration: 300
				});
			}
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
					this.$store.commit('setDefaultActiveProject', this.ChooseProject);
					this.customerList = [];
					this.p = 1;
					this.getCustomerList();
				}
			});
		},
		getBigareacustomapi() {
			this.$api.customGetbigareacustomapi({}, res => {
				if (res.code == 1000) {
					this.allProject = res.data;
					res.data.forEach(res => {
						res.project.forEach(resp => {
							resp.isactive = false;
						});
					});
					this.$store.commit('setSearchPro', res.data);
				}
			});
		},
		toTop() {
			this.p = 1;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		addCustomer() {
			uni.navigateTo({
				url: '/pages/customer/customer_add'
			});
		},
		cName(name) {
			return this.$tools.cName(name);
		},

		//获取所有项目
		getProject() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetprojectlistcustomapi({}, res => {
				this.allProject = res.data;
			});
		},
		detail(items) {
			uni.navigateTo({
				url: '/pages/customer/customer_detail?id=' + items.id
			});
		},

		InputBlur() {
			this.firstReq();
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
					this.ChooseProject = AP;
					this.default_pname = '全部项目';
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
				this.firstReq();
			}
		},
		toggleTab(str) {
			this.$refs[str].show();
		},
		onConfirm(val) {
			this.resultInfo = { ...val };
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

		async getCustomerList() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			await this.$api.getIndexcustomapi(this.requestData, res => {
				if (res.code == 1000) {
					res.data.data.forEach(resp => {
						this.customerList.push(resp);
					});
					this.per_page = res.data.per_page; //一页多少条数据；
					this.current_page = parseInt(res.data.current_page); //当前页数；
					this.last_page = res.data.last_page; //一共多少页；
					this.total = res.data.total; //总条数
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.cu-list.menu-avatar > .cu-item {
	height: 228rpx;
	margin: 24rpx;
	border-radius: 10rpx;
	display: block;
	padding-right: 0;
}
.right-line {
	border-left: 4rpx solid rgb(204, 204, 204);
	padding-left: 8rpx;
	padding-right: 8rpx;
}
.right-btn {
	border-radius: 50%;
	position: fixed;
	right: 10px;
	bottom: 130px;
	text-align: center;
	background: rgba(30, 127, 255, 0.1);
	border: 1px solid rgba(30, 127, 255, 0.3);
	color: #ffffff;
	height: 100rpx;
	width: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.right-btn-top {
	background-color: rgba(255, 254, 254, 1);
	color: rgba(16, 16, 16, 1);
	font-size: 28px;
	text-align: center;
	box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
	font-family: Arial;
	border: 1px solid rgba(255, 255, 255, 0);
	border-radius: 50%;
	position: fixed;
	right: 20upx;
	bottom: 380upx;
	text-align: center;
	color: #ffffff;
	height: 100upx;
	width: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.right-btn-top-page {
	background-color: rgba(255, 254, 254, 1);
	color: rgba(16, 16, 16, 1);
	font-size: 32px;
	text-align: center;
	box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
	font-family: Arial;
	border: 1px solid rgba(255, 255, 255, 0);
	border-radius: 50%;
	position: fixed;
	right: 20upx;
	bottom: 500upx;
	text-align: center;
	height: 100upx;
	width: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.more-data {
	height: 120upx;
	width: 100%;
	line-height: 120upx;
	text-align: center;
	color: #888888;
}
.cu-avatar {
	font-size: 34upx;
	height: 84rpx;
	width: 84rpx;
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
	z-index: 9;
	background: #fff;
	text-align: center;
}
.charts {
	width: 100%;
}
.uni-flex-center {
	background: #ffffff;
	width: 100%;
	height: 100%;
	.uni-content {
		width: 96%;
		height: 100%;
	}
}
.selects {
	height: 60upx;
	border-radius: 10upx;
	line-height: 50upx;
	margin: 5upx;
	padding: 5upx;
	width: 200upx;
	color: rgba(255, 255, 255, 0.6);
}
.padding {
	padding: 10upx;
}
</style>
