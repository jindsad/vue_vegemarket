<template>
<div class="login-wrap">
    <div class="login-cete">
          <div class="login-title">果蔬管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter="submitForm()"
                    >
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="register()">注册</el-button>
                </div>
            </el-form>
    </div>
</div>
</template>


<script>
import {request} from "../network/request";
import cookie from 'js-cookie'
import md5 from 'js-md5';
export default {
    data() {
        return {
            param: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    created() {
        this.$store.commit("clearTags");
    },
    methods: {
        submitForm() {
                  request({
                    method:'post',
                    url:'/user/loginweb',
                    dataType:'json',
                    async:false,
                    data:{
                        userId:this.param.username,
                        password:this.param.password
                    }
                }).then(res=>{
                    console.log(res.data)
                    if(res.data==""){
                        this.$message.error("账号密码错误");
                    }else{
                        if(res.data.amount!=-1){
                        cookie.remove('market');
                        cookie.remove('user');
                        cookie.set('market',  res.data, { expires: 7 });
                        cookie.set('user',  {username:this.param.username,password:md5(this.param.password)} , { expires: 7 });
                        this.$router.push("/market/order");}
                        else{
                            cookie.remove('market');
                            cookie.remove('user');
                            cookie.set('user', {username:this.param.username,password:md5(this.param.password),sid:res.data.sid}, { expires: 7 });
                            this.$router.push("/manage/approve");
                        }

                    }
                }).catch(err=>{
                    console.log(err);
                })
        },
        register(){
            this.$router.push("/register");
        }
    }
};
</script>

<style scoped>
.login-wrap{
    background-image:url(../assets/img/bg.jpeg);
    width: 100%;
    height: 100%;
    background-size: 100%;
}
.login-cete{
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