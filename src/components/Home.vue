<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.bak.png" alt="">
        <span>平台运维管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
<!--      <el-aside width="isCollapse ? '64px' : '200px'">-->
      <el-aside width="200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu  router :default-active="activePath"  background-color="#333744" text-color="#fff" active-text-color="#409EEF" unique-opened :collapse="isCollapse" :collapse-transition="false">
<!--          一级菜单-->
          <el-submenu :index="'/' + item.path" v-for="item in menulist" :key="item.id">
<!--            一集菜单的模板区域-->
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index="'/' + submenu.path" v-for="submenu in item.children" :key="submenu.id" @click="saveNavState('/' + submenu.path)">
              <template slot="title">
                <i :class="submenu.icon"></i>
                <span>{{submenu.name}}</span>
              </template>
<!--              <el-menu-item :index="subitem.id + ''" v-for="subitem in submenu.children" :key="subitem.id">-->
<!--                <template>-->
<!--                  <i class="subitem.icon"></i>-->
<!--                  <span>{{subitem.name}}</span>-->
<!--                </template>-->
<!--              </el-menu-item>-->
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getUserList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menulist: [],
      userData: [],
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 控制菜单的折叠
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },

    async getUserList () {
      const { data: res } = await this.$http.get('user/menu')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.menulist = res.data.valid
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
