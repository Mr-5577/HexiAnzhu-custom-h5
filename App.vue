<script>
	import watermark from '@/common/watermark.js';
export default {
	provide() {//跨组件刷新
		return {
			reload: this.reload
		};
	},
	data() {
		return {
			isRouterAlive: true,
			dateUrl: null,
			Login_token: '',
			Message: '',
			datetime: '',
			Login_datetime: '',
			appmc: false
		};
	},
	onLaunch: function() {
		// console.log('App Launch');
	},
	onHide: function() {
		// console.log('App Hide');
	},
	onShow() {
		var isRouterAlive= true;
		// var url= encodeURIComponent('http://voa.yangguangzhiye.cn/custom/pages/subscribe/subscribe?cuid=81277');
		// var ref_url = "http://192.168.8.51:81/custom";
		var ref_url = "http://woa.hexianzhu.com/custom";
		var dateUrl= null;
		var http_url= 'http://woa.hexianzhu.com/getLogin_qy.html';
		var Code= '';
		var Login_token='';
		var Message= '';
		var datetime= '';
		var Login_datetime='';
		var appmc= false;
		var systemid = 103;
		var api_token =  'a14498941db3a32f121762f3de2769a76ddea14c';
		// 获取回调域名h5模式 history
		//如果回调域名中传来的code=202，提示消息
		if (this.$route.query.Code == 202) {
			Message = this.$route.query.Message;
			appmc = true;
		}
		// 保存 hxCustomerData 到 sessionStorage（在认证前）
		this.saveParams();
		// 然后清除URL中的hxCustomerData参数（避免传递到认证服务器）
		this.clearUrlParams(['hxCustomerData']);

		//判断是否存储Login_token 如果有存储超时10800要重新请求
		// 开发模式
		// 7af5c9adaff25ddd0ec5da820cc8a831349b25e6
		// a4ac2cc8dd96c48572d0ed241ea7fa5e471b86b9
		// sessionStorage.setItem('Login_token','202fb571e5b5d8a53de48015a985ec2e8afc64b3')
		//判断是否存储Login_token 如果有存储超时10800要重新请求
		if (!sessionStorage.getItem('Login_token')) {
			let u_str = decodeURIComponent(location.href);
			let Code = u_str.search('Code=200') != -1;
			if (Code) {
				let token = this.getUrlkey('Login_token');
				sessionStorage.setItem('Login_token', token);
				this.pushStateUrl();
				this.getUser();
			} else {
				let dateTime = Date.parse(new Date()) / 1000;
				let uri = location.href;
				let redirectUri = encodeURIComponent(uri);
				const HREFURL = http_url + '?systemid=' + systemid + '&api_token=' + api_token + '&timestamp=' + dateTime + '&redirect_uri=' + redirectUri;
				location.href = HREFURL;
				// this.pushStateUrl();
			}
		} else {
			//水印
			this.getUser();
			this.pushStateUrl();
		}
	},
	methods: {
		// 保存参数
		saveParams() {
			let url = window.location.href;
			// 从完整 URL 中提取 hxCustomerData
			let match = url.match(/hxCustomerData=([^&]+)/);
			if (match) {
				console.log('保存hxCustomerData:', match[1]);
				try {
					let decoded = decodeURIComponent(match[1]);
					sessionStorage.setItem('hxCustomerData', decoded);
				} catch(e) {
					sessionStorage.setItem('hxCustomerData', match[1]);
				}
			}
		},
		// 通用的URL参数清理方法
		clearUrlParams(paramsToRemove = []) {
			if (paramsToRemove.length > 0) {
				let url = window.location.href;
				let [baseUrl, queryString] = url.split('?');
				if (queryString) {
					let params = new URLSearchParams(queryString);
					paramsToRemove.forEach(param => params.delete(param));
					let newQuery = params.toString();
					let newUrl = newQuery ? baseUrl + '?' + newQuery : baseUrl;
					// 真正修改浏览器URL
					if (newUrl !== url) {
						window.history.replaceState({}, 0, newUrl);
					}
				}
			}
		},
		appMc_hide() {
			this.appmc = false;
		},
		//hash模式下(带#的url),获取方式
		getUrlkey(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
		},
		getUser() {
			this.$api.Getuserinfobookingapi({}).then(res => {
				if (res.code == 1000) {
					this.$store.commit('setUerInfo', res.data);
					watermark.set(this.$store.state.userInfo.u_name + '  ' + this.cTel(this.$store.state.userInfo.u_tel1));
				}
			});
		},
		//切割url
		pushStateUrl() {
			let url = window.location.href;
			let hash = '';
			if (url.indexOf('?') != -1) {
				hash = url.split('?')[0];
			}
			window.history.pushState({}, 0, hash);
		},
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(function() {
				this.isRouterAlive = true;
			});
		},
		cTel(tel) {
			if (tel.length > 4) {
				let m = tel.length;
				return tel.substring(m - 4, m);
			} else {
				return tel;
			}
		}
		
	}
};
</script>

<style>
@import 'common/qiun.css';
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'common/app.css';
@import 'common/animate.css';
.uni-flex-center {
	display: flex;
	justify-content: center;
	align-items: center;
}
.uni-content {
	margin-bottom: 20upx;
}
</style>
