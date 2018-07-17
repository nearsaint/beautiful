<template>
<header class="nav-component">
  <div class="tipper" v-if="this.$store.state.tipper.show">
    <el-alert show-icon :title="this.$store.state.tipper.title" :type="this.$store.state.tipper.type">
    </el-alert>
  </div>
  <menu class="menu">
    <div class="left">
      <div class="factoryId">
        <div class="logo"></div>
        <el-select v-model="factoryId_lable" placeholder="请选择">
          <el-option :label="'必得福生产线-H'" :value="'H'">
          </el-option>
        </el-select>
      </div>
      <div class="nav">
        <el-menu router default-active="/" :unique-opened="true" class="el-menu-demo" mode="horizontal" background-color="#333" text-color="#ccc" active-text-color="#409EFF">
          <el-menu-item index="/">展示仪表板</el-menu-item>
          <el-menu-item index="/devices">设备</el-menu-item>
          <el-menu-item index="/orders">订单管理</el-menu-item>
          <el-menu-item index="4" disabled>能耗</el-menu-item>
          <el-menu-item index="5" disabled>人员管理</el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="right">
      <div class="info">
        <a class="btn"><i class="fa fa-bell" aria-hidden="true"></i></a>
      </div>
      <hr>
      <div class="user">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="fa fa-user" aria-hidden="true"></i> Administrator <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的信息</el-dropdown-item>
            <el-dropdown-item divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </menu>
</header>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
import 'styles/menu.scss'

export default {
  data() {
    return {
      factoryId: 'H',
      factoryId_lable: '必得福生产线-H',
      factoryData: [],

      SocketIO: [
        this.$store.state.socket.factoryAll,
      ],
    }
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {
    this.get_data_factory()
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},

  methods: {
    routeChange: function() {},
    get_data_factory: function() {
      let that = this;
      this.$socket.emit(that.SocketIO[0], {
        'ID1': this.factoryId,
      }, function(data) {
        console.log('获取产线 >>>>>>>>>>>>>>>>>>>>>>>>> nav_query_all_parts');
        console.log(data);
        this.navList = that.factoryData.concat(data);
        that.factoryData = this.navList;
        that.$store.state.factory.data = this.navList;
        console.log(that.$store.state.factory.data);
      })
    },
    // getInfo: function() {
    //   let that = this;
    //   this.$socket.on('nav_check_part_fault', function(data) {
    //     console.log(data);
    //     for (let i = 0; i <= data.value.length; i++) {
    //       setTimeout(function() {
    //         that.$notify.error({
    //           title: '故障信息',
    //           message: data.value[i].unit + data.value[i].part + "发生故障. " + data.value[i].datetime,
    //           duration: 0,
    //           offset: 100
    //         });
    //       }, 100);
    //     }
    //   });
    //   // this.$socket.on('nav_parts_management_remind', function(data) {
    //   //   console.log(data);
    //   //   for (let i = 0; i < data.total; i++) {
    //   //     setTimeout(function() {
    //   //       that.$alert('<h5 style="line-height: 28px;">设备:' + data.value[i].unit + data.value[i].part + '</h5><h5 style="line-height: 28px;">配件: ' + data.value[i].name + '</h5><h5 style="line-height: 28px;">剩余' + data.value[i].remainingtime +
    //   //         '天到期</h5>', '设备更换提醒', {
    //   //           dangerouslyUseHTMLString: true,
    //   //           confirmButtonText: '知道了',
    //   //         });
    //   //     }, 100);
    //   //   }
    //   // });
    // },
  },
  computed: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
</style>
