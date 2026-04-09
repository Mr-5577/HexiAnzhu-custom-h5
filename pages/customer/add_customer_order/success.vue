<template>
	<view class="padding">
		<view >
			<!-- <view class="text-center margin">订单编号：CD002202002201234</view> -->
			<view class="text-center text-green cuIcon-roundcheckfill" style="font-size: 80px;"></view>
			<view class="text-center margin-sm text-bold">提交在线认购订单成功</view>
			<view class="text-center text-bold">有以下方式通知客户付款</view>
		</view>
		<view class="margin-top">
			<!-- <view class="flex justify-between margin" style="height: 80px;">
				<view class="flex align-center align-center" style="width: 10%;">
					<text>1</text>
				</view>
				<view class="flex align-center align-center" style="width: 30%;">
					<image src="/static/images/qrcode.png" style="height: 60px; width: 60px;"></image>
				</view>
				<view class="flex align-center align-center" style="width: 60%;">
					<view class="">保存此订单二维码到手机相册，通过微信发送给客户付款</view>
				</view>
			</view> -->
			<view class="line-gray"></view>
			<view class="flex justify-between margin" style="height: 80px;">
				<view class="flex align-center align-center" style="width: 10%;">
					<text>1</text>
				</view>
				<view class="flex align-center align-center" style="width: 30%;">
					<image :src="qrCode" class="qrcode" @click="showImg"></image>
				</view>
				<view class="flex align-center align-center" style="width: 60%;">
					<view>邀请客户访问阳光梦享家小程序，客户使用订单的手机号登录小程序后，可在“我的”里面看到此未付款的订单，客户可以进入订单付款。</view>
				</view>
			</view>
			<view class="line-gray"></view>
			<button type="primary" class="margin-top round" @click="order">查看全部订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			qrCode: '/static/images/xcx.jpg'
		};
	},
	methods: {
		order() {
			uni.navigateTo({
				url: '/pages/order/order'
			});
		},
		showImg(){
			let imgs = []
			imgs.push(this.qrCode);
			uni.previewImage({
				current: 0,
				urls: imgs
			});
		}
	}
};
</script>

<style lang="less">
page,
view {
	background: #ffffff;
}
.qrcode {
	height: 60px;
	width: 60px;
}
.line-gray {
	height: 6px;
	width: 100%;
	background: #eee;
}
</style>
