<template>
	<view class="">
		<!-- <scroll-view scroll-x class="bg-defalut nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in Tab" :key="index" @tap="tabSelect" :data-id="index">
					{{ item }}
				</view>
			</view>
		</scroll-view> -->
		<view class="">
			<view class="cu-bar search bg-defalut">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input maxlength="11"  v-model="requestData.keyword" @input="search" :adjust-position="false" type="number" confirm-type="search"  placeholder="请输入电话号码搜索"  />
				    <text class="lg text-gray cuIcon-roundclose" @click="searchClear"></text>
				</view>
				<view class="action">
					<!-- <button class="cu-btn bg-blue shadow-blur round" @click="search">搜索</button> -->
					<view class="text-white text-bold" @click="toSearch" >房源查询 <text class="cuIcon-right"></text> </view>
				</view>
			</view>
			<view class="padding-sm bg-white text-gray text-bold">
				<text>说明：</text>
				<view>1、查询为公共查询，为保证数据安全，必须输入完整的电话号码查询，不支持模糊查询；</view>
				<view>2、可查询权限范围内所有客户，仅显示客户归属状态。</view>
			</view>
			<view class="padding-sm">共查询{{ total }}条记录</view>
			<view class="">
				<view class="flex text-gray bg-white margin-top-xs" v-for="(item, index) in customerList" :key="index">
					<view class="margin header-logo bg-blue round flex align-center justify-center">
						<text>{{ cname(item.cname) }}</text>
					</view>
					<view style="line-height: 25px;">
						<view>客户姓名：{{ item.cname }}</view>
						<view>归属项目：{{ item.p_name }}</view>
						<view>首次到访：{{ item.ctimestr }}</view>
						<view>最近跟进：{{ item.lasttime }}</view>
						<view>置业顾问：{{ item.u_name }}</view>
					</view>
				</view>
				<view class="" style="line-height: 60px;height: 60px;text-align: center;" v-if="current_page < last_page">上拉加载更多数据~~</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			TabCur: 0,
			Tab: ['客户查询', '房源查询'],
			requestData: {
				keyword: '', //搜索
				page: 1,
				limit: 15
			},
			customerList: [],
			per_page: 0,
			current_page: 0,
			last_page: 0,
			total: 0
		};
	},
	onShow() {
		this.TabCur = 0;
		
	},
	onReachBottom() {
		if (this.current_page < this.last_page) {
			this.requestData.page = this.current_page + 1;
			this.getCustomerList();
		}
	},
	methods: {
		searchClear() {
			this.requestData.keyword = '';
			this.total = 0;
			this.customerList = [];
		},
		cname(name) {
			return this.$tools.cName(name);
		},
		search() {
			this.customerList = [];
			this.total = 0;
			this.requestData.page = 1;
			let isPhone = this.$tools.isPhone(this.requestData.keyword);
			if (isPhone == false) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确且完整的手机号'
				});
			} else {
				this.getCustomerList();
			}
		},
		getCustomerList() {
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.mcSearchCustomapi(this.requestData, res => {
				res.data.data.forEach(resp => {
					this.customerList.push(resp);
				});
				this.per_page = res.data.per_page; //一页多少条数据；
				this.current_page = res.data.current_page; //当前页数；
				this.last_page = res.data.last_page; //一共多少页；
				this.total = res.data.total; //总条数
			});
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			if (this.TabCur == 1) {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		},
		toSearch(){
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		InputFocus(e) {
			if (e.target.value) {
				this.requestData.keyword = e.target.value;
				this.customerList = [];
				this.requestData.page = 1;
				this.getCustomerList();
			} else {
				this.customerList = [];
				this.total = 0;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.header-logo {
	height: 50px;
	width: 50px;
	border-radius: 50%;
}
</style>
