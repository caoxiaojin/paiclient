<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统配置</el-breadcrumb-item>
    <el-breadcrumb-item>服务配置</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入文件" v-model="queryInfo.query" clearable @clear="getconfigList">
          <el-button slot="append" icon="el-icon-search" @click="getconfigList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加配置</el-button>
      </el-col>
    </el-row>
    <el-table :data="configList" border stripe>
      <el-table-column label="项目" prop="project"></el-table-column>
      <el-table-column label="服务" prop="service"></el-table-column>
      <el-table-column label="文件" prop="filename"></el-table-column>
      <el-table-column label="内容" prop="content" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scopre">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeConfig(scopre.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog title="添加配置" :visible.sync="addDialogVisible"
             width="50%" @close="addDialogClosed">
    <el-form :model="addConfigForm" :rules="addConfigFormRules" ref="addConfigFormRef" label-width="70px">
      <el-form-item label="项目" prop="project">
        <el-input v-model="addConfigForm.project"></el-input>
      </el-form-item>
      <el-form-item label="服务" prop="service">
        <el-input v-model="addConfigForm.service"></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="filename">
        <el-input v-model="addConfigForm.filename"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea"  v-model="addConfigForm.content" :autosize="{ minRows: 1, maxRows: 50 }"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfig">确 定</el-button>
      </span>
  </el-dialog>

  <el-dialog title="修改配置信息" :visible.sync="editDialogVisible"
             width="50%" @close="editDialogClosed">
    <!-- 内容主体 -->
    <el-form :model="editConfigForm" ref="editConfigFormRef"
             :rules="editConfigFormRules" label-width="70px">
      <el-form-item label="项目">
        <el-input v-model="editConfigForm.project" disabled></el-input>
      </el-form-item>
      <el-form-item label="服务" prop="service">
        <el-input v-model="editConfigForm.service" disabled></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="filename">
        <el-input v-model="editConfigForm.filename" disabled></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="editConfigForm.content"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfig">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      configList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addConfigForm: {
      },
      addConfigFormRules: {
        project: [
          { required: true, message: '请输入项目', trigger: 'blur' }
        ],
        service: [
          { required: true, message: '请输入服务', trigger: 'blur' }
        ],
        filename: [
          { required: true, message: '请输入文件', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文件', trigger: 'blur' }
        ]
      },
      editConfigForm: {},
      editConfigFormRules: {
        content: [
          { required: true, message: '请输入文件', trigger: 'blur' }
        ]
      },
      queryInfo: {
        query: '',
        pageSize: 2,
        page: 1
      }
    }
  },
  created () {
    this.getconfigList()
  },
  methods: {
    async getconfigList () {
      const { data: res } = await this.$http.get('configure/common', { params: this.queryInfo })
      console.log(res)
      if (res.codo !== 200) {
        return this.$message.error(res.msg)
      }
      this.configList = res.data
    },

    addDialogClosed () {
      this.$refs.addConfigFormRef.resetFields()
    },

    editDialogClosed () {
      this.$refs.editConfigFormRef.resetFields()
    },

    showEditDialog (row) {
      this.editConfigForm = row
      this.editDialogVisible = true
    },
    addConfig () {
      // 提交请求前，表单预验证
      this.$refs.addConfigFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('configure/common', this.addConfigForm)
        if (res.codo === 200) {
          this.$message.success(res.msg)
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getconfigList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    editConfig () {
      // 提交请求前，表单预验证
      this.$refs.editConfigFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.put(
          'configure/common?project=' + this.editConfigForm.project + '&service=' + this.editConfigForm.service + '&filename=' + this.editConfigForm.filename,
          { content: this.editConfigForm.content })
        if (res.codo === 200) {
          this.editDialogVisible = false
          this.$message.success(res.msg)
          this.getconfigList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    async removeConfig (row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除配置, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('configure/common?project=' + row.project + '&service=' + row.service + '&filename=' + row.filename)
      if (res.codo !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getconfigList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
