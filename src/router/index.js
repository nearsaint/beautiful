import Vue from 'vue'
import Router from 'vue-router'

//引入组件到路由
//首页
import index from 'views/index.vue'
//设备
import devices from 'views/devices/devices.vue'
import devicesList from 'views/devices/devicesList.vue'
import groups from 'views/devices/groups.vue'
import group from 'views/devices/group.vue'
import device from 'views/devices/device.vue'
import property from 'views/devices/property.vue'
//订单
import orders from 'views/orders/orders.vue'
//echart
import chart from 'views/chart.vue'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index,
    },
    {
      path: '/devices',
      name: 'devices',
      component: devices,
      children: [{
        path: 'devicesList',
        name: 'devicesList',
        component: devicesList,
      }, {
        path: 'groups',
        name: 'groups',
        component: groups,
        children: [{
          path: 'group/:groupID',
          name: 'group',
          component: group,
        }],
        redirect: '/devices/groups/group/:groupID'
      }],
      redirect: '/devices/devicesList'
    },
    {
      path: '/device/:deviceID',
      name: 'device',
      component: device,
    },
    {
      path: '/property/:propertyID',
      name: 'property',
      component: property,
    },
    {
      path: '/orders',
      name: 'orders',
      component: orders,
    },
    {
      path: '/chart',
      name: 'chart',
      component: chart,
    },
  ]
})