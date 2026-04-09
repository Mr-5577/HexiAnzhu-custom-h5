import uniRequest from "./request.js"
import qiniuUploader from '@/common/qiniuUploader.js';
import store from '@/store/index.js';

let api = new Object();

function nowDay() {
	let date = new Date();
	return date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
}



//获取七牛云上传token接口
api.qiniuTokencustomapi = (data, callback) => {
	uniRequest.post('custom-qiniutokencustomapi', data).then(callback)
}
//阳光大地各业务获取授权认证token接口
api.customGetaccesstokenoauth = (data, callback) => {
	uniRequest.post('custom-getaccesstokenoauth', data).then(callback)
}
//获取公司列表
api.customGetcompanylistcustomapi = (data, callback) => {
	uniRequest.post('custom-getcompanylistcustomapi', data).then(callback)
}
//获取项目列表
api.customGetprojectlistcustomapi = (data, callback) => {
	uniRequest.post('custom-getprojectlistcustomapi', data).then(callback)
}
//获取项目模板接口
api.customGetprojecttemplatecustomapi = (data) => {
	return uniRequest.post('custom-getprojecttemplatecustomapi', data)
}
//获取房源类型
api.customGettypecustomapi = (data, callback) => {
	uniRequest.post('custom-gettypecustomapi', data).then(callback)
}
//获取房源详情
api.GetRoomslistcustomapi = (data, callback) => {
	uniRequest.post('custom-getroomslistcustomapi', data).then(callback)
}


//获取大区和大区下的项目
api.customGetbigareacustomapi = (data, callback) => {
	uniRequest.post('custom-getbigareacustomapi', data).then(callback)
}
//客户统计
api.customGetcustomstatisticcustomapi = (data, callback) => {
	uniRequest.post('custom-getcustomstatisticcustomapi', data).then(callback)
}
//重要事项提醒
api.customGetcustomremindcustomapi = (data, callback) => {
	uniRequest.post('custom-getcustomremindcustomapi', data).then(callback)
}

//项目模板类型分析（单项目）
api.customCustomtypecustomapi = (data, callback) => {
	uniRequest.post('custom-customtypecustomapi', data).then(callback)
}

// 到访来源分析
api.customPathwaycustomapi = (data, callback) => {
	uniRequest.post('custom-pathwaycustomapi', data).then(callback)
}
//意向房型分析
api.customHousetypecustomapi = (data, callback) => {
	uniRequest.post('custom-housetypecustomapi', data).then(callback)
}
//首次到访分析
api.customFirstvisitcustomapi = (data, callback) => {
	uniRequest.post('custom-firstvisitcustomapi', data).then(callback)
}
// 客户成交列表查询接口/
api.Getdeallistcustomapi = (data, callback) => {
	uniRequest.post('custom-getdeallistcustomapi', data).then(callback)
}

//总客户数图表分析(多项目)
api.customCustomtotalcountcustomapi = (data, callback) => {
	uniRequest.post('custom-customtotalcountcustomapi', data).then(callback)
}
//客户跟进图表分析(多项目)
api.customCustomrecordcustomapi = (data, callback) => {
	uniRequest.post('custom-customrecordcustomapi', data).then(callback)
}
//待完善客户列表
api.customUntreatedcustomlistcustomapi = (data, callback) => {
	uniRequest.post('custom-untreatedcustomlistcustomapi', data).then(callback)
}
//逾期客户管理列表
api.getOverduelistcustomapi = (data, callback) => {
	uniRequest.post('custom-getoverduelistcustomapi', data).then(callback)
}
//客户逾期详情
api.getOverdueinfocustomapi = (data, callback) => {
	uniRequest.post('custom-getoverdueinfocustomapi', data).then(callback)
}
//客户列表查询接口
  api.getIndexcustomapi =(data, callback) => {
	uniRequest.post('custom-indexcustomapi', data).then(callback)
} 
//查看客户详情
api.getInfocustomapi = (data, callback) => {
	uniRequest.post('custom-getinfocustomapi', data).then(callback)
}
//客户编辑详情
api.GetCustominfocustomapi = (data, callback) => {
	uniRequest.post('custom-getcustominfocustomapi', data).then(callback)
}
//验证手机号是否唯一
api.TelVerifycustomapi = (data) => {
	return new Promise((resolve, reject) => {
		uniRequest.post('custom-telverifycustomapi', data).then(res => {
			resolve(res)
		})
	})
}

//获取共享人
api.getSharecustomapi = (data, callback) => {
	uniRequest.post('custom-getsharecustomapi', data).then(callback)
}
//获取项目下的置业顾问
api.getSaleslistcustomapi = (data, callback) => {
	uniRequest.post('custom-getsaleslistcustomapi', data).then(callback)
}
//获取分组置业顾问
api.GetGroupsalecustomapi = (data) => {
	return  uniRequest.post('custom-getgroupsalecustomapi', data)
}
//设置共享成员
api.SetSharecustomapi = (data, callback) => {
	uniRequest.post('custom-setsharecustomapi', data).then(callback)
}
//添加催办记录
api.DunNingcustomapi = (data, callback) => {
	uniRequest.post('custom-dunningcustomapi', data).then(callback)
}


//获取房源
api.getProjectbuildingcustomapi = (data, callback) => {
	uniRequest.post('custom-getprojectbuildingcustomapi', data).then(callback)
}
//客户录入
api.addCustomapi = (data, callback) => {
	uniRequest.post('custom-addcustomapi', data).then(callback)
}
//客户编辑
api.EditCustomapi = (data, callback) => {
	uniRequest.post('custom-editcustomapi', data).then(callback)
}


//客户跟进记录
api.indexRecordapi = (data, callback) => {
	uniRequest.post('custom-indexrecordapi', data).then(callback)
}
//获取客户可跟进项目
api.RecordapiGetProject = (data) => {
	return uniRequest.post('custom-recordapi_getproject', data)
}


//添加跟进记录
api.AddRecordapi = (data, callback) => {
	uniRequest.post('custom-addrecordapi', data).then(callback)
}


// 客户快速查询接口
api.mcSearchCustomapi = (data, callback) => {
	uniRequest.post('custom-mcsearchcustomapi', data).then(callback)
}



//在线认购
api.indexBookingapi = (data, callback) => {
	uniRequest.post('custom-indexbookingapi', data).then(callback)
}
//获取楼栋
api.getBuildingListBookingapi = (data, callback) => {
	uniRequest.post('custom-getbuildinglistbookingapi', data).then(callback)
}

//获取房号列表
api.getRoomsListBookingapi = (data, callback) => {
	uniRequest.post('custom-getroomslistbookingapi', data).then(callback)
}
//获取协议模板列表
api.getTempletListBookingapi = (data, callback) => {
	uniRequest.post('custom-gettempletlistbookingapi', data).then(callback)
}
//生成定房协议
api.makeAgreementBookingapi = (data, callback) => {
	uniRequest.post('custom-makeagreementbookingapi', data).then(callback)
}
//订单列表查询
api.indexOrderapi = (data, callback) => {
	uniRequest.post('custom-indexorderapi', data).then(callback)
}
//获取订单详情信息
api.getInfoOrderapi = (data, callback) => {
	uniRequest.post('custom-getinfoorderapi', data).then(callback)
}
//取消订单
api.cancelOrderapi = (data, callback) => {
	uniRequest.post('custom-cancelorderapi', data).then(callback)
}
//提交认购订单信息
api.createBookingapi = (data, callback) => {
	uniRequest.post('custom-createbookingapi', data).then(callback)
}
//查询登录人信息
api.Getuserinfobookingapi = (data) => {
	return uniRequest.post('custom-getuserinfobookingapi', data)
}
//查询成交列表
api.Getdeallistbookingapi = (data, callback) => {
	uniRequest.post('custom-getdeallistbookingapi', data).then(callback)
}
//查询成交详情
api.Getdealinfobookingapi = (data, callback) => {
	uniRequest.post('custom-getdealinfobookingapi', data).then(callback)
}

//获取成交的项目
api.Getdealprojectbookingapi = (data, callback) => {
	uniRequest.post('custom-getdealprojectbookingapi', data).then(callback)
}
//获取创建订单的项目
api.Getprojectlistorderapi = (data, callback) => {
	uniRequest.post('custom-getprojectlistorderapi', data).then(callback)
}
//设置默认项目
api.SetDefaultpidbookingapi = (data, callback) => {
	uniRequest.post('custom-setdefaultpidbookingapi', data).then(callback)
}

//未分配客户列表查询接口
api.UnallocatedapiIndex = (data, callback) => {
	uniRequest.post('custom-unallocatedapi_index', data).then(callback)
}
//未分配客户用户详情
api.UnallocatedapiInfo = (data) => {
	return uniRequest.post('custom-unallocatedapi_info', data)
}
//无效客户
api.UnallocatedapiInvalid = (data) => {
	return uniRequest.post('custom-unallocatedapi_invalid', data)
}
//设置有效客户
api.UnallocatedapiValid = (data) => {
	return uniRequest.post('custom-unallocatedapi_valid', data)
}
//分配客户
api.UnallocatedapiAssigncsutom = (data) => {
	return uniRequest.post('custom-unallocatedapi_assigncsutom', data)
}
//设置为待来访
api.UnallocatedApiWaitVisit = (data) => {
	return uniRequest.post('custom-unallocatedapi_waitvisit', data)
}





// 渠道兑换商品核销
api.SweepcodeIndex = (data) => {
	return uniRequest.post('custom-sweepcode_index', data)
}



//上传图片到七牛云
api.uploadQiniuImage = (qiniuDatas, filePath, typeUrl) => {
	let _this = this;
	return new Promise(resolve => {
		let token = qiniuDatas.token;
		let domain = qiniuDatas.http_domain;
		let bucket = qiniuDatas.bucket;

		//当前时间
		let date = new Date();
		let nowDay = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
		let qiniuName = store.state.uploadQiNiuName + typeUrl + nowDay + '-' + new Date().getTime() + '-' + parseInt(Math.random() *10000);
		qiniuUploader.upload(
			filePath,
			res => {
				if (res.Code == 200 && res.fsize != 0) {
					resolve(qiniuName);
				}else{
					uni.hideLoading();
					uni.showToast({
						icon:'none',
						title:'图片上传失败，请重新选择图片'
					})
					resolve('error')
				}
			},
			error => {
				// resolve(error)
			}, {
				region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
				domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
				key: qiniuName, // 自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
				// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
				uptoken: token // 由其他程序生成七牛 uptoken
			}
		);
	});

}


export default api;
