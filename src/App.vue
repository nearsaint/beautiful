<template>
<div id="app">
  <el-container v-bind:class="[this.$store.state.loading ? 'blur' : '','main']">
    <el-header>
      <nav-component></nav-component>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  <div class="loading" v-show="this.$store.state.loading">
    <div class="spinner">
      <!-- <b class="logo"></b> -->
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
      <span>我们在给你拼命加载中</span>
    </div>
  </div>

</div>
</template>

<script>
// 引入组件
import NavComponent from 'components/nav-component.vue'

// vue
export default {
  name: 'app',

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {},
  sockets: {
    connect: function() {
      console.log('socket is connected');
      this.$store.state.loading = false;
    },
    disconnect: function() {
      console.log('socket is disconnected');
      this.$store.state.loading = true;
    },
  },
  components: {
    NavComponent
  },
}
</script>
<style lang="scss" scoped>
#app {
    min-height: 100%;
    height: 100%;
}
.main {
    transition: filter 3s;

    &.blur {
        filter: blur(3px);
    }
}
.el-main {
    padding: 0;
}
div.loading {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.8);
    z-index: 999999;
}
.spinner {
    width: 200px;
    height: 40px;
    text-align: center;
    font-size: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    margin-top: -80px;
    > span {
        color: #999;
        display: block;
        text-align: center;
        margin-top: 10px;
    }
    > b.logo {
        display: block;
        margin-bottom: 10px;
        width: 100%;
        height: 50px;
        background-image: url("~images/logo/logo-en.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
}

.spinner > div {
    background-color: #3498DB;
    height: 100%;
    width: 20px;
    display: inline-block;

    -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
    animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
    background-color: #1ABC9C;
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.spinner .rect3 {
    background-color: #2ECC71;
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
}

.spinner .rect4 {
    background-color: #F1C40F;
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.spinner .rect5 {
    background-color: #E67E22;
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
    0%,
    100%,
    40% {
        -webkit-transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1.0);
    }
}

@keyframes stretchdelay {
    0%,
    100%,
    40% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
    }
}
</style>
