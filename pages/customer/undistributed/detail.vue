<template>
	<view class="">
		<view style="margin-bottom: 180rpx;">
			<view class="header">
				<view class="cu-avatar round  bg-blue text-white ">{{ cName(customerInfo.info.cou_name) }}</view>
				<view class="uni-cell-50">
					<view class="text-black text-bold text-lg">{{ customerInfo.info.cou_name }}</view>
					<view class=" text-13 flex padding-top-sm">{{ customerInfo.info.cou_tel }}</view>
				</view>
				<view class="text-grey">
					<view class="text-right text-15">
						<text v-show="customerInfo.info.status == 1" class="text-orange">待联系</text>
						<text v-show="customerInfo.info.status == 2" class="text-orange">待来访</text>
						<text v-show="customerInfo.info.status == 3" class="text-red">已失效</text>
						<text v-show="customerInfo.info.status == 4" class="text-green">复活客户</text>
						<text v-show="customerInfo.info.status == 5" class="text-blue">未分配</text>
					</view>
					<view class="lg padding-top-sm text-13  text-right">
						<text v-show="customerInfo.info.status == 5 || customerInfo.info.status == 4">{{ customerInfo.info.ctime }}</text>
						<text v-show="customerInfo.info.status == 1">
							还有
							<text class="text-blue padding-left-xs padding-right-xs">{{ customerInfo.info.return_day }}</text>
							天退回
						</text>
						<text v-show="customerInfo.info.status == 2">
							<text class="text-blue">{{ customerInfo.info.valid_before_day }}</text>
							天前判定有效
						</text>
						<text v-show="customerInfo.info.status == 3">
							<text class="text-red">{{ customerInfo.info.invalid_before_day }}</text>
							天前判定失效
						</text>
					</view>
				</view>
			</view>
			<view class="content margin-top-sm padding" v-if="requestData.source == 1">
				<view class="text-13 text-gray">
					<view class="flex justify-between  ">
						<text>首次录入</text>
						<text>{{ customerInfo.info.ctime }}</text>
					</view>

					<view v-show="customerInfo.info.status == 2" class="flex justify-between padding-top-sm">
						<text>判定有效</text>
						<text>{{ customerInfo.info.valid_time }}</text>
					</view>
					<view v-show="customerInfo.info.valid_time" class="flex justify-between padding-top-sm">
						<text>首次跟进</text>
						<text>{{ customerInfo.info.valid_time }}</text>
					</view>
					<view
						v-show="customerInfo.info.status == 3 || customerInfo.info.status == 4"
						class="flex justify-between padding-top-sm"
						:class="customerInfo.info.status == 3 ? 'text-red' : customerInfo.info.status == 4 ? 'text-blue' : ''"
					>
						<text>{{ customerInfo.info.status == 3 ? '判断失效' : customerInfo.info.status == 4 ? '过期失效' : '' }}</text>
						<text>{{ customerInfo.info.invalid_time }}</text>
					</view>
					<view v-show="customerInfo.info.status != 5" class="flex justify-between padding-top-sm">
						<text>所属顾问</text>
						<text>{{ customerInfo.info.u_name }}</text>
					</view>
					<view v-show="customerInfo.info.status == 4" class="flex justify-between padding-top-sm">
						<text>复活时间</text>
						<text>{{ customerInfo.info.revive_time }}</text>
					</view>
				</view>
			</view>

			<view class="content margin-top-sm" v-if="requestData.source == 1">
				<view class="content-title text-lg text-bold">浏览记录</view>
				<view class="content-body radius">
					<view class="flex justify-between padding-top-sm text-13 text-gray" v-for="(item, i) in customerInfo.history.data" :key="i">
						<text>{{ item.p_name }}</text>
						<text>{{ timestampToTimes(item.loop_time) }}</text>
					</view>
				</view>
			</view>
			<view class="content margin-top-sm" v-if="requestData.source == 2">
				<view class="content-title text-lg text-bold">来电记录</view>
				<view class="content-body">
					<view class="flex justify-between padding-top-sm text-15 text-gray" v-for="i in 3" :key="i">
						<text>2019-19-12</text>
						<text>通话时长{{ i }}分钟</text>
					</view>
				</view>
			</view>
			<view class="foot" v-if="customerInfo.info.status == 5 && userInfo.allocated_admin == 1">
				<text>分配客户</text>
				<picker :range="sales" @change="changeSale" mode="multiSelector" range-key="u_name"  @columnchange="columnchange">
					<view class="flex">
						<view class="flex align-center items-center">
							<image src="/static/images/avatar.png" style="height: 60rpx;width: 60rpx;"></image>
						</view>
						<text class="padding-left-xs">{{ saleIndex == -1 ? '请选择置业顾问' :sales[1][saleIndex[1]].u_name }}</text>
						<text class="cuIcon-right"></text>
					</view>
				</picker>
			</view>
		</view>
		<view class="foot-btn" v-if="customerInfo.info.status == 5 && userInfo.allocated_admin == 1">
			<!-- 1-待联系，2-待来访，3-无效，4-复活，5-未分配 -->
			<view v-if="customerInfo.info.status == 5" class="cu-btn bg-blue block round" @click="check">确认分配</view>
			<view class="cu-btn line-blue block round  border-blue" @click="cancel">无效用户</view>
		</view>
		<view class="foot-btn" v-if="userInfo.allocated_admin == 0 || (userInfo.allocated_admin == 1 && customerInfo.info.u_id == userInfo.u_id)">
			<!-- 1-待联系，2-待来访，3-无效，4-复活，5-未分配 -->
			<view class="cu-btn bg-blue block round" v-if="customerInfo.info.status == 1 " @click="waitVisit">已邀约</view>
			<view class="cu-btn bg-blue block round" v-if="customerInfo.info.status == 2 " @click="addCustom">已来访</view>
			<view
				class="cu-btn line-blue block round  border-blue"
				v-if="(customerInfo.info.status == 1 || customerInfo.info.status == 2) "
				@click="cancel"
			>
				无效用户
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			customerInfo: {
				info: {
					cou_name: ''
				},
				history: {
					data: ''
				}
			},
			requestData: '', //
			sales: [], //置业顾问分组
			sale:[],//具体的置业顾问
			saleIndex: -1,
			reqData: {},
			userInfo: {} ,//用户信息
			value: [0,0],
			
		};
	},
	onLoad(option) {
		if (option.data) {
			this.requestData = JSON.parse(option.data);
			this.reqData = {
				ca_id: '',
				relation_id: this.requestData.relation_id,
				pid: this.requestData.p_id,
				source: this.requestData.source
			};
			this.info();
			this.getSale();
			this.getUser();
		}
	},
	methods: {
		columnchange(e){
			this.value[e.detail.column] = e.detail.value;
			//根据第一个选项计算 第二个选项的数据
			this.sales[1] = {...this.sale[this.value[0]]};
		},
		//设置为待来访
		waitVisit() {
			this.$api.UnallocatedApiWaitVisit({ ca_id: this.customerInfo.info.ca_id }).then(res => {
				if (res.code == 1000) {
					this.info();
				}
			});
		},
		addCustom() {
			let customerData = {
				cname: this.customerInfo.info.cou_name,
				ctel: this.customerInfo.info.cou_tel,
				ca_id: this.customerInfo.info.ca_id
			};
			uni.redirectTo({
				url: '/pages/customer/customer_add?customerData=' + JSON.stringify(customerData)
			});
		},
		check() {
			if (this.saleIndex == -1) {
				uni.showToast({
					icon: 'none',
					title: '请选择置业顾问',
					duration: 2000
				});
				return;
			}
			this.reqData.u_id = this.sales[1][this.saleIndex[1]].u_id;
			this.$api.UnallocatedapiAssigncsutom(this.reqData).then(res => {
				if (res.code == 1000) {
					uni.showToast({
						icon: 'none',
						title: '分配成功',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				}
			});
		},
		cancel() {
			let _this = this;
			uni.showModal({
				content: '是否设置为 无效用户?',
				success(c) {
					if (c.confirm) {
						_this.$api.UnallocatedapiInvalid(_this.reqData).then(res => {
							if (res.code == 1000) {
								uni.showToast({
									icon: 'none',
									title: '设置成功',
									duration: 2000
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 1500);
							}
						});
					}
				}
			});
		},
		changeSale(e) {
			this.saleIndex = e.detail.value;
		},
		getSale() {
			this.$api.GetGroupsalecustomapi({ pid: this.requestData.p_id }).then(res => {
				if (res.code == 1000) {
					this.sales = [];
					let demo =[]
					this.sale =[];
					for (let var1 in res.data) {
						let key ={
							u_name:res.data[var1][0].name,
							gid:res.data[var1][0].gid
						}
						demo.push(key);
						this.sale.push(res.data[var1]);
					}
					this.sales[0] = {...demo};
					this.sales[1] = {...this.sale[0]};
				}
			});
		},
		cName(name) {
			return this.$tools.cName(name);
		},
		timestampToTimes(timestamp) {
			return this.$tools.timestampToTime(timestamp);
		},
		info() {
			this.$api.UnallocatedapiInfo(this.reqData).then(res => {
				if (res.code == 1000) {
					this.customerInfo = res.data;
				}
			});
		},
		getUser() {
			this.$api.Getuserinfobookingapi({}).then( res => {
				if (res.code == 1000) {
					this.userInfo = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	height: 180rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	padding: 30rpx;
	.cu-avatar {
		width: 100rpx;
		height: 100rpx;
	}
}

.content {
	background-color: #ffffff;
	padding-bottom: 30rpx;
	.content-title {
		line-height: 100rpx;
		padding-left: 24rpx;
	}
	.content-body {
		background-color: rgb(250, 250, 250);
		margin: 0 30rpx;
		padding:0 24rpx 24rpx;
	}
}
.foot {
	margin-top: 30rpx;
	display: flex;
	justify-content: space-between;
	background-color: #ffffff;
	padding-left: 24rpx;
	padding-right: 24rpx;
	line-height: 120rpx;
}
.foot-btn {
	position: fixed;
	width: 100%;
	bottom: 0rpx;
	left: 0;
	display: flex;
	justify-content: space-between;
	padding-left: 24rpx;
	padding-right: 24rpx;
	height: 140rpx;
	z-index: 999;
	background-color: rgb(250, 250, 250);
	.cu-btn {
		width: 340rpx;
		text-align: center;
		line-height: 90rpx;
		height: 90rpx;
		margin-bottom: 60rpx;
		margin-top: 20rpx;
	}
}
</style>
