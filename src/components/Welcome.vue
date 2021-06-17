<template>
  <div>webcome
    <el-main>
      <el-table :data="userData" border style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="alias" label="别名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="is_superuser" label="管理员"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="phone" label="操作"></el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      userData: []
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('userinfo')
      console.log(res)
      if (res.codo !== 200) return this.$message.error(res.msg)
      this.userData = res.data
    }
  }
}
</script>

<style scoped>

</style>
