<template>
	<view v-if="customerData">
		<view class="cu-list menu-avatar">
			<view class="cu-item" style="height: 180rpx;">
				<view class="cu-avatar round lg bg-blue text-white" v-if="customerData.head_photo">
					<image @click.stop="showHeadImg(customerData.head_photo)" :src="customerData.head_photo" mode="aspectFill" class="cu-avatar lg round"></image>
				</view>
				<view class="cu-avatar round lg bg-blue text-white " v-else>
					<text class="text-df">{{ cName(customerData.cname) }}</text>
				</view>
				<view class="content">
					<view class="">
						<view class="text-cut text-lg">{{ customerData.cname }}</view>
						<view class="padding-left-sm text-sm" v-if="customerData.status != 3">
							<text v-if="customerData.status == 1">已认购</text>
							<text v-if="customerData.status == 2" class="text-orange">未成交</text>
						</view>
					</view>
					<view class=" flex padding-top-sm">
						<view class="text-cut">
							<text class=" text-15">{{ customerData.ctel }}</text>
						</view>
					</view>
				</view>
				<view>
					<view class="text-grey text-right padding-right-sm">
						<text class="text-xxl text-blue cuIcon-emoji" v-show="customerData.loop_type == 2"></text>
						<text class="text-xxl text-green cuIcon-weixin padding-sm" v-show="customerData.loop_type == 3"></text>
					</view>
					<view class="text-gray text-sm text-right padding-top" style="line-height: 40upx;">跟进{{ recordList.length }}次</view>
				</view>
			</view>
		</view>

		<view class="bg-white margin-top-sm">
			<view class="video-and-pic  padding-top">
				<view class="changebox flex">
					<view class="video" @click="changeTypeMedia(0)" :class="changetype == 0 ? 'activebox' : ''">基本资料</view>
					<view class="pic " @click="changeTypeMedia(1)" :class="changetype == 1 ? 'activebox' : ''">跟进记录</view>
				</view>
			</view>
		</view>
		<!-- 客户详情 -->
		<view v-if="TabCur == 0" class="padding-bottom-xxxl">
			<view class="bg-white padding" v-if="customerData.edit_status == 1">
				<button class="cu-btn block border-blue lg round bg-white text-blue" @click="update">
					<text class="lg text-blue cuIcon-edit padding-right"></text>
					编辑客户资料
				</button>
			</view>
			<view class="cu-list menu">
				<view class="cu-item ">
					<view class="content text-sm"><text class="">归属项目</text></view>
					<view class="action">
						<view class=" light">{{ customerData.p_name }}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text class="">客户名称</text></view>
					<view class="action">
						<view class="">{{ customerData.cname }}</view>
					</view>
				</view>
				<view class="cu-item" @tap="call(customerData.ctel)">
					<view class="content text-sm"><text class="">联系电话</text></view>
					<view class="action flex">
						<text class="text-blue">{{ customerData.ctel }}</text>
						<view class="lg text-blue cuIcon-mobilefill"></view>
					</view>
				</view>
				<view class="cu-item" v-if="customerData.ctels" @tap="call(customerData.ctels)">
					<view class="content text-sm"><text class="">备用电话</text></view>
					<view class="action flex">
						<text class="text-blue">{{ customerData.ctels }}</text>
						<view class="lg text-blue cuIcon-mobilefill"></view>
					</view>
				</view>
				<view class="cu-item" v-if="customerData.idcard">
					<view class="content text-sm"><text class="">身份证号</text></view>
					<view class="action flex">
						<text class="">{{ customerData.idcard }}</text>
					</view>
				</view>

				<view class="cu-item" v-if="customerData.address">
					<view class="content text-sm"><text class="">家庭住址</text></view>
					<view class="action flex">
						<text class="">{{ customerData.address }}</text>
					</view>
				</view>

				<view class="cu-item">
					<view class="content text-sm"><text class="">录入系统</text></view>
					<view class="action">
						<view class="lg">{{ customerData.creattime }}</view>
					</view>
				</view>
				<view class="cu-item" v-if="customerData.ctimestr">
					<view class="content text-sm"><text class="">首访时间</text></view>
					<view class="action">
						<view class="lg">{{ customerData.ctimestr }}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text>最近跟进</text></view>
					<view class="action">
						<view class="lg">{{ customerData.lasttime }}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text class="">责任人</text></view>
					<view class="action">
						<view class="lg ">{{ customerData.u_name }}</view>
					</view>
				</view>
				<view class="cu-item " @click="showShare">
					<view class="content text-sm "><text class="">共享人</text></view>
					<view class="action">
						<view class="lg ">
							{{ customerData.share_name }}
							<text v-show="customerData.edit_status == 1" class="lg text-gray cuIcon-right padding-left"></text>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text class="">公池客户</text></view>
					<view class="action">
						<view class="lg ">{{ customerData.purchase == 9 ? '是' : '否' }}</view>
					</view>
				</view>
				<!-- 模板信息 -->
				<view class="margin-top cu-list menu">
					<view class="cu-item " v-for="(items, key, index) in customerData.project_template" :key="index">
						<view class="content text-sm">
							<text class="">{{ key }}</text>
						</view>
						<view class="action"><view class="lg " v-html="items"></view></view>
					</view>
				</view>

				<view class="margin-xs margin-top">
					<view class="bg-white radius">
						<template v-if="customerData.resistance_point">
							<view class="padding-xs">抗性点</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="disabled" v-model="customerData.resistance_point"></textarea>
							</view>
						</template>
						<template v-if="customerData.agree_point">
							<view class="padding-xs">认同点</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="disabled" v-model="customerData.agree_point"></textarea>
							</view>
						</template>
						<template v-if="customerData.suggest_point">
							<view class="padding-xs">突破建议</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="disabled" v-model="customerData.suggest_point"></textarea>
							</view>
						</template>
						<template v-if="customerData.attribution">
							<view class="padding-xs">客户归属</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="disabled" v-model="customerData.attribution"></textarea>
							</view>
						</template>
						<template v-if="customerData.transaction_point">
							<view class="padding-xs">成交重点</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="customerData.transaction_point"></textarea>
							</view>
						</template>
						<template v-if="customerData.tips">
							<view class="padding-xs">备注信息</view>
							<view class="cu-form-group border radius margin-sm">
								<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="customerData.tips"></textarea>
							</view>
						</template>
					</view>
				</view>

				<view v-if="customerData.photo.length != 0" class="cu-bar bg-white ">
					<view class="action">到访照片</view>
					<view class="action">{{ customerData.photo.length }}</view>
				</view>
				<view class="cu-form-group" v-if="customerData.photo.length != 0">
					<view class="grid col-4 grid-square flex-sub">
						<view
							class="bg-img"
							style="border: 1upx solid #eee;"
							v-for="(item, index) in customerData.photo"
							:key="index"
							@tap="ViewImage"
							:data-url="customerData.photo[index]"
						>
							<image :src="customerData.photo[index]" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 跟进记录 -->
		<view class="bg-white padding-bottom-xxxl" v-if="TabCur == 1">
			<view class="bg-white padding" v-if="customerData.record_status == 1">
				<button class="cu-btn block line-blue lg round border-blue text-blue bg-white " @click="addRecord">
					<text class="lg text-blue cuIcon-edit padding-right"></text>
					添加跟进记录
				</button>
			</view>
			<!-- 时间线 -->
			<timelineItem  v-for="(item, index) in recordList" :key="index" color="rgb(77,151,255)">
				<view class="tripItem">
					<view class="text-15 text-bold">
						<text>{{ item.c_time }}</text>
						<text class="padding-left-sm">{{ item.u_name }}</text>
						<text
							class="padding-left-sm text-blue"
							:class="{
								'cuIcon-weixin': item.visit_type == '聊天软件拜访',
								'cuIcon-mobilefill': item.visit_type == '电话拜访',
								'cuIcon-emoji': item.visit_type == '当面拜访'
							}"
						></text>
					</view>
					<view class="padding-top-sm flex ">
						<view class="text-gray uni-cell-20 text-right">跟进方式</view>
						<view class="uni-cell-70 padding-left-sm">{{ item.visit_type }}</view>
					</view>
					<view class="padding-top-sm flex " v-show="item.content">
						<view class="text-gray uni-cell-20 text-right">跟进内容</view>
						<view class="uni-cell-70 padding-left-sm">{{ item.content }}</view>
					</view>
					<view class="content">
						<view v-show="item.resistance_point" class="padding-top-sm flex "> 
							<view class="text-gray uni-cell-20 text-right">抗性点</view>
							<view class="uni-cell-70 padding-left-sm">{{ item.resistance_point }}</view>
						</view>
						<view v-show="item.agree_point" class="padding-top-sm flex">
							<view class="text-gray uni-cell-20 text-right">认同点</view>
							<view class="uni-cell-70 padding-left-sm">{{ item.agree_point }}</view>
						</view>
						<view v-show="item.suggest_point" class="padding-top-sm flex">
							<view class="text-gray uni-cell-20 text-right">突破性建议</view>
							<view class="uni-cell-70 padding-left-sm">{{ item.suggest_point }}</view>
						</view>
						<view v-show="item.transaction_point" class="padding-top-sm flex">
							<view class="text-gray uni-cell-20 text-right">成交重点</view>
							<view class="uni-cell-70 padding-left-sm">{{ item.transaction_point }}</view>
						</view>
						<view v-show="item.guest" class="padding-top-sm flex">
							<view class="text-gray uni-cell-20 text-right">经理盘客</view>
							<view class="text-blue uni-cell-70 padding-left-sm" >{{ item.guest }}</view>
						</view>
						<view v-for="(it, key, i) in item.extend" class="padding-top-sm flex" :key="i">
							<view class="text-gray uni-cell-20 text-right">{{ key }} </view>
							<view class=" uni-cell-70 padding-left-sm ">{{ it }}</view>
						</view>
						<view v-if="item.img_str.length != 0" class="padding-top-sm ">
							<view class="uni-cell-20 text-right">
								<text class="text-gray">跟进图片</text>
							</view>
							
							<view class="grid col-4 grid-square flex-sub padding-top-sm padding-left-sm">
								<view class="bg-img" v-for="(ite, index) in item.img_str" :key="index" @tap="ViewImages(item.img_str, index)" :data-url="item.img_str[index]">
									<image :src="item.img_str[index]" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</timelineItem>
		</view>
		<!-- 添加跟进记录 -->
		<view class=" padding-bottom-xxxl " v-if="TabCur == 2">
			<view class="cu-form-group padding-top-sm">
				<view class="title">
					跟进方式
					<text class="text-red">*</text>
				</view>
				<picker @change="PickerChange" :value="visit_type" :range="recordType">
					<view class="picker">{{ recordType[visit_type] }}</view>
				</picker>
			</view>
			<view class="cu-form-group"  id="cTime">
				<view class="title">
					跟进时间
					<text class="text-red">*</text>
				</view>
				<view class="text-right" @click="showTimes">
					<text v-if="cTime">{{ cTime }}</text>
					<text class="text-grey" v-else>请选择跟进准确时间</text>
					<text class="cuIcon-right  text-grey" style="font-size: 16px;"></text>
				</view>
			</view>
			<!-- 项目模板 -->
			<template>
				<uni-collapse ref="add" class="warp ">
					<uni-collapse-item
						v-for="(p, key, pindex) in PtemplateList"
						@changeSelect="changeSelect"
						:id="key"
						:pindex="pindex"
						:showIcon="PtemplateList.length == 0 ?true: pindex == 0?true:false"
						:key="pindex"
						:open="p.length == 0?false:true"
						:show-animation="showAnimation"
						:title="projects[pindex].p_name"
					>
					
						<view class="bg-white radius padding-top-sm padding-bottom">
							<view v-for="(items, index) in p" :key="index">
								<view class="padding-xs padding-left" :id="items.key">
									{{ items.name }}
									<text class="text-red" v-if="items.empty == 2">*</text>
								</view>
								<view class="flex flex-wrap">
									<view
										class="cu-btn radius line-gray margin-sm"
										v-for="(item, index) in items.list"
										@click="chooseTemp(item, index, items)"
										style="width: 23%;padding: 0;margin:6rpx;"
										:key="index"
										:class="item.active ? 'bg-blue text-white' : 'bg-grey'"
									>
										{{ item.name }}
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</template>
			 <!-- 集团模板 -->
			<template>
				<view class="bg-white  padding-bottom"  v-for="(items, index) in JttemplateList" :class="index == 0?'padding-top-sm margin-top-sm':''" :key="index + '1'">
					<view class="padding-xs padding-left" :id="items.key">
						{{ items.name }}
						<text class="text-red" v-if="items.empty == 2">*</text>
					</view>
					<view class="flex flex-wrap">
						<view
							class="cu-btn radius line-gray margin-sm"
							v-for="(item, index) in items.list"
							@click="chooseTemp(item, index, items)"
							style="width: 23%;padding: 0;margin:6rpx;"
							:key="index + '2'"
							:class="item.active ? 'bg-blue text-white' : 'bg-grey'"
							:style="items.inputname == 'jt_reason' ? 'width: 100%' : ''"
						>
							{{ item.name }}
						</view>
					</view>
				</view>

				<view class="bg-white radius margin-top margin-bottom padding-bottom-sm">
					<view class="padding-xs padding-left">抗性点</view>
					<view class="cu-form-group border radius margin-sm " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.resistance_point" placeholder="请输入抗性点"></textarea>
					</view>
					<view class="padding-xs padding-left">认同点</view>
					<view class="cu-form-group border radius margin-sm " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.agree_point" placeholder="请输入认同点"></textarea>
					</view>
					<view class="padding-xs padding-left">突破建议</view>
					<view class="cu-form-group border radius margin-sm " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.suggest_point" placeholder="请输入突破建议"></textarea>
					</view>
					<view class="padding-xs padding-left" id="attribution">
						客户归属
						<text class="text-red">*</text>
					</view>
					<view class="cu-form-group border radius margin-sm " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.attribution" placeholder="请输入客户归属"></textarea>
					</view>
					<view class="padding-xs padding-left">成交重点</view>
					<view class="cu-form-group border radius margin-sm " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.transaction_point" placeholder="请输入成交重点"></textarea>
					</view>

					<view class="padding-xs padding-left ">跟进内容</view>
					<view class="cu-form-group border radius margin-sm margin-bottom " style="margin-top: 0px;">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.content" placeholder="请输入跟进内容"></textarea>
					</view>
				</view>
			</template>
			 <!-- 跟进图片 -->
			<template>
				<view class="cu-bar bg-white padding-top-sm">
					<view class="action">跟进图片</view>
					<view class="action">{{ imgList.length }}/3</view>
				</view>
				<view class="cu-form-group padding-bottom-xxl">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImages(imgList, index)" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 3"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
				<view class="bg-white padding-top-xl">
					<view class="bg-white padding savebottom" style="background-color: #FFFFFF;">
						<button class="cu-btn round block bg-blue margin-tb-sm lg" :disabled="disableds" @click="sub">确认添加</button>
					</view>
				</view>
			</template>
			
		</view>
		<w-picker mode="time" @confirm="onConfirm" ref="dateTime" themeColor="#4D97FF"></w-picker>
		<share-person ref="sharePersons" :shareStr="customerData.share_str" :sharePerson="groupSaleData" @onShare="onShares"></share-person>

		<view class="foot" v-if="TabCur != 2">
			<button class="cu-btn block round bg-blue" v-if="customerData.edit_status == 1 && customerData.buy_status == 2" @click="addOrder">创建订单</button>
			<button class="cu-btn block round bg-white border-blue text-blue" @click="dealOrder">成交管理</button>
		</view>
	</view>
</template>

<script>
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
import qiniuUploader from '@/common/qiniuUploader.js';

import timeline from '@/components/chenbin-timeline/timeLine.vue';
import timelineItem from '@/components/chenbin-timeline/timelineItem.vue';
export default {
	components: {
		uniCollapse,
		uniCollapseItem,
		wPicker,
		timeline,
		timelineItem
	},
	data() {
		return {
			showAnimation: true,
			open: true,
			showShareMask: false,
			listData: [
				{
					type: false,
					subName: '',
					content: ''
				}
			],
			id: '',
			modalName: null,
			customerData: '',
			TabCur: 0,
			tabSelects: ['基本资料', '客户跟进'],
			imgList: [],
			recordList: [], //跟进记录
			recordType: ['当面拜访', '电话拜访', '聊天软件拜访', '其他'], //1-当面拜访,2-电话拜访,3-聊天软件拜访,4-其他
			formData: {
				visit_type: 0, //拜访方式( 1-当面拜访,2-电话拜访,3-聊天软件拜访,4-其他)
				c_time: 0,
				resistance_point: '',
				agree_point: '',
				suggest_point: '',
				attribution: '',
				transaction_point: '',
				tel: '',
				content: '' ,//跟进内容
				base_project_template:'',//集团模板
				list_project_template:'',//项目模板
				guest:'',//经理盘客
				is_invite:'',//是否邀约(1-邀约，2-未邀约)
				invite_time:'',//邀约时间
				pid:''
			},
			cTime: '',
			PtemplateList: '', //录入客户模板
			JttemplateList: '', //跟进集团模板
			imgList: [],
			qiniuDatas: '',
			visit_type: 0,
			groupSaleData: '',
			shareDatas: '',
			share_ids: '',
			disabled: true,
			disableds: false,
			changetype: 0,
			projects: '', //客户可跟进项目
			showIcon: false,
			checkProject: []
		};
	},

	onBackPress(e) {
		// console.log('监听返回');
	},
	onLoad(option) {
		this.id = option.id;
		this.getCustomerInfo();
		this.getQiniuToken();
		this.recordapiGetProject();
	},

	computed: {
		nowDay() {
			let date = new Date();
			return date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
		},
		nowTime() {
			let date = new Date();
			const Y = date.getFullYear() + '-';
			const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			return Y + M + D;
		}
	},
	methods: {
		//是否选择了 项目进行添加跟进记录
		changeSelect(e) {
			this.projects.map(res => {
				if (res.pid == e.id) {
					res.check = e.showIcon;
				}
			});
		},

		//获取客户可跟进项目
		async recordapiGetProject() {
			let recordapProject = await this.$api.RecordapiGetProject({ custom_id: this.id });
			this.projects = [];
			if(recordapProject.data){
				recordapProject.data.map( resp =>{
					resp.check = true
					this.projects.push(resp)
				})
			}
			let keyValue = {};
			for (let i = 0; i < this.projects.length; i++) {
				let key = this.projects[i].pid;
				let template = await this.getPTemplate(key);
				keyValue[key] = template;
			}
			this.PtemplateList = keyValue;
		},
		changeTypeMedia(type) {
			this.changetype = type;
			this.TabCur = type;
		},
		dealOrder() {
			uni.navigateTo({
				url: '/pages/customer/deal_customer/deal_customer?cuid=' + this.id
			});
		},
		addOrder() {
			uni.navigateTo({
				url: '/pages/customer/add_customer_order/add_customer_order?cid=' + this.id
			});
		},
		onShares(data) {
			this.$refs.sharePersons.close();
			let ids = [];
			let names = [];
			if (data) {
				data.forEach(res => {
					ids.push(res.u_id);
					names.push(res.u_name);
				});
			}
			this.customerData.share_name = this.$tools.toStrings(names);
			this.share_ids = this.$tools.toStrings(ids);
			this.setShare();
		},
		update() {
			this.$store.commit('setCustomerInfo', this.customerData);
			uni.redirectTo({
				url: '/pages/customer/customer_update?id=' + this.id
			});
		},
		setShare() {
			if (this.shareDatas) {
				this.$api.SetSharecustomapi({ id: this.id, share_str: this.share_ids }, res => {
					if (res.code == 1000) {
						this.getCustomerInfo();
						this.showShareMask = !this.showShareMask;
					}
				});
			}
		},

		stop() {},
		showShare() {
			if (this.customerData.edit_status == 1) {
				if (this.groupSaleData) {
					this.$refs.sharePersons.open();
				} else {
					uni.showToast({
						icon: 'none',
						title: '此项目无共享人'
					});
				}
			}
		},
		PickerChange(e) {
			this.visit_type = e.detail.value;
		},
		getQiniuToken() {
			uni.showLoading({
				title: '正在获取数据...'
			});
			this.$api.qiniuTokencustomapi({}, res => {
				this.qiniuDatas = res;
			});
		},
		ViewImages(item, index) {
			uni.previewImage({
				urls: item,
				current: index
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e) {
			uni.showModal({
				title: '提示',
				content: '确定删除？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},
		ChooseImage() {
			uni.chooseImage({
				count: 3, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths);
					} else {
						this.imgList = res.tempFilePaths;
					}
				}
			});
		},
		chooseTemp(item, index, items) {
			item.index = index;
			//0 select 单选  1 check-box  复选 2 radio单选
			if (items.type == 1) {
				item.active = !item.active;
			} else {
				items.list.forEach(res => {
					res.active = false;
				});
				item.active = !item.active;
			}
			this.$forceUpdate();
		},
		onConfirm(res) {
			//时间选择
			this.cTime = this.nowTime + ' ' + res.result;
			this.formData.c_time = this.cTime;
		},
		showTimes() {
			this.$refs.dateTime.show();
		},
		//跟进集团模板
		getJtTemplate() {
			let data = {
				pid: 0,
				type: 2 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetprojecttemplatecustomapi(data).then(res => {
				this.JttemplateList = [];
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
						idIndex: 0,
						inputname: res.data[var1].inputname,
						empty: res.data[var1].empty, ////是否必选（1-非必选，2-必选）
						type: res.data[var1].type, //0 select 单选  1 check-box  复选 2 radio单选
						enable: res.data[var1].enable //是否启用（1-启用，2-禁用）
					};
					res.data[var1].option_data.forEach(res => {
						let datas = {
							name: res,
							active: false
						};
						temp.list.push(datas);
					});
					this.JttemplateList.push(temp);
				}
			});
		},
		async getPTemplate(pid) {
			let data = {
				pid: pid,
				type: 2 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			let PtemplateList = [];
			await this.$api.customGetprojecttemplatecustomapi(data).then(res => {
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
						idIndex: 0,
						empty: res.data[var1].empty, ////是否必选（1-非必选，2-必选）
						type: res.data[var1].type, //0 select 单选  1 check-box  复选 2 radio单选
						enable: res.data[var1].enable //是否启用（1-启用，2-禁用）
					};

					res.data[var1].option_data.forEach(res => {
						let datas = {
							name: res,
							active: false
						};
						temp.list.push(datas);
					});
					PtemplateList.push(temp);
				}
			});
			return PtemplateList;
		},
		showHeadImg(img) {
			let imgs = [];
			imgs.push(img);
			uni.previewImage({
				urls: imgs,
				current: 0
			});
		},
		call(tel) {
			if (tel) {
				let tels = this.$tools.isPhone(tel);
				if (tels) {
					uni.showModal({
						content: '是否拨打电话？',
						success(e) {
							if (e.confirm) {
								uni.makePhoneCall({
									phoneNumber: tel
								});
							}
						}
					});
				}
			}
		},
		changeColl(e) {
		},
		cName(names) {
			if (names.length > 2) {
				let m = names.length;
				return names.substring(m - 2, m);
			} else {
				return names;
			}
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		},
		getCustomerInfo() {
			let data = {
				id: this.id
			};
			this.$api.getInfocustomapi(data, res => {
				this.customerData = res.data;
				this.getJtTemplate();
				this.getGroupsale();
			});
			this.getRecordapi();
		},
		getGroupsale() {
			this.$api.GetGroupsalecustomapi({ pid: this.customerData.pid }).then(res => {
				if (res.code == 1000) {
					this.groupSaleData = res.data;
					this.$store.commit('setGroupSaleData', this.groupSaleData);
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.customerData.photo,
				current: e.currentTarget.dataset.url
			});
		},
		//客户跟进记录
		getRecordapi() {
			let data = {
				id: this.id
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.indexRecordapi(data, res => {
				if (res.code == 1000) {
					this.recordList = res.data.data;
					
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		addRecord() {
			this.TabCur = 2;
		},
		//确认添加 跟进记录
		async sub() {
			this.formData.id = this.customerData.id;
			this.formData.tel = this.customerData.ctel;
			if (!this.formData.c_time) {
				uni.showToast({
					icon: 'none',
					title: '请选择跟进时间'
				});
				document.getElementById('cTime').scrollIntoView(true);
				return;
			}
			this.formData.visit_type = this.visit_type + 1;

			let pro = [];
			let cids =[];
			for (let p in this.projects) {
				if (this.projects[p].check == true) {
					pro.push(this.projects[p].pid);
					cids.push(this.projects[p].id);
				}
			}
			this.formData.cid = cids;
			if (pro.length == 0) {
				uni.showToast({
					icon: 'none',
					title: '必须选择一个项目'
				});
				return;
			}
			//项目模板
			let ptObj = {};
			if (this.PtemplateList) {
				for (let p in this.PtemplateList) {
					let templateList = this.PtemplateList[p];
					let pobj = {};
					for (let pt in pro) {
						if (pro[pt] == p) {
							for (let var1 in templateList) {
								let keyValue = {};
								let key = templateList[var1].key;
								keyValue[key] = [];
								if (templateList[var1].list) {
									templateList[var1].list.forEach(resp => {
										if (resp.active == true) {
											keyValue[key].push(resp.index);
										}
									});
								}
								if (keyValue[key].length == 0 && templateList[var1].empty == 2) {
									uni.showToast({
										icon: 'none',
										title: templateList[var1].name + '必须选择'
									});
									document.getElementById(templateList[var1].key).scrollIntoView(true);
									return;
								}
								pobj[key] = keyValue[key];
							}
							ptObj[p] = pobj;
						}
					}
				}
			}
			this.formData.list_project_template = ptObj;

			// 集团模板
			let obj = {};
			for (let var1 in this.JttemplateList) {
				let keyValue = {};
				let key = this.JttemplateList[var1].key;
				keyValue[key] = [];
				this.JttemplateList[var1].list.forEach(resp => {
					if (resp.active == true) {
						keyValue[key].push(resp.index);
					}
				});
				if (keyValue[key].length == 0 && this.JttemplateList[var1].empty == 2) {
					uni.showToast({
						icon: 'none',
						title: this.JttemplateList[var1].name + '必须选择'
					});
					document.getElementById(this.JttemplateList[var1].key).scrollIntoView(true);
					return;
				}
				obj[key] = keyValue[key];
			}
			this.formData.base_project_template = obj;


			if(!this.formData.attribution){
				uni.showToast({
					icon: 'none',
					title: '客户归属必填'
				});
				document.getElementById('attribution').scrollIntoView(true);
				return;
			}
			
			this.disableds = true;
			uni.showLoading({
				title: '正在上传数据...'
			});
			this.formData.image = []; //七牛云图片名
			if (this.imgList.length !== 0) {
				for (let var1 in this.imgList) {
					//图片压缩
					let c_url = await this.$tools.compressPic(this.imgList[var1]);
					//图片上传至七牛云
					try {
						let photo = await this.$api.uploadQiniuImage(this.qiniuDatas, c_url, '/record/');

						if (photo == 'error') {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '图片上传失败，请重新选择图片'
							});
							this.disableds = false;
							return;
						} else {
							this.formData.image.push(photo);
						}
					} catch {
						uni.hideLoading();
						this.disabled = false;
					}
				}
			}
			this.$api.AddRecordapi(this.formData, res => {
				this.disableds = false;
				if (res.code == 1000) {
					this.TabCur = 1;
					this.getRecordapi();
					this.formData.image = '';
					this.cTime = '';
					this.formData = {
						visit_type: 0,
						c_time: 0,
						resistance_point: '',
						agree_point: '',
						suggest_point: '',
						attribution: '',
						transaction_point: '',
						base_project_template:'',
						list_project_template:'',
						pid:''
					};
					// this.getPTemplate();
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
	.uni-textarea-placeholder{
		color: rgb(204, 204, 204);;
	}
.tripItem {
	background-color: rgb(249, 249, 249);
	padding: 40rpx 30rpx 20rpx;
	margin-top: 10rpx;
	font-size: 14px;
}
.content {
	// padding: 15px;
	font-size: 14px;
	line-height: 20px;
	// background-color: #f9f9f9;
	color: #666;
}
.video-and-pic {
	z-index: 99;
	width: 100%;
	line-height: 60rpx;
	text-align: center;
	color: rgb(77, 151, 255);
	display: flex;
	justify-content: center;
	padding-bottom: 20rpx;
	.changebox {
		height: 60rpx;
		width: 278rpx;
		line-height: 62rpx;
		background: rgba(77, 151, 255, 0.15);
		border-radius: 50px;
		font-size: 26rpx;
		.video {
			width: 140rpx;
			text-align: center;
		}
		.pic {
			width: 140rpx;
			text-align: center;
		}
		.activebox {
			background: rgb(77, 151, 255);
			border-radius: 50rpx;
			color: #ffffff;
		}
	}
}

.cu-list.menu > .cu-item {
	min-height: 70rpx;
}

.cu-list.menu > .cu-item:after {
	border: none;
}
.right-btn-deal {
	border-radius: 50%;
	position: fixed;
	right: 10px;
	bottom: 260px;
	text-align: center;
	background: #007aff;
	color: #ffffff;
	height: 60px;
	width: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.right-btn {
	border-radius: 50%;
	position: fixed;
	right: 10px;
	bottom: 180px;
	text-align: center;
	background: #007aff;
	color: #ffffff;
	height: 60px;
	width: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.show-template {
	z-index: 998;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	position: fixed;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	.show-template-log {
		height: 80%;
		width: 85%;
		border-radius: 5px;
		background: #ffffff;
		color: #333333;
		font-size: 12px;
		z-index: 999;
		padding: 10px;
		overflow: auto;
		overflow-y: auto;
		padding-bottom: 50px;
	}
	.show-btn {
		position: absolute;
		bottom: 12%;
		flex: 1;
		justify-content: center;
		align-items: center;
		width: 80%;
		button {
			width: 30%;
			background: #007aff;
			color: #ffffff;
			height: 30px;
			line-height: 30px;
		}
	}
}
.foot {
	height: 140rpx;
	position: fixed;
	width: 100%;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	bottom: 0;
	left: 0;
	padding: 24rpx;
	button {
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		margin-left: 10rpx;
	}
}
.bg-grey {
	background-color: rgb(255, 255, 255);
	color: rgb(195, 195, 195);
	border: 1rpx solid rgb(195, 195, 195);
}
.border {
	background-color: rgb(249, 249, 249);
}
.savebottom {
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
}
</style>
