<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!--      用户列表区-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="别名" prop="alias"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="激活">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active" @change="userStageChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scopre">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scopre.row.username)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scopre.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="addUserForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editUserForm" ref="editUserFormRef"
        :rules="editUserFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="editUserForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
<!--    分配角色的对话框-->
    <el-dialog title="分配角色"
      :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDIalogClosed">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRolesId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      selectedRolesId: '',
      userInfo: {},
      rolesList: [],
      setRoleDialogVisible: false,
      queryInfo: {
        query: '',
        pageSize: 2,
        page: 1
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        username: '',
        alias: '',
        password: '',
        email: '',
        phone: ''
      },
      editUserForm: {},
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserFormRules: {
        alias: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('user/userinfo', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.userlist = res.data
      this.total = res.count
    },

    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听页码改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getUserList()
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addUserFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editUserFormRef.resetFields()
    },
    addUser () {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('user/userinfo', this.addUserForm)
        if (res.code === 200) {
          this.$message.success(res.msg)
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async userStageChanged (userinfo) {
      const { data: res } = await this.$http.put(`user/active?user=${userinfo.id}&active=${userinfo.is_active}`)
      if (res.codo !== 200) {
        userinfo.is_active = !userinfo.is_active
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    },

    // 修改用户信息
    async editUser () {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.put(
          'user/userinfo?user=' + this.editUserForm.username,
          {
            alias: this.editUserForm.alias,
            email: this.editUserForm.email,
            phone: this.editUserForm.phone
          }
        )
        if (res.code === 200) {
          this.editDialogVisible = false
          this.$message.success(res.msg)
          this.getUserList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async removeUser (username) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.delete('user/userinfo?user=' + username)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    showEditDialog (row) {
      this.editUserForm = row
      this.editDialogVisible = true
    },
    async setRole (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('user/roles')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectedRolesId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`user/role?userid=${this.userInfo.id}`, { roleid: this.selectedRolesId })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDIalogClosed () {
      this.selectedRolesId = {}
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
