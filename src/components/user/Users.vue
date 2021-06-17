<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加配置</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageSize: 2,
        page: 1
      },
      configlist: [],
      total: 0
    }
  },
  created () {
    this.gettaskConfig()
  },
  methods: {
    async gettaskConfig () {
      const { data: res } = await this.$http.get('task/config', { params: this.queryInfo })
      if (res.codo !== 200) return this.$message.error(res.msg)
      this.configlist = res.data
      this.total = res.count
    }
  }
}
</script>

<style lang="less" scoped>

</style>
