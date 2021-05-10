<template>
  <el-form
    :model="param"
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="邮箱" prop="username">
      <el-input
        placeholder="请输入邮箱"
        v-model="param.username"
        style="width: 70%"
      ></el-input>
      <el-button @click="getcode" style="margin-left: 10px" v-if="second == ''"
        >发送验证码</el-button
      >
      <el-button  style="margin-left: 10px" v-else disabled
        >{{ second }}秒后重试</el-button
      >
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="param.password"
        style="width: 70%"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="spassword">
      <el-input
        type="password"
        placeholder="请再确认密码"
        v-model="param.spassword"
        style="width: 70%"
      ></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <el-input
        placeholder="请输入验证码"
        v-model="param.code"
        style="width: 30%"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { ElMessage } from "element-plus";
import { request } from "../../network/request";
export default {
  data() {
    return {
      param: {
        username: "",
        password: "",
        spassword: "",
        code: "",
      },
      second: "",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        spassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$store.commit("clearTags");
    this.param = this.user;
  },
  props: { user: Object },
  methods: {
    getcode() {
              request({
                method: "get",
                url: "/user/getcode?userid=" + this.user.username+"&table=emil",
                dataType: "json",
                async: false,
              })
                .then((res) => {
                  if (res.data == 1) {
                      this.second = 60;
                      let num=setInterval(() => {
                         this.second = this.second - 1;
                            if(this.second==0)clearInterval(num)
                        }, 1000);
                  } else if(res.data == 2){
                    ElMessage("邮箱错误");
                  }else{
                    ElMessage("账号已存在");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
    },

  },
};
</script>

<style scoped>
.login-cete {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}
.login-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>