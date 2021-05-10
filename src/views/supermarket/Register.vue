<template>
  <div style="background: #f0f0f0">
    <div class="header">
      <div class="logo" style="margin-left: 80px">果蔬超市管理系统</div>
    </div>
    <div class="content" >
      <el-header>
        <el-steps :active="active" align-center style="width:50%;margin:0 auto;margin-top:30px;">
          <el-step title="步骤 1" description="请设置账号密码"></el-step>
          <el-step title="步骤 2" description="请输入商店信息"></el-step>
          <el-step title="步骤 3" description="请设置商店地址"></el-step>
          <el-step title="步骤 4" description="等待管理员确认"></el-step>
        </el-steps>
      </el-header>
      <el-main style="height: 610px; overflow: visible; width: 50%;margin:0 auto">
        <div class="container" style="margin-top: 30px">
          <get-account :user="user" v-if="active == 0" />
          <update-market
            :ubackground="background"
            :upicture="picture"
            :market="market"
            :ulicense="license"
            v-if="active == 1"
          />
          <place :ugps="gps" v-if="active == 2" />
          <div v-if="active == 3">
            <h1>请等待管理员确认</h1>
          </div>
          <div style="height: 200px ">
            <el-button
              type="primary"
              v-if="active != 0 && active != 3"
              @click="before()"
              style="margin-left: 100px"
              >上一步</el-button
            >
            <el-button
              type="primary"
              v-if="active != 3"
              @click="next()"
              style="margin-left: 50px"
              >下一步</el-button
            >
          </div>
        </div>
      </el-main>
    </div>
  </div>
</template>
<script>
import { request } from "../../network/request";
import GetAccount from "./GetAccount";
import UpdateMarket from "./UpdateMarket";
import Place from "./Place";
import { ElMessage } from "element-plus";
export default {
  components: {
    GetAccount,
    UpdateMarket,
    Place,
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
        spassword: "",
        code:""
      },
      background: {
        file: "",
        key: "",
      },
      picture: {
        file: "",
        key: "",
      },
      license: {
        file: "",
        key: "",
      },
      market: {
        name: "",
        phone: "",
        openingTime: "08:00",
        endTime: "10:00",
        background: "",
        picture: "",
        placeIntr: "",
        latitude: "",
        longitude: "",
        license: "",
      },
      gps: {
        latitude: "",
        longitude: "",
      },
      active: 0,
    };
  },
  computed: {},
  methods: {
    next() {
      console.log(this.active);
      console.log()
      if (this.active == 0) {
          if(this.user.password=="")
              ElMessage("密码不能为空")
          else if(this.user.username=="")
            ElMessage("邮箱不能为空")
          else if(this.user.password.length<6||this.user.password.length>15)
          ElMessage("密码长度在 6 到 15 个字符")
          else if(this.user.code=="")
          ElMessage("验证码不能为空")
        else if (this.user.password == this.user.spassword) {
          request({
            method: "get",
            url: "/user/setcode?userid=" + this.user.username+"&code="+ this.user.code+"&table=emil",
            dataType: "json",
            async: false,
          })
            .then((res) => {
              if (res.data == 1) this.active = 1;
              else ElMessage("验证码错误");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
            ElMessage("两次密码不同");
        }
      } else if (this.active == 1) {
        if (this.market.name.length < 3 || this.market.name.length > 15)
          ElMessage("商店名称长度大于2小于16");
        else if (this.market.phone.length != 11) ElMessage("手机号应为11位");
        else if (this.market.placeIntr == "") ElMessage("地址不能为空");
        else if (this.license.file == "") ElMessage("需要上传营业执照");
        else {
          this.active = 2;
        }
      } else if (this.active == 2) {
        if (this.gps.latitude == "") ElMessage("请选择地址");
        else {
          this.addmarket();
          this.active = 3;
        }
      }
    },
    before() {
      if (this.active == 1) {
        this.active = 0;
      } else if (this.active == 2) {
        this.active = 1;
      } else if (this.active == 3) {
        this.active = 2;
      }
    },
    addmarket() {
      if (this.background.file != "") this.market.background = "1";
      if (this.license.file != "") this.market.license = "1";
      if (this.picture.file != "") this.market.picture = "1";
      this.market.openingTime =
        "1999-07-14T" + this.market.openingTime + ":00.000+0800";
      this.market.endTime =
        "1999-07-14T" + this.market.endTime + ":00.000+0800";
      this.market.longitude = this.gps.longitude;
      this.market.latitude = this.gps.latitude;
      request({
        method: "post",
        url: "/market/add",
        dataType: "json",
        async: false,
        data: this.market,
      })
        .then((res) => {
          this.adduser(res.data.sid);
          this.background.key = "/picture/marketback/" + res.data.sid + ".jpg";
          this.picture.key = "/picture/market/" + res.data.sid + ".jpg";
          this.license.key = "/picture/license/" + res.data.sid + ".jpg";
          if (this.background.file != "") this.uploadpicture(this.background);
          if (this.picture.file != "") this.uploadpicture(this.picture);
          if (this.license.file != "") this.uploadpicture(this.license);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    adduser(id) {
      let mark = {
        userId: this.user.username,
        password: this.user.password,
        marketId: id,
      };
      console.log(mark);
      request({
        method: "post",
        url: "/user/register",
        dataType: "json",
        async: false,
        data: mark,
      })
        .then((res) => {
          res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadpicture(data) {
      const param = new FormData();
      param.append("file", data.file);
      param.append("key", data.key);
      request({
        method: "post",
        url: "/market/getpicture",
        // dataType:'json',
        async: false,
        data: param,
      })
        .then((res) => {
          res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
</style>