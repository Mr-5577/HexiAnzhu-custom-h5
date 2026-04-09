<template>
	<view class="li-choose flex justify-center align-center animated "  :class="{ slideInRight: mode == true, slideOutRight: mode == false }" v-if="mode">
		<scroll-view scroll-y="true" class="li-content">
			<template v-if="showCustomer">
				<view class="margin-top-xl">
					<view class=" flex text-black text-bold">客户归属选择</view>
					<view class="flex items-center margin-top border-bottom" style="flex-direction: row;">
						<view class="flex justify-between margin-bottom-sm flex-wrap" style="width: 80%;flex-direction: row;">
							<button
								class="cu-btn line-blue round"
								v-for="(item, index) in btns"
								:class=" index == activeBtn ?'bg-blue text-white':'bg-gray text-gray'"
								@click="chooseBtn(item, index)"
								:key="index"
							>
								{{ item.title }}
							</button>
						</view>
					</view>
				</view>
			</template>

			<view class="margin-top">
				<view class="flex justify-between flex-wrap" style="flex-direction: row;" v-if="isSingle == false">
					<view class="text-black text-bold ">项目选择</view>
					<button class="cu-btn round bg-blue ">
						<text v-if="isAllChooseProject == false" @click="allSelected(1)">全选</text>
						<text v-else @click="allSelected(0)">取消全选</text>
					</button>
				</view>

				<view class="margin-top-sm border-bottom"  v-for="(item, index) in pro" :key="index">
					<view class="flex justify-between flex-wrap" style="flex-direction: row;line-height: 64rpx;height: 64rpx;">
						<view class="text-black text-bold ">{{ item.name }}</view>
						<!-- <template v-if="isSingle == false">
							<radio-group @change="radioChange" >
								<label class="radio" >
									<text v-if="allChooseList(item.project)">全选</text> 
									<text v-else>取消</text>
									<radio  value="1" :checked="allChooseList(item.project)" style="transform:scale(0.7)" />
								</label>
							</radio-group>
						</template> -->
						
						
						<button class="cu-btn  round bg-blue"  v-if="isSingle == false">
							<text v-if="allChooseList(item.project)" @click="all(item.project, 1)">全选</text>
							<text v-else @click="all(item.project, 0)">取消全选</text>
						</button>
					</view>
					<view class="flex flex-wrap margin-bottom-sm margin-top-sm flex-wrap" style="flex-direction: row;">
						<button
							class="cu-btn round margin-xs"
							style="margin: 10rpx;"
							v-for="(items, index) in item.project"
							@click="selected(items)"
							:class="items.isactive?'bg-blue text-white':'bg-gray text-gray'"
							:key="index"
						>
							{{ items.p_name }}
						</button>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class=" flex  foot-btn" style="justify-content: center;flex-direction: row;">
			<view class="flex justify-between padding-sm margin-top" style="flex-direction: row;width: 100%;">
				<button class="cu-btn bg-blue lg round"  @click="sub">确认筛选</button>
				<button class="cu-btn bg-white border-blue lg round text-blue" @click="cancel">取消返回</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name:'lichoose',
	data() {
		return {
			key: '',
			mode: false,
			activeBtn: 0, //默认选择第一个
			searcData: {
				type: '1',
				pid: ''
			},
			isAllChooseProject:false//所有项目是否全选了
		};
	},
	props: {
		showCustomer: {
			type: Boolean,
			default: false
		},
		isSingle: {
			//是否是单选
			type: Boolean,
			default: false
		},
		isAllChoose:{
			//是否 已经全选
			type: Boolean,
			default: false
		}
	},
	
	mounted() {
		//当组件为单选时
		if (this.isSingle == true) {
			if (this.pro) {
				this.pro.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = false;
					});
				});
			}
		}
	},
	watch:{
		
		isAllChoose(newValue,oldValue){
			this.isAllChooseProject = newValue;
			if(this.isAllChooseProject == true){
				this.pro.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = true;
					});
				});
				this.$forceUpdate();
			}
		}
	},
	computed: {
		btns(){
			let activeValue = this.$store.state.defaultActiveCustom;
			let btn=  [{ title: '我负责的', value: '1' }, { title: '共享给我的', value: '2' }, { title: '我管理的', value: '3' }]; //客户归属
			btn.forEach((res,index)=>{
				if(res.value == activeValue){
					this.activeBtn = index;
				}
			})
			return btn;
		},
		pro() {
			let data = this.$store.state.searchPro;
			let defaultProject = this.$store.state.defaultActiveProject;
			if(defaultProject.length != 0){
				data.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = false;
					});
				});
				let allproject = [];
				data.forEach(res => {
					res.project.forEach(resp => {
						allproject.push(resp)
						defaultProject.forEach(dp =>{
							if(resp.p_id == dp.p_id){
								resp.isactive = true;
							}
						})
					});
				});
				// 已经选择的项目和所有项目是否相等
				if(allproject.length == defaultProject.length){
					this.isAllChooseProject =true;
				}else{
					this.isAllChooseProject =false;
				}
			}
			return data;
		},
		allChoose:{
			get(){
				var choose = false;
				var dataTrue = [];
				var num = 0;
				if (this.pro) {
					this.pro.forEach(res => {
						num = num + res.project.length;
						res.project.forEach(resp => {
							if (resp.isactive == false) {
								choose = false;
							} else {
								dataTrue.push(resp);
							}
						});
					});
					if (num != dataTrue.length) {
						choose = true;
						this.isAllChooseProject = true;
					}
				}
				return choose;
			},
			set(e){
				console.log(e);
			}
		}
	},
	methods: {
		radioChange(e){
			console.log("e: " + JSON.stringify(e));
		},
		allChooseList(list) {
			var choose = false;
			var c = [];
			if (list) {
				list.forEach(res => {
					if (res.isactive == false) {
						choose = true;
					} else {
						c.push(res);
					}
				});
				if (c.length == list.length) {
					choose = false;
				}
			}
			return choose;
		},
		chooseBtn(item, index) {
			this.activeBtn = index;
			this.$store.commit('setDefaultActiveCustom',item.value);
			this.searcData.type = item.value;
		},
		//所有楼盘全选
		allSelected(index) {
			if (index == 0) {
				this.pro.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = false;
					});
				});
				this.isAllChooseProject = false;
			}
			if (index == 1) {
				this.pro.forEach(res => {
					res.project.forEach(resp => {
						resp.isactive = true;
					});
				});
				this.isAllChooseProject = true;
			}
			this.$forceUpdate();
		},
		selected(items) {
			//当类型为单选时
			if (this.isSingle == true) {
				if (this.pro) {
					this.pro.forEach(res => {
						res.project.forEach(resp => {
							resp.isactive = false;
						});
					});
				}
				items.isactive = true;
			} else {
				items.isactive = !items.isactive;
			}
			this.$forceUpdate();
		},
		//区域全选
		all(list, index) {
			//0 是取消全选 1 全选
			if (index == 0) {
				list.forEach(res => {
					res.isactive = false;
				});
			}
			if (index == 1) {
				list.forEach(res => {
					res.isactive = true;
				});
			}
			this.$forceUpdate();
		},

		moveHandle() {},
		cancel() {
			this.mode = false;
			uni.showTabBar({})
		},
		show() {
			this.mode = true;
			uni.hideTabBar({})
		},
		sub() {
			this.mode = false;
			uni.showTabBar({});
			let activeValue = this.$store.state.defaultActiveCustom;
			let btn=  [{ title: '我负责的', value: '1' }, { title: '共享给我的', value: '2' }, { title: '我管理的', value: '3' }]; //客户归属
			btn.forEach((res,index)=>{
				if(res.value == activeValue){
					this.activeBtn = index;
					this.$store.commit('setDefaultActiveCustom',res.value);
				}
			})
			let pids = [];
			let projects = [];
			this.pro.forEach(res => {
				res.project.forEach((resp,index) => {
					if (resp.isactive == true) {
						pids.push(resp.p_id);
						let data ={
							id:resp.p_id,
							name:resp.p_name
						}
						projects.push(data);
					}
				});
			});
			this.searcData.pid = pids;
			this.searcData.type = this.$store.state.defaultActiveCustom;
			this.searcData.projects = projects;
			if (this.isSingle == true) {
				let data = {
					pid: pids,
					p_name: projects[0].name,
					type:this.$store.state.defaultActiveCustom
				};
				this.$emit('confirm', data);
			} else {
				this.$emit('confirm', this.searcData);
			}
		}
	}
};
</script>

<style lang="less">
	.radio{
		height: 50rpx;
		line-height: 50rpx;
	}
	.bg-gray{
	    background-color: rgba(235, 235, 235);
	}
.li-choose {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background: #ffffff;
	z-index: 998;
	.li-content {
		width: 96%;
		height: 100%;
		z-index: 999;
		overflow: auto;
		padding-bottom: 200rpx;
	}
}
.foot-btn {
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 999;
	left: 0;
	height: 220rpx;
	background-color: #FFFFFF;
	button{
		width: 340rpx;
		height: 90rpx;
		line-height: 90rpx;
	}
}
.submit-warp {
	position: fixed;
	bottom: var(--window-bottom);
	left: 0;
	right: 0;
	height: 0.5 * 200rpx;
	line-height: 0.5 * 200rpx;
	background: #fff;
}
// ios底部安全距离-padding
.savepadding {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: content-box;
}

// ios底部安全距离-bottom
.savebottom {
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
}

</style>
