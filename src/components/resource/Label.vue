<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    <el-breadcrumb-item>标签列表</el-breadcrumb-item>
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
      <el-table-column label="标签描述" prop="describe"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scopre">
          <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMachine(scopre.row.name)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog title="添加标签" :visible.sync="addDialogVisible"
             width="50%" @close="addDialogClosed">
    <el-form :model="addLabelForm" :rules="addLabelFormRules" ref="addLabelFormRef" label-width="70px">
      <el-form-item label="标签名" prop="name">
        <el-input v-model="addLabelForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="describe">
        <el-input v-model="addLabelForm.describe"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLabel">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false,
      labelList: [],
      queryInfo: {
        query: ''
      },
      addLabelForm: {
        name: '',
        describe: ''
      },
      addLabelFormRules: {
        name: [
          { required: true, message: '请输入机器id', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入机器信息', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getLabelList()
  },
  methods: {
    async getLabelList () {
      const { data: res } = await this.$http.get('resource/label', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.labelList = res.data
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addLabelFormRef.resetFields()
    },
    addLabel () {
      // 提交请求前，表单预验证
      this.$refs.addLabelFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('resource/label', this.addLabelForm)
        if (res.code === 200) {
          this.$message.success(res.msg)
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getLabelList()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
