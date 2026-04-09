<template>
	<view class="bg-white ">
		<view v-if="c_phao.length != 0" class="padding-sm">
			<view class=" text-lg text-bold text-black">排号单</view>
			<view class=" bg-gray margin-top-sm padding-sm padding-top" v-for="(item, index) in c_phao" @click="detail(item, 1)" :key="index">
				<view class="text-15 flex justify-between">
					<text class="text-black text-bold">{{ item.p_name }}</text>
					<text class="text-yellow">￥ {{ item.money }}</text>
				</view>
				<view class="padding-top-sm flex justify-between text-gray text-13">
					<text>{{ item.ordernumer }}({{ item.name }})</text>
					<text>{{ item.time }}</text>
				</view>
			</view>
		</view>
		<view style="height: 30rpx;width: 100%; background-color: rgb(250,250,250);margin-top: 30rpx;">
		</view>
		<view v-if="c_roompact.length != 0" class="padding-sm">
			<view class="text-lg text-bold text-black padding-top">认购单</view>
			<view class="bg-gray margin-top-sm padding-sm padding-top" v-for="(item, index) in c_roompact" @click="detail(item, 2)" :key="index">
				<view class="text-15 flex justify-between">
					<text class="text-black text-bold">{{ item.p_name }}</text>
					<text class="text-yellow">￥ {{ item.allmoney }}</text>
				</view>
				<view class="padding-top-sm flex justify-between text-gray text-13">
					<text>{{ item.roomnum }}({{ item.name }})</text>
					<text :class="item.time == '定房中'?'text-blue':''">{{ item.time }}</text>
				</view>
			</view>
		</view>
		<view v-if="c_phao.length == 0 && c_roompact.length == 0" class="text-center text-gray" style="line-height: 100px;">暂无排号和成交记录~~~</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cuid: '',
			Data: '',
			c_phao: [],
			c_roompact: []
		};
	},
	onLoad(option) {
		if (option.cuid) {
			this.cuid = option.cuid;
			this.getList();
		}
	},
	methods: {
		getList() {
			this.$api.Getdeallistcustomapi({ cid: this.cuid }, res => {
				if (res.code == 1000) {
					this.Data = res.data;
					this.c_roompact = res.data.c_roompact;
					this.c_phao = res.data.c_phao;
				}
			});
		},
		detail(item, type) {
			// type  1 排号 2成交
			let id = '';
			if (type == 1) {
				id = item.cr_id;
			} else {
				id = item.crp_id;
			}
			uni.navigateTo({
				url: '/pages/order/traded_order_detail?id=' + id + '&type=' + type
			});
		}
	}
};
</script>

<style lang="less" scoped>
page {
	background-color: rgb(255, 255, 255);
}
</style>
