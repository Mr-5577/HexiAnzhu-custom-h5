<template>
	<view class="t-th" :style="{ 'border-width': thBorder + 'px' ,'border-color':borderColor,'font-size':fontSize+'px' ,'color':color,'justify-content':thAlignCpd}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			align: String,
		},
		data() {
			return {
				thBorder: '1',
				borderColor: '#ffffff',
				fontSize: '10',
				color: '#3b4246',
				thAlign: 'center'
			};
		},
		inject: ['table', 'tr'],

		created() {
			this.thBorder = this.table.border;
			this.borderColor = this.table.borderColor;
			this.fontSize = this.tr.fontSize;
			this.color = this.tr.color;
			if (this.align) {
				this.thAlign = this.align;
			} else {
				this.thAlign = this.tr.align
			}
		},

		computed: {
			thAlignCpd() {
				let nameAlign = '';
				switch (this.thAlign) {
					case 'left':
						nameAlign = 'flex-start'
						break;
					case 'center':
						nameAlign = 'center'
						break;
					case 'right':
						nameAlign = 'flex-end'
						break;
					default:
						nameAlign = 'center'
						break;
				}
				return nameAlign
			}
		}
	};
</script>

<style>
	.t-th {
		flex: 1;
		display: flex;
		align-items: center;
		font-size: 24upx;
		font-weight: bold;
		text-align: center;
		color: #3b4246;
		background: rgb(250,250,250);
		border-left: 1px #ffffff solid;
		border-top: 1px #ffffff solid;
		padding: 15upx;
	}
</style>
