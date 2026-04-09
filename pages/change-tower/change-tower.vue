<template>
	<view class="bg-white">
		<view class="">
			<view class="text-center text-xxl padding-sm" style="padding-top: 5px;">{{ pname }}({{ bname }}栋)</view>
			<view class="flex justify-center items-center">
				<view class="flex header">
					<view class="">
						<view class="header-item bg-red"></view>
						<view class="text-center">已售</view>
					</view>
					<view class="">
						<view class="header-item bg-sred"></view>
						<view class="text-center">已网签</view>
					</view>
					<view class="">
						<view class="header-item bg-sgreen"></view>
						<view class="text-center">可售</view>
					</view>
				</view>
			</view>
		</view>
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<text class="text-bold">类型：</text>
			<view v-for="(tab, index) in tabBars" :key="index" class="uni-tab-item" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''">{{ tab.tname }}</text>
			</view>
		</scroll-view>
		<view class="padding-sm border-bottom-dash">
			<view class="text-bold">
				合计:{{ houseDetail.total == undefined ? '0' : houseDetail.total }} 已售:{{ houseDetail.sold == undefined ? '0' : houseDetail.sold }} 已网签:{{
					houseDetail.net_sign == undefined ? '0' : houseDetail.net_sign
				}}
				未售:{{ houseDetail.unsold == undefined ? '0' : houseDetail.unsold }}
			</view>
		</view>
		<view class="padding-sm">
			<!-- 别墅和住宅 -->
			<view class="">
				<view class="c-content" v-if="type == 1 || type == 3">
					<!-- <view class="bottom_cls">住宅、别墅</view> -->
					<view v-for="(item, keys, index) in houseData" :key="index">
						<view class="flex border-bottom padding-left-xs">
							<view class="flex" style="line-height: 60rpx;">
								<text class="text-df text-bold ">{{ keys }}单元</text>
								<view class="text-sm padding-left-sm">
									合计:{{ item.statistics.total == undefined ? '0' : item.statistics.total }} 已售:{{
										item.statistics.sold == undefined ? '0' : item.statistics.sold
									}}
									已网签:{{ item.statistics.net_sign == undefined ? '0' : item.statistics.net_sign }} 未售:{{
										item.statistics.unsold == undefined ? '0' : item.statistics.unsold
									}}
								</view>
							</view>
						</view>
						<view class="">
							<view class="flex items" v-for="(ite, key, ind) in item.floor" :key="ind">
								<view class="uni-cell-15 padding-xs   flex justify-center items-center">
									<view>{{ spliteKey(key) }}楼</view>
								</view>
								<view class="flex uni-cell-90">
									<view
										v-for="(fl, indexs) in ite"
										:key="indexs"
										@click="ShowHouse(fl)"
										class=" box2"
										style="width: 100%;"
										:class="{ 'bg-sgreen': fl.rst == 3, 'bg-sred': fl.rst == 2, 'bg-red': fl.rst == 1 }"
									>
										<!-- （1已售 2网签 3未售） -->
										<text class="box2-text">{{ fl.number }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商铺 -->
			<view class="uni-flex-center">
				<view class="c-content" v-if="type == 2">
					<view class="flex items" v-for="(ite, key, ind) in houseData.floor" :key="ind" v-show="key != 'statistics'">
						<view class="uni-cell-15 border-right padding-xs flex  justify-center items-center text-center">
							<view>{{ spliteKey(key) }}楼</view>
						</view>
						<view class="uni-cell-90 flex flex-wrap padding-xs ">
							<view
								v-for="(fl, indexs) in ite"
								:key="indexs"
								@click="ShowHouse(fl)"
								class=" box2"
								:class="{ 'bg-sgreen': fl.rst == 3, 'bg-sred': fl.rst == 2, 'bg-red': fl.rst == 1 }"
							>
								<text class="box2-text">{{ fl.number }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 车位 -->
			<view class="uni-flex-center">
				<view class="c-content" v-if="type == 4">
					<view class="">
						<view class="flex items" v-for="(ite, key, ind) in houseData" :key="ind" v-show="key != 'statistics'">
							<!-- <view class="uni-cell-20 padding-xs border-right" >{{ key }}-楼</view> -->
							<view class=" flex flex-wrap padding-xs">
								<view
									v-for="(fl, indexs) in ite"
									:key="indexs"
									@click="ShowHouse(fl)"
									class=" box2"
									:class="{ 'bg-sgreen': fl.rst == 3, 'bg-sred': fl.rst == 2, 'bg-red': fl.rst == 1 }"
								>
									<!--（1已售 2网签 3未售）-->
									<text class="box2-text">{{ fl.number }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 显示详细信息 -->
		<view class="uni-common-mark flex justify-center align-center" v-if="showBox" @click="showBox = false">
			<view class=" uni-font-size24 test">
				<view class="uni-flex uni-line-height50">
					<text class="uni-cell-30 ">房号:</text>
					<text class="uni-cell-70 uni-text-warp">{{ showBoxData.roomnum }}</text>
				</view>
				<view class="uni-flex uni-line-height50">
					<text class="uni-cell-30 ">面积:</text>
					<text class="uni-cell-70 uni-text-warp">{{ showBoxData.buildareas }}</text>
				</view>
				<view class="uni-flex uni-line-height50">
					<text class="uni-cell-30 ">类型:</text>
					<text class="uni-cell-70 uni-text-warp">{{ showBoxData.tid_name }}-{{ showBoxData.tids_name }}</text>
				</view>
				<view class="uni-flex uni-line-height50">
					<text class="uni-cell-30 ">挂牌单价:</text>
					<text class="uni-cell-70 uni-text-warp">{{ nToLocalString(showBoxData.price) }} 元/㎡</text>
				</view>
				<view class="uni-flex uni-line-height50">
					<text class="uni-cell-30 ">挂牌总价:</text>
					<text class="uni-cell-70 uni-text-warp">{{ nToLocalString(showBoxData.totalprice) }} 元</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showBox: false,
			tabIndex: 0,
			scrollInto: '',
			tabBars: [],
			current: 0,
			styleType: 'text',
			activeColor: '#ff0000',
			contentType: '',
			carList: [], //车位
			storeList: [], //商铺
			houseData: [], //住宅和别墅
			originalHouseData: [], //住宅和别墅原始数据
			originalStoreData: [], //商铺原始数据
			storeTrue: [], //可选商铺数量
			carTrue: [], //可选车位数量
			houseTrue: [], //可选房产数量
			pc_id: '',
			cb_id: '',
			showBoxData: '',
			houseDetail: '',
			type: 1,
			bname: ''
		};
	},
	methods: {
		nToLocalString(nums) {
			return this.$tools.numberToLocalString(nums);
		},
		
		//截取楼层的key
		spliteKey(nums) {
			if (nums.indexOf('index') != -1) {
				return nums.substring(5, nums.length);
			}
		},
		ShowHouse(item) {
			this.showBox = !this.showBox;
			this.showBoxData = item;
		},
		onLoad(options) {
			this.bid = options.bid;
			this.pname = options.pname;
			this.bname = options.bname;
			this.getTypeRooms();
		},
		ontabtap(e) {
			let index = e.target.dataset.current || e.currentTarget.dataset.current;
			this.tabIndex = index;
			this.type = this.tabBars[this.tabIndex].id;
			this.getChHouse();
		},

		getTypeRooms() {
			this.$api.customGettypecustomapi({}, res => {
				if (res.code == 1000) {
					this.tabBars = res.data;
					this.type = this.tabBars[this.tabIndex].id;
					this.getChHouse();
				}
			});
		},
		getChHouse() {
			let data = {
				bid: this.bid,
				type: this.type
			};
			uni.showLoading({
				title: '正在获取房源数据...'
			});
			this.$api.GetRoomslistcustomapi(data, res => {
				if (res.code == 1000) {
					this.houseDetail = res.statistics;
					this.houseData = res.data;
					for (let var1 in this.houseData) {
						if (this.houseData.floor) {
							let newData = this.sortArr(this.houseData[var1]);
							this.houseData[var1] = newData;
						}
						if (this.houseData[var1].floor) {
							let newData = this.sortArr(this.houseData[var1].floor);
							this.houseData[var1].floor = newData;
							// 第一个key
							let fristKey = this.getFirstAttr(this.houseData[var1].floor);
							
							// 所有key
							for (let lastkey in this.houseData[var1].floor) {
								if (this.houseData[var1].floor[lastkey].length <= this.houseData[var1].floor[fristKey].length) {
									let fristlength = this.houseData[var1].floor[fristKey].length;
									let lastlength = this.houseData[var1].floor[lastkey].length;
									for (let i = 0; i < fristlength - lastlength; i++) {
										this.houseData[var1].floor[lastkey].push([''])
									}
								}
							}
						}
					}
				}
			});
		},
		
		//返回第一个key
		getFirstAttr(obj) {
			for (var k in obj) return k;
		},
		//排序
		sortArr(data) {
			var arr = [];
			for (var key in data) {
				arr.push(key);
			}
			arr = arr.sort(function(a, b) {
				return b - a;
			});
			var newData = {};
			for (var i in arr) {
				var itemKey = arr[i].toString();
				newData['index' + itemKey] = data[itemKey];
			}
			return newData;
		}
	}
};
</script>

<style lang="less" scoped>
.header {
	width: 480rpx;
	.header-item {
		height: 40rpx;
		width: 160rpx;
	}
}
.bg-sred {
	background-color: #900000;
	color: #ffffff;
}
.border-right {
	border-right: 1upx solid #eee;
}
.bg-sgreen {
	background-color: #005500;
	color: #ffffff;
}
.footer {
	height: 140upx;
	width: 100%;
	background: #ffffff;
	display: flex;
	justify-content: space-between;
	position: fixed;
	bottom: 0rpx;
}
.bottom_cls {
	font-weight: 700;
	border-bottom: 1upx solid #eeeeee;
}
.uni-common-mark {
	position: fixed;
	z-index: 999;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	.title {
		text-align: center;
		line-height: 100upx;
		font-size: 32upx;
	}
	.test {
		background: #ffffff;
		padding: 10px;
		border-radius: 5px;
	}
	.uni-common-mark-close {
		text-align: center;
		font-size: 22upx;
		border-radius: 50%;
		border: 1upx solid #ffffff;
		width: 40upx;
		color: #ffffff;
		margin-top: 40upx;
	}
}
.h-header {
	position: fixed;
	top: 0;
	width: 100%;
	height: 80upx;
	z-index: 999;
	background: #ffffff;
}
.uniBgRed {
	background: #ff0000;
}
.box1 {
	height: 35upx;
	width: 80upx;
	line-height: 35upx;
	text-align: center;
	margin-top: 5upx;
}
.change-type {
	display: flex;
	margin-top: 30upx;
	justify-content: space-between;
	border-bottom: 2px solid #eeeeee;
	padding-bottom: 15upx;
}
.change-num {
	line-height: 35upx;
	font-size: 24upx;
}
.box-text {
	font-size: 24upx;
	padding-left: 10upx;
}
.scroll-h {
	height: 80upx;
	flex-direction: row;
	text-align: center;
	/* #ifndef APP-PLUS */
	white-space: nowrap;
	/* #endif */
	/* flex-wrap: nowrap; */
	/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
}
.uni-tab-item {
	/* #ifndef APP-PLUS */
	display: inline-block;
	/* #endif */
	flex-wrap: nowrap;
	padding-left: 14upx;
	padding-right: 14upx;
}

.uni-tab-item-title {
	color: #fff;
	font-size: 24upx;
	height: 80upx;
	line-height: 80upx;
	background-color: #1cbbb4;
	border-radius: 5px;
	padding: 5px;
	flex-wrap: nowrap;
	/* #ifndef APP-PLUS */
	white-space: nowrap;
	/* #endif */
}
.uni-tab-item-title-active {
	background-color: #e19600;
	// color: #fff;
	// font-size: 24upx;
	// height: 80upx;
	// line-height: 80upx;
	// background-color: #1CBBB4;
	// border-radius: 5px;
	// padding: 5px;
	// flex-wrap: nowrap;
	// border-bottom: 2px solid #e51c23;
}
.c-content {
	// padding-top: 20upx;
	// margin-bottom: 150upx;
	border: 1upx solid #eee;
	width: 100%;
	.items {
		border-bottom: 1px solid #eeeeee;
	}
	.box2 {
		width: 20%;
		line-height: 60upx;
		text-align: center;
		border: 1upx solid #ffffff;
		position: relative;
	}
	.box2-text {
		line-height: 40upx;
		font-size: 24upx;
	}
}
</style>
