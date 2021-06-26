<template>
<div>
  <!--    面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>

  <!--    卡片视图 -->
  <el-card>
<!--    2 为 图表准备宽度-->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {}
  },
  mounted () {
    this.test()
  },
  methods: {
    test () {
      var myChart = echarts.init(document.getElementById('main'))
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      // 5 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
