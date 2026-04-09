<template>
	<view>
		<view class="padding-xs bg-white">
			<view class="padding-xs text-lg text-bold text-black">客户基本信息(集团模板)</view>
			<view class="cu-form-group margin-top" id="project">
				<view class="title">
					选择项目
					<text class="text-red">*</text>
				</view>
				<view class="picker text-cut text-right" style="width: 60%;" @click="chooseProject">
					{{ p_name }}
					<text class="sm text-gray cuIcon-right" style="padding-left: 16upx;"></text>
				</view>
			</view>
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
				<input placeholder="联系电话" @input="verifyTels1" @blur="verifyTel(1)" v-model="formData.ctel" maxlength="11" type="text" name="input" />
			</view>
			<view class="cu-form-group" id="ctels">
				<view class="title">备用电话</view>
				<input placeholder="备用电话" @input="verifyTels2" @blur="verifyTel(2)" v-model="formData.ctels" maxlength="11" type="text" name="input" />
			</view>
			<view class="cu-form-group" id="idcard">
				<view class="title">身份证号</view>
				<input placeholder="请输入身份证号(选填)" v-model="formData.idcard" name="input" />
			</view>

			<view class="cu-form-group">
				<view class="title">家庭住址</view>
				<input placeholder="请输入家庭住址(选填)" v-model="formData.address" name="input" />
			</view>

			<view class="bg-white radius margin-top-sm padding-bottom">
				<view class="" v-for="(items, indexs) in JttemplateList" :key="indexs">
					<view class="padding-xs text-15 margin-top" :id="items.key">
						{{ items.name }}
						<text class="text-red" v-if="items.empty == 2">*</text>
					</view>
					<view class="cu-list grid col-4">
						<view
							class="cu-btn round radius cu-item"
							style="width: 23%;padding: 0;margin:6rpx;"
							v-for="(its, idxs) in items.list"
							@click="chooseTemp(its, idxs, items)"
							:key="idxs"
							:style="items.inputname == 'jt_reason' ? 'width: 100%' : ''"
							:class="its.active ? 'bg-blue text-white ' : 'bg-grey'"
						>
							{{ its.name }}
						</view>
					</view>
				</view>
				<view class="text-center padding" v-if="list_project_template.length == 0">请先选择项目</view>
			</view>
		</view>
		<view class="padding-xs bg-white margin-top padding-bottom" v-for="(items, key, indexs) in list_project_template" :key="indexs" v-if="items.length != 0">
			<view class="padding-xs text-bold text-lg text-black">客户收集信息( {{ project[key].name }} - 项目模板)</view>
			<view class=" radius">
				<view class="" v-for="(item, index) in items" :key="index">
					<view class="padding-xs text-15 margin-top" :id="item.key">
						{{ item.name }}
						<text class="text-red" v-if="item.empty == 2">*</text>
					</view>
					<view class="flex flex-wrap ">
						<view
							class="cu-btn round radius  "
							style="width: 23%;padding: 0;margin:6rpx;"
							v-for="(it, idx) in item.list"
							@click="chooseTemp(it, idx, item)"
							:key="idx"
							:style="item.inputname == 'noreason' ? 'width: 100%' : ''"
							:class="it.active ? 'bg-blue text-white' : 'bg-grey'"
						>
							{{ it.name }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="margin-xs bg-white margin-top">
			<view class="padding-xs padding-top text-lg text-bold text-black">客户意向信息</view>
			<view class="padding-xs padding-bottom radius">
				<view class=" text-15 margin-top">抗性点</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.resistance_point" placeholder="请输入抗性点"></textarea>
				</view>
				<view class=" text-15 margin-top-lg">认同点</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.agree_point" placeholder="请输入认同点"></textarea>
				</view>
				<view class=" text-15 margin-top-lg">突破建议</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.suggest_point" placeholder="请输入突破建议"></textarea>
				</view>
				<view class=" text-15 margin-top-lg" id="attribution">客户归属</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.attribution" placeholder="请输入客户归属"></textarea>
				</view>
				<view class=" text-15 margin-top-lg">成交重点</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.transaction_point" placeholder="请输入成交重点"></textarea>
				</view>
				<view class=" text-15 margin-top-lg">备注信息</view>
				<view class="cu-form-group border radius  margin-top-xs">
					<textarea maxlength="-1" class="" :disabled="modalName != null" v-model="formData.tips" placeholder="请输入备注信息"></textarea>
				</view>
			</view>
		</view>
		<view class="margin-xs bg-white margin-top">
			<view class="padding-xs text-bold text-lg text-black margin-top padding-top">客户到访信息</view>
			<view class=" radius">
				<view class="cu-form-group" id="firstTime">
					<view class="title">
						首访时间
						<text class="text-red">*</text>
					</view>
					<view class="" @click="ShowTimes">
						<text v-if="firstTime">{{ firstTime }}</text>
						<text v-else>请选择首访准确时间</text>
					</view>
				</view>
				<!-- 设置共享人 -->
				<template>
					<view class="text-bold text-black padding-xs text-15 margin-top">共享人</view>
					<view v-for="(item, key, i) in project" :key="i" class="cu-form-group " @click="showShare(key)">
						<view class="title">{{ item.name }}</view>
						<view class="picker text-cut text-right uni-cell-60">{{ !item.salesName ? '请选择共享人' : item.salesName }} ></view>
					</view>
				</template>

				<view class="cu-bar bg-white margin-top">
					<view class="action text-15">到访照片</view>
					<view class="action">{{ imgList.length }}/9</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 9"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="margin savebottom"><button class="cu-btn block bg-blue margin-bottom-xxl lg round" @click="Sub" :disabled="disabled">提交保存</button></view>
		<li-choose ref="lichoose" :showCustomer="showCustomer" @confirm="Confirms" :isSingle="isSingle"></li-choose>
		<share-person ref="sharePersons" :sharePerson="groupSaleData" @onShare="OnShares"></share-person>
		<w-picker mode="time" @confirm="OnConfirm" ref="dateTime" themeColor="#f00"></w-picker>
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
			isSingle: false, //选择项目是否是单选
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
				tmp_id: '', //否	string	关联人脸信息id
				base_project_template: '', //集团模板
				list_project_template: '' //项目模板
			},
			firstTime: '',
			JttemplateList: [],
			list_project_template: '', //项目模板 (用于循环页面)
			groupSaleData: '',
			disabled: false,
			tmp_standardtime: '',
			customerData: '',
			project: [], //已经选择的项目
			sale_pid: '' //选择共享人的项目id
		};
	},
	components: {
		liChoose,
		sharePerson,
		wPicker
	},
	onLoad(option) {
		if (option.customerData) {
			this.customerData = JSON.parse(option.customerData);
			this.formData.cname = this.customerData.cname;
			this.formData.ctel = this.customerData.ctel;
		}
		if (option.tmp_id) {
			this.formData.tmp_id = option.tmp_id;
		}
		if (option.tmp_standardtime) {
			this.firstTime = option.tmp_standardtime;
			this.formData.ctimestr = this.firstTime;
			this.tmp_standardtime = this.firstTime;
		}
		this.GetUser();
		this.GetBigareacustomapi();
		this.getQiniuToken();
		this.GetJtTemplate();
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
		},
		headBaseName() {
			return this.$store.state.uploadQiNiuName;
		}
	},

	methods: {
		//有效用户
		valid() {
			this.$api.UnallocatedapiValid({ ca_id: this.customerData.ca_id }).then(res => {
				if (res.code == 1000) {
				}
			});
		},
		//验证手机号
		async verifyPhoneNumber(phoneNumber,type){
			if (phoneNumber.length != 11) {
				uni.showToast({
					icon: 'none',
					title: '请输入11位的手机号'
				});
				
				if(type == 1){
					document.getElementById('ctel').scrollIntoView(true);
				}
				if(type == 2){
					document.getElementById('ctels').scrollIntoView(true);
				}
				return false;
			}
			
			if (this.formData.pid.length == 1) {
				let verTel = {
					pid: this.formData.pid[0],
					tel: phoneNumber,
					id: ''
				};
				let verData = await this.$api.TelVerifycustomapi(verTel);
				if (verData.code != 1000) {
					uni.showToast({
						icon: 'none',
						title: verData.msg
					});
					if(type == 1){
						document.getElementById('ctel').scrollIntoView(true);
					}
					if(type == 2){
						document.getElementById('ctels').scrollIntoView(true);
					}
					return false;
				}
			}
			if (this.formData.pid.length > 1) {
				for (let t in this.formData.pid) {
					let verTel = {
						pid: this.formData.pid[t],
						tel: phoneNumber,
						id: ''
					};
					let verData = await this.$api.TelVerifycustomapi(verTel);
					if (verData.code != 1000) {
						uni.showToast({
							icon: 'none',
							title: verData.msg
						});
						document.getElementById('ctel').scrollIntoView(true);
						return false;
					}
				}
			}
		},
		//验证手机号
		async verifyTels1(e) {
			if (e.detail.value.length == 11) {
				this.formData.ctel = e.detail.value;
				let verify =  await this.verifyPhoneNumber(e.detail.value,1);
				if(!verify){
					return
				}
			}
		},
		//验证备用手机号
		async verifyTels2(e) {
			if (e.detail.value.length == 11) {
				this.formData.ctels = e.detail.value;
				let verify =  await this.verifyPhoneNumber(e.detail.value,2);
				if(!verify){
					return
				}
			}
		},
		// 失去焦点 验证手机号
		async verifyTel(type) {
			// 失去焦点 验证手机号
			if (type == 1) {
				this.verifyPhoneNumber(this.formData.ctel,1);
			}
			// 验证备用手机号
			if (type == 2) {
				if (this.formData.ctels) {
					this.verifyPhoneNumber(this.formData.ctels,2);
				}
			}
		},
		//获取用户信息
		async GetUser() {
			await this.$api.Getuserinfobookingapi({}).then(res => {
				if (res.code == 1000) {
					this.formData.pid = [];
					this.p_name = res.data.default_pname;
					this.formData.pid.push(res.data.default_pid);
					let obj = {};
					obj[this.formData.pid] = { name: this.p_name };
					this.project = obj;
					this.$store.commit('setDefaultPid', res.data.default_pid);
					let data = { p_id: res.data.default_pid, p_name: res.data.default_pname, isactive: true };
					let ChooseProject = [];
					ChooseProject.push(data);
					this.$store.commit('setDefaultActiveProject', ChooseProject);
				}
			});
			//获取项目模板
			let keyValue = {};
			let key = this.formData.pid[0];
			let template = await this.GetTemplate(this.formData.pid[0]);
			keyValue[key] = template;
			this.list_project_template = keyValue;
		},
		//获取集团模板
		async GetJtTemplate() {
			let data = {
				pid: 0,
				type: 1 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			await this.$api.customGetprojecttemplatecustomapi(data).then(res => {
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
		InputTel(e) {
			this.$tools.isPhone(e.detail.value);
		},
		InputIdcard(e) {
			this.$tools.isIdCard(e.detail.value);
		},
		//根据权限获取大区和大区下的项目
		GetBigareacustomapi() {
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
		ShowTimes() {
			if (!this.tmp_standardtime) {
				this.$refs.dateTime.show();
			}
		},
		OnConfirm(res) {
			//时间选择
			this.firstTime = this.nowTime + ' ' + res.result;
			this.formData.ctimestr = this.firstTime;
		},
		chooseProject() {
			this.$refs.lichoose.show();
		},
		//选择项目之后
		async Confirms(res) {
			if (res.pid) {
				let obj = {};
				let keyValue = {};
				this.formData.pid = res.pid;
				for (let i = 0; i < res.pid.length; i++) {
					let key = res.pid[i];
					let template = await this.GetTemplate(key);
					keyValue[key] = template;
				}
				this.list_project_template = keyValue;
				if (res.projects.length > 0) {
					let names = [];
					let projectNameObj = {};
					res.projects.forEach(res => {
						names.push(res.name);
						projectNameObj[res.id] = { name: res.name };
					});
					this.project = projectNameObj;

					this.p_name = this.$tools.toStrings(names);
				}
			} else {
				this.GetUser();
			}
		},
		//共享人
		async GetGroupsale(pid) {
			this.sale_pid = pid;
			await this.$api.GetGroupsalecustomapi({ pid: pid }).then(res => {
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
				count: 9, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
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

		//获取项目模板
		async GetTemplate(pid) {
			let data = {
				pid: pid,
				type: 1 //1：录入客户模板；2：跟进客户模板
			};
			uni.showLoading({
				title: '正在加载数据...'
			});
			let templateList = [];
			await this.$api.customGetprojecttemplatecustomapi(data).then(res => {
				for (let var1 in res.data) {
					let temp = {
						name: res.data[var1].title,
						list: [],
						key: var1,
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
					templateList.push(temp);
				}
			});
			return templateList;
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
		async Sub() {
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
			// 集团模板
			let jtObj = {};
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
				jtObj[key] = keyValue[key];
			}
			this.formData.base_project_template = jtObj;
			//项目模板
			let obj = {};
			if (this.list_project_template) {
				for (let p in this.list_project_template) {
					let templateList = this.list_project_template[p];
					let pobj = {};
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
					obj[p] = pobj;
				}
			}
			this.formData.list_project_template = obj;

            // console.log(JSON.stringify(this.formData))
				
			if (!this.formData.ctimestr) {
				uni.showToast({
					icon: 'none',
					title: '请选择客户来访时间'
				});
				document.getElementById('firstTime').scrollIntoView(true);
				return;
			}
			this.disabled = true;
			//验证手机号
			if (this.formData.ctel) {
				if (this.formData.ctel != this.formData.ctels) {
					this.verifyPhoneNumber(this.formData.ctel,1)
					let verify =  await this.verifyPhoneNumber(this.formData.ctel,1);
					if(verify == false){
						this.disabled = false;
						return
					}
				}
			}
			//验证备用手机号
			if (this.formData.ctels) {
				if (this.formData.ctel == this.formData.ctels) {
					uni.showToast({
						icon: 'none',
						title: '手机号和备用手机号不能重复！'
					});
					document.getElementById('ctel').scrollIntoView(true);
					this.disabled = false;
					return;
				}else{
					let verify =  await this.verifyPhoneNumber(this.formData.ctels,2);
					if(verify == false){
						this.disabled = false;
						return
					}
				}
			}
			
			//共享人数据
			let share_str = {};
			for (let p in this.project) {
				if (this.project[p].salesId) {
					share_str[p] = this.project[p].salesId;
				}
			}
			this.formData.share_str = share_str;

			uni.showLoading({
				title: '正在上传数据...'
			});

			this.formData.photo = ''; //七牛云图片名
			if (this.imgList.length !== 0) {
				this.formData.photo = [];
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
							this.disabled = false;
							return;
						} else {
							this.formData.photo.push(photo);
						}
					} catch {
						uni.hideLoading();
						this.disabled = false;
					}
				}
			}
			await this.$api.addCustomapi(this.formData, res => {
				this.disabled = false;
				uni.hideLoading();
				if (res.code == 1000) {
					uni.showToast({
						icon: 'none',
						title: '添加成功',
						duration:2000
					});
					if (this.customerData.ca_id) {
						this.valid();
					}
					_this.formData = {
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
						tmp_id: '', //否	string	关联人脸信息id
						list_project_template: '', //项目
						base_project_template: '' //集团
					};
					_this.list_project_template = '';
					_this.imgList = '';
					_this.firstTime = '';
					_this.sharePersons = '';
					_this.project = '';
					_this.sale_pid = '';
					 this.GetUser();
					 this.GetJtTemplate();
				} else {
					uni.showToast({
						icon: 'none',
						title: res.error_msg[0].msg
					});
				}
			});
			
		},
		async showShare(pid) {
			if (!this.formData.pid) {
				uni.showToast({
					icon: 'none',
					title: '请先选择项目'
				});
				return;
			}
			await this.GetGroupsale(pid);
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

		OnShares(data) {
			this.$refs.sharePersons.close();
			let ids = [];
			let names = [];
			if (data) {
				data.forEach(res => {
					ids.push(res.u_id);
					names.push(res.u_name);
				});
			}
			if (this.sale_pid) {
				this.project[this.sale_pid].salesName = this.$tools.toStrings(names);
				this.project[this.sale_pid].salesId = this.$tools.toStrings(ids);
			}
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="less">
page {
	background-color: rgb(250, 250, 250);
}
// ios底部安全距离-bottom
.cu-form-group {
	padding: 1rpx 10rpx;
}
.bg-grey {
	background-color: rgb(255, 255, 255);
	color: rgb(195, 195, 195);
	border: 1rpx solid rgb(194, 194, 194);
}
.border {
	background-color: rgb(249, 249, 249);
}
.savebottom {
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
	padding-bottom: 100rpx;
}
</style>
