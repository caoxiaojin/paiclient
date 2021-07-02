<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>任务模板</el-breadcrumb-item>
    <el-breadcrumb-item>模板信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入模板名" v-model="queryInfo.query" clearable @clear="gettemplateList">
          <el-button slot="append" icon="el-icon-search" @click="gettemplateList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ path: '/publish/template/add' }"><el-button type="primary">添加模板</el-button></router-link>
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
        query: ''
      },
      templateList: []
    }
  },
  created () {},
  methods: {
    async gettemplateList () {
      const { data: res } = await this.$http.get('publish/template', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.templateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
