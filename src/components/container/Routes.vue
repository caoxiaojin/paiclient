<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>服务管理</el-breadcrumb-item>
    <el-breadcrumb-item>routes管理</el-breadcrumb-item>
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
    <el-table :data="routesList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="端点" prop="ip"></el-table-column>
      <el-table-column label="规则" prop="host"></el-table-column>
      <el-table-column label="服务名" prop="service_name"></el-table-column>
      <el-table-column label="服务端口" prop="service_port"></el-table-column>
      <el-table-column label="创建时间" prop="creation_timestamp"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scopre">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scopre.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scopre.row.username)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      routesList: [],
      clusters: [],
      namespaces: [],
      cluster: window.sessionStorage.getItem('cluster'),
      namespace: window.sessionStorage.getItem('namespace')
    }
  },
  created () {
    this.getclusterList()
    this.getnamespaceList()
    this.getroutesList()
  },
  methods: {
    async getclusterList () {
      const { data: res } = await this.$http.get('container/cluster')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.clusters = res.data
    },
    namespaceinfo () {
      window.sessionStorage.setItem('namespace', this.namespace)
      this.getroutesList()
    },
    clusterinfo () {
      window.sessionStorage.setItem('cluster', this.cluster)
      this.getnamespaceList()
      this.namespace = ''
    },
    async getnamespaceList () {
      const { data: res } = await this.$http.get(`container/namespace?cluster=${this.cluster}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.namespaces = res.data
    },
    async getroutesList () {
      const { data: res } = await this.$http.get(`container/routes?cluster=${this.cluster}&namespace=${this.namespace}`)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.routesList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
