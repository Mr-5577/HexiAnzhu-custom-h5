<template>
	<view>
		<view v-if="c_phao.length != 0">
			<view class="padding-sm">排号</view>
			<view v-for="(item, index) in c_phao" @click="detail(item, 1)" :key="index">
				<view class="cu-form-group ">
					<view class="title">{{ item.ordernumer }}({{ item.name }})</view>
					<view class="picker">
						{{ item.time }}
						<text class="sm text-gray cuIcon-right" style="padding-left: 16upx;"></text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="c_roompact.length != 0">
			<view class="padding-sm">认购</view>
			<view v-for="(item, index) in c_roompact" @click="detail(item, 2)" :key="index">
				<view class="cu-form-group ">
					<view class="title">{{ item.roomnum }}({{ item.name }})</view>
					<view class="picker">
						{{ item.time }}
						<text class="sm text-gray cuIcon-right" style="padding-left: 16upx;"></text>
					</view>
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

<style lang="less" scoped></style>
