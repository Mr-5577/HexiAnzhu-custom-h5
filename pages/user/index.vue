<template>
	<view class="center" v-if="userInfo">
		<view class="padding-left-sm padding-right-sm">
			<view class="logo flex" :style="{ backgroundImage: `url(${headerBg})` }">
				<image class="logo-img" :src="userInfo.qiniu_filekey" v-if="userInfo.qiniu_filekey"></image>
				<view class="logo-img-text flex justify-center" v-if="!userInfo.qiniu_filekey">
					<text class="text-center">{{ cName(userInfo.u_name) }}</text>
				</view>
				<view class="logo-title">
					<view class="uer-name">{{ userInfo.u_name }}</view>
					<view class="uer-name">{{ userInfo.u_tel1 }}</view>
					<view class="uer-name">{{ userInfo.jiegou }}</view>
				</view>
			</view>
		</view>

		<view class="center-list">
			<view @click="navTo('customer/customer')" hover-class="navigator-hover">
				<view class="center-list-item ">
					<view class="flex justify-center align-center"><image src="/static/images/user/user.png" class="user-icon" mode="aspectFit"></image></view>
					<view class="flex justify-between uni-cell-100 border-bottom margin-left">
						<text class="list-text">我的客户</text>
						<text class="navigat-arrow text-gray">&#xe65e;</text>
					</view>
				</view>
			</view>
			<navigator url="/pages/order/order" hover-class="navigator-hover">
				<view class="center-list-item ">
					<view class="flex justify-center align-center"><image src="/static/images/user/order.png" class="user-icon" mode="aspectFit"></image></view>
					<view class="flex justify-between uni-cell-100 border-bottom margin-left">
						<text class="list-text">我的订单</text>
						<text class="navigat-arrow text-gray">&#xe65e;</text>
					</view>
				</view>
			</navigator>
			<navigator url="/pages/order/traded_order" hover-class="navigator-hover">
				<view class="center-list-item ">
					<view class="flex justify-center align-center"><image src="/static/images/user/deal.png" class="user-icon" mode="aspectFit"></image></view>
					<view class="flex justify-between uni-cell-100 border-bottom margin-left">
						<text class="list-text">我的成交</text>
						<text class="navigat-arrow text-gray">&#xe65e;</text>
					</view>
				</view>
			</navigator>
			<view @click="showChoose" class="flex" hover-class="navigator-hover">
				<view class="center-list-item ">
					<view class="flex justify-center align-center"><image src="/static/images/user/df-project.png" class="user-icon" mode="aspectFit"></image></view>
					<view class="flex justify-between uni-cell-100 border-bottom margin-left">
						<text class="list-text">默认项目</text>
						<view>
							<text class=" text-gray">{{ userInfo.default_pname }}</text>
							<text class="navigat-arrow text-gray">&#xe65e;</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<li-choose ref="lichoose" :showCustomer="showCustomer" @confirm="confirms" :isSingle="isSingle"></li-choose>
	</view>
</template>

<script>
import liChoose from '@/components/li-choose/li-choose.vue';
import headerBg from '@/static/images/bg.png';
export default {
	data() {
		return {
			login: false,
			avatarUrl: '/static/images/avatar.png',
			headerBg: headerBg,
			userInfo: {
				u_name: ''
			},
			isSingle: true,
			showCustomer: false,
			default_pid: '',
			ChooseProject: ''
		};
	},
	components: {
		liChoose
	},
	onLoad() {
		this.getUser();
		this.getBigareacustomapi();
	},
	onShow() {
		if(this.$refs.lichoose){
			this.$refs.lichoose.cancel();
		}
		
	},
	onHide() {
		this.$refs.lichoose.cancel();
	},
	methods: {
		//根据权限获取大区和大区下的项目
		getBigareacustomapi() {
			this.$api.customGetbigareacustomapi({}, res => {
				res.data.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = false;
					});
				});
				this.$store.commit('setSearchPro', res.data);
			});
		},
		confirms(res) {
			if (res.pid[0]) {
				this.$store.commit('setDefaultPid', res.pid[0]);
				this.userInfo.default_pname = res.p_name;
				this.$api.SetDefaultpidbookingapi({ pid: res.pid[0] }, res => {
					if (res.code == 1000) {
						uni.showToast({
							icon: 'none',
							title: '默认项目设置成功'
						});
						this.$store.commit('setDefaultActiveProject', '');
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
				});
			}
		},
		showChoose() {
			this.$store.commit('setDefaultActiveProject', '');
			this.$store.commit('setDefaultActiveProject', this.ChooseProject);
			this.$refs.lichoose.show();
		},
		navTo(urls) {
			if (urls == 'customer/customer') {
				uni.switchTab({
					url: '/pages/' + urls
				});
				this.$store.commit('setCustomerType', 1);
			} else {
				uni.navigateTo({
					url: '/pages/' + urls
				});
			}
		},
		getUser() {
			this.$api.Getuserinfobookingapi({}).then(res => {
				if (res.code == 1000) {
					this.ChooseProject = [];
					this.userInfo = res.data;
					let data = { p_id: res.data.default_pid, p_name: res.data.default_pname, isactive: true };
					this.ChooseProject.push(data);
					this.$store.commit('setDefaultPid', this.userInfo.default_pid);
				}
			});
		},
		cName(names) {
			if (names) {
				return names.substring(0, 2);
			} else {
				return names;
			}
		}
	}
};
</script>

<style scoped>
@font-face {
	font-family: texticons;
	font-weight: normal;
	font-style: normal;
	src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
}
page {
	background-color: rgb(250, 250, 250);
}

.center {
	flex-direction: column;
	padding-top: 24rpx;
}
.user-icon {
	width: 70rpx;
	height: 70rpx;
}
.logo {
	height: 240rpx;
	box-sizing: border-box;
	align-items: center;
	position: relative;
	z-index: 99;
	justify-content: space-between;
	background-size: 100% 100%;
	border-radius: 10px;
	-moz-box-shadow: 0px 5px 13px rgba(80, 118, 182, 0.3);
	-webkit-box-shadow: 0px 5px 13px rgba(80, 118, 182, 0.3);
	box-shadow: 0px 5px 13px rgba(80, 118, 182, 0.3);
}

.logo-hover {
	opacity: 0.8;
}

.logo-img {
	width: 150rpx;
	height: 150rpx;
	border-radius: 150rpx;
	z-index: 99;
	margin-left: 20px;
}
.logo-img-text {
	width: 150rpx;
	height: 150rpx;
	border-radius: 150rpx;
	z-index: 99;
	margin-left: 20px;
	text-align: center;
	line-height: 150rpx;
	border-radius: 50%;
	background-color: #007aff;
	color: #ffffff;
	font-weight: bold;
	font-size: 36rpx;
}
.logo-title {
	width: 70%;
	height: 150rpx;
	margin-left: 10rpx;
	z-index: 99;
	display: block;
	font-size: 28rpx;
}

.uer-name {
	height: 50rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	color: #ffffff;
}
.center-list {
	margin-top: 40rpx;
	width: 750rpx;
	flex-direction: column;
}

.center-list-item {
	height: 110rpx;
	width: 750rpx;
	box-sizing: border-box;
	flex-direction: row;
	padding: 0rpx 20rpx;
	display: flex;
}

.border-bottom {
	border-bottom-width: 1rpx;
	border-color: #eeeeee;
	border-bottom-style: solid;
}

.list-icon {
	width: 40rpx;
	height: 110rpx;
	line-height: 110rpx;
	font-size: 28rpx;
	text-align: center;
	margin-right: 20rpx;
}

.list-text {
	height: 110rpx;
	line-height: 110rpx;
	font-size: 28rpx;
	color: #555;
	flex: 1;
	text-align: left;
}

.navigat-arrow {
	height: 110rpx;
	width: 40rpx;
	line-height: 110rpx;
	font-size: 34rpx;
	color: rgb(153, 153, 153);
	text-align: right;
	font-family: texticons;
}
</style>
