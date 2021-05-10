<template>
<div class="container">
<el-form  label-width="100px" class="demo-ruleForm">
  <el-form-item label="商店名称" >
    <span style="font-size: 16px;" >{{market.name}}</span>
  </el-form-item>
    <el-form-item label="联系方式" >
    <span style="font-size: 16px;">{{market.phone}}</span>
  </el-form-item>
    <el-form-item label="营业时间">
     <span style="font-size: 16px;">{{market.openingTime}}  至  {{market.endTime}}</span>
  </el-form-item>
  <el-form-item label="背景图片">
        <img :src="market.background" v-if="market.background!=''" class="avatar">
        <img src="https://tuyun-1301564486.cos.ap-shanghai.myqcloud.com/moren.jpg" v-else class="avatar">
  </el-form-item>
    <el-form-item label="店铺图片">
        <img :src="market.picture" v-if="market.picture!=''" class="avatar">
        <img src="https://tuyun-1301564486.cos.ap-shanghai.myqcloud.com/moren.jpg" v-else class="avatar">
  </el-form-item>
  <el-form-item label="位置详情">
    <span style="font-size: 16px;">{{market.placeIntr}}</span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm()" >修改商家信息</el-button>
  </el-form-item>
</el-form>
        <el-dialog title="商家信息" v-model="dialogUpdateVisible" >
          <update-market :market="getmarket" v-model:ubackground="background" v-model:upicture="picture"></update-market>
          <el-button type="primary" @click="updatem()" v-if="getmarket.name.length>2&getmarket.name.length<16&getmarket.phone.length==11&getmarket.placeIntr!=''" style="margin-left:40px">确认创建</el-button>
         <el-button type="primary" @click="updatem()" v-else disabled style="margin-left:40px" >确认创建</el-button>
        </el-dialog>
  </div>
</template>

<script>
import {request} from "../../network/request";
import cookie from 'js-cookie';
import UpdateMarket from './UpdateMarket.vue';
  export default {
  components: { UpdateMarket },
    data() {
      return {
        background:{
          file:'',
          key:''
        },
        picture:{
          file:'',
          key:''
        },
        updatemarket:{},
        market:{
          name:'',
          phone:'',
          openingTime:'',
          endTime:'',
          background:'',
          picture:'',
          placeIntr:'',
        },
        dialogUpdateVisible:false,
      };
    },
    created() {
      this.getData()
    },
    computed:{
      getmarket(){
        return this.updatemarket
      }
    },
    methods: {
      submitForm() {
        this.dialogUpdateVisible=true;
      },
      getData(){
              request({
                method:'get',
                url:'/market/webmarketid?marketid='+JSON.parse(cookie.get('market')).sid,
                dataType:'json',
                async:false,
            }).then(res=>{
              console.log(res.data)
                this.market=res.data;
                this.market.openingTime=this.market.openingTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.market.openingTime.split('T')[1].split('.')[0].split(':')[1];
                this.market.endTime=this.market.endTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.market.endTime.split('T')[1].split('.')[0].split(':')[1];
                this.updatemarket=JSON.parse(JSON.stringify(this.market));
            }).catch(err=>{
                console.log(err);
            })
      }, 
      updatem() {
        console.log(this.background)
              this.getmarket.openingTime="1999-07-14T"+this.getmarket.openingTime+":00.000+0800"
              this.getmarket.endTime="1999-07-14T"+this.getmarket.endTime+":00.000+0800"
              request({
                method:'post',
                url:'/market/update',
                dataType:'json',
                async:false,
                data:this.getmarket
            }).then(res=>{
                this.dialogUpdateVisible=false;
                this.market=res.data;
                this.market.picture=this.getmarket.picture
                this.market.background=this.getmarket.background
                this.market.openingTime=this.market.openingTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.market.openingTime.split('T')[1].split('.')[0].split(':')[1];
                this.market.endTime=this.market.endTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.market.endTime.split('T')[1].split('.')[0].split(':')[1];
                this.getmarket.openingTime=this.getmarket.openingTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.getmarket.openingTime.split('T')[1].split('.')[0].split(':')[1];
                this.getmarket.endTime=this.getmarket.endTime.split('T')[1].split('.')[0].split(':')[0]+":"+this.getmarket.endTime.split('T')[1].split('.')[0].split(':')[1];
                this.background.key="/picture/marketback/"+this.market.sid+".jpg"
                this.picture.key="/picture/market/"+this.market.sid+".jpg"
                if(this.background.file!='')
                  this.uploadpicture(this.background);
                if(this.picture.file!='')
                  this.uploadpicture(this.picture);
            }).catch(err=>{
                console.log(err);
            })
      },
      uploadpicture(data){
              const param = new FormData();
                param.append("file", data.file);
                param.append("key", data.key);
                request({
                method:'post',
                url:'/market/getpicture',
                // dataType:'json',
                async:false,
                data:param
            }).then(res=>{
              res
            }).catch(err=>{
                console.log(err);
            })
      }
    },
  }
</script>
<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>