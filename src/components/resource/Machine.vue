<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机器管理</el-breadcrumb-item>
      <el-breadcrumb-item>机器列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入机器id" v-model="queryInfo.query" clearable @clear="getMachineList">
            <el-button slot="append" icon="el-icon-search" @click="getMachineList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加机器</el-button>
          <el-button type="primary" @click="addDialogVisible = true">全局分配标签</el-button>
        </el-col>
      </el-row>
      <!--      用户列表区-->
      <el-table :data="machinelist" border stripe>
        <!--        <el-table-column type="index" label="#"></el-table-column>-->
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="机器id" prop="machine"></el-table-column>
        <el-table-column label="信息" prop="adminRemark"></el-table-column>
        <el-table-column label="激活">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active" @change="machineStageChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <router-link :to="{ path: '/resource/machine/' + scope.row.machine }">
                <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
              </router-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMachine(scope.row.machine_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog title="添加机器" :visible.sync="addDialogVisible"
               width="50%" @close="addDialogClosed">
      <el-form :model="addMachineForm" :rules="addMachineFormRules" ref="addMachineFormRef" label-width="70px">
        <el-form-item label="机器id" prop="machine">
          <el-input v-model="addMachineForm.machine"></el-input>
        </el-form-item>
        <el-form-item label="信息" prop="adminRemark">
          <el-input v-model="addMachineForm.adminRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMachine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedRolesId: '',
      machine: {},
      setRoleDialogVisible: false,
      queryInfo: {
        query: '',
        pageSize: 2,
        page: 1
      },
      machinelist: [],
      total: 0,
      addDialogVisible: false,
      addMachineForm: {
        machine: '',
        adminRemark: ''
      },
      addMachineFormRules: {
        machine: [
          { required: true, message: '请输入机器id或者ip', trigger: 'blur' }
        ],
        adminRemark: [
          { required: true, message: '请输入机器信息', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMachineList()
  },
  methods: {
    async getMachineList () {
      const { data: res } = await this.$http.get('resource/machine', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.machinelist = res.data
      this.total = res.count
    },

    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getMachineList()
    },
    // 监听页码改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getMachineList()
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addMachineFormRef.resetFields()
    },
    addMachine () {
      // 提交请求前，表单预验证
      this.$refs.addMachineFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('resource/machine', this.addMachineForm)
        if (res.code === 200) {
          this.$message.success(res.msg)
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getMachineList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    machineStageChanged (mainine) {
      mainine.is_active = !mainine.is_active
      return this.$message.error('不允许操作')
    },

    async removeMachine (machine) {
      const confirmResult = await this.$confirm('此操作将永久删除该机器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('resource/machine?machine=' + machine)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('删除机器成功！')
      this.getMachineList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
