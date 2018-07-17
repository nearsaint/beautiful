<template>
<div>
  <nav class="meun_lv3 animated fadeInDown">
    <ul>
      <li>
        <router-link :to="{ path: '/devices/devicesList'}">设备管理</router-link>
        <hr>
      </li>
      <li>
        <router-link :to="{ path: '/devices/groups/group/'+query.group ,query:{ group: query.group} }">{{query.group}}</router-link>
        <hr>
      </li>
      <li>
        <router-link :to="{ path: '/device/'+query.group+query.device ,query:{ group: query.group, device: query.device} }">{{query.device}}</router-link>
      </li>
    </ul>
    <div class="btn">
      <router-link :to="{ path: '/chart' }"><i class="fa fa-download" aria-hidden="true"></i> 导出报表</router-link>
      <router-link :to="{ path: '/chart' }"><i class="fa fa-bar-chart" aria-hidden="true"></i> 数据曲线</router-link>
    </div>
  </nav>
  <div class="device page">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="box ">
          <div class="title">
            <span>设备测点列表</span>
          </div>
          <div class="content">
            <div class="list">
              <h5 v-if="total==0">{{total_text}}</h5>
              <ul class="pointBox">
                <li v-for="(item, index) in propertyList" :key="index" class="animated fadeIn" v-bind:class="(propertyStatusClass(item.rvalue,item.tvaluel,item.tvalueh))">
                  <h5><i></i><span>{{item.name}}</span></h5>
                  <div class="value">
                    <div>
                      <h5 class="hight">{{propertyValueR(item.rvalue)}}</h5>
                      <h6>实时值</h6>
                    </div>
                    <div>
                      <h5 class="hight">{{propertyStatus(item.rvalue,item.tvaluel,item.tvalueh)}}</h5>
                      <h6>阈值状态</h6>
                    </div>
                    <div>
                      <h5>{{propertyValueS(item.svaluel,item.svalueh)}}</h5>
                      <h6>设定值</h6>
                    </div>
                    <div>
                      <h5>{{propertyValueT(item.tvaluel,item.tvalueh)}}</h5>
                      <h6>阈值</h6>
                    </div>
                  </div>
                  <div class="chart">
                    <div class="canvas" v-bind:id="'myChart_'+index">
                    </div>
                  </div>
                  <div class="btn">
                    <a @click="set_tvalue(query.group,query.device,item.name,item.tvaluel,item.tvalueh)">阈值设置</a>
                    <a @click="goto_property(item.name)">查看测点</a>
                  </div>
                  <!-- {{createChart(index,item.datetime,item.value,item.rvalue,item.tvaluel,item.tvalueh)}}  -->
                  <!-- {{createChart(index,item.datetime,item.value,item.rvalue,item.tvaluel,item.tvalueh)}} -->
                </li>
              </ul>
              <el-pagination v-if="total>10" @current-change="set_page" background layout="total, prev, pager, next" :total="total" :current-page.sync="page">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box_status">
          <div class="openClose" v-bind:class="[this.isrunning ? 'normal' : 'closed']">
            <b></b>
            <h5></h5>
            <h6>设备启停</h6>
            <i class="fa fa-plug" aria-hidden="true"></i>
          </div>
          <div class="status" v-bind:class="[this.status ? 'warning' : 'normal']">
            <h5></h5>
            <h6>系统故障状态</h6>
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
        </div>
        <div class="box">
          <div class="title">
            <span>设备基本信息</span>
          </div>
          <div class="content">
            <ul class="info">
              <li><span>设备名</span>
                <h6>{{query.device}}</h6></li>
              <li><span>系统归属</span>
                <h6>{{query.group}}</h6></li>
              <li><span>测点总数</span>
                <h6>{{total}}</h6></li>
              <li><span>系统描述</span>
                <h6>3号喷丝系统</h6></li>
            </ul>
          </div>
        </div>
        <div class="box">
          <div class="title">
            <span>设备阈值</span>
          </div>
          <div class="content">
            <ul class="info set">
              <li v-for="(item, index) in propertyList" :key="index" class="animated fadeIn">
                <span>{{item.name}}</span>
                <h6>{{propertyValueT(item.tvaluel,item.tvalueh)}}</h6>
                <a @click="set_tvalue(query.group,query.device,item.name,item.tvaluel,item.tvalueh)">设置</a>
              </li>
            </ul>
            <el-pagination v-if="total>10" @current-change="set_page" layout="prev, pager, next" :total="total" :current-page.sync="page">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
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
        this.$store.state.socket.propertyList,
      ],
      query: {
        group: '未知系统',
        device: '未知设备',
      },
      //列表
      search: '',
      page: 1,
      total: '',
      total_text: '数据加载中,请您稍后.',
      propertyList: [],
      isrunning: false,
      status: 0,
      tvaluel: '',
      tvalueh: '',
      treturn: false,
      //echart
      echart: [{
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
        {
          chart: ''
        },
      ],
    }
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {
    this.get_data_query();
  },
  mounted: function() {
    this.socketOn();
    this.get_data_propertyList();
  },
  beforeDestroy: function() {},
  destroyed: function() {
    this.$socket.removeAllListeners(this.SocketIO[0]);
  },
  //函数
  methods: {
    //data事件
    get_data_query: function() {
      this.query.group = this.$route.query.group;
      this.query.device = this.$route.query.device;
    },
    socketOn: function() {
      let that = this;
      this.$socket.on(that.SocketIO[0], function(data) {
        console.log('获取设备列表 >>>>>>>>>>>>>>>>>>>>>>>>>' + that.SocketIO[0]);
        console.log(data);
        that.propertyList = [];
        that.total_text = '数据加载中,请您稍后.';
        if (data.total >= 0) {
          that.total = data.total;
          if (data.total == 0) {
            that.total_text = '获取不到相应的数据.'
          }
        }
        this.propertyList = that.propertyList.concat(data.point);
        that.propertyList = this.propertyList;
        that.isrunning = data.isrunning;
        that.status = data.status;
      });
    },
    get_data_propertyList: function() {
      let that = this;
      that.page = 1;
      this.$socket.emit(that.SocketIO[0], {
        'args': {
          'unit': that.query.group,
          'part': that.query.device,
          'keywords': that.search,
        },
        'page': '',
      });
    },
    get_data_propertyList_page: function() {
      console.log('emit')
      let that = this;
      this.$socket.emit(that.SocketIO[0], {
        "args": '',
        "page": that.page - 1,
      });
    },

    //路由变化
    routeChange: function() {
      this.getQuery();
      this.getList_default();
      this.search = '';
      this.total0 = '加载中';
    },
    goto_property: function(property) {
      this.$router.push({
        path: '/property/' + this.query.group + this.query.device + property,
        query: {
          group: this.query.group,
          device: this.query.device,
          property: property,
        }
      })
    },

    //值
    propertyStatusClass: function(v, tvl, tvh) {
      if (v) {
        if (tvl && tvh) {
          if (v > tvl && v < tvh) {
            return 'normal';
          } else {
            return 'warning';
          }
        } else {
          if (tvl) {
            if (v > tvl) {
              return 'normal';
            } else {
              return 'warning';
            }
          } else if (tvh) {
            if (v < tvh) {
              return 'normal';
            } else {
              return 'warning';
            }
          } else {
            return 'normal'
          }
        }
      } else {
        return 'closed'
      }

    },
    propertyStatus: function(v, tvl, tvh) {
      if (v) {
        if (v < tvl) {
          return '低于最低阈值'
        } else if (v > tvh) {
          return '超过最高阈值'
        } else {
          return '正常'
        }
      } else {
        return '设备停机'
      }

    },
    propertyValueR: function(rv) {
      if (rv) {
        return rv;
      } else {
        if (rv.toString() == '0') {
          return '0';
        } else {
          return 'null';
        }
      }
    },
    propertyValueT: function(tvl, tvh) {
      if (tvl && tvh) {
        return tvl + '至' + tvh;
      } else {
        if (tvl) {
          return '大于' + tvl;
        } else if (tvh) {
          return '小于' + tvh;
        } else {
          if (tvl.toString() == '0' || tvh.toString() == '0') {
            return '0';
          } else {
            return 'null'
          }
        }
      }
    },
    propertyValueS: function(svl, svh) {
      if (svl && svh) {
        return svl + ',' + svh;
      } else {
        if (svl) {
          return svl;
        } else if (svh) {
          return svh;
        } else {
          if (svl.toString() == '0' || svh.toString() == '0') {
            return '0';
          } else {
            return 'null'
          }
        }
      }
    },
    set_tvalue: function(group, device, property, tvl, tvh) {
      this.tvaluel = '';
      this.tvalueh = '';
      this.treturn = false;
      this.set_tvaluel(group, device, property, tvl, tvh);
    },
    set_tvaluel: function(group, device, property, tvl, tvh) {
      this.$prompt('请输入 ' + group + device + property + ' 低限阈值', '设置', {
        confirmButtonText: '下一步',
        cancelButtonText: '取消',
        inputType: 'number',
        inputValue: tvl,
        lockScroll: false,
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
      }).then(({
        value: tvaluel
      }) => {
        this.tvaluel = tvaluel;
        this.set_tvalueh(group, device, property, tvl, tvh);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    set_tvalueh: function(group, device, property, tvl, tvh) {
      this.$prompt('请输入 ' + group + device + property + ' 高限阈值', '设置', {
        confirmButtonText: '下一步',
        cancelButtonText: '上一步',
        inputType: 'number',
        inputValue: tvh,
        lockScroll: false,
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
      }).then(({
        value: tvalueh
      }) => {
        this.tvalueh = tvalueh;
        this.set_tvalue_finnal(group, device, property, tvl, tvh)
      }).catch(() => {
        this.set_tvaluel(group, device, property, tvl, tvh);
      });
    },
    set_tvalue_finnal: function(group, device, property, tvl, tvh) {
      if (this.tvaluel && this.tvalueh && this.tvalueh < this.tvaluel) {
        this.$alert('您设置的高限阈值小于低限阈值', '错误设置', {
          confirmButtonText: '重新设置',
          lockScroll: false,
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          callback: action => {
            this.set_tvalue(group, device, property, tvl, tvh);
          }
        });
      } else {
        this.$confirm('此操作将设置' + group + device + property + '的阈值, 实时值超过阈值将显示警报,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false,
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.updata_tvalue(group, device, property, this.tvaluel, this.tvalueh);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消设置'
          });
        });
      }

    },
    updata_tvalue: function(group, device, property, tvl, tvh) {
      let that = this;
      that.treturn = false;
      that.$socket.emit(that.SocketIO[0], {
        'args': {
          'unit': group,
          'part': device,
          'property': property,
          "tvaluel": tvl,
          "tvalueh": tvh,
        },
        'page': '',
      }, function(data) {
        if (data == 'OK') {
          that.$message({
            type: 'success',
            message: '设置成功.'
          });
          that.get_data_propertyList();
        } else {
          that.$message.error('未知错误,请先检查网络是否连接!');
        }
      });
    },
    set_page: function(val) {
      let that = this;
      for (let i in that.propertyList) {
        console.log(that.echart[i].chart);
        if (!that.echart[i].chart == '') {
          that.echart[i].chart.dispose();
        }
      }
      this.get_data_propertyList_page();
    },

    //echart
    createChart: function(index, date, data, v, tvl, tvh) {
      let that = this;
      let id = 'myChart_' + index;
      let color_area1, color_area2, color_line, color_item;
      if (v) {
        if (tvl, tvh) {
          if (v > tvl && v < tvh) {
            color_area1 = '#2ECC71';
            color_area2 = '#1ABC9C';
            color_line = '#27AE60';
            color_item = '#16A085';
          } else {
            color_area1 = '#E74C3C';
            color_area2 = '#E67E22';
            color_line = '#C0392B';
            color_item = '#D35400';
          }
        } else if (tvl) {
          if (v > tvl) {
            color_area1 = '#2ECC71';
            color_area2 = '#1ABC9C';
            color_line = '#27AE60';
            color_item = '#16A085';
          } else {
            color_area1 = '#E74C3C';
            color_area2 = '#E67E22';
            color_line = '#C0392B';
            color_item = '#D35400';
          }
        } else if (tvh) {
          if (v < tvh) {
            color_area1 = '#2ECC71';
            color_area2 = '#1ABC9C';
            color_line = '#27AE60';
            color_item = '#16A085';
          } else {
            color_area1 = '#E74C3C';
            color_area2 = '#E67E22';
            color_line = '#C0392B';
            color_item = '#D35400';
          }
        } else {
          color_area1 = '#2ECC71';
          color_area2 = '#1ABC9C';
          color_line = '#27AE60';
          color_item = '#16A085';
        }
      } else {
        color_area1 = '#ccc';
        color_area2 = '#ddd';
        color_line = '#ccc';
        color_item = '#bbb';
      };
      that.echart[index].chart = that.$echarts.init(document.getElementById(id));
      that.echart[index].chart.setOption({
        xAxis: {
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: date,
          axisPointer: {
            label: {
              formatter: function(params) {
                return (params.seriesData.length ? '值:' + params.seriesData[0].data : '') + '  时间:' + params.value;
              }
            }
          },
        },
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          }
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        yAxis: {
          boundaryGap: ['20%', '20%'],
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          scale: true,
        },
        series: [{
          data: data,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: color_line
          },
          itemStyle: {
            borderWidth: '4',
            borderColor: color_item
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: color_area1 // 0% 处的颜色
              }, {
                offset: 1,
                color: color_area2 // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        }]
      });
    },
  },
  computed: {},
  components: {},
  watch: {
    propertyList: function() {
      let that = this;
      that.$nextTick(function() {
        for (let i in that.propertyList) {
          if (!that.propertyList[i].value.length == 0) {
            let date = that.propertyList[i].datetime;
            let data = that.propertyList[i].value;
            let rdata = that.propertyList[i].rvalue;
            let rdatal = that.propertyList[i].tvaluel;
            let rdatah = that.propertyList[i].tvalueh;
            that.createChart(i, date, data, rdata, rdatal, rdatah)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
div.box_status {
    width: 100%;
    height: auto;
    > div {
        background-color: #ccc;
        border-radius: 5px;
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #ddd;
        position: relative;
        overflow: hidden;
        > h6 {
            color: #ECF0F1;
            line-height: 20px;
            height: 20px;
        }
        > h5 {
            color: #fff;
            font-size: 24px;
            margin-bottom: 10px;
            line-height: 30px;
            height: 30px;
        }
        > i {
            position: absolute;
            color: #ddd;
            font-size: 120px;
            top: -10px;
            right: 20px;
        }
        &.openClose {
            &.normal {
                background-color: #2ECC71;
                > i {
                    color: #27AE60;
                }
                > h5::after {
                    content: '启动',;
                }
            }
            &.closed {
                > h5::after {
                    content: '关闭',;
                }
            }
        }

        &.status {
            &.normal {
                background-color: #2ECC71;
                > i {
                    color: #27AE60;
                }
                > h5::after {
                    content: '正常',;
                }
            }
            &.warning {
                background-color: #E74C3C;
                > i {
                    color: #C0392B;
                }
                > h5::after {
                    content: '故障',;
                }
            }
        }
    }
}
div.list {
    > h5 {
        margin-top: 20px;
        height: 200px;
        line-height: 200px;
        text-align: center;
        font-size: 14px;
        color: #7F8C8D;
    }
    > ul.pointBox {

        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 10px;
        > li {
            width: calc(50% - 20px);
            border: 1px solid #ddd;
            margin: 10px;
            border-radius: 5px;
            padding: 20px;
            position: relative;
            overflow: hidden;

            &.closed {
                background-color: #eee;
            }
            &.warning {
                background-color: #fef0f0;
                > div.btn > a {
                    background: #E74C3C;
                }
                > h5 {
                    > i {
                        background-color: #E74C3C;
                    }
                }
                > div.value {
                    h5.hight {
                        color: #E74C3C;
                    }
                }
                &:hover {
                    border-color: #E74C3C !important;
                }
            }
            &.normal {
                background-color: #f0f9eb;
                > div.btn > a {
                    background: #27AE60;
                }
                > h5 {
                    > i {
                        background-color: #27AE60;
                    }
                }
                > div.value {
                    h5.hight {
                        color: #27AE60;
                    }
                }
                &:hover {
                    border-color: #27AE60 !important;
                }
            }
            > h5 {
                font-size: 16px;
                margin-bottom: 30px;
                line-height: 32px;
                display: flex;
                > i {
                    display: block;
                    height: 20px;
                    margin: 6px 10px 6px 0;
                    width: 6px;
                    border-radius: 10px;
                    background-color: #ccc;
                }
            }
            > div.value {
                display: flex;
                flex-wrap: wrap;
                > div {
                    width: 50%;
                    padding-right: 20px;
                    margin-bottom: 20px;
                    > h5 {
                        font-size: 24px;
                        margin-bottom: 10px;
                        color: #34495E;
                    }
                    > h6 {
                        font-size: 12px;
                        color: #89949b;
                    }
                }
            }
            > div.chart {
                height: 150px;
                margin: 0 -20px -20px;
                width: calc(100% + 40px);
                border-radius: 0 0 5px 5px;
                overflow: hidden;
                margin-top: 10px;
                border-top: 1px solid #bbb;
                position: relative;
                background: rgba(0,0,0,0.058) url("~images/bg_db.gif") repeat center;
            }
            > div.btn {
                transition: right 0.3s;
                position: absolute;
                top: 20px;
                right: -200px;
                > a {
                    display: inline-block;
                    border-radius: 50px;
                    line-height: 32px;
                    padding: 0 20px;
                    background: #409eff;
                    color: #fff;
                    font-size: 13px;
                }
            }
            &:hover {

                border-color: #409eff;
                > div.btn {
                    right: 20px;
                }
            }
        }
    }
}
</style>
