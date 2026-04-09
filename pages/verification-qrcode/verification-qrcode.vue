<template>
	<view class="bg-qrcode-blue">
		<template>
			<view class="flex justify-center margin-top-xxxl">
				<image :src="successImg" class="qr-img" mode="aspectFit"></image>
			</view>
			<view class="text-center text-bold text-white padding-top">
				{{title}}
			</view>
		</template>
		<template v-if="showContent">
			<view class="flex justify-center">
				<view class="content">
					<view class="text-bold text-black text-lg">
						礼品信息
					</view>
					<view class="content-detail">
						<view class="text-cut flex justify-between" >
							<view class="uni-cell-30">
								商品
							</view>
							<view class="text-cut text-black">
								{{content.product_name}}
							</view>
						</view>
						<view class="text-cut flex justify-between padding-top" >
							<view class="uni-cell-30">
								数量
							</view>
							<view class="text-black ">
							 {{content.number}}
							</view>
						</view>
						<view class="text-cut flex justify-between padding-top" >
							<view class="uni-cell-30">
								规格
							</view>
							<view class="text-black ">
								{{content.specs.specs}}
							</view>
						</view>
						<view class="text-cut flex justify-between padding-top" >
							<view class="uni-cell-30">
								颜色
							</view>
							<view class="text-black">
								{{content.specs.color}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import successImg from '@/static/images/qrcode/success.png';
	import warnImg from '@/static/images/qrcode/warn.png';
	import errorImg from '@/static/images/qrcode/error.png';
	export default {
		data() {
			return {
				successImg:successImg,
				title:'',
				code:'',
				showContent:false,
				content:''
			};
		},
		onLoad(option) {
			if(option.code){
				this.code = option.code;
				this.getDetal();
			}else{
				this.title = '没有扫描二维码';
				this.successImg = errorImg;
			}
		},
		methods:{
			getDetal(){
				this.$api.SweepcodeIndex({code:this.code}).then(res =>{
					if(res.code == 1000){
						this.successImg = successImg;
						this.showContent = true;
						this.content = res.data;
						this.title = '核销成功，请发放礼品';
					}else{
						this.successImg = errorImg;
						this.title = res.msg;
						uni.showToast({
							icon:'none',
							title:res.msg,
							duration:2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
.bg-qrcode-blue{
	height: 100%;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-image: linear-gradient(rgb(67,120,190), rgb(86,156,249));
}
.cu-btn{
	height: 90rpx;
	line-height: 90rpx;
}
.qr-img{
	width: 166rpx;
	height: 122rpx;
}
.content{
	width: 642rpx;
	margin-top: 60rpx;
	background-color: rgb(255,255,255);
	border-radius: 20rpx;
	padding: 60rpx;
	.content-detail{
		background-color: rgb(250,250,250);
		border-radius: 10rpx;
		padding: 30rpx;
		color: rgb(153,153,153);
		margin-top: 20rpx;
		font-size: 30rpx;
	}
}
</style>
