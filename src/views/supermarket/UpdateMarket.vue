<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="商店名称" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
    <el-form-item label="联系方式" prop="phone">
    <el-input v-model="ruleForm.phone"></el-input>
  </el-form-item>
    <el-form-item label="营业时间" prop="time">
        <el-time-select
            placeholder="起始时间"
            v-model="ruleForm.openingTime"
            start='00:00'
            step='00:15'
            end='24:00'>
        </el-time-select>
        <el-time-select
            placeholder="结束时间"
            v-model="ruleForm.endTime"
            start='00:00'
            step='00:15'
            end='24:00'
            :minTime="ruleForm.openingTime">
        </el-time-select>
  </el-form-item>
  <el-form-item label="背景图片">
        <el-upload
            class="avatar-uploader"
            action=""
            ref="upload"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="beforeUpload"
        >
        <img v-if="ruleForm.background" :src="ruleForm.background" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
  </el-form-item>
    <el-form-item label="店铺图片">
        <el-upload
              class="avatar-uploader"
            action=""
            ref="upload"
            :auto-upload="false"
            :show-file-list="false"
        :on-change="beforeUpload1"
        >
        <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
  </el-form-item>

      <el-form-item label="营业执照" v-if="market.sid==undefined" >
        <el-upload
            class="avatar-uploader"
            action=""
            ref="upload"
            :auto-upload="false"
            :show-file-list="false"
        :on-change="beforeUpload2"
        >
        <img v-if="ruleForm.license" :src="ruleForm.license" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
  </el-form-item>


  <el-form-item label="位置详情" prop="placeIntr">
    <el-input type="textarea" v-model="ruleForm.placeIntr" ></el-input>
  </el-form-item>
</el-form>
</template>

<script>
  export default {
    data() {
      return {
        background:{
          file:'',
          key:''
        },
        license:{
          file:'',
          key:''
        },
        picture:{
          file:'',
          key:''
        },
        ruleForm: {
          name: '',
          phone: '',
          placeIntr: '',
          openingTime:'08:00',
          endTime:'10:00'
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'change' },
            { len : 11, message: '手机号要11位', trigger: 'blur' }
          ],
          openingTime: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          endTime: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          placeIntr: [
            { required: true, message: '请填写地址详情', trigger: 'blur' }
          ]
        }
      };
    },
     created(){
            this.ruleForm=this.market;
            this.background=this.ubackground
            this.picture=this.upicture
            if(this.market.name==''){
              this.license=this.ulicense
            } 
    },
    props:{
      market:Object,
      ubackground:Object,
      upicture:Object,
      ulicense:Object
      },
    methods: {
      
      // submitForm() {
      //     console.log(this.ruleForm)
      //     if(this.market!=undefined){
      //         this.ruleForm.openingTime="1999-07-14T"+this.ruleForm.openingTime+":00.000+0800"
      //         this.ruleForm.endTime="1999-07-14T"+this.ruleForm.endTime+":00.000+0800"
      //         request({
      //           method:'post',
      //           url:'/market/update',
      //           dataType:'json',
      //           async:false,
      //           data:this.ruleForm
      //       }).then(res=>{
      //         res
      //         // this.$refs.upload.submit();
      //       }).catch(err=>{
      //           console.log(err);
      //       })}
      // },
      beforeUpload(file) {
          this.background.file=file.raw;
          this.ruleForm.background=URL.createObjectURL(file.raw);
      },
      beforeUpload1(file){
          this.picture.file=file.raw;
          this.ruleForm.picture=URL.createObjectURL(file.raw);
      },beforeUpload2(file){
          this.license.file=file.raw;
          this.ruleForm.license=URL.createObjectURL(file.raw);
      },
      
    }
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