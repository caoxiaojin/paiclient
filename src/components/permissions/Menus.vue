<template>
<div>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="menuList" border stripe>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="图标" prop="icon"></el-table-column>
        <el-table-column label="fid" prop="fid"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scopre">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scopre.row.username)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data: res } = await this.$http.get('suppermenu?menu=list')
      if (res.codo !== 200) {
        return this.$message.error(res.msg)
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
