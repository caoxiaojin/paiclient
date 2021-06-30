<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>访问管理</el-breadcrumb-item>
    <el-breadcrumb-item>访问分析</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-date-picker placeholder="请输入开始时间" v-model="queryInfo.start_time" type="datetime" value-format="timestamp" clearable @change="getvisitreport" @clear="getvisitreport">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-date-picker placeholder="请输入结束时间" v-model="queryInfo.end_time" type="datetime" value-format="timestamp" clearable @change="getvisitreport" @clear="getvisitreport">
        </el-date-picker>
      </el-col>
    </el-row>
    <!--    2 为 图表准备宽度-->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      queryInfo: {
        start_time: '',
        end_time: ''
      },
      option: {
        title: {
          text: '用户访问量分析'
        },
        tooltip: {},
        legend: {
          data: ['访问量']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      }
    }
  },
  mounted () {
    this.getvisitreport()
  },
  methods: {
    async getvisitreport () {
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.get('audit/visitreport', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.option.xAxis.data = res.data.userlist
      this.option.series[0].data = res.data.countlist
      myChart.setOption(this.option)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
