<template>
	<view style="height: 100%;width: 100%;">
		<!-- 头部和筛选选项 -->
		<template>
			<view class="cu-bar search bg-df-blue">
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
				<view class="action" >
					<view class=" text-white  text-bold " @click="search">搜索</view>
				</view>
			</view>
			<view class="bg-df-blue flex  justify-between padding-sm">
				<view class="selects">
					<view class="cu-btn radius flex" :class="showtext=='project'?'text-white':''">
						<picker @change="changeProject" :range="orderProject" range-key="p_name" :value="p_index">{{ orderProject[p_index].p_name }}</picker>
						<text class="lg  cuIcon-unfold padding-left-xs"></text>
					</view>
				</view>
				<view class="selects">
					<text class="cu-btn radius " :class="showtext=='type'?'text-white':''" @click="order">
						{{ typeText }}
						<text class="lg  cuIcon-unfold padding-left-xs"></text>
					</text>
				</view>
				<view class="selects">
					<text class="cu-btn radius " :class="showtext=='status'?'text-white':''" @click="clickStatus">
						{{ statusText }}
						<text class="lg  cuIcon-unfold padding-left-xs"></text>
					</text>
				</view>
			</view>
		</template>
		<!-- 内容 -->
		<view class="margin-sm text-sm text-gray">共有 {{ total }} 条数据记录</view>
		<view class="margin-top ">
			<view class="bg-white margin-sm radius box-shadow" v-for="(item, index) in orderList" :key="index" @click="detail(item)">
				<view class="border-bottom padding-sm flex justify-between">
					<text>订单号：{{ item.cbo_order_sn }}</text>
					<text v-show="item.cbo_pay_status == 1" class="text-orange">未支付</text>
					<text v-show="item.cbo_pay_status == 2" class="text-green">已支付</text>
					<text v-show="item.cbo_pay_status == 9" class="text-red">已失效</text>
				</view>
				<view class="flex justify-between text-sm">
					<view class="margin-sm flex justify-center align-center"><image :src="item.logo_img" mode="" class="round" style="width: 50px;height: 50px;"></image></view>
					<view class="margin-sm line-sm ">
						<view>客户名称：{{ item.cbo_cname }}</view>
						<view class="padding-top-xs">
							订单类型：
							<text v-show="item.cbo_pay_type == 1" class="text-orange">排号</text>
							<text v-show="item.cbo_pay_type == 2" class="text-green">认购</text>
							<text v-show="item.cbo_pay_type == 3" class="text-red">排号补款</text>
							<text v-show="item.cbo_pay_type == 4" class="text-red">购房款补款</text>
						</view>
						<view class="padding-top-xs">客户电话：{{ item.u_tel1 }}</view>
					</view>
					<view class="padding-top-sm flex justify-end uni-cell-30 ">
						<view class="text-right padding-right-sm padding-top">
							<view class="text-black text-bold text-lg text-right">{{ item.cbo_paymoney }}</view>
							<view class="text-gray text-sm text-center padding-top-xs">金额(元)</view>
						</view>
					</view>
				</view>
			</view>
			<view class="text-center light padding" v-if="orderList.length == 0">暂无订单信息～～</view>
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
			showtext:'',//是否正在选中状态
			InputBottom: 0,
			orderList: [],
			keyword: '',
			status: '',
			type: '',
			projetcText: '全部项目',
			statusText: '全部状态',
			typeText: '全部订单',
			modalName: '',
			contents: '',
			p_id: '',
			orderProject: [{ p_name: '全部项目', p_id: '-1' }],
			p_index: 0,
			total: 0
		};
	},

	onLoad() {
		this.p_id = this.$store.state.project_id;
		this.getOrderList();
		this.getProject();
	},
	methods: {
		search() {
			this.orderList = [];
			this.getOrderList();
		},
		changeProject(e) {
			this.showtext ='project';
			this.p_index = e.detail.value;
			if (this.orderProject[this.p_index].p_id != -1) {
				this.p_id = this.orderProject[this.p_index].p_id;
				this.getOrderList();
			} else {
				this.p_id = '';
				this.getOrderList();
			}
		},
		getProject() {
			this.$api.Getprojectlistorderapi({}, res => {
				if (res.code == 1000) {
					this.orderProject = [{ p_name: '全部项目', p_id: '-1' }];
					res.data.forEach(res => {
						this.orderProject.push(res);
					});
				}
			});
		},
		stop() {},
		order() {
			this.showtext = 'type';
			let _this = this;
			let items = ['全部订单', '排号订单', '认购订单'];
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
					_this.getOrderList();
				}
			});
		},
		detail(item) {
			uni.navigateTo({
				url: '/pages/order/detail?cbo_id=' + item.cbo_id
			});
		},

		clickStatus() {
			this.showtext = 'status'
			let _this = this;
			let items = ['全部状态', '未付款', '已付款', '已失效'];
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.statusText = items[res.tapIndex];
					if (res.tapIndex == 0) {
						_this.status = '';
					}
					if (res.tapIndex == 1) {
						_this.status = 1;
					}
					if (res.tapIndex == 2) {
						_this.status = 2;
					}
					if (res.tapIndex == 3) {
						_this.status = 9;
					}
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
		getOrderList() {
			let data = {
				pid: this.p_id, //是	int	项目id
				type: this.type, //	是	int	订单类型（1-排号，2-认购，3-排号补款，4-购房款补款）
				status: this.status, //	是	int	订单支付状态 1=未支付 2=已支付 9=已撤销/已失效
				keyword: this.keyword, //	是	string	订单号、客户名称、联系电话关键字查询
				limit: 10000
			};
			uni.showLoading({
				title: '正在获取数据...'
			});
			this.$api.indexOrderapi(data, res => {
				if (res.code == 1000) {
					this.total = res.data.total;
					this.orderList = res.data.data;
				}
			});
		},
		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		InputBlur(e) {
			this.InputBottom = 0;
		},
		getPhoneNumber(e) {
			if (e.detail.iv) {
				this.login(e.detail.iv, e.detail.encryptedData);
			} else {
				uni.showToast({
					icon: 'none',
					title: '请继续授权，以保证能正常使用'
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
page {
	height: 100%;
	width: 100%;
}
.selects{
	color: rgba(255, 255, 255, 0.6);
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
.box-shadow {
	-moz-box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.05);
	-webkit-box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.05);
	box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.05);
}
</style>
