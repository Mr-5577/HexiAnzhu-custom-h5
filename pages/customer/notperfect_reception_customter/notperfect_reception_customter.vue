<template>
	<view>
		<scroll-view scroll-x class="bg-defalut text-white nav text-center padding-bottom-xss">
			<view class="cu-item" :class="index==TabCur?'text-white text-bold cur':''" v-for="(item,index) in nav" :key="index" @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<view class="content">
			<template  v-if="TabCur == 0">
				<view class="list">
					
				</view>
			</template>
			<template  v-if="TabCur == 1">
				<view class="list">
					
				</view>
			</template>
			<template  v-if="TabCur == 2">
				<view class="list">
					
				</view>
			</template>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				nav:['新客户','再访客户','接待记录']
			};
		},
		methods:{
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		}
	}
</script>

<style lang="less">
.padding-bottom-xss{
	padding-bottom: 5rpx;
}
.content{
	margin: 24rpx;
	.list{
		
	}
}
</style>
