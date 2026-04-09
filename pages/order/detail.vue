<template>
	<view>
		<template>
			<view class="cu-form-group">
				<view class="title">项目名称</view>
				<view class="text-right">
					<text>{{ orderDetail.p_name }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">客户姓名</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_cname }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">客户电话</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_ctel }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">备用电话</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_ctels == null ? '' : orderDetail.cbo_ctels }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">身份证号</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_cidcard == null ? '' : orderDetail.cbo_cidcard }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">家庭住址</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_address == null ? '' : orderDetail.cbo_address }}</text>
				</view>
			</view>

			<view class="cu-form-group margin-top">
				<view class="title">订单编号</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_order_sn }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">订单类型</view>
				<view class="text-right">
					<text>{{ orderDetail.pay_type_name }}</text>
				</view>
			</view>
			<view class="cu-form-group" v-show="orderDetail.roomnum">
				<view class="title">房号(车位号)</view>
				<view class="text-right">
					<text>{{ orderDetail.roomnum == null ? '' : orderDetail.roomnum }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">订单金额</view>
				<view class="text-right">
					<text>{{ nToLocalString(orderDetail.cbo_paymoney) }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">提交时间</view>
				<view class="text-right">
					<text>{{ orderDetail.cbo_ctime == null ? '' : orderDetail.cbo_ctime }}</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">支付状态</view>
				<!-- cbo_pay_status 1未付款 2已付款 9失效 -->
				<view class="text-right">
					<text v-show="orderDetail.cbo_pay_status == 1">{{ orderDetail.pay_status_name }}</text>
					<text v-show="orderDetail.cbo_pay_status == 2" :class="{ 'text-green': orderDetail.cbo_pay_status == 2 }">{{ orderDetail.pay_status_name }}</text>
					<text v-show="orderDetail.cbo_pay_status == 9" :class="{ 'text-orange': orderDetail.cbo_pay_status == 9 }">{{ orderDetail.pay_status_name }}</text>
				</view>
			</view>
			<view class="cu-form-group" v-if="orderDetail.cbo_pay_status == 2">
				<view class="title">支付时间</view>
				<view class="text-right">
					<text :class="{ 'text-green': orderDetail.cbo_pay_status == 2 }">{{ orderDetail.cbo_paytime }}</text>
				</view>
			</view>
			<view class="cu-form-group" v-if="orderDetail.cbo_pay_status == 9">
				<view class="title">取消时间</view>
				<view class="text-right">
					<text :class="{ 'text-orange': orderDetail.cbo_pay_status == 9 }">{{ orderDetail.cbo_cancel_time }}</text>
				</view>
			</view>
		</template>
		<!-- 订单备注 -->
		<view v-if="orderDetail.cbo_remark">
			<view class="margin-top padding-left-sm text-bold">订单备注</view>
			<textarea class="cu-form-group margin-top padding" disabled="true" style="overflow: auto;width: 100%;height: 100px;" v-model="orderDetail.cbo_remark"></textarea>
		</view>
		<!-- 订单操作 -->
		<view v-if="orderDetail.cbo_pay_status == 1" class="margin-top flex justify-center items-center margin-bottom-xxl">
			<view class="flex justify-between margin-sm uni-cell-100">
				<view v-if="orderDetail.cbo_pay_status == 1" class="round cu-btn bg-blue uni-cell-45 " >
					<text class="lg text-white cuIcon-qrcode padding-right-xs"></text>
					<text>生成付款码</text>
				</view>
				<view class="cu-btn bg-white round uni-cell-45 text-blue border-blue"  :disabled="orderDetail.cbo_pay_status != 1" @click="cancelOrder">
					<text class="lg text-blue cuIcon-delete padding-right-xs"></text>
					<text class="text-blue">取消订单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderDetail: {
				order_id: ''
			}
		};
	},
	onLoad(option) {
		this.cbo_id = option.cbo_id;
		if (this.cbo_id) {
			this.getOrderDetail();
		}
	},
	methods: {
		nToLocalString(nums) {
			return this.$tools.numberToLocalString(nums);
		},
		getOrderDetail() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.getInfoOrderapi({ order_id: this.cbo_id }, res => {
				if (res.code == 1000) {
					this.orderDetail = res.data;
				}
			});
		},
		cancelOrder() {
			let _this = this;
			uni.showModal({
				title: '取消订单',
				content: '是否取消订单？',
				success(res) {
					if (res.confirm) {
						_this.$api.cancelOrderapi({ order_id: _this.cbo_id }, res => {
							if (res.code == 1000) {
								uni.showToast({
									icon: 'none',
									title: '取消成功！'
								});
								setTimeout(() => {
									_this.getOrderDetail();
								}, 1000);
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.cu-form-group {
	min-height: 35px;
	border: none;
	.title {
		color: rgb(153, 153, 153);
	}
}
.uni-cell-45 {
	height: 90rpx;
	line-height: 90rpx;
	width: 170px;
}

</style>
