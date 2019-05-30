<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo"/>
      <a-menu theme="dark" mode="inline" @click="handleMenu" :defaultSelectedKeys="['box_list']" v-model="key">
        <template v-for="(item,index) in menu">
          <a-sub-menu :key="index" v-if="item.children">
            <span slot="title">
              <a-icon :type="item.icon"/>
              <span>{{item.title}}</span>
            </span>
            <a-menu-item :key="sub.path" v-for="sub in item.children">
              <a-icon :type="sub.icon"/>
              {{sub.title}}
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.path">
            <a-icon :type="item.icon"/>
            <span>{{item.title}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100vh' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
      key: [],
      menu: [
        {
          title: "设备管理",
          icon: "appstore-o",
          children: [
            {
              title: "机柜管理",
              path: "/Index/BoxList",
              icon: "database"
            },
            {
              title: "充电宝管理",
              path: "/Index/ChargerList",
              icon: "hdd"
            }
          ]
        },
        {
          title: "订单列表",
          path: "/Index/OrderList",
          icon: "profile"
        },
        {
          title: "反馈信息管理",
          icon: "shop",
          path: "/Index/FeedbackList"
        },
        {
          title: "广告管理",
          path: "/Index/Advertise",
          icon: "team"
        },
        {
          title: "维修工单管理",
          icon: "shop",
          path: "/Index/Works"
        },
        {
          title: "系统设置",
          path: "/setting_list",
          icon: "setting"
        }
      ],
      userInfo: null
    };
  },
  methods: {
    handleMenu(item, key) {
      this.$router.push(item.key);
    },
  },
  mounted() {
    this.key = [this.$route.path];
  }
};
</script>
<style>
#components-layout-demo-custom-trigger {
  text-align: left;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  height: 100%;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
