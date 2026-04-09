<template>
	<view class="bg-gray">
		<view>
			<view class="cu-bar search bg-defalut">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input
						@focus="InputFocus"
						@blur="InputBlur"
						v-model="keyword"
						:adjust-position="false"
						type="text"
						placeholder="请输入订单号、客户姓名、电话号码搜索"
						confirm-type="search"
					/>
				</view>
				<view class="action"><view class=" text-bold text-white" @click="search">搜索</view></view>
			</view>
			<view class="">
				<view class="flex justify-between bg-defalut padding-sm" style="padding-bottom: 10px;">
					<view class=" selects">
						<view class="cu-btn radius flex" :class="showtext == 'project'?'text-white':''">
							<picker @change="changeProject" :range="dealProject" range-key="p_name" :value="p_index">{{ dealProject[p_index].p_name }}</picker>
							<text class="lg  cuIcon-unfold padding-left-xs"></text>
						</view>
					</view>
					<view class=" selects">
						<text class="cu-btn radius flex" :class="showtext == 'type'?'text-white':''" @click="order">
							<text>{{ typeText }}</text>
							<text class="lg  cuIcon-unfold padding-left-xs"></text>
						</text>
					</view>
					<view class=" selects">
						<text class="cu-btn radius flex" :class="showtext == 'status'?'text-white':''" @click="clickStatus">
							<text>{{ statusText }}</text>
							<text class="lg  cuIcon-unfold padding-left-xs"></text>
						</text>
					</view>
				</view>
				<view class="" v-for="(item, index) in orderList" :key="index" @click="detail(item)">
					<view class="flex justify-between text-sm margin-sm radius  bg-white shadow-gray">
						<view class="margin-sm flex justify-center align-center">
							<view class="logo-img-text flex justify-center">
								<text class="text-center">{{ item.cname.substring(0, 2) }}</text>
							</view>
						</view>
						<view class="margin-sm line-sm " style="width: 80%;">
							<view class="flex justify-between">
								<view class="text-cut">
									<text class="text-black text-15">{{ item.cname }}</text>
									<text class="text-gray padding-left-xs">- {{ item.p_name }}</text>
								</view>
								<view class="uni-cell-20 text-right">
									<text v-show="item.type == 1" class="text-orange">排号</text>
									<text v-show="item.type == 2" class="text-green">认购</text>
									<text v-show="item.type == 3" class="text-red">排号补款</text>
									<text v-show="item.type == 4" class="text-red">购房款补款</text>
								</view>
							</view>
							<view class="padding-top-xs">成交房号：{{ item.code_num }}</view>
							<view class="flex justify-between padding-top-xs">
								<text>{{ item.ctime }}</text>
								<text class="text-black text-15">
									{{ item.money }}
									<text class="text-gray">(元)</text>
								</text>
							</view>
						</view>
					</view>
				</view>
				<view class="text-center light padding bg-white" v-if="orderList.length == 0">暂无订单信息～～</view>
				<view class="more-data" v-show="current_page < last_page">{{ moreData }}</view>
			</view>
		</view>
		<!-- 协议文本 -->
		<view v-if="modalName == 'Modal'" class="show-template" @click="hideModal">
			<view class="show-template-log" @tap.stop="stop"><rich-text :nodes="contents" class="padding"></rich-text></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showtext:'',
			InputBottom: 0,
			code: '',
			orderList: [],
			keyword: '',
			tid: '',
			type: '',
			projetcText: '全部项目',
			statusText: '房源类型',
			typeText: '成交类型',
			modalName: '',
			contents: '',
			p_id: '',
			per_page: 0, //一页多少条数据；
			current_page: 1, //当前页数；
			last_page: 0, //一共多少页；
			moreData: '加载更多数据...',
			total: 0,
			page: 0,
			dealProject: [{ p_name: '全部项目', p_id: '-1' }], //已处理项目
			p_index: 0
		};
	},

	onLoad() {
		this.p_id = this.$store.state.project_id;
		this.getOrderList();
		this.getDealProject();
	},
	onReachBottom() {
		if (this.current_page < this.last_page) {
			this.current_page = this.current_page + 1;
			this.page = this.current_page;
			this.getOrderList();
		}
	},
	methods: {
		getDealProject() {
			this.$api.Getdealprojectbookingapi({}, res => {
				this.dealProject = [{ p_name: '全部项目', p_id: '-1' }];
				res.data.forEach(res => {
					this.dealProject.push(res);
				});
			});
		},

		cName(names) {
			if (names.length > 2) {
				return names.substring(0, 2);
			} else {
				return names;
			}
		},
		stop() {},
		order() {
			this.showtext = 'type';
			let _this = this;
			let items = ['成交类型', '排号', '认购'];
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.typeText = items[res.tapIndex];
					if (res.tapIndex == 0) {
						_this.type = '';
					}
					if (res.tapIndex != 0) {
						_this.type = res.tapIndex;
					}
					_this.orderList = [];
					_this.page = 1;
					_this.getOrderList();
				}
			});
		},
		detail(item) {
			uni.navigateTo({
				url: '/pages/order/traded_order_detail?id=' + item.id + '&type=' + item.type
			});
		},
		changeProject(e) {
			this.showtext = 'project';
			this.p_index = e.detail.value;
			if (this.dealProject[this.p_index].p_id != -1) {
				this.p_id = this.dealProject[this.p_index].p_id;
				this.page = 1;
				this.getOrderList();
			}
		},
		clickStatus() {
			this.showtext = 'status';
			let _this = this;
			let items = ['房源类型', '住宅', '商业', '别墅', '车位']; //1-住宅，2-商业，3-别墅，4-车位
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.statusText = items[res.tapIndex];
					if (res.tapIndex == 0) {
						_this.tid = '';
					} else {
						_this.tid = res.tapIndex;
					}
					_this.page = 1;
					_this.orderList = [];
					_this.getOrderList();
				}
			});
		},
		cancel(item) {
			let _this = this;
			uni.showModal({
				title: '取消订单',
				content: '是否取消订单？',
				success(res) {
					if (res.confirm) {
						_this.$api.SalesProjectCancelorder({ order_id: item.cbo_id }, res => {
							_this.getOrderList();
						});
					}
				}
			});
		},
		search() {
			this.orderList = [];
			this.getOrderList();
		},
		getOrderList() {
			let data = {
				pid: this.p_id, //是	int	项目id
				type: this.type, //	是	int	订单类型（1-排号，2-认购，3-排号补款，4-购房款补款）
				keyword: this.keyword, //	是	string	订单号、客户名称、联系电话关键字查询
				tid: this.tid, // 成交类型1-住宅，2-商业，3-别墅，4-车位
				page: this.page
			};
			uni.showLoading({
				title: '正在获取数据...'
			});
			this.$api.Getdeallistbookingapi(data, res => {
				res.data.data.forEach(resp => {
					this.orderList.push(resp);
				});
				this.per_page = res.data.per_page; //一页多少条数据；
				this.current_page = res.data.current_page; //当前页数；
				this.last_page = res.data.last_page; //一共多少页；
				this.total = res.data.total; //总条数
			});
		},
		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		InputBlur(e) {
			this.InputBottom = 0;
		}
	}
};
</script>

<style lang="less" scoped>
	.selects{
		color: rgba(255, 255, 255, 0.6);
	}
.logo-img-text {
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	z-index: 99;
	text-align: center;
	line-height: 100upx;
	border-radius: 50%;
	background-color: #007aff;
	color: #ffffff;
	font-weight: bold;
	font-size: 36upx;
}
.line-sm {
	line-height: 40rpx;
}
.has-login {
	height: 100%;
	width: 100%;
}
.show-template {
	z-index: 998;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	position: fixed;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	.show-template-log {
		height: 80%;
		width: 85%;
		border-radius: 5px;
		background: #ffffff;
		color: #333333;
		font-size: 12px;
		z-index: 999;
		padding: 10px;
		overflow: auto;
		overflow-y: auto;
	}
}
.more-data {
	height: 120upx;
	width: 100%;
	line-height: 120upx;
	text-align: center;
	color: #888888;
}
</style>
