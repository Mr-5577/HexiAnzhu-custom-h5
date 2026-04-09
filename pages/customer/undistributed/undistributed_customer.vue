<template>
	<view>
		<view>
			<view class="bg-df-blue flex solid-bottom padding justify-between  ">
				<!-- 项目 -->
				<view class=" selects">
					<view class="flex justify-center text-center" :class="showB == 'overType' ? 'text-white' : ''" @click="showType('overType')">
						<view class="flex text-cut">
							<view class="text-sm text-cut text-center">{{ default_pname }}</view>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</view>
					</view>
				</view>
				<!-- 来源-->
				<view class="selects">
					<view class="flex justify-center" :class="showB == 'source' ? 'text-white' : ''" @click="showType('source')">
						<view class="text-cut">
							<text class="text-sm">{{ sourceData[sourceIndex] }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</view>
					</view>
				</view>
				<!-- 日期 -->
				<view class=" selects">
					<picker mode="date" @change="bindTimeChange" @cancel="cancels">
						<view class="flex justify-center" :class="showB == 'sort' ? 'text-white' : ''" >
							<view class="text-cut">
								<text class="text-sm">{{ time }}</text>
								<text class="text-lg padding-left-xs cuIcon-unfold"></text>
							</view>
						</view>
					</picker>
				</view>
				<!-- 状态 -->
				<view class=" selects">
					<view class="flex justify-center" :class="showB == 'status' ? 'text-white' : ''" @click="showType('status')">
						<view class="text-cut">
							<text class="text-sm">{{ statusData[statusIndex] }}</text>
							<text class="text-lg padding-left-xs cuIcon-unfold"></text>
						</view>
					</view>
				</view>
			</view>

			<view class="flex padding-sm" style="justify-content: space-between;">
				<view class="text-grey ">共{{ total }}条数据</view>
			</view>
			<!-- list -->
			<view class="cu-list menu-avatar">
				<view class="cu-item margin-sm margin-top radius shadow-gray" v-for="(items, index) in customerList" :key="index" @click="detail(items)">
					<view class="cu-avatar round lg bg-blue text-white ">{{ cName(items.cou_name) }}</view>
					<view class="uni-cell-60">
						<view class="text-black  text-15" style="vertical-align: middle">
							<text>{{ items.cou_name }}</text>
							<text class="padding-left-xs">{{ items.cou_tel }}</text>
						</view>
						<view class="text-gray text-13 flex padding-top-sm">
							<view>{{ items.p_name }}</view>
							<image :src="items.source == 1 ? xcx : phone" class="icon padding-top-xss margin-left-xs" mode="aspectFit"></image>
						</view>
					</view>
					<view class="text-grey padding-right-xs">
						<view class="  text-right text-15">
							<!-- 1-待联系，2-待来访，3-无效，4-复活，5-未分配 -->
							<text v-show="items.status == 1" class="text-orange">待联系</text>
							<text v-show="items.status == 2" class="text-orange">待来访</text>
							<text v-show="items.status == 3" class="text-gray">无效</text>
							<text v-show="items.status == 4" class="text-green">复活客户</text>
							<text v-show="items.status == 5" class="text-blue">未分配</text>
						</view>
						<view class="lg padding-top-sm text-13  text-right">{{ items.loop_time }}</view>
					</view>
				</view>
			</view>

			<view class="more-data" v-show="current_page < last_page">{{ moreData }}</view>
		</view>
		<li-choose ref="lichoose" :showCustomer="showCustomer" :isAllChoose="isAllChoose" @confirm="confirms"></li-choose>
	</view>
</template>

<script>
import liChoose from '@/components/li-choose/li-choose.vue';
import xcx from '@/static/images/icon/xcx.png';
import phone from '@/static/images/icon/phone.png';

import { isJSON } from '@/common/checker.js';
var _self;
export default {
	components: {
		liChoose
	},
	data() {
		return {
			xcx: xcx,
			phone: phone,
			moreData: '加载更多数据...',
			ChooseProject: '',
			showCustomer: false,
			isAllChoose: false,
			scrollLeft: 0,
			textarea: '',
			total: 0,
			customerList: [],
			rangeDval: ['2017-10-30', '2019-12-31'],
			requestData: {
				limit: '', //	是	10分页条数
				pid: '', //是	 35 项目id
				source: '', //	是	 1 客户来源（1-梦想家，2-电话）
				loop_time: '', //	是 2020-06-15 录入时间
				status: '', //	是	 0 跟进状态（0-未分配，1-待联系，2-待来访，3-无效，4-复活）
				keyword: '' //	是	 18980265929 客户姓名、手机号
			},
			allProject: [],
			sourceData: ['全部来源', '梦享家', '电话'],
			time: '全部时间',
			statusData: ['全部状态', '待联系', '待来访', '无效', '复活', '未分配'],
			statusIndex: 0,
			sourceIndex: 0,
			overTypeIndex: 0,
			per_page: 0, //一页多少条数据；
			current_page: 1, //当前页数；
			last_page: 0, //一共多少页；
			status: 'more',
			p: 1,
			default_pname: '全部项目',
			showB: ''
		};
	},
	onShow() {
		const dap = this.$store.state.defaultActiveProject;
		if (dap.length == 0) {
			this.getUser();
		} else  {
			this.ChooseProject = dap;
			let pids = [];
			dap.forEach(res => {
				pids.push(res.p_id);
			});
			this.default_pname  = dap[0].p_name;
			this.requestData.pid = this.$tools.toStrings(pids);
			
			this.fristReq();
		}
	},
	
	onLoad() {
		this.getBigareacustomapi();
	},
	onPullDownRefresh() {
		this.fristReq();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1500);
	},
	onReachBottom() {
		if (this.current_page < this.last_page) {
			this.current_page = this.current_page + 1;
			this.requestData.page = this.current_page;
			this.getCustomerList();
		}
	},
	onPageScroll(e) {
		if (Math.ceil(e.scrollTop / 1000) == 0) {
			this.p = 1;
		} else {
			this.p = Math.ceil(e.scrollTop / 1000);
		}
	},

	methods: {
		fristReq() {
			this.customerList = [];
			this.scrollLeft = 0;
			this.requestData.page = 1;
			this.getCustomerList();
		},
		//取消时间
		cancels(e) {
			this.time = '全部时间'
			this.requestData.loop_time = '';
			this.fristReq();
		},
		bindTimeChange(e) {
			this.time = e.detail.value;
			this.requestData.loop_time = this.time;
			this.fristReq();
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
					this.fristReq();
				}
			});
		},
		getBigareacustomapi() {
			this.$api.customGetbigareacustomapi({}, res => {
				if (res.code == 1000) {
					this.allProject = res.data;
					let datas = []
					res.data.forEach(res => {
						res.project.forEach(resp => {
							resp.isactive = false;
							datas.push(resp.p_id);
						});
					});
					const dap = this.$store.state.defaultActiveProject;
					if(datas.length == dap.length){
						this.default_pname  =  '全部项目';
					}
					this.$store.commit('setSearchPro', res.data);
				}
			});
		},
		toTop() {
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
		showType(type) {
			let _this = this;
			this.showB = type;
			switch (type) {
				case 'source':
					uni.showActionSheet({
						itemList: _this.sourceData,
						success: function(res) {
							_this.sourceIndex = res.tapIndex;
							if (res.tapIndex == 0) {
								_this.requestData.source = '';
							} else {
								_this.requestData.source = res.tapIndex;
							}
							_this.fristReq();
						}
					});
					break;
				case 'status':
					uni.showActionSheet({
						itemList: _this.statusData,
						success: function(res) {
							_this.statusIndex = res.tapIndex;
							if (res.tapIndex == 0) {
								_this.requestData.status = '';
							} else {
								_this.requestData.status = res.tapIndex;
							}
							_this.fristReq();
						}
					});
					break;
				case 'overType':
					this.$refs.lichoose.show();
					break;
				default:
					break;
			}
		},

		detail(items) {
			uni.navigateTo({
				url: '/pages/customer/undistributed/detail?data=' + JSON.stringify(items)
			});
		},
		InputFocus() {
			this.customerList = [];
			this.getCustomerList();
		},
		InputBlur() {
			this.customerList = [];
			this.getCustomerList();
		},
		confirms(data) {
			if (data.pid.length == 0) {
				this.getUser();
				return;
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
					this.default_pname = '全部项目'
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
				this.fristReq();
			}
		},
		toggleTab(str) {
			this.$refs[str].show();
		},
		
		getCustomerList() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.UnallocatedapiIndex(this.requestData, res => {
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
.icon {
	width: 35rpx;
	height: 35rpx;
}
.right-btn {
	border-radius: 50%;
	position: fixed;
	right: 20upx;
	bottom: 260upx;
	text-align: center;
	background: #007aff;
	color: #ffffff;
	height: 100upx;
	width: 100upx;
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
	box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
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
	left: 20rpx;
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
	color: rgba(250, 250, 250, 0.6);
	text-align: center;
}
.padding {
	padding: 10upx;
}
</style>
