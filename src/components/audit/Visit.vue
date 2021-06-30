<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>日志管理</el-breadcrumb-item>
    <el-breadcrumb-item>日志信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input placeholder="请输入用户" v-model="queryInfo.username" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入访问方式" v-model="queryInfo.method" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入地址" v-model="queryInfo.path" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入是否被允许" v-model="queryInfo.allow" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-date-picker placeholder="请输入开始时间" v-model="queryInfo.start_time" type="datetime" value-format="timestamp" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-date-picker placeholder="请输入结束时间" v-model="queryInfo.end_time" type="datetime" value-format="timestamp" clearable @change="getvisitlist" @clear="getvisitlist">
        </el-date-picker>
      </el-col>
    </el-row>
    <!--      用户列表区-->
    <el-table :data="visitlist" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="访问用户" prop="username"></el-table-column>
      <el-table-column label="访问" prop="method"></el-table-column>
      <el-table-column label="地址" prop="path"></el-table-column>
      <el-table-column label="是否允许" prop="is_allow"></el-table-column>
      <el-table-column label="请求时间" prop="createtime"></el-table-column>
    </el-table>
    <!--      分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[15, 50, 100, 200]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        username: '',
        method: '',
        path: '',
        allow: '',
        start_time: '',
        end_time: '',
        pageSize: 15,
        page: 1
      },
      visitlist: [],
      total: 0
    }
  },
  created () {
    this.getvisitlist()
  },
  methods: {
    async getvisitlist () {
      const { data: res } = await this.$http.get('audit/visit', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.visitlist = res.data
      this.total = res.count
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getvisitlist()
    },
    // 监听页码改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getvisitlist()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
