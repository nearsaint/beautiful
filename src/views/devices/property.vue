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
        <hr>
      </li>
      <li>
        <router-link :to="{ path: '/property/'+query.group+query.device+query.property ,query:{ group: query.group, device: query.device, property: query.property} }">{{query.property}}</router-link>
      </li>
    </ul>
    <div class="btn">
      <router-link :to="{ path: '/chart' }"><i class="fa fa-download" aria-hidden="true"></i> 导出报表</router-link>
      <router-link :to="{ path: '/chart' }"><i class="fa fa-bar-chart" aria-hidden="true"></i> 数据曲线</router-link>
    </div>
  </nav>
  <div class="property page">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="box ">
          <div class="content">
            <div class="mark_chart" v-show="this.propertyData.date==[]">
              <h5>设备暂无数据</h5>
            </div>
            <div class="toolbox">
              <h6>图表辅助</h6>
              <ul>
                <li>
                  <h5>设定值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
                <li>
                  <h5>高限阈值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
                <li>
                  <h5>低限阈值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
                <li>
                  <h5>平均值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
                <li>
                  <h5>最高值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
                <li>
                  <h5>最低值</h5>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </li>
              </ul>
            </div>
            <div class="chart">
              <div class="canvas" id="myChart_property">
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <div class="title">
            <span>图表区间数据统计(最近60个采样点数值)</span>
          </div>
          <div class="content">
            <div class="chartInfo">
              <div>
                <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
                <h6>稳定率(超阈值个数/总个数)</h6>
              </div>
              <ul>
                <li>
                  <h5>58</h5>
                  <h6>实时值</h6>
                </li>
                <li>
                  <h5>60</h5>
                  <h6>设定值</h6>
                </li>
                <li>
                  <h5>80-90</h5>
                  <h6>阈值 <a>[设置]</a></h6>
                </li>
                <li>
                  <h5>2</h5>
                  <h6>超阈值个数</h6>
                </li>
                <li>
                  <h5>55</h5>
                  <h6>最大值</h6>
                </li>
                <li>
                  <h5>44</h5>
                  <h6>最小值</h6>
                </li>
                <li>
                  <h5>11</h5>
                  <h6>波动偏差</h6>
                </li>
                <li>
                  <h5>48</h5>
                  <h6>平均值</h6>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="title">
            <span>测点基本信息</span>
          </div>
          <div class="content">
            <ul class="info">
              <li><span>测点名</span>
                <h6>{{query.property}}</h6></li>
              <li><span>系统归属</span>
                <h6>{{query.group}}</h6></li>
              <li><span>设备归属</span>
                <h6>{{query.device}}</h6></li>
              <li><span>测点描述</span>
                <h6>描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述</h6></li>
            </ul>
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
        this.$store.state.socket.property,
      ],
      query: {
        group: '未知系统',
        device: '未知设备',
        property: '未知测点',
      },
      total: '',
      total_text: '数据加载中,请您稍后.',
      propertyData: {
        data: [],
        date: [],
        lenght: 20,
        echart: '',
        rvalue: '',
      },
    }
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {
    this.get_data_query();
  },
  mounted: function() {
    this.createChart();
    this.socketOn();
    this.get_data_property_default();
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
      this.query.property = this.$route.query.property;
    },
    socketOn: function() {
      let that = this;
      this.$socket.on(that.SocketIO[0], function(data) {
        console.log('获取测点数据 >>>>>>>>>>>>>>>>>>>>>>>>>' + that.SocketIO[0]);
        console.log(data);
        this.date = that.propertyData.date.concat(data.datetime);
        this.data = that.propertyData.data.concat(data.value);
        that.propertyData.date = this.date;
        that.propertyData.data = this.data;
        that.propertyData.rvalue = that.propertyData.data[that.propertyData.data.length - 1];
        if (that.propertyData.data.length > that.propertyData.lenght) {
          that.propertyData.data.shift();
          that.propertyData.date.shift();
        }
        that.refreshData();
      });
    },
    get_data_property_default: function() {
      let that = this;
      this.$socket.emit(that.SocketIO[0], {
        "args": {
          "unit": that.query.group,
          "part": that.query.device,
          "point": that.query.property
        }
      });
    },

    //set
    createChart: function() {
      let that = this;
      that.propertyData.echart = that.$echarts.init(document.getElementById('myChart_property'));
      that.propertyData.echart.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          show: true,
          right: 20,
          bottom: 15,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {
              show: false,
              readOnly: false
            },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: '20px',
          right: '20px',
          left: '60px',
          bottom: '80px',
        },
        xAxis: {
          boundaryGap: false,

          axisLine: {
            show: true,
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#999',
            }
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            inside: true,
            lineStyle: {
              color: '#333',
            }
          },
          axisLabel: {
            show: true,
            align: 'left',
          },
          splitArea: {
            show: true,
            interval: 0,
          },
          splitLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: '#ddd',
            }
          },
          data: that.propertyData.date
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['20%', '20%'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#bbb',
            }
          },
          axisTick: {
            show: true,
            inside: true,
            lineStyle: {
              color: '#333',
            }
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
            }
          },
        },
        series: [{
          name: this.query_property,
          type: 'line',
          smooth: true,

          itemStyle: {
            normal: {
              color: '#409EFF'
            }
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
                color: '#999'
              }, {
                offset: 1,
                color: '#333'
              }],
              globalCoord: false
            }
          },
          // markLine: {
          //   silent: true,
          //   data: [{
          //     yAxis: this.query_vh
          //   }, {
          //     yAxis: this.query_vl
          //   }]
          // },
          data: that.propertyData.data
        }]
      });
    },
    refreshData: function() {
      let that = this;
      // that.propertyData.echart.refresh();
      that.propertyData.echart.setOption({
        xAxis: {
          data: that.propertyData.date
        },
        series: [{
          data: that.propertyData.data
        }]
      });
    },
  },
  computed: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
div.chart {
    width: 100%;
    height: 620px;
    margin: 0 -20px;
    position: relative;
}
div.chartInfo {
    > div {
        text-align: center;
        margin: 20px 0;
        > h6 {
            font-size: 12px;
            margin-top: 10px;
            color: #89949b;
        }
    }
    > ul {
        margin: 0 -20px;
        border-top: 1px solid #ddd;
        display: flex;
        flex-wrap: wrap;
        > li {
            width: 50%;
            padding: 20px;
            border-bottom: 1px solid #ddd;
            text-align: center;
            > h5 {
                font-size: 24px;
                font-weight: bolder;
                color: #444;
                margin-bottom: 10px;
            }
            > h6 {
                font-size: 12px;
                color: #89949b;
            }
        }
    }
}
div.mark_chart {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
    > h5 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%)translateY(-50%);
        font-size: 18px;
        color: #89949b;
    }
}
div.toolbox {
    margin: 0 -20px 20px;
    padding: 0 20px 20px;
    border-bottom: 1px solid #ddd;
    > h6 {
        color: #89949b;
        margin-bottom: 20px;
    }
    > ul {
        display: flex;
        flex-wrap: wrap;
        margin-right: -20px;
        li {
            width: calc(33.3333% - 20px);
            background-color: #eee;
            border-radius: 5px;
            border: 1px solid #ddd;
            padding: 20px;
            margin-right: 20px;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            > h5 {
                line-height: 20px;
                color: #89949b;
            }
        }
    }
}
</style>
