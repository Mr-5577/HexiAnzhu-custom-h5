<template>
	<view>
		<view class="margin-xs">
			<view class="padding-xs">客户基本信息(集团模板)</view>
			
			<view class="cu-form-group" id="cname">
				<view class="title">
					客户姓名
					<text class="text-red">*</text>
				</view>
				<input placeholder="客户姓名" v-model="formData.cname" name="input" />
			</view>
			<view class="cu-form-group" id="ctel">
				<view class="title">
					联系电话
					<text class="text-red">*</text>
				</view>
				<input placeholder="联系电话" :disabled="formData.ctel?true:false" @blur="verifyTel(1)" v-model="formData.ctel" maxlength="11" type="text" name="input" />
			</view>
			<view class="cu-form-group" id="ctels">
				<view class="title">备用电话</view>
				<input placeholder="备用电话" disabled="true" @input="verifyTels2" @blur="verifyTel(2)" v-model="formData.ctels" maxlength="11" type="text" name="input" />
			</view>
			<view class="cu-form-group" id="idcard">
				<view class="title">身份证号</view>
				<input placeholder="请输入身份证号(选填)" v-model="formData.idcard" name="input" />
			</view>

			<view class="cu-form-group">
				<view class="title">家庭住址</view>
				<input placeholder="请输入家庭住址(选填)" v-model="formData.address" name="input" />
			</view>
		</view>
		<!-- 集团模板 -->
		<view class="margin-xs">
			<view class="bg-white radius">
				<view class="" v-for="(items, index) in JttemplateList" :key="index">
					<view class="padding-xs padding-top" :id="items.key">
						{{ items.name }}
						<text class="text-red" v-if="items.empty == 2">*</text>
					</view>
					<view class="flex flex-wrap">
						<view
							class="cu-btn radius line-gray margin-xs"
							style="width: 23%;padding: 0;margin:6rpx;"
							v-for="(item, index) in items.list"
							@click="chooseTemp(item, index, items)"
							:key="index"
							:class="item.active?'bg-blue text-white':'bg-grey'"
							:style="items.inputname == 'jt_reason'?'width: 100%':''"
						>
							{{ item.name }}
						</view>
					</view>
				</view>
				<view class="text-center padding" v-if="templateList.length == 0">请先选择项目</view>
			</view>
		</view>
		<!-- 项目模板 -->
		<view class="margin-xs">
			<view class="padding-xs">客户收集信息(项目模板)</view>
			<view class="bg-white radius">
				<view class="" v-for="(items, index) in templateList" :key="index">
					<view class="padding-xs padding-top" :id="items.key">
						{{ items.name }}
						<text class="text-red" v-if="items.empty == 2">*</text>
					</view>
					<view class="flex flex-wrap">
						<view
							class="cu-btn radius line-gray margin-xs"
							style="width: 23%;padding: 0;margin:6rpx;"
							v-for="(item, index) in items.list"
							@click="chooseTemp(item, index, items)"
							:key="index"
							:class="item.active?'bg-blue text-white':'bg-grey'"
						>
							{{ item.name }}
						</view>
					</view>
				</view>
				<view class="text-center padding" v-if="templateList.length == 0">请先选择项目</view>
			</view>
		</view>

		<view class="margin-xs">
			<view class="padding-xs">客户意向信息</view>
			<view class="bg-white radius">
				<view class="padding-xs">抗性点</view>
				<view class="cu-form-group border radius margin-sm ">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.resistance_point" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="padding-xs">认同点</view>
				<view class="cu-form-group border radius margin-sm ">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.agree_point" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="padding-xs">突破建议</view>
				<view class="cu-form-group border radius margin-sm ">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.suggest_point" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="padding-xs">客户归属</view>
				<view class="cu-form-group border radius margin-sm ">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.attribution" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="padding-xs">成交重点</view>
				<view class="cu-form-group border radius margin-sm ">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.transaction_point" placeholder="多行文本输入框"></textarea>
				</view>
			</view>
		</view>
		<view class="margin-xs">
			<view class="padding-xs">客户到访信息</view>
			<view class="bg-white radius">
				<view class="cu-form-group" id="firstTime">
					<view class="title">
						首访时间
						<text class="text-red">*</text>
					</view>
					<view class="" v-if="chooseCtime">
						<view class="">
							<text>{{ firstTime }}</text>
						</view>
					</view>
					<view class="" v-else @click="showTimes">
						<text v-if="firstTime">{{ firstTime }}</text>
						<text v-else>请选择首访准确时间</text>
					</view>
				</view>
				<view class="cu-form-group " @click="showShare">
					<view class="title">共享人</view>
					<view class="picker">{{ sharePersons }} ></view>
				</view>
				<view class="cu-bar bg-white margin-top">
					<view class="action">到访照片</view>
					<view class="action">{{ formData.photo.length + imgList.length }}/9</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in formData.photo" :key="index" @tap="ViewImageP" :data-url="formData.photo[index]">
							<image :src="formData.http_domain + formData.photo[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImgs" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="bg-img" v-for="(item, indexs) in imgList" :key="indexs + '1'" @tap="ViewImage" :data-url="imgList[indexs]">
							<image :src="imgList[indexs]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="indexs"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 9"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="margin savebottom"><button class="cu-btn block bg-blue round margin-bottom-xxl lg round" @click="sub" :disabled="disableds">提交保存</button></view>
		<li-choose ref="lichoose" :showCustomer="showCustomer" @confirm="confirms" :isSingle="isSingle"></li-choose>
		<share-person ref="sharePersons" :shareStr="formData.share_str" :sharePerson="groupSaleData" @onShare="onShares"></share-person>
		<w-picker mode="time" @confirm="onConfirm" ref="dateTime" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
import liChoose from '@/components/li-choose/li-choose.vue';
import sharePerson from '@/components/share-person/share-person.vue';
import qiniuUploader from '@/common/qiniuUploader.js';
import wPicker from '@/components/w-picker/w-picker.vue';
export default {
	data() {
		return {
			mode: false,
			index: -1,
			customerSource: ['自然到访', '渠道', '分销', '老带新', '电转访', '自拓', '其他'], //1-自然到访，2-渠道，3-分销，4-老带新，5-电转访，6-自拓，7-其他
			customerGender: [],
			customerAge: [],
			customerHouseType: [],
			customerBuyHousePurpose: [],
			modalName: null,
			imgList: [],
			pid: '', //项目id
			showCustomer: false,
			isSingle: true, //选择项目是否是单选
			p_name: '请选择项目', //选择项目
			templateList: [],
			activeIndex: 0,
			sharePersonData: [], //置业顾问
			sharePersons: '请选择共享人',
			qiniuDatas: '', //七牛云token
			formData: {
				pid: '',
				project_template: '', //模板
				source_type: 0, //客户来源（1-自然到访，2-渠道）
				visit_type: '', //到访情况 (1:面谈，2：非面谈)
				cname: '', //客户姓名
				ctel: '', //电话
				ctimestr: '', //首访时间戳
				ctels: '', //备用手机号
				idcard: '', //身份证号码
				address: '', //联系地址
				tips: '', //备注信息
				resistance_point: '', //抗性点
				agree_point: '', //	否	string	认同点
				suggest_point: '', //	否	string	突破建议
				transaction_point: '', //	否	string	成交重点
				attribution: '', //	否	string	客户归属
				focus_project: '', //	否	string	关注项目
				share_str: '', //	否	string	分享人
				photo: '', //	否	array	客户照片
				tmp_id: '' //否	string	关联人脸信息id
			},
			firstTime: '',
			JttemplateList: [],
			groupSaleData: '',
			disableds: false,
			disabledPathway: false, //是否可以选择到访方式
			chooseCtime: false //是否可以选择首访时间
		};
	},
	components: {
		liChoose,
		sharePerson,
		wPicker
	},
	onLoad(option) {
		if (option.id) {
			this.cid = option.id;
			this.getUpdateInfo();
		}
		this.getBigareacustomapi();
		this.getQiniuToken();
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
		//输入完成验证备用手机号
		async verifyTels2(e) {
			if (e.detail.value.length == 11) {
				this.formData.ctels = e.detail.value;
				if (this.formData.ctels) {
					if (this.formData.ctels.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入11位的手机号'
						});
						document.getElementById('ctels').scrollIntoView(true);
						return;
					}
					if (this.formData.ctel != this.formData.ctels) {
						let verTel = {
							pid: this.formData.pid,
							tel: this.formData.ctels,
							id: ''
						};
						let verData = await this.$api.TelVerifycustomapi(verTel);
						if (verData.code != 1000) {
							uni.showToast({
								icon: 'none',
								title: verData.msg
							});
							document.getElementById('ctels').scrollIntoView(true);
							return;
						}
					}
				}
			}
		},
		//失去焦点验证手机号
		async verifyTel(type) {
			if (type == 1) {
				if (this.formData.ctel.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					document.getElementById('ctel').scrollIntoView(true);
					return;
				}
				let verTel = {
					pid: this.formData.pid,
					tel: this.formData.ctel,
					id: ''
				};
				let verData = await this.$api.TelVerifycustomapi(verTel);
				if (verData.code != 1000) {
					uni.showToast({
						icon: 'none',
						title: verData.msg
					});
					document.getElementById('ctel').scrollIntoView(true);
					return;
				}
			}
			// 验证备用手机号
			if (type == 2) {
				if (this.formData.ctels) {
					if (this.formData.ctels.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入11位的手机号'
						});
						document.getElementById('ctels').scrollIntoView(true);
						return;
					}
					if (this.formData.ctel != this.formData.ctels) {
						let verTel = {
							pid: this.formData.pid,
							tel: this.formData.ctels,
							id: ''
						};
						let verData = await this.$api.TelVerifycustomapi(verTel);
						if (verData.code != 1000) {
							uni.showToast({
								icon: 'none',
								title: verData.msg
							});
							document.getElementById('ctels').scrollIntoView(true);
							return;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '手机号和备用手机号不能相同'
						});
						document.getElementById('ctels').scrollIntoView(true);
						return;
					}
				}
			}
		},
		getUpdateInfo() {
			let data = {
				id: this.cid
			};
			this.$api.GetCustominfocustomapi(data, res => {
				if (res.code == 1000) {
					this.formData = res.data;
					this.pid = this.formData.pid;
					//判断是否可以选择到访时间
					if (this.formData.ctimestr != 0) {
						this.chooseCtime = true;
						this.firstTime = this.$tools.timestampToTime(this.formData.ctimestr);
						this.formData.ctimestr = this.firstTime;
					}
					this.getGroupsale();
					this.getTemplate();
					this.getJtTemplate();
				}
			});
		},
		//获取项目模板
		getJtTemplate() {
			let data = {
				pid: 0,
				type: 1 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetprojecttemplatecustomapi(data).then( res => {
				this.JttemplateList = [];
				let pt = this.formData.project_template;
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
						idIndex: 0,
						inputname:res.data[var1].inputname,
						empty: res.data[var1].empty, ////是否必选（1-非必选，2-必选）
						type: res.data[var1].type, //0 select 单选  1 check-box  复选 2 radio单选
						enable: res.data[var1].enable //是否启用（1-启用，2-禁用）
					};
					res.data[var1].option_data.forEach((res, index) => {
						let datas = {
							name: res,
							active: false
						};
						for (let var2 in pt) {
							if (var1 == var2) {
								pt[var2].forEach(res => {
									if (index == res) {
										datas.active = true;
									}
								});
							}
						}
						temp.list.push(datas);
					});
					this.JttemplateList.push(temp);
					//判断是否可以选择到访方式
					this.JttemplateList.forEach(resp => {
						if (resp.key == 'jt_pathway') {
							for (let var1 in resp.list) {
								let res = resp.list[var1];
								if (res.active == true) {
									this.disabledPathway = true;
									return;
								}
							}
						}
					});
				}
			});
		},
		inputTel(e) {
			this.$tools.isPhone(e.detail.value);
		},
		inputIdcard(e) {
			this.$tools.isIdCard(e.detail.value);
		},
		//根据权限获取大区和大区下的项目
		getBigareacustomapi() {
			uni.showLoading({
				title: '正在获取数据...'
			});
			this.$api.customGetbigareacustomapi({}, res => {
				res.data.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = false;
					});
				});
				this.$store.commit('setSearchPro', res.data);
			});
		},
		showTimes() {
			this.$refs.dateTime.show();
		},
		onConfirm(res) {
			//时间选择
			this.firstTime = this.nowTime + ' ' + res.result;
			this.formData.ctimestr = this.firstTime;
		},
		chooseProject() {
			this.$refs.lichoose.show();
		},
		confirms(res) {
			if (res.p_name) {
				this.pid = res.pid[0];
				this.formData.pid = this.pid;
				this.p_name = res.p_name;
				this.getGroupsale();
				this.getTemplate();
			}
		},
		//共享人
		getGroupsale() {
			this.$api.GetGroupsalecustomapi({ pid: this.pid }).then(res => {
				var uname = [];
				if (res.code == 1000) {
					this.groupSaleData = res.data;
					for (let var1 in this.groupSaleData) {
						this.groupSaleData[var1].forEach(resp => {
							if (this.formData.share_str) {
								var share_str = this.formData.share_str.split(',');
								share_str.forEach(res => {
									if (res == resp.u_id) {
										uname.push(resp.u_name);
									}
								});
							}
						});
					}
					this.sharePersons = this.$tools.toStrings(uname);
					this.$store.commit('setGroupSaleData', this.groupSaleData);
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		PickerChange(e) {
			this.formData.source_type = e.detail.value;
		},
		PickerChangeGender(e) {
			let id = e.target.id;
			let index = e.detail.value;
			this.JttemplateList.forEach(res => {
				if (res.key == id) {
					res.idIndex = index;
				}
			});
		},

		//客户年龄
		PickerChangeAge(e) {},
		//意向房型
		PickerChangeHouse(e) {},
		//置业目的
		PickerChangeBuyHousePurpose(e) {},
		textareaAInput(e) {
			this.textareaAValue = e.detail.value;
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		ViewImageP(e) {
			let urls = [];
			this.formData.photo.forEach(res => {
				urls.push(this.formData.http_domain + res);
			});
			uni.previewImage({
				urls: urls,
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
		DelImgs(e) {
			uni.showModal({
				title: '提示',
				content: '确定删除？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.formData.photo.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},

		ChooseImage() {
			uni.chooseImage({
				count: 9, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					uni.na;
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths);
					} else {
						this.imgList = res.tempFilePaths;
					}
				}
			});
		},

		//获取项目模板
		getTemplate() {
			let data = {
				pid: this.pid,
				type: 1 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			this.$api.customGetprojecttemplatecustomapi(data).then(res => {
				this.templateList = [];
				let pt = this.formData.project_template;
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
						empty: res.data[var1].empty, ////是否必选（1-非必选，2-必选）
						type: res.data[var1].type, //0 select 单选  1 check-box  复选 2 radio单选
						enable: res.data[var1].enable //是否启用（1-启用，2-禁用）
					};
					res.data[var1].option_data.forEach((res, index) => {
						let datas = {
							name: res,
							active: false
						};
						for (let var2 in pt) {
							if (var1 == var2) {
								pt[var2].forEach(res => {
									if (index == res) {
										datas.active = true;
									}
								});
							}
						}
						temp.list.push(datas);
					});
					this.templateList.push(temp);
				}
			});
		},
		chooseTemp(item, index, items) {
			if (items.key == 'jt_pathway' && this.disabledPathway == true) {
				uni.showToast({
					icon: 'none',
					title: '到访方式不能修改！'
				});
				return;
			} else {
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
			}
		},
		async sub() {
			let _this = this;
			if (!this.formData.pid) {
				uni.showToast({
					icon: 'none',
					title: '请选择项目'
				});
				document.getElementById('project').scrollIntoView(true);
				return;
			}
			if (!this.formData.cname) {
				uni.showToast({
					icon: 'none',
					title: '请输入客户姓名'
				});
				document.getElementById('cname').scrollIntoView(true);
				return;
			}
			if (!this.formData.ctel) {
				uni.showToast({
					icon: 'none',
					title: '请输入客户联系方式'
				});
				document.getElementById('ctel').scrollIntoView(true);
				return;
			}
			if (this.formData.ctel.length != 11) {
				uni.showToast({
					icon: 'none',
					title: '请输入11位的手机号'
				});
				document.getElementById('ctel').scrollIntoView(true);
				return;
			}
			// if (this.formData.idcard) {
			// 	if (!this.$tools.isIdCard(this.formData.idcard)) {
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '请输入正确的身份证号码'
			// 		});
			// 		document.getElementById('idcard').scrollIntoView(true);
			// 		return;
			// 	}
			// }
			this.formData.project_template = [];
			if (!this.templateList) {
				uni.showToast({
					icon: 'none',
					title: '请先选择项目模板'
				});
				return;
			}

			let obj = {};

			for (let var1 in this.JttemplateList) {
				let keyValue = {};
				let key = this.JttemplateList[var1].key;
				keyValue[key] = [];
				this.JttemplateList[var1].list.forEach((resp, index) => {
					if (resp.active == true) {
						keyValue[key].push(index);
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

			for (let var1 in this.templateList) {
				let keyValue = {};
				let key = this.templateList[var1].key;
				keyValue[key] = [];
				this.templateList[var1].list.forEach((resp, index) => {
					if (resp.active == true) {
						keyValue[key].push(index);
					}
				});
				if (keyValue[key].length == 0 && this.templateList[var1].empty == 2) {
					uni.showToast({
						icon: 'none',
						title: this.templateList[var1].name + '必须选择'
					});
					document.getElementById(this.templateList[var1].key).scrollIntoView(true);
					return;
				}
				obj[key] = keyValue[key];
			}
			this.formData.project_template = obj;
			if (!this.formData.ctimestr) {
				uni.showToast({
					icon: 'none',
					title: '请选择客户来访时间'
				});
				document.getElementById('firstTime').scrollIntoView(true);
				return;
			}
			//验证手机号和备用手机号不能重复
			if (this.formData.ctels) {
				if (this.formData.ctels == this.formData.ctel) {
					uni.showToast({
						icon: 'none',
						title: '手机号和备用手机号不能重复'
					});
					return;
				}
			}
			//验证手机号是否存在
			let verTel = {
				pid: this.formData.pid,
				tel: this.formData.ctel,
				id: this.formData.id
			};

			let verData = await this.$api.TelVerifycustomapi(verTel);
			if (verData.code != 1000) {
				uni.showToast({
					icon: 'none',
					title: verData.msg
				});
				document.getElementById('ctel').scrollIntoView(true);
				return;
			}
			//验证备用手机号是否存在
			if (this.formData.ctels) {
				if (this.formData.ctels != this.formData.ctel) {
					let verTel = {
						pid: this.formData.pid,
						tel: this.formData.ctels,
						id: this.formData.id
					};
					let verData = await this.$api.TelVerifycustomapi(verTel);
					if (verData.code != 1000) {
						uni.showToast({
							icon: 'none',
							title: verData.msg
						});
						document.getElementById('ctels').scrollIntoView(true);
						return;
					}
				}
			}
			uni.showLoading({
				title: '正在上传数据...'
			});
			this.disableds = true;
			if (this.imgList.length !== 0) {
				let photos = [];
				for (let var1 in this.imgList) {
					//图片压缩
					let c_url = await this.$tools.compressPic(this.imgList[var1]);
					//图片上传至七牛云
					try {
						let photo = await this.$api.uploadQiniuImage(this.qiniuDatas, c_url, '/loop/');

						if (photo == 'error') {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '图片上传失败，请重新选择图片'
							});
							this.disableds = false;
							return;
						} else {
							photos.push(photo);
						}
					} catch {
						uni.hideLoading();
						this.disabled = false;
					}
				}
				if (this.formData.photo.length != 0) {
					this.formData.photo.forEach(res => {
						photos.push(res);
					});
				}
				this.imgList = [];
				this.formData.photo = photos;
			}
			this.$api.EditCustomapi(this.formData, res => {
				this.disableds = false;
				if (res.code == 1000) {
					uni.showToast({
						icon: 'none',
						title: '修改成功'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/customer/customer_detail?id=' + _this.cid
						});
					}, 1000);
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				}
			});
		},
		showShare() {
			if (this.groupSaleData) {
				this.$refs.sharePersons.open();
			} else {
				uni.showToast({
					icon: 'none',
					title: '此项目无共享人'
				});
			}
		},
		getQiniuToken() {
			uni.showLoading({
				title: '正在获取数据...'
			});
			this.$api.qiniuTokencustomapi({}, res => {
				this.qiniuDatas = res;
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
			this.sharePersons = this.$tools.toStrings(names);
			this.formData.share_str = this.$tools.toStrings(ids);
		}
	}
};
</script>

<style lang="less" scoped>
	.bg-grey {
		background-color: rgb(255, 255, 255);
		color: rgb(195, 195, 195);
		border: 1rpx solid rgb(195, 195, 195);
	}
	.border{
		background-color: rgb(249,249,249);
	}
.savebottom {
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
}
</style>
