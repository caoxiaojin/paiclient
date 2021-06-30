<template>
<div>
  <el-tag> 机器ID: {{ this.machine }} </el-tag>
  <el-divider content-position="center">
    <el-button type="primary" size="mini" @click="showDialogVisible">分配标签</el-button>
  </el-divider>
  <el-row>
    <el-tag v-for="label in machinelabel" :key="label.name"
        closable type="" @close="removeMachinelabel(label.name)">
      {{label.name}}
    </el-tag>
  </el-row>
  <el-dialog title="分配标签" :visible.sync="addDialogVisible"
             width="50%" @close="addDialogClosed">
    <el-form :model="addMachineLabelForm" :rules="addMachineLabelFormRules" ref="addMachineLabelFormRef" label-width="70px">
      <el-form-item label="标签名" prop="name">
        <el-select v-model="addMachineLabelForm.labellist" multiple placeholder="请选择">
          <el-option v-for="item in alllablelist" :key="item.id" :label="item.name" :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMachineLabel">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      machine: '',
      machinelabel: [],
      addDialogVisible: false,
      addMachineLabelForm: {
        labellist: []
      },
      addMachineLabelFormRules: {
        labellist: [
          { required: true, message: '请添加标签', trigger: 'blur' }
        ]
      },
      alllablelist: []
    }
  },
  created () {
    this.machine = this.$route.params.id
    this.getMachineLabelList(this.machine)
  },
  methods: {
    addDialogClosed () {
      this.$refs.addMachineLabelFormRef.resetFields()
    },
    addMachineLabel () {
      // 提交请求前，表单预验证
      this.$refs.addMachineLabelFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`resource/tag?machine=${this.machine}`, this.addMachineLabelForm)
        if (res.code === 200) {
          this.$message.success(res.msg)
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.machinelabel = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async getLabelList () {
      const { data: res } = await this.$http.get('resource/label')
      if (res.code !== 200) return this.$message.error(res.msg)
      console.log(res.data)
      this.alllablelist = res.data
    },
    showDialogVisible () {
      this.addDialogVisible = true
      this.getLabelList()
    },
    async getMachineLabelList (machine) {
      const { data: res } = await this.$http.get(`resource/tag?machine=${machine}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.machinelabel = res.data
    },
    async removeMachinelabel (label) {
      const confirResult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`resource/tag?machine=${this.machine}&label=${label}`)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.machinelabel = res.data
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
