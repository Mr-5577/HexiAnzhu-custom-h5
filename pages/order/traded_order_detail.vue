<template>
	<view class="bg-white padding-sm">
		<view v-if="customerData">
			<view class="text-bold text-black text-15">成交信息</view>
			<view class="margin-top border radius bg-gray text-13">
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">项目名称</text>
					<text class="uni-cell-60 text-right">{{customerData.info.p_name}}</text>
				</view>
				<view class="flex justify-between padding-sm  " v-if="customerData.info.roomnum">
					<text class="uni-cell-40 text-gray">房间号码</text>
					<text class="uni-cell-60 text-right">{{customerData.info.roomnum}}</text>
				</view>
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">客户名称</text>
					<text class="uni-cell-60 text-right">{{customerData.info.cname}}</text>
				</view>
				<view class="flex justify-between padding-sm  " v-if="customerData.info.buildareas">
					<text class="uni-cell-40 text-gray">建筑面积</text>
					<text class="uni-cell-60 text-right">{{customerData.info.buildareas}}</text>
				</view>
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">联系电话</text>
					<text class="uni-cell-60 text-right">{{customerData.info.ctel}}</text>
				</view>
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">身份证号</text>
					<text class="uni-cell-60 text-right">{{customerData.info.cidcard}}</text>
				</view>
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">成交总价</text>
					<text class="uni-cell-60 text-right" v-show="customerData.info.money">{{ nToLocalString(customerData.info.money) }}</text>
					<text class="uni-cell-60 text-right" v-show="customerData.info.allmoney">{{ nToLocalString(customerData.info.allmoney) }}</text>
				</view>
				
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">成交时间</text>
					<text class="uni-cell-60 text-right">{{customerData.info.ctime}}</text>
				</view>
				<view class="flex justify-between padding-sm  ">
					<text class="uni-cell-40 text-gray">置业顾问</text>
					<text class="uni-cell-60 text-right">{{customerData.info.u_name}}</text>
				</view>
			</view>
			<!-- //付款信息"payData": -->
			<template v-if="customerData.payData && customerData.payData.length != 0">
				<view class="margin-top">
					<view class="text-bold text-black text-15">付款信息</view>
				</view>
				<view class="margin-top bg-gray">
					<t-table @change="change" :borderColor="borderColor">
						<t-tr>
							<t-th>付款事项</t-th>
							<t-th>付款金额</t-th>
							<t-th>付款日期</t-th>
						</t-tr>
						
						<t-tr v-for="item in customerData.payData" :key="item.id">
							<t-td>{{ item.moneyreason }}</t-td>
							<t-td>{{ nToLocalString(item.allmoney)  }}</t-td>
							<t-td>{{ item.mtime.substr(0,10) }}</t-td>
						</t-tr>
					</t-table>
					<view class="text-right padding-xs" style="padding-right: 9%;" v-if="customerData.payData.length != 0">
						合计付款：￥{{ nToLocalString(allPayMoney)}}
					</view>
				</view>
			</template>
			<!-- //逾期"paymentData": [], -->
			<template v-if="customerData.paymentData && customerData.paymentData.length != 0">
				<view class="">
					<view class="text-bold text-black text-15">逾期信息</view>
				</view>
				<view class="margin-top bg-gray">
					<t-table @change="change" :borderColor="borderColor">
						<t-tr>
							<t-th>逾期类型</t-th>
							<t-th>应付应办</t-th>
							<t-th>逾期天数</t-th>
						</t-tr>
						<t-tr v-for="item in customerData.paymentData" :key="item.id">
							<t-td>{{ item.pname }}</t-td>
							<t-td>{{ nToLocalString(item.paymoney) }}</t-td>
							<t-td > <text class="text-red text-df">{{ item.diff_day }}</text> </t-td>
						</t-tr>
					</t-table>
				</view>
			</template>
			<!-- //催收记录"dunData": [] -->
			<template v-if="customerData.dunData && customerData.dunData.length != 0">
				<view class="margin-top">
					<view class="text-bold text-black text-15">催收记录</view>
				</view>
				<view class="margin-top">
					<view class="cu-timeline">
						<view  v-for="(item,index) in customerData.dunData" :key="index" class="cu-item text-orange" :class="{'text-green': index != 0}">
							<view class="content">
								<view>{{item.dun_time}} {{item.u_name}}</view>
								<view class="text-gray">{{item.dun_reason}}</view>
							</view>
						</view>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import liStep from '@/components/li-step/li-step.vue';
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
export default {
	components: {
		liStep,
		tTable,
		tTh,
		tTr,
		tTd
	},
	data() {
		return {
			tableList1:[],
			borderColor:'#fff',
			tableList: [],
			customerData:''
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.type = option.type;
		this.getDetail();
	},
	computed:{
		allPayMoney:{
			get(){
				let  all= 0;
				if(this.customerData.payData){
					this.customerData.payData.forEach(res =>{
					   all =  all+ parseFloat(res.allmoney)
					})
					return all;
				}else{
					return all;
				}
			     
			},
			set(values){
				console.log(values);
			}
		}
	},
	methods:{
		nToLocalString(nums){
			return this.$tools.numberToLocalString(nums);
		},
		getDetail(){
			uni.showLoading({
				title:'正在加载数据...'
			})
			this.$api.Getdealinfobookingapi({type:this.type,id:this.id},res =>{
				this.customerData = res.data;
			})
		}
	}
};
</script>

<style lang="less" scoped>
page{
	background: rgb(255,255,255);;
}
.bg-gray{
	background-color: rgb(250,250,250);
}
</style>
