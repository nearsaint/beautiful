// 考虑如何更好地在组件外部管理状态(把组件的共享状态抽取出来,以一个全局单例模式管理呢)
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {

  loading: true,
  tipper: {
    show: false,
    title: '',
    type: '',
  },
  color: ['#3498DB', '#2ECC71', '#34495E', '#E74C3C', '#E67E22', '#F1C40F', '#9B59B6', '#1ABC9C', '#7F8C8D'],
  // 产线
  factory: {
    id: '', // 产线 id
    data: [], // 系统 > 设备 > 测点
  },
  // 用户
  user: {
    userLogin: true, // 用户登录状态
    userID: null, //用户 ID
    userName: null, //用户名
    userJurisdiction: '', //用户权限
  },
  // socket 链接
  socket: {
    factoryAll: 'nav_query_all_parts', //nav-component / 获取产线测点树状
    deviceList: 'div_query_all_parts', //devices / 获取设备列表
    propertyList: 'div_check_single_part', //device / 获取测点列表
    property: 'div_check_point_data', //property / 获取测点数据 
  },

}

export default new Vuex.Store({
  state,
})