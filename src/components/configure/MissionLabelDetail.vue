<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>定时配置</el-breadcrumb-item>
      <el-breadcrumb-item>脚本配置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入标签名" v-model="queryInfo.query" clearable @clear="getLabelList">
            <el-button slot="append" icon="el-icon-search" @click="getLabelList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">上传脚本</el-button>
        </el-col>
      </el-row>
      <el-table :data="scriptlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="脚本" prop="name"></el-table-column>
        <el-table-column label="md5值" prop="md5"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scopre">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeConfig(scopre.row)"></el-button>
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
      name: '',
      scriptlist: []
    }
  },
  created () {
    this.name = this.$route.params.name
    this.getscriptlist(this.name)
  },
  methods: {
    async getscriptlist (name) {
      const { data: res } = await this.$http.get(`configure/script/missionscript?name=${name}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      console.log(res.data)
      this.scriptlist = res.data
    },
    async removeConfig (row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除配置, 是否继续?',
        '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('configure/script/missionscript?name=' + this.name + '&script=' + row.name)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getscriptlist(this.name)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
