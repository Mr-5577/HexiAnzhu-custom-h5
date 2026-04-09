<template>
	<view class="">
		<view class="padding" v-if="showRoom">
			<!-- 客户信息 -->
			<view>
				<view>客户信息</view>
				<form>
					<view class="cu-form-group margin-top">
						<view class="title">客户姓名  <text class="text-red">*</text></view>
						<view class="text-right text-gray">{{customer.cname}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">客户电话  <text class="text-red">*</text></view>
						<view class="text-right text-gray">{{customer.ctel}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">备用电话</view>
						<view class="text-right text-gray">{{customer.ctels}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">身份证号 <text class="text-red">*</text> </view>
						<view class="text-right text-gray">{{customer.idcard}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">家庭住址</view>
						<view class="text-right text-gray">{{customer.address}}</view>
					</view>
				</form>
			</view>
			<view class="margin-top">
				<view>订单类型</view>
				<form>
					<view class="cu-form-group margin-top">
						<view class="title">订单类型</view>
						<picker @change="changeOrderType" :value="orderIndex" :range="orderType" range-key="name">
							<view class="picker">{{ orderType[orderIndex].name}}</view>
						</picker>
					</view>
				</form>
			</view>
			<!-- 房源信息 -->
			<view class="margin-top">
				<view>房源信息</view>
				<form>
					<view class="cu-form-group margin-top">
						<view class="title">选择项目</view>
						<picker :range="project" disabled="true">
							<view class="picker">{{ project[0] }}</view>
						</picker>
					</view>
					<view class="cu-form-group" v-if="area_list.length != 0">
						<view class="title">选择大区</view>
						<picker @change="changeArea" :range="area_list" range-key="name">
							<view class="picker">{{ area_list[areaIndex].name }}</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">选择楼栋</view>
						<picker @change="changeBuilding" :value="buildindex" :range="building_list" range-key="name">
							<view class="picker">{{ building_list[buildindex].name }} 栋</view>
						</picker>
					</view>
					<view class="cu-form-group" @click="showRooms">
						<view class="title">选择房号</view>
						<view>
							<view class="picker flex">
								<view class="flex justify-center align-center">
									<text class="text-gray">{{ roomData.length == 0 ? demo : roomData.roomnum }}</text>
								</view>
								<view class="flex justify-center align-center" style="width: 20px;">
									<text class="text-gray cuIcon-right" style="font-size: 17px; right: 26px;position: absolute;"></text>
								</view>
							</view>
						</view>
					</view>
					<!-- 房号信息数据 -->
					<template v-if="roomData.length != 0">
						<view class="cu-form-group">
							<view class="title">房源类型</view>
							<view class="text-right text-gray">{{roomData.tid_name}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">房源面积</view>
							<view class="text-right text-gray">{{roomData.buildareas}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">房源单价</view>
							<view class="text-right text-gray">{{nToLocalString(roomData.unit_price)}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">房源总价</view>
							<view class="text-right text-gray">{{nToLocalString(roomData.total_price)}}</view>
						</view>
						<!-- // "pay_way": 1,//成交方式 1=以总价成交 2=以单价成交 -->
						<view class="cu-form-group" v-if="roomData.pay_way == 1">
							<view class="title">成交单价</view>
							<input name="input" class="text-right" text="number" placeholder="请输入成交单价" :disabled="roomData.pay_way != 2" v-model="deal_unit_price" />
						</view>
						<view class="cu-form-group" v-else>
							<view class="title">成交单价</view>
							<input name="input" class="text-right" text="number" style="color: #000000;" placeholder="请输入成交单价" :disabled="roomData.pay_way != 2" v-model="unit_price" />
						</view>
						<view class="cu-form-group" v-if="roomData.pay_way == 1">
							<view class="title">成交总价</view>
							<input name="input" class="text-right" text="number" style="color: #000000;" placeholder="请输入成交总价"  :disabled="roomData.pay_way != 1" v-model="total_price"  />
						</view>
						<view class="cu-form-group" v-else>
							<view class="title">成交总价</view>
							<input name="input" class="text-right" text="number" placeholder="请输入成交总价"  :disabled="roomData.pay_way != 1" v-model="deal_total_price"  />
						</view>
						

						<!-- 协议模板 -->
						<view class="margin-top">
							<view>协议模板</view>
							<form>
								<view class="cu-form-group margin-top" style="border-bottom: 1rpx solid #eee;">
									<view class="title">选择模板协议</view>
									<picker @change="changeTemplate" :value="tempIndex" :range="templateList" range-key="title">
										<view class="picker">{{ templateList[tempIndex].title }}</view>
									</picker>
								</view>
								<view class="bg-white  flex justify-center align-center">
									<button type="primary " class="margin-top margin-bottom cu-btn radius line-blue" style="width: 80%;" @click="showModal">
										<text class="lg text-blue cuIcon-text padding-right"></text>
										查看模板协议
									</button>
								</view>
							</form>
						</view>
						<view class="margin-top">
							<view>订单备注</view>
							<view class="margin-top bg-white">
								<textarea value="" class="padding-sm" style="height: 100px;width: 100%;" placeholder="请输入订单备注" v-model="remark" />
							</view>
						</view>
						<!-- 付款信息 -->
						<view class="margin-top">
							<view>付款信息</view>
							<view class="margin-top bg-white">
								<view class="padding-top text-center text-bold">请输入定金金额</view>
								<view class="flex justify-center align-center padding">
									<view class="flex radius" style=" width: 60%;border: 1upx solid #eee; line-height: 80px;height: 80px;">
										<text class="text-bold text-gray text-xxl " style="line-height: 80px;height: 80px;">￥</text>
										<input v-model="dmoney" type="number" class="padding-sm text-xxl" style="line-height: 80px;height: 80px;padding-left: 10px;" />
									</view>
								</view>
							</view>
						</view>
						
						<!-- 确定提交 -->
						<view class="margin-top">
							<button type="primary" class="margin" style="width: 90%;" @click="sub">确定提交</button>
						</view>
					</template>
				</form>
			</view>
		</view>
		<view class="searchRoom" v-else>
			<view class="" style="position: fixed;width: 100%;z-index: 1000;top: 0;">
				<view @click="close" class="bg-white padding-xs"><text class="cu-tag bg-blue radius">关闭</text></view>
				<view class="cu-bar search bg-white">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input  v-model="keyword" @input="search" :adjust-position="false" type="text" placeholder="搜索房号" confirm-type="search" />
					</view>
				</view>
			</view>
			<view class="" style="margin-top: 95px;overflow: auto;">
				<view class="uni-list" v-for="(item, index) in roomList" :key="index" @click="changeRoom(item)">
					<view>{{ item.roomnum }}</view>
				</view>
				<view class="uni-list text-center" v-if="roomCurrentPage < roomLastPage" @click="moreRoom">点击查看更多...</view>
			</view>
		</view>
		<!-- 协议文本 -->
		<view v-if="modalName == 'Modal'" class="show-template" @click="hideModal">
			<view class="show-template-log" @tap.stop="stop">
				<!-- <rich-text :nodes="contents" class="padding"></rich-text> -->
			  <view class="padding" v-html="contents"></view>	
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			demo: '请选择房号',
			showRoom: true,
			customer: {},
			index: 0,
			house: {}, //房源信息
			cuid: '',
			project: [], //项目
			area: [], //大区
			building_list: [{ name: '' }], //楼栋
			orderType:[{name:'认购订单',type:2}],
			orderIndex:0,
			buildindex: 0,
			b_id: '', //楼栋id
			roomList: [],
			roomTotal: 0,
			roomLastPage: 0,
			roomLimit: 0,
			roomCurrentPage: 0,
			roomData: '', //房号信息
			tempIndex: 0,
			templateList: [{ title: '' }],
			contents: '',
			modalName: '',
			dmoney: 0, //认购定金
			total_price:'',
			unit_price:'',
			tid:'',//协议模板id
			page:1,
			keyword:'',
			area_list:[{ name: '' }],//大区
			areaIndex:0,
			aid:'',//大区id
			remark:''
		};
	},
	onLoad(option) {
		let _this = this;
		// this.cuid = '81277';
		// this.cuid = '297257';
		
		// const geturlkey= function(name){
		//     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
		// }
		// this.cuid = geturlkey('cuid')
		
		if(option.cuid){
		   _this.cuid = option.cuid;
		  uni.setStorage({
		      key:'cuid',
		      data: _this.cuid,
		      success () {
		          _this.getBooking();
		      },
			  fail() {
			  	console.log('没存上');
			  }
		  });
		}
		// else{
		// 	uni.getStorage({
		// 	    key:'cuid',
		// 	    success :function(res){
		// 			_this.cuid = res.data;
		// 	        _this.getBooking();
		// 	    },
		// 		fail:function(error){
		// 			console.log(error);
		// 		}
		// 	});
		// }
	},
	computed: {
		deal_total_price: {
			//成交总价
			// getter
			get() {
				if(this.roomData.buildareas == 0){
					return  this.unit_price;
				}else{
					return this.roomData.buildareas * this.unit_price;
				}
			},
			// setter
			set(newValue) {
				// console.log("自动计算成交总价: " + JSON.stringify(newValue));
			}
		},
		deal_unit_price:{
				get() {
					 if(this.roomData.buildareas == 0){
						return  this.total_price
					}else{
						if(this.total_price > 0){
							return  parseFloat(this.total_price) /  parseFloat(this.roomData.buildareas) ;
						}else{
							return 0
						}
					}
				},
				// setter
				set(newValue) {
					// console.log("自动计算成交单价价: " + JSON.stringify(newValue));
				}
		}
	},
	methods: {
		nToLocalString(nums){
			return this.$tools.numberToLocalString(nums);
		},
		stop() {},
		changeArea(e){
			this.areaIndex = e.detail.value;
			this.aid = this.area_list[this.areaIndex].id;
			this.building_list = [{ name: '' }];
			this.getTower();
			
		},
		changeBuilding(e) {
			this.buildindex = e.detail.value;
			this.b_id = this.building_list[this.buildindex].id;
			this.roomData = '';
			this.roomList = [];
			this.getRoom();
		},
		changeOrderType(e){
			this.orderIndex =  e.detail.value;
		},
		changeTemplate(e) {
			this.tempIndex = e.detail.value;
		},
		//获取客户认购信息
		getBooking() {
			let data = {
				cuid: this.cuid
			};
			this.$api.indexBookingapi(data, res => {
				if(res.code == 1000){
					this.customer = res.data.custom_info;
					this.house = res.data.area_info;
					this.project.push(this.house.p_name);
					this.area.push(this.house.a_name);
					this.area_list = res.data.area_list;
					if(this.area_list.length != 0){
						this.aid = this.area_list[this.areaIndex].id;
					}else{
						this.getTower();
					}
					this.$store.commit('setProjectId',this.house.p_id);
				}
				else{
					if(res.code == 1059){
						uni.showToast({
							duration:2000,
							icon:'none',
							title:'该客户不属于你，无法进行操作'
						})
						setTimeout(() =>{
							uni.redirectTo({
								url: '/pages/order/order'
							})
						},2000)
					}
				}
			});
		},
		moreRoom(){
			if(this.roomLastPage > this.roomCurrentPage){
			  this.page = this.roomCurrentPage + 1
			  this.getRoom()
			}
		},
		getRoom() {
			// 获取房号
			this.$api.getRoomsListBookingapi({ b_id: this.b_id,limit:15,page:this.page,keyword:this.keyword}, res => {
				this.roomTotal = res.data.total;
				this.roomLastPage = res.data.last_page;
				this.roomLimit = res.data.per_page;
				this.roomCurrentPage = res.data.current_page;
				res.data.data.forEach(res =>{
					this.roomList.push(res)
				})
			});
		},
		getTemplate() {
			let data = {
				pid: this.house.p_id,
				type: this.roomData.tid
			};
			this.templateList =  [{ title: '' }];
			this.$api.getTempletListBookingapi(data, res => {
				
				if(res.data.length != 0){
					this.templateList = res.data;
				}
			});
		},
		search() {
			this.page = 1;
			this.roomList = [];
			this.getRoom();
		},
		getTower(){
			let data={
				pid:this.house.p_id,
				aid:this.aid
			}
			this.$api.getBuildingListBookingapi(data,res =>{
				if(res.code == 1000 && res.data){
					this.building_list = res.data;
					this.b_id = this.building_list[this.buildindex].id;
					this.roomList = [];
					this.getRoom();
				}
			})
		},
		showRooms() {
			if (this.roomList.length != 0) {
				this.showRoom = !this.showRoom;
			} else {
				uni.showToast({
					icon: 'none',
					title: '此楼栋没有可选房源'
				});
			}
		},
		close(){
			this.showRoom = !this.showRoom;
			this.keyword = '';
			this.getRoom()
		},
		changeRoom(item) {
			this.showRoom = !this.showRoom;
			this.roomData = item;
			this.dmoney = this.roomData.online_lowest_money
			// "pay_way": 1,//成交方式 1=以总价成交 2=以单价成交
			this.getTemplate();
		},
		makeTemplate() {
			let data = {
				tid: this.tid , //是	int	模板id
				crid: this.roomData.id, //是	int	房号id
				cname: this.customer.cname, //是	string	客户姓名
				tel: this.customer.ctel, //是	int	联系电话
				tels: this.customer.ctels, //是	int	备用电话
				idcard: this.customer.idcard, //是	int	身份证号
				address: this.customer.address, //是	int	家庭住址
				dmoney: this.dmoney, //是	int	认购定金
				total_price: 0, //	是	int	成交总价
				unit_price: 0 //成交单价
			};
			
			if(this.roomData.pay_way == 1){
				data.total_price = this.total_price;
				data.unit_price = this.deal_unit_price;
				if(parseFloat(data.total_price) <  parseFloat(this.roomData.total_price) ){
					uni.showToast({
						icon:'none',
						title:'成交总价不能低于房源总价'
					})
					return
				}
			}
			if(this.roomData.pay_way == 2){
				data.total_price = this.deal_total_price;
				data.unit_price = this.unit_price;
				if( parseFloat(data.unit_price) <  parseFloat(this.roomData.unit_price)){
					uni.showToast({
						icon:'none',
						title:'成交单价不能低于房源单价'
					})
					return
				}
			}
			if(!data.total_price){
				uni.showToast({
					icon:'none',
					title:'请先输入成交价格'
				})	
				return
			}
			
			if(!(parseFloat(data.dmoney) >  parseFloat(this.roomData.online_lowest_money) || parseFloat(data.dmoney) == parseFloat(this.roomData.online_lowest_money))){
				uni.showToast({
					icon:'none',
					title:'定金金额不能低于最低价格'
				})	
				return
			}
			if(!(parseFloat(data.dmoney) < parseFloat(data.total_price) || parseFloat(data.dmoney) == parseFloat(data.total_price)) ){
				uni.showToast({
					icon:'none',
					title:'定金金额不能高于成交总价'
				})	
				return
			}
			this.$api.makeAgreementBookingapi(data, res => {
				this.contents = res.data;
				this.modalName = 'Modal';
			});
		},
		showModal(e) {
			this.tid = this.templateList[this.tempIndex].id;
			if(this.tid){
				this.makeTemplate();
				
			}else{
				uni.showToast({
					icon:'none',
					title:'请先选择协议模板'
				})
			}
			
		},
		hideModal(e) {
			this.modalName = null;
		},
		errorToast(code){
			switch (code){
				case 1058:
					uni.showToast({
						icon:'none',
						title:'项目ID不存在'
					})
				break;
				case 1059:
					uni.showToast({
						icon:'none',
						title:'线上售楼部不存在'
					})
				break;
				case 1060:
					uni.showToast({
						icon:'none',
						title:'当前售楼部未开启线上缴费渠道'
					})
				break;
				case 1061:
					uni.showToast({
						icon:'none',
						title:'房源信息不存在或已被售出'
					})
				break;
				case 1062:
					uni.showToast({
						icon:'none',
						title:'当前售楼部未开启线上无预售购买渠道'
					})
				break;
				case 1063:
					uni.showToast({
						icon:'none',
						title:'成交单价/总价底于系统底价，请核对后再提交'
					})
				break;
				case 1064:
					uni.showToast({
						icon:'none',
						title:'请填写认购金额'
					})
				break;
				case 1065:
					uni.showToast({
						icon:'none',
						title:'请选择协议模板'
					})
				break;
				case 1066:
					uni.showToast({
						icon:'none',
						title:'请完善客户资料'
					})
				break;
				case 1067:
					uni.showToast({
						icon:'none',
						title:'订单生成失败，请稍后重试'
					})
				break;
				default:
					break;
			}
		},
		sub(){
			let data ={
				pid:this.house.p_id,//	是	int	项目ID
				roomid:this.roomData.id,//	是	int	房源ID
				type:this.orderType[this.orderIndex].type,//	是	int	交款类型 2-认购，3-排号补款，4-购房款补款
				price:0,//	是	float	成交单价
				roomprice:0,//	是	float	成交总价
				dmoney:this.dmoney,//	是	float	认购金额
				templet_id:this.templateList[this.tempIndex].id,//	是	int	协议模板
				cname: this.customer.cname, //是	string	客户姓名
				ctel: this.customer.ctel, //是	int	联系电话
				ctels: this.customer.ctels, //是	int	备用电话
				idcard: this.customer.idcard, //是	int	身份证号
				address: this.customer.address,
				cuid:this.customer.id,
				remark:this.remark,//订单备注
			}
			// <!-- // "pay_way": 1,//成交方式 1=以总价成交 2=以单价成交 -->
			if(this.roomData.pay_way == 1){
				data.roomprice = this.total_price;
				data.price = parseFloat(this.deal_unit_price);
				if(parseFloat(data.roomprice) <  parseFloat(this.roomData.total_price) ){
					uni.showToast({
						icon:'none',
						title:'成交总价不能低于房源总价'
					})
					return
				}
			}
			if(this.roomData.pay_way == 2){
				data.roomprice = this.deal_total_price;
				data.price = parseFloat(this.unit_price);
				if( parseFloat(data.price) <  parseFloat(this.roomData.unit_price)){
					uni.showToast({
						icon:'none',
						title:'成交单价不能低于房源单价'
					})
					return
				}
			}
			
			if(!data.templet_id){
				uni.showToast({
					icon:'none',
					title:'请先选择协议模板'
				})
				return
			}
			if(!data.price){
				uni.showToast({
					icon:'none',
					title:'请先输入成交单价'
				})
				return
			}
			if(!data.dmoney){
				uni.showToast({
					icon:'none',
					title:'请先输入认购金额'
				})
				return
			}
			if(data.dmoney == 0){
				uni.showToast({
					icon:'none',
					title:'认购金额不能为0元'
				})
				return
			}
			if(!(parseFloat(data.dmoney) >  parseFloat(this.roomData.online_lowest_money) || parseFloat(data.dmoney) == parseFloat(this.roomData.online_lowest_money))){
				uni.showToast({
					icon:'none',
					title:'定金金额不能低于最低价格'
				})	
				return
			}
			if(!(parseFloat(data.dmoney) < parseFloat(data.roomprice)|| parseFloat(data.dmoney) == parseFloat(data.roomprice)) ){
				uni.showToast({
					icon:'none',
					title:'定金金额不能高于成交总价'
				})	
				return
			}
			this.$api.createBookingapi(data,res =>{
				if(res.code == 1000){
					uni.showToast({
						icon:'none',
						title:'认购订单创建成功'
					})
					setTimeout(() =>{
						uni.navigateTo({
							url:'/pages/subscribe/success'
						})
					},1000)
				}else{
					this.errorToast(res.code)
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
.cu-form-group uni-input {
	color: #aaa;
	min-height: 40px;
}
.cu-form-group uni-picker .picker {
	line-height: 40px;
	color: #aaa;
}
.cu-form-group uni-picker::after {
	line-height: 40px;
	color: #aaa;
}
.text-right{
	padding-right: 11px;
}
.searchRoom {
	background: #ffffff;
	.uni-list {
		height: 80upx;
		line-height: 80upx;
		padding-left: 20upx;
		border-bottom: 1upx solid #eee;
	}
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
	}
}
</style>
