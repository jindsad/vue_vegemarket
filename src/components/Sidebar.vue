<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.index == 'order'">
          <el-badge :value="total" :max="99" :key="item.index" class="item">
            <el-menu-item :index="item.index">
              <i :class="item.icon"></i>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </el-badge>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
// import bus from "../common/bus";
import cookie from "js-cookie";
import { request } from "../network/request";
import { ElNotification } from 'element-plus';
export default {
  data() {
    return {
      total: 0,
      items: [
        {
          icon: "el-icon-s-home",
          index: "firstpage",
          title: "首页",
        },
        {
          icon: "el-icon-s-order",
          index: "order",
          title: "订单管理",
        },
        {
          icon: "el-icon-chat-line-round",
          index: "remark",
          title: "评论管理",
        },

        {
          icon: "el-icon-chicken",
          index: "product",
          title: "商品管理",
        },
        {
          icon: "el-icon-collection-tag",
          index: "type",
          title: "类别管理",
        },
        {
          icon: "el-icon-s-custom",
          index: "marketinfo",
          title: "商店信息",
        },
      ],
      manage: [
        {
          icon: "el-icon-s-home",
          index: "homepage",
          title: "首页",
        },
        {
          icon: "el-icon-s-order",
          index: "approve",
          title: "商店审批",
        },
        {
          icon: "el-icon-chicken",
          index: "pictureshift",
          title: "轮播图管理",
        },
        {
          icon: "el-icon-chat-line-round",
          index: "market",
          title: "商店管理",
        },

        {
          icon: "el-icon-chicken",
          index: "user",
          title: "用户管理",
        },
      ],
    };
  },
  created() {
    if (cookie.get("market") == undefined) {
      this.items = this.manage;
    } else {
      this.getTotal();
      this.openSocket();
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    collapse() {
      return this.$store.state.collapse;
    },
  },
  methods: {
    getTotal() {
      request({
        method: "get",
        url:
          "/order/gettotal?sid=" +
          JSON.parse(cookie.get("market")).sid +
          "&type=1",
        dataType: "json",
        async: false,
      })
        .then((res) => {
          this.total = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openSocket() {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl = "http://119.45.146.98:9000/imserver/" + JSON.parse(cookie.get('market')).sid;
        socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
        console.log(socketUrl);
        if (this.socket != null) {
          this.socket.close();
          this.socket = null;
        }
        this.socket = new WebSocket(socketUrl);
        //打开事件
        this.socket.onopen = function () {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        this.socket.onmessage = function (msg) {
          if(msg.data!="连接成功"){
        ElNotification({
          title: '您有新的订单请接收',
          dangerouslyUseHTMLString: true,
          message:'<p>订单号:</p><p>'+msg.data+'</p>',
          duration: 60*1000
        });}
        };
        //关闭事件
        this.socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        this.socket.onerror = function () {
          console.log("websocket发生了错误");
        };
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>
