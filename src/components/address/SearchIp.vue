<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>地址查询</el-breadcrumb-item>
    <el-breadcrumb-item>ip查询</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入ip" v-model="queryInfo.ip" clearable @clear="getSearchip">
          <el-button slot="append" icon="el-icon-search" @click="getSearchip"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <h3>PPIO查询</h3>
    <el-table :data="ppiosearch" border stripe>
      <el-table-column label="区县" prop="accuracy"></el-table-column>
      <el-table-column label="国家" prop="country"></el-table-column>
      <el-table-column label="country" prop="areacode"></el-table-column>
      <el-table-column label="城市" prop="city"></el-table-column>
      <el-table-column label="州" prop="continent"></el-table-column>
      <el-table-column label="区" prop="district"></el-table-column>
      <el-table-column label="运营商" prop="isp"></el-table-column>
      <el-table-column label="省" prop="province"></el-table-column>
      <el-table-column label="数据来源" prop="source"></el-table-column>
      <el-table-column label="时区" prop="timezone"></el-table-column>
    </el-table>
    <h3>ip138查询</h3>
    <el-table :data="search138" border stripe>
      <el-table-column label="ASN归属地" prop="ASN归属地"></el-table-column>
      <el-table-column label="iP段" prop="iP段"></el-table-column>
      <el-table-column label="兼容IPv6地址图标" prop="兼容IPv6地址"></el-table-column>
      <el-table-column label="映射IPv6地址" prop="映射IPv6地址"></el-table-column>
      <el-table-column label="国家" prop="ip_c_list[0].ct"></el-table-column>
      <el-table-column label="省" prop="ip_c_list[0].prov"></el-table-column>
      <el-table-column label="城市" prop="ip_c_list[0].city"></el-table-column>
      <el-table-column label="运营商" prop="ip_c_list[0].yunyin"></el-table-column>
    </el-table>
    <h3>iptaobao查询</h3>
    <el-table :data="taobaosearch" border stripe>
      <el-table-column label="城市" prop="city"></el-table-column>
      <el-table-column label="国家" prop="country"></el-table-column>
      <el-table-column label="country" prop="country_id"></el-table-column>
      <el-table-column label="运营商" prop="isp"></el-table-column>
      <el-table-column label="地域" prop="region"></el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        ip: ''
      },
      ppiosearch: [],
      search138: [],
      taobaosearch: []
    }
  },
  methods: {
    async getSearchip () {
      const { data: res } = await this.$http.get('ipinfo/search', { params: this.queryInfo })
      if (res.codo !== 200) return this.$message.error(res.msg)
      this.ppiosearch = res.data.ppiosearch
      this.search138 = res.data.search138
      this.taobaosearch = res.data.iptaobao
    }
  }
}
</script>

<style scoped>

</style>
