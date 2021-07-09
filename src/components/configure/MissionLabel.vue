<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>定时配置</el-breadcrumb-item>
    <el-breadcrumb-item>任务配置</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入标签名" v-model="queryInfo.query" clearable @clear="getLabelList">
          <el-button slot="append" icon="el-icon-search" @click="getLabelList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加标签</el-button>
      </el-col>
    </el-row>
    <el-table :data="labelList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="标签名称" prop="name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scopre">
          <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
            <router-link :to="{ path: '/configure/label/' + scopre.row.name }">
              <el-button type="primary" icon="el-icon-share" size="mini" ></el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
      labelList: [],
      addDialogVisible: false
    }
  },
  mounted () {
    this.getLabelList()
  },
  methods: {
    async getLabelList () {
      const { data: res } = await this.$http.get('configure/missionplan/label', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.labelList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
