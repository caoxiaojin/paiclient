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
        <el-button type="primary" @click="addDialogVisible = true">添加模板</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-dialog title="添加模板" :visible.sync="addDialogVisible"
             width="50%" @close="addDialogClosed">
    <el-form :model="addTemplateForm" :rules="addTemplateFormRules" ref="addTemplateFormRef" label-width="70px">
      <el-form-item label="模板名" prop="name">
        <el-input v-model="addTemplateForm.name"></el-input>
      </el-form-item>
      <el-form-item label="数据" prop="data">
        <el-input v-model="addTemplateForm.data"></el-input>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="addTemplateForm.version"></el-input>
      </el-form-item>
      <el-form-item label="标签组" prop="label">
        <el-input v-model="addTemplateForm.label"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTemplate">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: ''
      },
      templateList: [],
      addDialogVisible: false,
      addTemplateForm: {},
      addTemplateFormRules: {}
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
