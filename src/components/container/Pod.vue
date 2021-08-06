<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>服务管理</el-breadcrumb-item>
    <el-breadcrumb-item>pod管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6"><span>集群</span>
        <el-select v-model="cluster" placeholder="请选择集群" size="medium" @change="clusterinfo">
          <el-option
              v-for="item in clusters"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6"><span>名称空间</span>
        <el-select v-model="namespace" placeholder="请选择名称空间" size="medium" @change="namespaceinfo">
          <el-option
              v-for="item in namespaces"
              :key="item.nid"
              :label="item.name"
              :value="item.name">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-table :data="podsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="重启次数" prop="restart_count"></el-table-column>
      <el-table-column label="镜像" prop="image"></el-table-column>
      <el-table-column label="节点" prop="host_ip"></el-table-column>
      <el-table-column label="Pod IP" prop="pod_ip"></el-table-column>
      <el-table-column label="启动时间" prop="start_time"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scopre">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
          <el-button type="primary" size="mini" @click="webssh(scopre.row)">进入</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delPod(scopre.row.name)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[15, 30, 50, 100]"
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
      total: 0,
      podsList: [],
      clusters: [],
      namespaces: [],
      cluster: window.sessionStorage.getItem('cluster'),
      namespace: window.sessionStorage.getItem('namespace'),
      queryInfo: {
        query: '',
        pageSize: 15,
        page: 1
      }
    }
  },
  created () {
    this.getclusterList()
    this.getnamespaceList()
    this.getpodList()
  },
  methods: {
    async getclusterList () {
      const { data: res } = await this.$http.get('container/cluster')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.clusters = res.data
    },
    namespaceinfo () {
      window.sessionStorage.setItem('namespace', this.namespace)
      this.getpodList()
    },
    async getnamespaceList () {
      const { data: res } = await this.$http.get(`container/namespace?cluster=${this.cluster}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.namespaces = res.data
    },
    clusterinfo () {
      window.sessionStorage.setItem('cluster', this.cluster)
      this.getnamespaceList()
      this.namespace = ''
    },
    async getpodList () {
      const { data: res } = await this.$http.get(`container/pod?cluster=${this.cluster}&namespace=${this.namespace}`, { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.podsList = res.data
      this.total = res.count
    },
    async delPod (podname) {
      const { data: res } = await this.$http.delete(`container/pod?cluster=${this.cluster}&namespace=${this.namespace}&name=${podname}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      await this.getpodList()
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getpodList()
    },
    // 监听页码改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getpodList()
    },
    webssh (row) {
      const podname = row.name
      const url = '#container/terminal/' + podname
      console.log(url)
      window.open(url)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
