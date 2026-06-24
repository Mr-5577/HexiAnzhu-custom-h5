import md5 from 'js-md5';
import store from '@/store/index.js';

const baseUrl = store.state.baseUrl;
const erpBaseUrl = store.state.erpBaseUrl;
let requests = {}

function showToast(title) {
	uni.showToast({
		icon: 'none',
		title: title,
		duration: 2000
	})
}

function successState(res) {
	if(res.data.code != 1000){
		uni.showToast({
			icon:'none',
			title:res.data.msg
		})
	}
	if(res.data.code == 1008){
		sessionStorage.removeItem('LoginToken');
	}
}

function errorState(err) {
	uni.showToast({
		icon: 'none',
		title: '请求超时...'
	})
}

//ascii排序
function sort_ASCII(obj) {

	var arr = new Array();
	var num = 0;
	for (var i in obj) {
		arr[num] = i;
		num++;
	}
	var sortArr = arr.sort();
	var sortObj = {};
	for (var i in sortArr) {
		if (sortArr[i] != 'rule_key') {
			sortObj[sortArr[i]] = obj[sortArr[i]];
		}
	}
	return sortObj;
}
//对象转为字符串
function data_toStirng(obj) {
	let str = ''
	let arrayData = []
	Object.getOwnPropertyNames(obj).forEach(function(key) {
		if (obj[key]) {
			arrayData.push(key + '=' + obj[key]);
		}
	})
	for (let i = 0; i < arrayData.length; i++) {
		//最后一条数据
		let lastLength = arrayData.length - 1;
		//如果不是最后一条数据加上& 
		if (i !== lastLength) {
			str += arrayData[i] + '&'
		} else {
			str += arrayData[lastLength]
		}
	}
	return str;

}
//获取rule_key
function rule_key(data) {
	let asciiData = sort_ASCII(data);
	let asciiData_toStirng = data_toStirng(asciiData);
	let md5data = md5(asciiData_toStirng);
	let upperCaseData = md5data.toUpperCase();
	return upperCaseData;
}

requests.post = (url, data) => {
	let loginToken =  sessionStorage.getItem('Login_token');
	var objData = data;
	let timestamp = (Date.parse(new Date())) / 1000;
	//公用loginToken
	if (loginToken) {
		var publicData = {
			scope: store.state.scope,
			timestamp: timestamp,
			login_token: loginToken
		};
	} else {
		var publicData = {
			scope: store.state.scope,
			timestamp: timestamp
		};
	}
	objData = Object.assign(data, publicData);
	var ruleKey = rule_key(objData);
	objData = Object.assign(data, {
		rule_key: ruleKey
	});
	// 本地联调时在url后加上?XDEBUG_SESSION=PHPSTORM，url: baseUrl + url + '?XDEBUG_SESSION=PHPSTORM',
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: baseUrl + url,
			data: objData,
			method: "POST",
			header: {},
			success(res) {
				// if(res.data.code == 1000){
				resolve(res.data)
				// }
				uni.hideLoading();
				successState(res)

			},
			fail(err) {
				uni.hideLoading();
				reject(err)
			}
		});
	})
	return promise
}
// 请求erp数据库接口使用
requests.erpPost = (url, data = {}, header = {}) => {
  // 获取公共参数
  const loginToken = sessionStorage.getItem('Login_token');
  const timestamp = Math.floor(Date.now() / 1000); // 秒级时间戳
  // 构建公共参数
  const publicData = {
    scope: store.state.scope,
    timestamp,
    ...(loginToken && { login_token: loginToken })
  };
  // 合并参数
  const requestData = {
    ...data,
    ...publicData
  };
  // 生成签名
  const ruleKey = rule_key(requestData);
  // 最终请求参数
  const finalData = {
    ...requestData,
    rule_key: ruleKey
  };
  // 返回 Promise
  return new Promise((resolve, reject) => {
    uni.request({
      url: erpBaseUrl + url,
      data: finalData,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        uni.hideLoading();
        resolve(res.data);
      },
      fail: (err) => {
        uni.hideLoading();
        reject(err);
      }
    });
  });
};

export default requests;
