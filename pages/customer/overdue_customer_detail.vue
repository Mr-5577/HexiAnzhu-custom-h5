<template>
	<view class="uni-flex-center">
		<view class="uni-content" v-if="customerData">
			<li-step title="成交信息"></li-step>
			<view class="margin-top border">
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">项目名称：</text>
					<text class="uni-cell-60">{{customerData.pactData.p_name}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">房间号码：</text>
					<text class="uni-cell-60">{{customerData.pactData.roomnum}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">客户名称：</text>
					<text class="uni-cell-60">{{customerData.pactData.cname}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">建筑面积：</text>
					<text class="uni-cell-60">{{customerData.pactData.buildareas}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">联系电话：</text>
					<text class="uni-cell-60">{{customerData.pactData.ctel}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm" v-if="customerData.pactData.ctels">
					<text class="uni-cell-40">备用电话：</text>
					<text class="uni-cell-60">{{customerData.pactData.ctels}}</text>
				</view>
				
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">身份证：</text>
					<text class="uni-cell-60">{{customerData.pactData.cidcard}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">成交总价：</text>
					<text class="uni-cell-60">{{ nToLocalString(customerData.pactData.allmoney) }}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">成交时间：</text>
					<text class="uni-cell-60">{{customerData.pactData.dtime}}</text>
				</view>
				<view class="flex justify-between padding-sm border-bottom text-sm">
					<text class="uni-cell-40">置业顾问：</text>
					<text class="uni-cell-60">{{customerData.pactData.u_name}}</text>
				</view>
			</view>
			<!-- //付款信息"payData": -->
			<view class="margin-top"><li-step title="付款信息"></li-step></view>
			<view class="margin-top">
				<t-table @change="change" :borderColor="borderColor">
					<t-tr>
						<t-th>付款事项</t-th>
						<t-th>付款金额</t-th>
						<t-th>付款日期</t-th>
					</t-tr>
					
					<t-tr v-for="item in customerData.payData" :key="item.id">
						<t-td>{{ item.moneyreason }}</t-td>
						<t-td>{{  nToLocalString(item.allmoney)}}</t-td>
						<t-td>{{ item.mtime.substr(0,10) }}</t-td>
					</t-tr>
				</t-table>
				<view class="text-right padding-xs" style="padding-right: 9%;" v-if="customerData.payData.length != 0">
					合计付款：￥{{ nToLocalString(allPayMoney)}}
				</view>
			</view>
			
			<!-- //逾期"paymentData": [], -->
			<view class=""><li-step title="逾期信息"></li-step></view>
			<view class="margin-top">
				<t-table @change="change" :borderColor="borderColor">
					<t-tr>
						<t-th>逾期类型</t-th>
						<t-th>应付应办</t-th>
						<t-th>逾期天数</t-th>
					</t-tr>
					<t-tr v-for="item in customerData.overdueData" :key="item.id">
						<t-td>{{ item.type }}</t-td>
						<t-td v-if="item.type == '网签' || item.type == '银行签字'">{{ item.appointed_time }}</t-td>
						<t-td v-else>{{  nToLocalString(item.money) }}</t-td>
						<t-td > <text class="text-red text-df">{{ item.overday }}</text> </t-td>
					</t-tr>
				</t-table>
			</view>
			<!-- //催收记录"dunData": [] -->
			<view class="margin-top"><li-step title="催收记录"></li-step></view>
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
		</view>
		<view v-if="customerData.power == 1" class="right-btn" @click="addDunData">
			<view>
				<view>添加</view>
				<view>催办</view>
			</view>
		</view>
		<view class="uni-common-mark uni-flex-center" v-if="showDun" @click="showDun=false" >
			<view class=" uni-font-size24 test" @tap.stop="stop">
				<textarea placeholder="请填写催办记录" maxlength="-1" v-model="dunDatas.dun_reason"></textarea>
				<button @click="addDunning">确定添加</button>
			</view>
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
			showDun:false,
			tableList1:[],
			borderColor:'#fff',
			tableList: [],
			customerData:'',
			dunDatas:{
				dun_time:'',
				dun_reason:'',
				pactid:'',
				ptid:'',
				pid:''
			}
		};
	},
	onLoad(option) {
		this.crp_id = option.crp_id;
		this.dunDatas.ptid = option.ptid;
		this.dunDatas.pactid = this.crp_id;
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
				// console.log(values);
			}
		}
	},
	methods:{
		nToLocalString(nums){
			return this.$tools.numberToLocalString(nums);
		},
		stop(){},
		getDetail(){
			uni.showLoading({
				title:'正在加载数据...'
			})
			this.$api.getOverdueinfocustomapi({crp_id:this.crp_id},res =>{
				this.customerData = res.data;
				this.dunDatas.pid = this.customerData.pactData.pid;
			})
		},
		addDunData(){
			this.showDun = true;
		},
		addDunning(){
			this.dunDatas.dun_time = this.$tools.timestampToTime(new Date().getTime());
			this.$api.DunNingcustomapi(this.dunDatas,res =>{
				if(res.code == 1000){
					this.showDun = false;
					this.getDetail();
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
page{
	background: #FFFFFF;
}
.uni-common-mark {
	position: fixed;
	z-index: 999;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	.title {
		text-align: center;
		line-height: 100upx;
		font-size: 32upx;
	}
	.test {
		background: #FFFFFF;
		padding:10px;
		border-radius: 5px;
	}
	.uni-common-mark-close {
		text-align: center;
		font-size: 22upx;
		border-radius: 50%;
		border: 1upx solid #ffffff;
		width: 40upx;
		color: #ffffff;
		margin-top: 40upx;
	}
}
.content{
	background-color: #FFFFFF;
}
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
