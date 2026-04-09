<template>
	<view class="li-mask" v-if="mode"  @touchmove.stop.prevent="moveHandle">
		<view class="li-mask-content animated slideInUp">
			<view class="flex justify-between padding-sm" style="flex-direction: row;">
				<text class="text-green" @click="cancel">取消</text>
				<text class="text-blue" @click="comfirm">确定</text>
			</view>
			<scroll-view scroll-y="true" class="list">
				<view class="list-cell border-bottom" >
					<checkbox-group class="block" @change="checkboxChange">
						<view class="cu-form-group" style="flex-direction: row;"  v-for="item in items" :key="item.value">
							<checkbox class="round blue" :value="item.value" :class="item.checked ? 'checked' : ''" :checked="item.checked ? true : false" />
							<view class="title" style="padding: 0;">{{ item.name }}</view>
						</view>
					</checkbox-group>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				mode:false,
			}
		},
		props:{
			items:{
				type:Array,
				default:[]
			},
			types:{
				type:String,
				default:'single'
			}
		},
		methods:{
			cancel(){
				this.mode = false
				uni.showTabBar({})
			},
			show(){
				this.mode =true;
				uni.hideTabBar({})
			},
			comfirm(){
				this.cancel();
				let data={
					types:this.types,
					item:this.items
				}
				this.$emit('comfirm',data)
			},
			moveHandle(){},
			checkboxChange(e) {
			var items = this.items;
			let values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
				for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
					if (items[i].value == values[j]) {
						items[i].checked = true;
						break;
					}
				}
			}
		},
		}
	}
</script>

<style >
	.li-mask{
		position: fixed;
		top: 0;
		height: 100%;
		width:100%;
		background: rgb(0,0,0,0.7);
		z-index: 998;
		
	}
	.li-mask-content{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 55%;
		background: #FFFFFF;
		z-index: 999;
		overflow: auto;
	}
	.list{
		overflow: auto;
		margin-bottom: 40upx;
		height: 75%;
		overflow-y: auto;
	}
	.list-cell{
		line-height: 50px;
	}
	.title{
		line-height: 50px;
	}
</style>
