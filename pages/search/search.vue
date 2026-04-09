<template>
	<view>
		<!-- 顶部区域 -->
		<view class="bg-white">
			<view class="margin-sm " style="margin-top: 0px;">
				<view class="text-gray padding-top-sm">区域</view>
				<view class="flex flex-wrap padding-bottom-sm justify-start">
					<button
					    style="width: 150rpx;padding: 0 20rpx;"
						v-for="(item, index) in bigarea"
						:key="index"
						@click="chooseBigarea(item, index)"
						class="cu-btn round line-gray margin-xs"
						:class="index == bigareaIndex ? 'text-white bg-blue' : 'bg-gray'"
					>
						{{ item.name }}
					</button>
				</view>
			</view>
		</view>
		
		<view class="VerticalBox">
			<!-- 左侧项目区域 -->
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 220upx)">
				<view
					class="cu-item text-cut"
					:class="index == tabCur ? 'text-blue' : ''"
					v-for="(item, index) in list"
					:key="index"
					@tap="TabSelect(item, index)"
					:data-id="index"
				>
					{{ item.c_shortname }}
				</view>
			</scroll-view>
			<!-- 项目楼盘 -->
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 220upx)" :scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
				<view
					class="padding-sm"
					style="padding-top: 0;padding-right: 0;"
					v-for="(items, indexs) in projectList"
					:key="indexs"
					:class="{ 'padding-top': indexs != 0 }"
					:id="'main-' + indexs"
				>
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-blue"></text>
							{{ items.p_name }}
						</view>
					</view>
					<view class="cu-list menu-avatar " v-if="items.dtype == 1">
						<view class="bg-white ">
							<view class="" v-for="(ite, idx) in items.area" :key="idx">
								<view class="padding-sm text-bold padding-top" style="padding-bottom: 10rpx;">{{ ite.name }}</view>
								<view class="flex flex-wrap padding-bottom-xs">
									<view v-for="(item, index) in ite.build" :key="index" @click="buildDetail(item, index, items.p_name)" class=" avatar  margin-xs ">
										<text class="text-sm">{{ item.name }}栋</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="cu-list menu-avatar " v-if="items.dtype == 0">
						<view class="bg-white ">
							<view class="flex flex-wrap padding-bottom-xs">
								<view v-for="(item, index) in items.build" :key="index" @click="buildDetail(item, index, items.p_name)" class=" avatar margin-xs ">
									<text class="text-sm">{{ item.name }}栋</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [], //公司列表
			tabCur: 0,
			mainCur: 0,
			verticalNavTop: 0,
			load: true,
			bigarea: '', //大区
			bigareaIndex: 0, //大区索引
			bigareaId: '', //大区id
			c_id: '', //公司id
			projectList: '', //楼盘
			activeIndex: -1
		};
	},
	onLoad() {
		this.getBigareacustomapi();
	},
	onReady() {
		uni.hideLoading();
	},

	methods: {
		buildDetail(item, index, pname) {
			this.activeIndex = index;
			if (item.id) {
				uni.navigateTo({
					url: '/pages/change-tower/change-tower?bid=' + item.id + '&pname=' + pname + '&bname=' + item.name
				});
			}
		},
		chooseBigarea(item, index) {
			this.bigareaIndex = index;
			this.bigareaId = item.id;
			this.tabCur = 0;
			if (this.bigareaId) {
				this.getCompanyList();
			}
		},
		TabSelect(item, e) {
			this.tabCur = e;
			this.mainCur = e;
			this.verticalNavTop = (e - 1) * 50;
			this.c_id = item.c_id;
			if (this.c_id) {
				this.getHouseList();
			}
		},
		VerticalMain(e) {
			// #ifdef MP-ALIPAY
			return false; //支付宝小程序暂时不支持双向联动
			// #endif
			let that = this;
			let tabHeight = 0;
			if (this.load) {
				for (let i = 0; i < this.list.length; i++) {
					let view = uni.createSelectorQuery().select('#main-' + this.list[i].id);
					view.fields(
						{
							size: true
						},
						data => {
							this.list[i].top = tabHeight;
							// tabHeight = tabHeight + data.height;
							// this.list[i].bottom = tabHeight;
						}
					).exec();
				}
				this.load = false;
			}
			let scrollTop = e.detail.scrollTop + 10;
			for (let i = 0; i < this.list.length; i++) {
				if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
					this.verticalNavTop = (this.list[i].id - 1) * 50;
					this.tabCur = this.list[i].id;
					console.log(scrollTop);
					return false;
				}
			}
		},
		//根据权限获取大区和大区下的项目
		getBigareacustomapi() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetbigareacustomapi({}, res => {
				this.bigarea = res.data;
				if (this.bigarea) {
					this.bigareaId = this.bigarea[0].id;
					this.getCompanyList();
				}
			});
		},
		//公司列表
		getCompanyList() {
			let data = {
				id: this.bigareaId
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetcompanylistcustomapi(data, res => {
				this.list = res.data;
				if (this.list) {
					this.c_id = this.list[0].c_id;
					this.getHouseList();
				}
			});
		},
		//房源列表
		getHouseList() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.getProjectbuildingcustomapi({ cid: this.c_id }, res => {
				this.projectList = res.data;
			});
		}
	}
};
</script>

<style scoped>
.bg-gray {
	background-color: rgba(235, 235, 235);
}
.fixed {
	position: fixed;
	z-index: 99;
}

.VerticalNav.nav {
	width: 200rpx;
	white-space: initial;
}

.VerticalNav.nav .cu-item {
	width: 100%;
	text-align: center;
	background-color: #fff;
	margin: 0;
	border: none;
	height: 100rpx;
	position: relative;
	line-height: 100rpx;
}
.avatar {
	text-align: center;
	background-color: #eee;
	border: 1rpx solid #eee;
	height: 84rpx;
	width: 84rpx;
	line-height: 84rpx;
	border-radius: 50%;
}

.VerticalNav.nav .cu-item.cur {
	background-color: rgb(250, 250, 250);
}

.VerticalNav.nav .cu-item.cur::after {
	content: '';
	width: 8upx;
	height: 30upx;
	border-radius: 10upx 0 0 10upx;
	position: absolute;
	background-color: currentColor;
	top: 0;
	right: 0upx;
	bottom: 0;
	margin: auto;
}

.VerticalBox {
	display: flex;
}

.VerticalMain {
	background-color: rgb(250, 250, 250);
	flex: 1;
}
</style>
