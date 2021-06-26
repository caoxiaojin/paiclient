<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
<!--    步骤条区域-->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
<!--tab栏区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
      <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTableave" tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader expandTrigger="hover"
              :options="catelist" :props="cateProps"
              v-model="addForm.goods_cat" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="btnAdd">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      catelist: [
        {
          cat_id: 1,
          cat_name: '大家电',
          cat_pid: 0,
          cat_level: 0,
          cat_deleted: false,
          children: [{
            cat_id: 3,
            cat_name: '电视',
            cat_pid: 1,
            cat_level: 1,
            cat_deleted: 'false',
            children: [{
              cat_id: 6,
              cat_name: '曲面电视',
              cat_pid: 3,
              cat_level: 2,
              cat_deleted: false
            }]
          }]
        }
      ],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        goods_introduce: ''
      },
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      manyTableData: []
    }
  },
  created () {},
  methods: {
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTableave (activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入标签页名字是：' + activeName)
      // return false
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return true
      }
    },
    async tabClicked () {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`cate/${this.cateId}/attributtes`, { params: { sel: 'many' } })
        if (res.codo !== 200) {
          // return this.$message.error(res.msg)
          this.manyTableData = []
        }
        this.manyTableData = []
      }
    }
  },
  computed: {
    // 计算属性，获取id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.btnAdd {
  margin-top: 15px;
}
</style>
