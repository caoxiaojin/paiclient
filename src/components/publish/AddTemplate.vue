<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加模板</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="模板添加的信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="模板名称"></el-step>
        <el-step title="模板内容"></el-step>
        <el-step title="信息描述"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTableave" tab-click="tabClicked">
          <el-tab-pane label="模板名称" name="0">
            <el-form-item label="模板名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="模板内容" name="1">
            <el-form-item label="模板内容" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="信息描述" name="2">信息描述</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {},
      addFormRules: {}
    }
  },
  created () {},
  methods: {
    beforeTableave (activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入标签页名字是：' + activeName)
      // return false
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先填写模板名称')
        return true
      }
    },
    async tabClicked () {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`cate/${this.cateId}/attributtes`, { params: { sel: 'many' } })
        if (res.codo !== 200) {
          // return this.$message.error(res.msg)
          this.manyTableData = []
        }
        this.manyTableData = []
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
