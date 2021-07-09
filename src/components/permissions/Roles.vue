<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table :data="rolesList" border stripe @expand-change="ExpandChange" >
      <!-- 展开列 -->
      <el-table-column type="expand">
<!--        <template slot-scope="scope">-->
<!--          {{scope.row}}}-->
<!--        </template>-->
        <template>
          <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in this.roleMenuPermission.children" :key="item1.id">
            <!--          渲染一级权限-->
            <el-col :span="5">
              <el-tag closable @close="removeApiPermissionByid(roleMenuPermission.name,item1.id)">{{item1.name}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--          渲染二，三级权限-->
            <el-col :span="19">
              <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeApiPermissionByid(roleMenuPermission.name,item2.id)">{{item2.name}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeApiPermissionByid(roleMenuPermission.name,item3.id)">{{item3.name}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
<!--          <pre>-->
<!--            {{ this.roleMenuPermission }}-->
<!--          </pre>-->
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="角色描述" prop="describe"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini"
            @click="showSetPermissionDialog(scope.row)">分配权限</el-button>
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

  <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
    <el-form :model="addRoleForm" ref="addRoleFormRef" :rules="addRoleFormRules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addRoleForm.describe"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
  </el-dialog>

<!--  分配权限对话框-->
  <el-dialog
    title="分配权限"
    :visible.sync="setPermissionDialogVisible"
    width="50%" @close="setPermissionDialogClosed">
    <el-tree :data="menuList" :props="treeProps"
      show-checkbox node-key="id"
      default-expand-all
      :default-checked-keys="defKeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setPermissionDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allowPermission">确 定</el-button>
  </span>
  </el-dialog>

</div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageSize: 2,
        page: 1
      },
      rolesList: [],
      setPermissionDialogVisible: false,
      roleMenuPermission: [],
      menuList: [],
      rolename: '',
      treeProps: { label: 'name', children: 'children' },
      // 默认选择节点id的数组
      defKeys: [],
      addRoleForm: {},
      AddRoleDialogVisible: false,
      addRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      total: 0
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('user/roles', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.rolesList = res.data
      this.total = res.count
    },
    // 添加角色对话框的关闭
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    addRoles () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('user/roles', this.addRoleForm)
        if (res.code !== 200) {
          this.$message.error(res.msg)
        }
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.AddRoleDialogVisible = false
          this.getRoleList()
        }
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getRoleList()
    },

    // 监听页码改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getRoleList()
    },
    async ExpandChange (row) {
      const { data: res } = await this.$http.get('user/permissions?name=' + row.name)
      if (res.code === 401) {
        this.$message.warning(res.msg)
      }
      this.roleMenuPermission = res.data
    },

    async getMenupermissions (name) {
      const { data: res } = await this.$http.get('menupermissions?name=' + name)
      if (res.code === 401) {
        this.$message.warning(res.msg)
      }
      this.roleMenuPermission = res.data
    },

    async removeApiPermissionByid (name, meid) {
      const confirResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`user/permissions?name=${name}&meid=${meid}`)
      if (res.codo === 200) {
        this.$message.success(res.msg)
        this.roleMenuPermission = res.data
      } else {
        this.$message.error(res.msg)
      }
    },

    // 分配权限
    async showSetPermissionDialog (role) {
      const { data: res } = await this.$http.get(`user/menuid?name=${role.name}`)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.defKeys = res.data
      const { data: res1 } = await this.$http.get('user/allmenu?menu=tree')
      if (res1.code !== 200) {
        return this.$message.error(res1.msg)
      }
      this.rolename = role.name
      this.menuList = res1.data.valid
      // role应该是该角色的详细信息进行递归，然后保存在数组中。可在后端完成
      // this.getLeafKeys(role, this.defKeys)
      this.setPermissionDialogVisible = true
    },
    // 如果当前node节点不包含children属性，则是三级节点
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setPermissionDialogClosed () {
      this.defKeys = []
    },
    async allowPermission () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
      // const idStr = keys.join(',')
      // const { data: res } = await this.$http.post(`user/permissions?name=${this.rolename}`, { rids: idStr })
      const { data: res } = await this.$http.post(`user/permissions?name=${this.rolename}`, { meids: keys })
      if (res.code !== 200) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.getRoleList()
        this.setPermissionDialogVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
