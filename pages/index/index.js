// index.js
Page({

  /*页面的初始数据*/
  data: {
    dischargeValue: 0,
    concentrationValue: 0,
    flowRateValue: 0,
    historyLog: []
  },

  /* 生命周期函数--监听页面加载*/
  onLoad(options) {
    const self = this;

    // 获取数据库数据和更新数据
    /*this.fetchDataFromDatabase();
    this.updateData();*/

    // 获取记录
    wx.getStorage({
      key: 'historyLog',
      success(res) {
        self.setData({
          historyLog: res.data 
        });
        // 调试用
        console.log('本地存储的记录：', res.data);
      }
    });
  },

  // 跳转记录
  showInputModal() {
    const self = this;
    // 输入框
    wx.showModal({
      title: '输入记录',
      content: '',
      editable: true,
      placeholderText: '在此输入',
      success(res) {
        if (res.cancel) {
          // 点击取消
          wx.showToast({
            title: '记录失败',
            icon: 'none',
            duration: 2000
          });
        } else if (res.confirm) {
          // 点击确定
          const currentDateTime = self.getCurrentDateTime();
          const inputText = res.content || '';
          const concentrationValue = self.data.concentrationValue;
          const flowRateValue = self.data.flowRateValue;
          const dischargeValue = self.data.dischargeValue;

          // 更新数据
          const currentLogs = self.data.historyLog;
          const newLog = {
            inputText: inputText,
            dateTime: currentDateTime,
            concentrationValue:concentrationValue,
            flowRateValue:flowRateValue,
            dischargeValue:dischargeValue
          };
          currentLogs.unshift(newLog);
          self.setData({
            historyLog: currentLogs
          });
          // 存储记录
          wx.setStorage({
            key: 'historyLog',
            data: currentLogs,
            success() {
              console.log('记录成功保存到本地存储');
            }
          });

          // 提示记录成功
          wx.showToast({
            title: '记录成功',
            icon: 'success',
            duration: 2000
          });

          // 调试用(JSON.stringify在字符串中这个才能看)
          console.log(`记录内容: ${JSON.stringify(self.data.historyLog)}`);
        }
      }
    });
  },

  // 获取当前年月日时分
  getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return `${year}-${month}-${day}-${hour}-${minute}`;
  },

  // 跳转历史记录
  gotoHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },

  // 数据库连接测试
  fetchDataFromDatabase(callback) {
    const self = this;
    wx.request({
      url: 'http://127.0.0.1/',
      method: 'GET',
      success(res) {
        const data = res.data[0]; //数组
        const concentrationValue = parseFloat(data.concentrationValue);
        const flowRateValue = parseFloat(data.flowRateValue);

        self.setData({
          concentrationValue: concentrationValue,
          flowRateValue: flowRateValue
        });
        self.calculateDischargeValue();

        if (typeof callback === 'function') {
          callback();
        }
      },
      fail(err) {
        console.error("获取出错：", err);
        if (typeof callback === 'function') {
          callback();
        }
      }
    })
  },

  // 更新数据
  updateData() {
    const self = this;
    this.intervalId = setInterval(() => {
      self.fetchDataFromDatabase();
    }, 10000);
  },

  // 计算排量
  calculateDischargeValue() {
    const {
      concentrationValue,
      flowRateValue
    } = this.data;
    const dischargeValue = concentrationValue * flowRateValue;
    this.setData({
      dischargeValue: dischargeValue
    });
  },

  /*生命周期函数--监听页面初次渲染完成*/
  onReady() {

  },

  /*生命周期函数--监听页面显示*/
  onShow() {

  },

  /*生命周期函数--监听页面隐藏*/
  onHide() {

  },

  /*生命周期函数--监听页面卸载*/
  onUnload() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh() {
    this.fetchDataFromDatabase(() => {
      wx.stopPullDownRefresh();
    })
  },

  /*页面上拉触底事件的处理函数*/
  onReachBottom() {

  },

  /*用户点击右上角分享*/
  onShareAppMessage() {

  }
})