<template>
<div>
  <nav class="meun_lv2 animated fadeInDown">
    <ul>
      <li>
        <router-link :to="{ path: '/devices/devicesList' }">设备管理</router-link>
      </li>
      <li v-for="(items, indexs) in this.$store.state.factory.data" :key="('unit-'+indexs)">
        <hr>
        <router-link :to="{ path: '/devices/groups/group/'+ items.unit ,query:{ group: items.unit} }">{{items.unit}}</router-link>
      </li>
    </ul>
    <div class="btn">
      <router-link :to="{ path: '/chart' }"><i class="fa fa-download" aria-hidden="true"></i> 导出报表</router-link>
      <router-link :to="{ path: '/chart' }"><i class="fa fa-bar-chart" aria-hidden="true"></i> 数据曲线</router-link>
    </div>
  </nav>
  <router-view></router-view>
</div>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
export default {
  data() {
    return {}
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  //函数
  methods: {
    routeChange: function() {},
  },
  computed: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
</style>
