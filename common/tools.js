var tools = new Object();
//对象转为字符串
tools.toStrings = (arrayData) => {
	let str = '';
	for (let i = 0; i < arrayData.length; i++) {
		//最后一条数据
		let lastLength = arrayData.length - 1;
		//如果不是最后一条数据加上& 
		if (i !== lastLength) {
			str += arrayData[i] + ','
		} else {
			str += arrayData[lastLength]
		}
	}
	return str;
}
tools.cName = (name) => {
	if (name.length > 2) {

		let m = name.length;

		return name.substring(m - 2, m);
	} else {
		return name;
	}
}
// 对数据进行3位数分割
tools.numberToLocalString = (str) => {
	if (str) {
		str = str.toString();
		var newStr = "";
		var count = 0;
		if (str.indexOf(".") == -1) {
			for (var i = str.length - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr;
				}
				count++;
			}
			str = newStr + ".00"; //自动补小数点后两位
		} else {
			for (var i = str.indexOf(".") - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				}
				count++;
			}
			str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
		}
		return str
	}
}

//时间转时间戳
tools.timeToTimeStamp = (times) => {
	let str = times.replace(/-/g, '/');
	let time = new Date(str);
	let timestamp = time.getTime();
	return parseInt(timestamp / 1000);
}
//时间戳转时间
tools.timestampToTime = (timestamp) => {
	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}
tools.getDate = (types) => {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (types === 'start') {
		year = year;
	} else if (types === 'end') {
		year = year + 2;
	}
	let months = month > 9 ? month : '0' + month;
	let days = day > 9 ? day : '0' + day;
	return `${year}-${months}-${days}`;
}
//手机号验证
tools.isPhone = (e) => {
	let phone = e;
	var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	if (myreg.test(phone) === false) {
		// uni.showToast({
		// 	icon: 'none',
		// 	title: '请输入正确的手机号'
		// });
		return false;
	}
	return true;
}
//身份证验证
tools.isIdCard = (card) => {
	let reg =
		/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	if (reg.test(card) === false) {
		uni.showToast({
			icon: 'none',
			title: '请输入正确的身份证号'
		});
		return false;
	}
	return true;
}

tools.watermark = (settings) => {
	//默认设置
	var defaultSettings = {
		watermark_txt: "text",
		watermark_x: 20, //水印起始位置x轴坐标
		watermark_y: 20, //水印起始位置Y轴坐标
		watermark_rows: 10, //水印行数
		watermark_cols: 0, //水印列数
		watermark_x_space: 70, //水印x轴间隔
		watermark_y_space: 40, //水印y轴间隔
		watermark_color: '#aaa', //水印字体颜色
		watermark_alpha: 0.4, //水印透明度
		watermark_fontsize: '15px', //水印字体大小
		watermark_font: '微软雅黑', //水印字体
		watermark_width: 70, //水印宽度
		watermark_height: 60, //水印长度
		watermark_angle: 60 //水印倾斜度数
	};

	//采用配置项替换默认值，作用类似jquery.extend
	if (arguments.length === 1 && typeof arguments[0] === "object") {
		var src = arguments[0] || {};
		for (key in src) {
			if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
				continue;
			else if (src[key])
				defaultSettings[key] = src[key];
		}
	}

	var oTemp = document.createDocumentFragment();

	//获取页面最大宽度
	var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
	var cutWidth = page_width * 0.0150;
	var page_width = page_width - cutWidth - 10;

	//获取页面最大高度
	var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight);
	// var page_height = document.body.scrollHeight+document.body.scrollTop;

	//如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
	if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width *
				defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) >
			page_width)) {
		defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) /
			(defaultSettings.watermark_width + defaultSettings.watermark_x_space));
		defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width *
			defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
	}

	defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) /
		(defaultSettings.watermark_height + defaultSettings.watermark_y_space));
	defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height *
		defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));

	var x;
	var y;
	for (var i = 0; i < defaultSettings.watermark_rows; i++) {
		y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
		for (var j = 0; j < defaultSettings.watermark_cols; j++) {
			x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

			var mask_div = document.createElement('div');
			mask_div.id = 'mask_div' + i + j;
			mask_div.className = 'mask_div';
			mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));

			//设置水印div倾斜显示
			mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
			mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
			mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
			mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
			mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
			mask_div.style.visibility = "";
			mask_div.style.position = "absolute";
			mask_div.style.left = x + 'px';
			mask_div.style.top = y + 'px';
			mask_div.style.overflow = "hidden";
			mask_div.style.zIndex = "9999";
			mask_div.style.pointerEvents = 'none'; //pointer-events:none  让水印不遮挡页面的点击事件
			mask_div.style.opacity = defaultSettings.watermark_alpha;
			mask_div.style.fontSize = defaultSettings.watermark_fontsize;
			mask_div.style.fontFamily = defaultSettings.watermark_font;
			mask_div.style.color = defaultSettings.watermark_color;
			mask_div.style.textAlign = "center";
			mask_div.style.width = defaultSettings.watermark_width + 'px';
			mask_div.style.height = defaultSettings.watermark_height + 'px';
			mask_div.style.display = "block";
			oTemp.appendChild(mask_div);
		};
	};
	document.body.appendChild(oTemp);
}

//压缩图片 最大720
tools.compressPic = (url) => {
	return new Promise((resolve, reject) => {
		var img = new Image();
		img.src = url;
		img.onload = function() {
			var _img = img;
			var w = _img.width,
				h = _img.height,
				scale = w / h;
			w = 720 || w;
			h = w / scale;
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = w;
			canvas.height = h;
			ctx.drawImage(_img, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/png', 'image/jpeg', 'image/jpg', 1 || 0.8);
			resolve(base64)
		};
	})
}

export default tools;
