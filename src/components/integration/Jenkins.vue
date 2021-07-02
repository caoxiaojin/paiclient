<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>jenkins-job</el-breadcrumb-item>
    <el-breadcrumb-item>job信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入名字" v-model="queryInfo.query" clearable @clear="getLabelList">
          <el-button slot="append" icon="el-icon-search" @click="getLabelList"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="jenkinsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="任务名称" prop="name"></el-table-column>
      <el-table-column label="任务状态" prop="color"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scopre">
          <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="removeMachine(scopre.row.name)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMachine(scopre.row.name)"></el-button>
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
      jenkinsList: []
    }
  },
  created () {
  },
  methods () {}
}
</script>

<style scoped>

</style>
