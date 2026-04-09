<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view class="leftTime">
				{{leftTime}}
			</view>
			<view class="line">
				<view class="out" :style="{background: color == '' ? '' : color}">
					<view class="inner" :style="{background: color == '' ? '' : color}"></view>
				</view>
			</view>
			<view class="rightContent">
				<slot></slot>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			leftTime:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped lang="less">
	.timelineItem {
		.timeItem {
			display: flex;
			.leftTime {
				width: 20rpx;
				padding: 0 10rpx;
				font-size:22rpx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				margin-right: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.line {
				width: 1px;
				background:rgba(77,151,255,0.5);
				position: relative;
				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width: 24rpx;
					height: 24rpx;
					background : rgba(236,104,23,0.6);
					border-radius: 50%;
					.inner {
						width: 18rpx;
						height: 18rpx;
						background : rgba(236,104,23,1);
						border-radius: 50%;
					}
				}
			}
			.rightContent {
				flex: 1;
				padding:30rpx 10rpx 10rpx;
				margin-left: 20rpx;
				min-height: 50rpx;
			}
		}
	}
</style>
