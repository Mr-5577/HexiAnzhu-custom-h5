<template>
    <view class="li-visit-record flex justify-center align-center animated "
        :class="{ slideInRight: mode == true, slideOutRight: mode == false }" v-if="mode">
        <scroll-view scroll-y="true" class="li-visit-record-content">
            <view class="margin-top">
                <view class="flex justify-between flex-wrap">
                    <view class="padding-xs text-lg text-bold text-black">来访记录选择</view>
                </view>

                <!-- 查询条件区域 - 一行显示 -->
                <view class="search-bar margin-top-sm">
                    <view class="search-row">
                        <view class="search-input-wrap">
                            <input class="search-input" type="text" v-model="searchParams.custName" placeholder="客户姓名"
                                @confirm="handleSearch" />
                        </view>
                        <view class="search-input-wrap">
                            <input class="search-input" type="text" v-model="searchParams.custTel" placeholder="客户电话"
                                @confirm="handleSearch" />
                        </view>
                        <view class="search-buttons">
                            <button class="cu-btn bg-blue sm" @click="handleSearch">查询</button>
                        </view>
                    </view>
                </view>

                <!-- 单选滚动列表 -->
                <view class="margin-top-sm">
                    <view class="visit-list" v-if="visitRecordList.length > 0">
                        <view class="visit-item border-bottom" v-for="(item, index) in visitRecordList" :key="index"
                            @click="selectItem(item)">
                            <view class="visit-item-content">
                                <view class="visit-info">
                                    <view class="visit-name-wrap">
                                        <text class="field-label">客户姓名：</text>
                                        <text class="visit-name text-black text-bold">
                                            {{ item.custName || '未知姓名' }}
                                        </text>
                                    </view>
                                    <view class="visit-tel-wrap">
                                        <text class="field-label">客户电话：</text>
                                        <text class="visit-tel text-gray">{{ item.custTel || '无电话' }}</text>
                                    </view>
                                </view>
                                <view class="visit-time-wrap">
                                    <text class="field-label">来访时间：</text>
                                    <text class="visit-time text-gray">{{ item.visitTime || '未知时间' }}</text>
                                </view>
                            </view>
                            <view class="visit-radio">
                                <view
                                    :class="['radio-btn', selectedItem && selectedItem.id === item.id ? 'radio-checked' : '']">
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-else class="empty-data">
                        <text class="text-gray">暂无来访记录</text>
                    </view>
                </view>
            </view>
        </scroll-view>
        <view class="flex foot-btn" style="justify-content: center;flex-direction: row;">
            <view class="flex justify-between padding-sm margin-top" style="flex-direction: row;width: 100%;">
                <button class="cu-btn bg-blue lg round" @click="handleConfirm">确认关联</button>
                <button class="cu-btn bg-white border-blue lg round text-blue" @click="cancel">取消返回</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'lichoose',
    data() {
        return {
            mode: false,
            selectedItem: null, // 当前选中的记录
            visitRecordList: [], // 显示的来访记录列表
            searchParams: {
                projId: "",
                custName: '', // 客户姓名查询条件
                custTel: ''   // 客户电话查询条件
            },

        };
    },
    props: {
        // 接收外部传入的项目ID
        projectId: {
            type: Array,
            required: true,
            default: () => []
        },
        // 选中的来访记录ID
        visitId: {
            type: [Number, String],
            default: null
        }
    },
    watch: {
        projectId: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.searchParams.projId = newVal[0];
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() { },
    computed: {},
    methods: {
        /**
         * 获取未关联的来访记录
         */
        async getVisitList() {
            if (!this.searchParams.projId) {
                if (uni && uni.showToast) {
                    uni.showToast({
                        title: '项目ID不能为空',
                        icon: 'none',
                        duration: 2000
                    });
                }
                return;
            }
            try {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
                const tem = new Date().getTime(); // 时间戳，毫秒数
                const keyStr = `hxaz${tem}`;
                const sha1Str = this.$tools.hmacSha1("HXAZ_VISIT_LIST", keyStr);
                const header = {
                    'X-Signature': sha1Str,
                    'X-Timestamp': tem,
                };
                // 构建请求参数
                const requestParams = {
                    projId: this.searchParams.projId,
                    custName: this.searchParams.custName.trim(),
                    custTel: this.searchParams.custTel.trim(),
                };
                const res = await this.$api.GetVisitList(requestParams, header);
                uni.hideLoading();
                if (res.code === 200) {
                    this.visitRecordList = res.data || []
                    // 回显选中的来访ID
                    if (this.visitId && this.visitRecordList.length > 0) {
                        this.selectedItem = this.visitRecordList.find(item => item.id == this.visitId);
                    }
                } else {
                    if (uni && uni.showToast) {
                        uni.showToast({
                            title: res.message || '获取来访记录失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            } catch (error) {
                uni.hideLoading();
                if (uni && uni.showToast) {
                    uni.showToast({
                        title: '网络错误，请稍后重试',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        },

        /**
         * 查询
         */
        async handleSearch() {
            // 重新发起请求
            await this.getVisitList();
        },

        /**
         * 重置查询条件并重新获取所有数据
         */
        async handleReset() {
            this.searchParams.custName = '';
            this.searchParams.custTel = '';
            await this.getVisitList();
        },

        /**
         * 选择来访记录（单选）
         * @param {Object} item 选中的记录对象
         */
        selectItem(item) {
            // 如果点击的是当前已选中的项，则取消选中
            if (this.selectedItem && this.selectedItem.id === item.id) {
                this.selectedItem = null;
            } else {
                // 否则选中当前项
                this.selectedItem = item;
            }
            // 强制更新视图
            this.$forceUpdate();
        },

        /**
         * 取消选择并关闭弹窗
         */
        cancel() {
            this.mode = false;
            this.selectedItem = null;
            // 重置查询条件
            this.searchParams.custName = '';
            this.searchParams.custTel = '';
        },

        /**
         * 显示
         */
        async show() {
            // 检查项目ID
            if (!this.searchParams.projId) {
                if (uni && uni.showToast) {
                    uni.showToast({
                        title: '项目ID不能为空,请选择项目',
                        icon: 'none',
                        duration: 2000
                    });
                }
                return;
            }

            this.mode = true;
            this.selectedItem = null;
            // 重置查询条件
            this.searchParams.custName = '';
            this.searchParams.custTel = '';
            // 获取来访记录数据
            await this.getVisitList();
        },

        /**
         * 确认关联，返回选中的数据
         */
        handleConfirm() {
            if (!this.selectedItem) {
                // 未选择任何记录时的提示
                if (uni && uni.showToast) {
                    uni.showToast({
                        title: '请选择一条来访记录',
                        icon: 'none',
                        duration: 2000
                    });
                }
                return;
            }

            this.mode = false;
            // 返回选中数据
            this.$emit('confirm', this.selectedItem);
        }
    }
};
</script>

<style lang="less">
.radio {
    height: 50rpx;
    line-height: 50rpx;
}

.bg-gray {
    background-color: rgba(235, 235, 235);
}

.li-visit-record {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    z-index: 998;

    .li-visit-record-content {
        width: 96%;
        height: 100%;
        z-index: 999;
        overflow: auto;
        padding-bottom: 200rpx;
    }
}

// 搜索栏样式 - 一行显示
.search-bar {
    padding: 20rpx;
    box-sizing: border-box;
    background-color: #f8f8f8;
    border-radius: 16rpx;
}

.search-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.search-input-wrap {
    flex: 1;
    min-width: 0; // 防止flex子项溢出
}

.search-input {
    background-color: #ffffff;
    height: 70rpx;
    padding: 0 20rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    border: 1rpx solid #e5e5e5;
    width: 100%;
    box-sizing: border-box;
}

.search-buttons {
    display: flex;
    gap: 12rpx;
    flex-shrink: 0;

    .cu-btn {
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
        padding: 0 24rpx;
        white-space: nowrap;
    }
}

// 来访列表样式
.visit-list {
    width: 100%;
}

.visit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    margin: 0 20rpx;
    border-bottom: 1rpx solid #e5e5e5;

    &:last-child {
        border-bottom: none;
    }
}

.visit-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.visit-info {
    display: flex;
    flex-direction: column;
    margin-bottom: 12rpx;
}

.visit-name-wrap,
.visit-tel-wrap {
    display: flex;
    align-items: baseline;
    margin-bottom: 8rpx;

    &:last-child {
        margin-bottom: 0;
    }
}

.visit-time-wrap {
    display: flex;
    align-items: baseline;
}

.field-label {
    font-size: 28rpx;
    color: #666666;
    width: 140rpx;
    flex-shrink: 0;
}

.visit-name {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    flex: 1;
}

.visit-tel {
    font-size: 28rpx;
    color: #666666;
    flex: 1;
}

.visit-time {
    font-size: 28rpx;
    color: #666666;
    flex: 1;
}

.visit-radio {
    margin-left: 20rpx;
    padding: 10rpx;
}

.radio-btn {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 2rpx solid #dddddd;
    background-color: #ffffff;
    transition: all 0.2s ease;
}

.radio-checked {
    border-color: #007aff;
    background-color: #007aff;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20rpx;
        height: 12rpx;
        border: 2rpx solid #ffffff;
        border-top: none;
        border-right: none;
        transform: translate(-50%, -60%) rotate(-45deg);
    }
}

.empty-data {
    text-align: center;
    padding: 100rpx 0;
    color: #999999;
    font-size: 28rpx;
}

.foot-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
    left: 0;
    height: 180rpx;
    background-color: #FFFFFF;

    button {
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