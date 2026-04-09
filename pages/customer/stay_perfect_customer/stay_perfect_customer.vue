<template>
	<view class="uni-flex-center">
		<view class="uni-content">
			<view class="cu-bar search bg-white margin-top-sm">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="请输入客户房号、姓名、电话" confirm-type="search" />
				</view>
				<view class="action">取消</view>
			</view>
			<view class="bg-white flex solid-bottom padding justify-between margin-top-sm">
				<view class="flex  padding-sm" style="padding-bottom: 10px;">
					<view class="">
						<text class="cu-btn radius line-gray" @click="clickType">
							{{ typeText }}
							<text class="lg text-gray cuIcon-triangledownfill"></text>
						</text>
					</view>
					<view class="margin-left-xs">
						<text class="cu-btn radius line-gray" @click="clickSource">
							{{ sourceText }}
							<text class="lg text-gray cuIcon-triangledownfill"></text>
						</text>
					</view>
					<view class="margin-left-xs">
						<text class="cu-btn radius line-gray" @click="clickComeTime">
							{{ comeTimeText }}
							<text class="lg text-gray cuIcon-triangledownfill"></text>
						</text>
					</view>
					<view class="margin-left-xs">
						<text class="cu-btn radius line-gray" @click="clickTime">
							{{ timeText }}
							<text class="lg text-gray cuIcon-triangledownfill"></text>
						</text>
					</view>
				</view>
			</view>
			<view class="text-grey padding">共{{ total }}条数据</view>
			<view class="cu-list menu-avatar">
				<checkbox-group class="block " @change="checkboxChange">
					<view class="cu-form-group cu-item" style="padding: 5upx;" v-for="(item, index) in customerList" :key="index">
						<checkbox style="transform: scale(0.8);" class="round blue" :value="index + '1'" :class="item.checked ? 'checked' : ''" :checked="item.checked" />
						<view class="padding-left"><image class=" cu-avatar round lg round" :src="item.tmp_standardurl" mode="aspectFit"></image></view>
						<view class="content padding-left">
							<view class="text-grey">
								<view class="text-cut text-gray">来源：{{ item.cname }} 时间： {{ item.tmp_standardtime }}</view>
								<view class="text-cut text-gray">客户：{{ item.cname }} 项目：{{ item.p_name }}</view>
								<view class="text-df text-gray ">备注：{{ item.tmp_remak }}</view>
							</view>
						</view>
					</view>
				</checkbox-group>
				<view class="text-center bg-white" style="padding: 10px;" v-if="customerList.length == 0">暂无数据~~</view>
			</view>
		</view>
		<w-picker mode="date" @confirm="onConfirm" ref="yearMonth" themeColor="#f00"></w-picker>
		<view class="add-data" @click="perfectData" v-if="customerList.length != 0">
			<view>
				完善
				<br />
				资料
			</view>
		</view>
	</view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker.vue';
import { isJSON } from '@/common/checker.js';
var _self;
var canvaPie = null;
export default {
	components: {
		wPicker
	},
	data() {
		return {
			scrollLeft: 0,
			mode: false,

			items: [],
			TabCur: 0,
			mask: false,
			mask1: false,
			pixelRatio: 1,
			textarea: '',
			typeText: '待完善',
			sourceText: '人脸识别',
			comeTimeText: '到访日期',
			timeText: '时间正序',
			requestData: {
				source: 1, //来源类型(1-人脸识别，2-微信客户，3-小程序扫码)
				over_type: '',
				type: 3, //按客户归属查询（1我负责的，2共享给我的，3全部客户，4客户共池）
				keyword: '', //按客户房号、名称和电话关键字进行查询
				sort: 1, //进行排序（1：按创建时间正叙，2：按创建时间倒叙）
				pid: '', //	按项目进行查询
				page: 1,
				status: 0, //是否完善过（0-未完善，1-已完善）
				date: ''
			},
			per_page: 0,
			customerList: [],
			total: 0,
			current_page: 0,
			last_page: 0,
			tmp_id: '',
			checkbox: [
				{
					value: 'A',
					checked: true
				},
				{
					value: 'B',
					checked: true
				},
				{
					value: 'C',
					checked: false
				}
			]
		};
	},
	onShow() {
		_self = this;
		this.customerList = [];
		this.getUntreatedCustomer();
	},
	onReachBottom() {
		if (this.current_page < this.last_page) {
			this.current_page = this.current_page + 1;
			this.requestData.page = this.current_page;
			this.getUntreatedCustomer();
		}
	},
	methods: {
		ChangeChecked(item) {
			if (item.checked == true) {
				item.checked = false;
			}
			if (item.checked == false) {
				item.checked = true;
			}
			this.$forceUpdate();
		},
		RadioChange(e) {
			this.tmp_id = e.detail.value;
		},
		clickType() {
			let _this = this;
			let items = ['待完善', '已完善'];
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.typeText = items[res.tapIndex];
					_this.requestData.status = res.tapIndex;
					_this.requestData.page = 1;
					_this.customerList = [];
					_this.getUntreatedCustomer();
				}
			});
		},
		clickSource() {
			let _this = this;
			let items = ['人脸识别'];
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.sourceText = items[res.tapIndex];
					_this.requestData.source = res.tapIndex + 1;
					_this.requestData.page = 1;
					_this.customerList = [];
					_this.getUntreatedCustomer();
				}
			});
		},
		clickComeTime() {
			this.$refs.yearMonth.show();
		},
		clickTime() {
			let _this = this;
			let items = ['时间正序', '时间倒序'];
			uni.showActionSheet({
				itemList: items,
				success: function(res) {
					_this.timeText = items[res.tapIndex];
					_this.requestData.sort = res.tapIndex + 1;
					_this.requestData.page = 1;
					_this.customerList = [];
					_this.getUntreatedCustomer();
				}
			});
		},
		getUntreatedCustomer() {
			this.$api.customUntreatedcustomlistcustomapi(this.requestData, res => {
				res.data.data.forEach(resp => {
					resp.checked = false;
					this.customerList.push(resp);
				});
				this.per_page = res.data.per_page; //一页多少条数据；
				this.current_page = res.data.current_page; //当前页数；
				this.last_page = res.data.last_page; //一共多少页；
				this.total = res.data.total; //总条数
			});
		},
		perfectData() {
			let tmp_ids = [];
			let tmp_standardtime = '';
			this.customerList.forEach(res => {
				if (res.checked == true) {
					tmp_standardtime = res.tmp_standardtime;
					tmp_ids.push(res.tmp_id);
				}
			});
			if (tmp_ids.length != 0) {
				let tmp_id = this.$tools.toStrings(tmp_ids);
				uni.navigateTo({
					url: '/pages/customer/customer_add?tmp_id=' + tmp_id + '&tmp_standardtime=' + tmp_standardtime
				});
			}
		},
		detail(items) {
			uni.navigateTo({
				url: '/pages/customer/overdue_customer/overdue_customer_detail?id=' + items
			});
		},
		InputFocus() {},
		InputBlur() {},

		toggleTab(str) {
			this.$refs[str].show();
		},
		onConfirm(val) {
			let resultInfo = { ...val };
			this.requestData.date = resultInfo.result;
			this.comeTimeText = resultInfo.result;
			this.customerList = [];
			this.requestData.page = 1;
			this.getUntreatedCustomer();
		},
		chooseProject() {
			this.$refs.lichoose.show();
		},
		checkboxChange(e) {
			var items = this.customerList;
			let values = e.detail.value;
			for (var i = 0, lenI = this.customerList.length; i < lenI; ++i) {
				this.customerList[i].checked = false;
				for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
					if (i + '1' == values[j]) {
						this.customerList[i].checked = true;
						break;
					}
				}
			}
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		}
	}
};
</script>

<style lang="less" scoped>
.cu-form-group {
	justify-content: flex-start;
}
.cu-btn {
	padding: 0 16upx;
}
.mask {
	position: absolute;
	border: 1px solid #ddd;
	border-radius: 10upx;
	top: 70upx;
	width: 20%;
	padding: 5upx;
	z-index: 999;
	background: #fff;
}

.uni-flex-center {
	// background: #F4F2F2;
	width: 100%;
	height: 100%;
	.uni-content {
		width: 100%;
		height: 100%;
	}
}
.selects {
	height: 60upx;
	border: 1px solid #007aff;
	border-radius: 10upx;
	line-height: 50upx;
	padding: 5upx;
	width: 200upx;
}
.padding {
	padding: 10upx;
}
.add-data {
	position: fixed;
	bottom: 200upx;
	right: 50upx;
	height: 100upx;
	width: 100upx;
	text-align: center;
	border-radius: 50%;
	color: #ffffff;
	background: rgba(25, 138, 250, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
