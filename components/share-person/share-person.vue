<template>
	<view class="share" v-if="mode" @click="close" @touchmove.stop.prevent="moveHandle">
		<view class="content radius" @click.stop="opens" >
			<view class="text-center padding">选择客户共享人</view>
			<scroll-view scroll-y="true" style="height: 700rpx;">
				<view  v-for="(items, key, indexs) in groupSaleData" :key="indexs">
					<view style="line-height: 28px;">{{ items[0].name }}</view>
					<view class="flex flex-wrap">
						<view class="flex " v-for="(item, index) in items" :key="index" @click="choose(item)">
							<view class="cu-btn round sm  margin-xs" :class="item.active ? 'bg-blue' : 'bg-gray'">{{ item.u_name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="flex flex justify-center align-center foot-btn">
				<button type="primary" class="cu-btn round bg-blue" @click="submit">确定选择</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mode: false
		};
	},
	props: {
		shareStr: {
			type: String,
			default: ''
		}
	},
	computed: {
		groupSaleData() {
			let go = this.$store.state.groupSaleDatas;

			if (this.shareStr) {
				var share_str = this.shareStr.split(',');
				for (let x in go) {
					for (var i = 0, lenI = go[x].length; i < lenI; ++i) {
						share_str.forEach(res => {
							if (go[x][i].u_id == res) {
								go[x][i].active = true;
							}
						});
					}
				}
			} else {
				let allSales = []
				for (let x in go) {
					for (var i = 0, lenI = go[x].length; i < lenI; ++i) {
						allSales.push(go[x][i])
					}
				}
				if(allSales.length != 0){
					allSales.map((res,index) =>{
						res.active = false
					})
				}
			}
			return go;
		}
	},
	methods: {
		moveHandle() {
		},
		choose(item) {
			let ids = [];
			for (let x in this.groupSaleData) {
				for (var i = 0, lenI = this.groupSaleData[x].length; i < lenI; ++i) {
					if (this.groupSaleData[x][i].active == true) {
						ids.push(this.groupSaleData[x][i].u_id);
					}
				}
			}
			if (ids.length >= 5) {
				uni.showToast({
					icon: 'none',
					title: '共享人最多不超过5人'
				});
				item.active = false;
			} else {
				item.active = !item.active;
			}
			this.$forceUpdate();
		},
		close() {
			this.mode = false;
		},
		open() {
			this.mode = true;
		},
		opens() {},
		submit() {
			let sales = [];
			for (let x in this.groupSaleData) {
				for (var i = 0, lenI = this.groupSaleData[x].length; i < lenI; ++i) {
					if (this.groupSaleData[x][i].active == true) {
						sales.push(this.groupSaleData[x][i]);
					}
				}
			}
			this.$emit('onShare', sales);
		}
	}
};
</script>

<style lang="less">
.share {
	top: 0;
	position: fixed;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.6);
	z-index: 998;
	.content {
		height: 900rpx;
		width: 80%;
		background: #fff;
		z-index: 999;
		overflow-y: auto;
		padding: 5px;
		padding-bottom: 50px;
		position: relative;
	}
	.foot-btn {
		bottom: 10upx;
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0rpx;
		height: 90rpx;
		background-color: #FFFFFF;
	}
}
</style>
