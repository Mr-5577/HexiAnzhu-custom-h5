<template>
	<view class="">
		<view class="bg-white margin-top">
			<view class="li-step-line">
				<text class="li-step-text padding-xs text-bold">{{ title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		title: {
			type: String,
			default: ''
		}
	}
};
</script>

<style>
.li-step-line {
	border-bottom: 1px solid #dddddd;
	width: 100%;
}
.li-step-text {
	position: relative;
	background: #fff;
	left: 60upx;
	top: 20upx;
	font-size: 28upx;
}
</style>
