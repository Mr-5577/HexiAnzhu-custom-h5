<template>
	<view class="" v-if="customerData">
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar round lg bg-blue text-white" v-if="customerData.head_photo">
					<image @click.stop="showHeadImg(customerData.head_photo)" :src="customerData.head_photo" mode="aspectFit" class="cu-avatar lg round"></image>
				</view>
				<view class="cu-avatar round lg bg-blue text-white " v-else>
					<text class="text-df">{{ cName(customerData.cname) }}</text>
				</view>
				<view class="content">
					<view class="text-grey">
						<view class="text-cut">{{ customerData.cname }}</view>
						<view class="cu-tag line-blue radius sm" v-if="customerData.status != 3">
							<text v-if="customerData.status == 1">已认购</text>
							<text v-if="customerData.status == 2" class="line-red">未成交</text>
						</view>
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							<text class="text-bage text-xs">{{ customerData.ctel }}</text>
						</view>
					</view>
				</view>
				<view>
					<view class="text-grey text-right">
						<text class="text-xxl text-blue cuIcon-emoji" v-show="customerData.loop_type == 2"></text>
						<text class="text-xxl text-green cuIcon-weixin padding-sm" v-show="customerData.loop_type == 3"></text>
					</view>
					<view class="text-gray text-xs text-right " style="line-height: 40upx;">跟进{{ recordList.length }}次</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-x class="bg-white nav margin-top">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in tabSelects" :key="index" @tap="tabSelect" :data-id="index">
					<text v-show="index == 0">{{ item }}</text>
					<text v-show="index == 1">{{ item }}({{ recordList.length }})</text>
				</view>
			</view>
		</scroll-view>
		<view class="" v-if="TabCur == 0">
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
				<view class="cu-item" @tap="call(customerData.ctels)">
					<view class="content text-sm"><text class="">备用电话</text></view>
					<view class="action flex">
						<text class="text-blue">{{ customerData.ctels }}</text>
						<view class="lg text-blue cuIcon-mobilefill"></view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text class="">首次到访</text></view>
					<view class="action">
						<view class="lg ">{{ customerData.ctimestr }}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content text-sm"><text class="">录入系统</text></view>
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
				<view class="cu-item">
					<view class="content text-sm"><text class="">共享人</text></view>
					<view class="action">
						<view class="lg ">{{ customerData.share_name }}</view>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">到访照片</view>
					<view class="action">{{ customerData.photo.length }}</view>
				</view>
				<view class="cu-form-group">
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
		<view class="" v-if="TabCur == 1">
			<view class="cu-timeline">
				<view
					class="cu-item text-blue  "
					v-for="(item, index) in recordList"
					:key="index"
					:class="{
						'cuIcon-weixin': item.visit_type == '聊天软件拜访',
						'cuIcon-mobilefill': item.visit_type == '电话拜访',
						'cuIcon-emoji': item.visit_type == '当面拜访'
					}"
				>
					<view class="content bg-white shadow-blur">
						<view class="">{{ item.c_time }} {{ item.u_name }}</view>
						<view class="">跟进方式： <text class="text-gray"> {{ item.visit_type }}  </text> </view>
						<view class="" v-show="item.content">跟进结果： <text class="text-gray">{{ item.content }} </text> </view>
						<uni-collapse ref="add" class="warp" @change="change">
							<uni-collapse-item>
								<template>
									<view class="content">
										<view v-show="item.resistance_point">抗性点： <text class="text-gray">{{ item.resistance_point }}</text> </view>
										<view v-show="item.agree_point">认同点：<text class="text-gray">{{ item.agree_point }} </text> </view>
										<view v-show="item.suggest_point">突破性建议：<text class="text-gray">{{ item.suggest_point }} </text> </view>
										<view v-show="item.transaction_point">成交重点： <text class="text-gray">{{ item.transaction_point }}</text> </view>
										<view v-show="item.guest">
											经理盘客：
											<text class="text-blue">{{ item.guest }}</text>
										</view>
										<view v-for="(it, key, i) in item.extend" :key="i">{{ key }} ：  <text class="text-gray">{{ it }} </text> </view>
										<view v-show="item.img_str != []">
											跟进图片：
											<view class="grid col-4 grid-square flex-sub">
												<view class="bg-img" v-for="(ite, index) in item.img_str" :key="index" @tap="ViewImages(item.img_str,index)" :data-url="item.img_str[index]">
													<image :src="item.img_str[index]" mode="aspectFill"></image>
												</view>
											</view>
										</view>
									</view>
								</template>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</view>
				<view class="text-center padding margin-top" v-if="recordList.length == 0">暂无跟进记录~~</view>
			</view>

			<view class="right-btn" @click="addRecord">
				<view class="text-xxl text-white cuIcon-writefill"></view>
			</view>
		</view>
		<view  v-if="TabCur == 2">
			<view class="cu-form-group margin-top-sm">
				<view class="title">
					跟进方式
					<text class="text-red">*</text>
				</view>
				<picker @change="PickerChange" :value="formData.visit_type" :range="recordType">
					<view class="picker">{{ recordType[formData.visit_type] }}</view>
				</picker>
			</view>
			<view class="cu-form-group" style="border-bottom: 1upx solid #eee;">
				<view class="title">
					跟进时间
					<text class="text-red">*</text>
				</view>
				<input placeholder="请选择首访准确时间" name="input" class="text-right" v-model="cTime" @click="showTimes" />
			</view>
			<template>
					<view class="bg-white radius">
						<view class="" v-for="(items, index) in PtemplateList" :key="index">
							<view class="padding-xs padding-left">
								{{ items.name }}
								<text class="text-red" v-if="items.empty == 2">*</text>
							</view>
							<view class="flex flex-wrap">
								<view
									class="cu-btn radius line-gray margin-sm"
									v-for="(item, index) in items.list"
									@click="chooseTemp(item, index, items)"
									:key="index"
									:class="{ 'bg-blue text-white': item.active }">
									{{ item.name }}
								</view>
							</view>
						</view>
						
					</view>
			</template>
			<template >
				<view class="bg-white radius">
					<view class="padding-xs padding-left">抗性点</view>
					<view class="cu-form-group border radius margin-sm">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.resistance_point" placeholder="请输入抗性点"></textarea>
					</view>
					<view class="padding-xs padding-left">认同点</view>
					<view class="cu-form-group border radius margin-sm">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.agree_point" placeholder="请输入认同点"></textarea>
					</view>
					<view class="padding-xs padding-left">突破建议</view>
					<view class="cu-form-group border radius margin-sm">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.suggest_point" placeholder="请输入突破建议"></textarea>
					</view>
					<view class="padding-xs padding-left">客户归属</view>
					<view class="cu-form-group border radius margin-sm">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.attribution" placeholder="请输入客户归属"></textarea>
					</view>
					<view class="padding-xs padding-left">成交重点</view>
					<view class="cu-form-group border radius margin-sm">
						<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.transaction_point" placeholder="请输入成交重点"></textarea>
					</view>
				</view>
			</template>
			<template>
				<view class="cu-bar bg-white margin-top">
					<view class="action">跟进图片</view>
					<view class="action">{{ imgList.length }}/3</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 3"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
			</template>
			<view class="margin"><button class="cu-btn block bg-blue margin-tb-sm lg" @click="sub">提交保存</button></view>
		</view>
		<w-picker mode="dateTime" @confirm="onConfirm" ref="dateTime" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
import qiniuUploader from '@/common/qiniuUploader.js';
export default {
	data() {
		return {
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
			recordList: [] ,//跟进记录
			recordType:['当面拜访','电话拜访','聊天软件拜访','其他'], //1-当面拜访,2-电话拜访,3-聊天软件拜访,4-其他
			formData:{
			    visit_type:0,
				c_time:0,
				resistance_point:'',
				agree_point:'',
				suggest_point:'',
				attribution:'',
				transaction_point:'',
				extend:''
			},
			cTime:'',
			PtemplateList:'',//录入客户模板
			imgList: [],
			qiniuDatas:'',
			visit_type:0
		};
	},
	components: {
		uniCollapse,
		uniCollapseItem,
		wPicker
	},
	onLoad(option) {
		this.id = option.id;
		// this.id = '259496';
		this.getCustomerInfo();
		this.getQiniuToken();
	},
	computed:{
		nowDay() {
			let date = new Date();
			return date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
		}
	},
	methods: {
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
		ViewImages(item,index){
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
			this.cTime = res.result;
			this.formData.c_time = this.$tools.timeToTimeStamp(res.result);
		},
		showTimes() {
			this.$refs.dateTime.show();
		},
		getPTemplate() {
			let data = {
				pid: this.customerData.pid,
				type: 2 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetprojecttemplatecustomapi(data, res => {
				this.PtemplateList = [];
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
						idIndex:0,
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
					this.PtemplateList.push(temp);
				}
			});
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
				let tels =  this.$tools.isPhone(tel);
				if(tels){
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
		change(e) {
			//console.log(e)
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
				console.log("res: " + JSON.stringify(res));
				this.getPTemplate();
			});
			this.getRecordapi();
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
				this.recordList = res.data.data;
			});
		},
		addRecord() {
			this.TabCur = 2;
		},
		imageUploads() {
			let _this = this;
			return new Promise(resolve => {
				let keys = [];
				let token = this.qiniuDatas.token;
				let domain = this.qiniuDatas.http_domain;
				let bucket = this.qiniuDatas.bucket;
				_this.imgList.forEach(filePath => {
					let key = 'sunest-' + this.nowDay + '-' + new Date().getTime() + '.jpg';
					keys.push(key);
					qiniuUploader.upload(
						filePath,
						res => {
							// console.log('ressss: ' + JSON.stringify(res));
						},
						error => {
							// resolve(error)
						},
						{
							region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
							domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
							uptoken: token // 由其他程序生成七牛 uptoken
						},
						res => {
							if (res.progress === 100) {
								resolve(keys);
							}
						}
					);
				});
			});
		},
		async sub() {
			
			this.formData.extend = [];
			this.formData.id = this.customerData.id;
			if (!this.formData.c_time) {
				uni.showToast({
					icon: 'none',
					title: '请选择跟进时间'
				});
				return;
			}
			this.formData.visit_type = this.visit_type  + 1;
			let obj = {};
			for (let var1 in this.PtemplateList) {
				let keyValue = {};
				let key = this.PtemplateList[var1].key;
				keyValue[key] = [];
				this.PtemplateList[var1].list.forEach(resp => {
					if (resp.active == true) {
						keyValue[key].push(resp.index);
					}
				});
				if (keyValue[key].length == 0 && this.PtemplateList[var1].empty == 2) {
					uni.showToast({
						icon: 'none',
						title: this.PtemplateList[var1].name + '必须选择'
					});
					return;
				}
				obj[key] = keyValue[key];
			}
		
			this.formData.extend = obj;
			uni.showLoading({
				title: '正在上传数据...'
			});
			this.formData.image = ''; //七牛云图片名
			if (this.imgList.length !== 0) {
				try {
					this.formData.image = await this.imageUploads();
				} catch (e) {
					//TODO handle the exception
				}
			}
			this.$api.AddRecordapi(this.formData, res => {
				if(res.code == 1000){
					this.TabCur = 1;
					this.getRecordapi();
				}else{
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				}
			});
		},
	}
};
</script>

<style lang="less" scoped>
.right-btn {
	border-radius: 50%;
	position: fixed;
	right: 20upx;
	bottom: 260upx;
	text-align: center;
	background: #007aff;
	color: #ffffff;
	height: 100upx;
	width: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
