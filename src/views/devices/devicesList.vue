<template>
<div class="devicesList page">
  <el-row :gutter="20">
    <el-col :span="18">
      <div class="box ">
        <div class="title">
          <span>全部设备列表</span>
          <a v-if="!openClose.toString()==''||!status.toString()==''||!group.toString()==''||!search.toString()==''" @click="set_clear"><i class="fa fa-times" aria-hidden="true"></i> 清空条件</a>
        </div>
        <div class="content">
          <div class="inhaul">
            <div class="left">
              <div class="sort">
                <el-select v-model="openClose" placeholder="全部启停" @change="set_openClose">
                  <el-option v-for="item in openClose_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="sort">
                <el-select v-model="status" placeholder="全部故障状态" @change="set_status">
                  <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="sort">
                <el-select v-model="group" placeholder="全部系统" @change="set_group">
                  <el-option v-for="item in group_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="right">
              <div class="search">
                <el-input v-model="search" placeholder="请输入您要找的关键字" suffix-icon="el-icon-search" clearable @keyup.enter.native="set_search">
                </el-input>
              </div>
            </div>
          </div>
          <div class="list">
            <ul class="title column">
              <li class="dot"></li>
              <li class="name">设备名</li>
              <li class="group">归属系统</li>
              <li class="openClose">启停</li>
              <li class="status">故障状态</li>
              <li class="propertyNum">测点数</li>
              <li class="edit">操作</li>
            </ul>
            <h5 v-if="total==0">{{total_text}}</h5>
            <ul class="content" v-show="total>0">
              <li v-for="(item, index) in devicesList" :key="index" class="animated fadeIn">
                <ul class="title column">
                  <li class="dot"><i v-bind:class="[item.status ? 'warning' : 'normal',item.isrunning ? '' : 'closed' ]"></i></li>
                  <li class="name">{{item.name}}</li>
                  <li class="group">{{item.unit}}</li>
                  <li class="openClose" v-bind:class="[item.isrunning ? 'running' : 'closed', item.status ? 'warning' : 'normal' ]"></li>
                  <li class="status" v-bind:class="[item.status ? 'warning' : 'normal',item.isrunning ? 'running' : 'closed' ]"></li>
                  <li class="propertyNum">{{item.properties}}</li>
                  <li class="edit"><a @click="goto_device(item.unit,item.name)">查看设备</a></li>
                </ul>
              </li>
            </ul>

            <el-pagination v-if="total>10" @current-change="set_page" background layout="total, prev, pager, next" :total="total" :current-page.sync="page">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <!-- <div class="box">
        <div class="title">
          <span>最近一条报警信息</span>
          <div class="btn">
            <a>more</a>
          </div>
        </div>
        <div class="content">
          <div class="warningInfo">
            <ul>
              <li>
                <h5 class="warning">警报 : 超过预警值</h5>
                <h6><strong>SB1热压辊-温度</strong>,超过预警值,警报时实时值为<strong>542</strong>,阈值为<strong>540</strong>.</h6>
                <a>查看报警时测点曲线</a>
                <span>2018-07-10 16:13:22</span>
              </li>
            </ul>
          </div>
        </div>
      </div> -->
      <div class="box">
        <div class="title">
          <span>列表设备启停统计</span>
        </div>
        <div class="content">
          <div class="echart">
            <div class="canvas" id="myChart_001">
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="title">
          <span>列表设备故障状态统计</span>
        </div>
        <div class="content">
          <div class="echart">
            <div class="canvas" id="myChart_002">
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="box">
        <div class="title">
          <span>全部设备归属统计</span>
        </div>
        <div class="content">
          <div class="echart">
            <div class="canvas" id="myChart_003">
            </div>
          </div>
        </div>
      </div> -->
    </el-col>
  </el-row>

</div>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
export default {
  data() {
    return {
      SocketIO: [
        this.$store.state.socket.deviceList,
      ],

      //列表
      openClose: '',
      status: '',
      group: '',
      search: '',
      page: 1,
      total: '',
      total_text: '数据加载中,请您稍后.',
      openClose_options: [{
          value: '',
          label: '全部启停'
        }, {
          value: 1,
          label: '运行'
        },
        {
          value: 0,
          label: '关闭'
        }
      ],
      status_options: [{
          value: '',
          label: '全部故障状态'
        },
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '故障'
        },
      ],
      group_options: [{
        value: '',
        label: '全部系统'
      }],
      devicesList: [],

      //图表
      echart_001: '',
      echart_002: '',
      echart_003: '',
      fault: 0,
      closed: 0,
    }
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {
    this.get_data_group();
  },
  mounted: function() {
    this.socketOn();
    this.get_data_devicesList_default();
    this.createChart_001();
    this.createChart_002();
    this.createChart_003();
  },
  beforeDestroy: function() {
    this.$socket.removeAllListeners(this.SocketIO[0]);
  },
  destroyed: function() {},
  //函数
  methods: {
    //data事件
    socketOn: function() {
      let that = this;
      this.$socket.on(that.SocketIO[0], function(data) {
        console.log('获取设备列表 >>>>>>>>>>>>>>>>>>>>>>>>> div_query_all_parts');
        console.log(data);
        that.devicesList = [];
        that.total_text = '数据加载中,请您稍后.';
        if (data.total >= 0) {
          that.total = data.total;
          if (data.total == 0) {
            that.total_text = '获取不到相应的数据.'
          }
        }
        this.parts = that.devicesList.concat(data.parts);
        that.devicesList = this.parts;
        that.fault = data.fault;
        that.closed = data.closed;
        that.refreshData();
      });
    },
    get_data_devicesList_default: function() {
      let that = this;
      this.$socket.emit(that.SocketIO[0], {
        'args': '',
        'page': '',
      });
    },
    get_data_devicesList_inhaul: function() {
      let that = this;
      that.page = 1;
      this.$socket.emit(that.SocketIO[0], {
        'args': {
          'isrunning': that.openClose,
          'status': that.status,
          'unit': that.group,
          'keywords': that.search,
        },
        'page': '',
      });
    },
    get_data_devicesList_page: function() {
      let that = this;
      this.$socket.emit(that.SocketIO[0], {
        "args": '',
        "page": that.page - 1,
      });
    },
    get_data_group: function() {
      let that = this;
      setTimeout(function() {
        if (that.$store.state.factory.data.length == 0) {
          setTimeout(function() {
            that.get_data_group();
            return false;
          }, 500);
        } else {
          let list = that.$store.state.factory.data;
          for (let index in list) {
            that.group_options.push({
              value: list[index].unit,
              label: list[index].unit
            })
          };
        }
      }, 500);
    },
    //data事件 结束 -------------------------

    //引索事件
    set_search: function(val) {
      this.get_data_devicesList_inhaul();
    },
    set_page: function(val) {
      this.get_data_devicesList_page();
    },
    set_openClose: function(val) {
      this.get_data_devicesList_inhaul()
    },
    set_status: function(val) {
      this.get_data_devicesList_inhaul();
    },
    set_group: function(val) {
      this.get_data_devicesList_inhaul();
    },
    set_clear: function() {
      this.openClose = '';
      this.status = '';
      this.group = '';
      this.search = '';
      this.page = 0;
      this.get_data_devicesList_inhaul();
    },
    refreshData: function() {
      let that = this;
      let closed = that.closed;
      let fault = that.fault;
      let running = that.total - closed;
      let normal = that.total - fault;
      that.echart_001.setOption({
        series: [{
          data: [{
            value: running,
            name: '启动',
            itemStyle: {
              color: '#2ECC71'
            },
          }, {
            value: closed,
            name: '关闭',
            itemStyle: {
              color: '#BDC3C7'
            },
          }]
        }]
      });
      that.echart_002.setOption({
        series: [{
          data: [{
              value: normal,
              name: '正常',
              itemStyle: {
                color: '#2ECC71'
              },
            },
            {
              value: fault,
              name: '故障',
              itemStyle: {
                color: '#C0392B'
              },
            }
          ]
        }]
      });
    },
    //引索事件 结束-----------------------------

    //echart
    createChart_001: function() {
      this.echart_001 = this.$echarts.init(document.getElementById('myChart_001'));
      this.echart_001.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          orient: 'vertical',
          top: '0',
          right: '20',
          data: ['启动', '关闭'],
          backgroundColor: '#eee',
          borderRadius: 5,
        },
        series: [{
          type: 'pie',
          center: ['42%', '50%'],
          radius: ['42%', '66%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: "{b}\n{d}%",
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
          },
          data: [{
              value: 0,
              name: '启动',
              itemStyle: {
                color: '#2ECC71'
              },
            },
            {
              value: 0,
              name: '关闭',
              itemStyle: {
                color: '#BDC3C7'
              },
            }
          ]
        }]
      });
    },
    createChart_002: function() {
      this.echart_002 = this.$echarts.init(document.getElementById('myChart_002'));
      this.echart_002.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          orient: 'vertical',
          top: '0',
          right: '20',
          data: ['正常', '故障'],
          backgroundColor: '#eee',
          borderRadius: 5,
        },
        series: [{
          type: 'pie',
          center: ['42%', '50%'],
          radius: ['42%', '66%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: "{b}\n{d}%",
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
          },
          data: [{
              value: 0,
              name: '正常',
              itemStyle: {
                color: '#2ECC71'
              },
            },
            {
              value: 0,
              name: '故障',
              itemStyle: {
                color: '#C0392B'
              },
            }
          ]
        }]
      });
    },
    createChart_003: function() {
      let list = this.$store.state.factory.data;
      let legend = [];
      let data = [];
      console.log(list);
      for (let i in list) {
        legend.push(list[i].unit);
        data.push({
          value: list[i].parts.length,
          name: list[i].unit,
          itemStyle: {
            color: this.$store.state.color[i],
          },
        });
      }
      this.echart_003 = this.$echarts.init(document.getElementById('myChart_003'));
      this.echart_003.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          orient: 'vertical',
          top: '0',
          right: '20',
          data: legend,
          backgroundColor: '#eee',
          borderRadius: 5,
        },
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['42%', '66%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: "{b}\n{d}%",
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
          },
          data: data
        }]
      });
    },
    //echart end ------------------------------

    //路由事件
    routeChange: function() {
      this.get_data_devicesList_default();
    },

    goto_device: function(group, device) {
      this.$router.push({
        path: '/device/' + group + device,
        query: {
          group: group,
          device: device,
        }
      })
    }
    //路由事件 结束-----------------------------


  },
  computed: {},
  components: {},
  watch: {
    '$route': 'routeChange',
  },
}
</script>
<style lang="scss" scoped>
div.list {
    border-top: 1px solid #ddd;
    > h5 {
        margin-top: 20px;
        height: 200px;
        line-height: 200px;
        text-align: center;
        font-size: 14px;
        color: #7F8C8D;
    }

    ul.column {
        > li {
            transition: color 0.3s;

            &.dot {
                width: 5%;
                > i {
                    display: block;
                    width: 8px;
                    height: 20px;
                    background-color: #ccc;
                    margin: 0 auto;
                    border-radius: 10px;
                    &.normal {
                        background-color: #2ECC71;
                    }
                    &.warning {
                        background-color: #E74C3C;
                    }
                    &.closed {
                        background-color: #BDC3C7;
                    }
                }
            }
            &.name {
                width: 20%;
            }
            &.group {
                width: 20%;
            }
            &.openClose {
                width: 10%;
                text-align: center;
                &.running {
                    color: #27AE60;
                    &.warning {
                        color: #C0392B;
                    }
                    &::after {
                        content: '启动';
                    }
                }
                &.closed {
                    &::after {
                        content: '停机';
                    }
                }
            }
            &.status {
                width: 10%;
                text-align: center;
                &.running {
                    color: #27AE60;
                    &.warning {
                        color: #C0392B;
                        &::after {
                            content: '故障';
                        }
                    }
                    &::after {
                        content: '正常';
                    }
                }
                &.closed {
                    &::after {
                        content: ' ';
                    }
                }
            }
            &.propertyNum {
                width: 10%;
                text-align: center;
            }
            &.edit {
                width: 25%;
                text-align: right;
                position: relative;
                overflow: hidden;
                > a {
                    position: absolute;
                    top: 14px;
                    right: -200px;
                    white-space: nowrap;
                    font-size: 12px;
                    padding: 0 15px;
                    background-color: #409eff;
                    line-height: 32px;
                    display: block;
                    height: 32px;
                    color: #fff;
                    border-radius: 20px;
                    &:hover {}
                }
            }
        }
        &:hover {
            > li {
                color: #000;
                &.edit {
                    > a {
                        right: 20px;
                    }
                }
            }

        }
    }
}
</style>
