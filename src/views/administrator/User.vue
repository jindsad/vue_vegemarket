<template>
<div class="container">
<div class="select">
  <el-button type="success" style="margin-right:10px" @click="download">批量导出</el-button>
  <el-button type="success" style="margin-right:10px"  @click="upload">批量导入</el-button>
      <el-button type="success"  @click="uploadform">模板下载</el-button>
  </div>
    <el-table
    v-model:data="userData"
    border
    max-height:8
    style="width: 100%;margin-top:30px">
    <el-table-column
      prop="userId"
      label="账号"
      width="200px"
      align="center">
    </el-table-column>
    <el-table-column
      label="用户头像"
      align="center"
      width="100px">
      <template #default="scope">
        <el-image
        v-if="scope.row.picture!=''&&scope.row.picture!=undefined"
            style="width: 50px; height: 50px"
            :src="scope.row.picture"
            :preview-src-list="[scope.row.picture]"
        ></el-image>
    </template>
    </el-table-column>
    <el-table-column
      label="注册时间"
      align="center">
      <template #default="scope">
      {{scope.row.creationTime.split('T')[0]}}
    </template>
    </el-table-column>
      <el-table-column
      label="注销时间"
      align="center">
      <template #default="scope">
      {{scope.row.creationTime.split('T')[0]}}
      </template>
    </el-table-column>
      <el-table-column
      prop="mobile"
      label="手机号"
      align="center">
    </el-table-column>
      <el-table-column
      prop="sex"
      label="性别"
      align="center">
    </el-table-column>
          <el-table-column
      prop="city"
      label="城市"
      align="center">
    </el-table-column>
      <el-table-column
      prop="introduction"
      label="简介"
      align="center">
    </el-table-column>
     <el-table-column
      label="积分"
      prop="integral"
      align="center"
      width="100px">
    </el-table-column>
      <el-table-column
      label="用户属性"
      align="center"
      width="100px">
      <template #default="scope">
      <p v-if="scope.row.marketId==0">普通用户</p>
        <p v-else>超市管理员</p>
    </template>
    </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination
        background
        hide-on-single-page
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
        :page-size="pageSize"
        layout="total,prev, pager, next"
        :total="total">
        </el-pagination>
    </div>
      <el-dialog title="批量导入" v-model="dialogTableVisible"  style="width: 500px;height: 500px" >
        <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        action=""
        :on-change="beforeUpload"
        :limit="1"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xls 文件，且不超过 500kb
          </div>
        </template>
      </el-upload>
        <el-button type="success" style="margin-right:10px;margin-top:10px"  @click="uploadweb">导入</el-button>
    </el-dialog>
</div>
</template>

<script>
import { request } from '../../network/request';
import { ElMessage } from 'element-plus'
export default {
    data(){
        return {
            userData:[],
            dialogTableVisible:false,
            total:0,
            pageSize:6,
            currentPage:1,
            user:{
              file:'',
              key:''
            },
        }
    },
    created(){
        this.getData(0);
        this.getCount();
    },
    mounted(){
    //   this.getAdress()
    },
    methods:{
        getData(count){
            request({
                method:'get',
                url:"/user/getallweb?count="+count,
                dataType:'json',
                async:false
            }).then(res=>{
                this.userData=res.data
                console.log(this.userData)
                this.currentPage=count
            }).catch(err=>{
                console.log(err);
            });
        },
        getCount(){
            request({
                method:'get',
                url:"/user/count",
                dataType:'json',
                async:false
            }).then(res=>{
                this.total=res.data;
            }).catch(err=>{
                console.log(err);
            });
        }, handleCurrentChange(val) {
            this.getData(val-1);
      },
      download(){
              request({
                method:'get',
                url:"/user/getfile?fileName=userinformation.xls",
                responseType: 'blob',
                async:false
            }).then(res=>{
                this.downloadFile(res, 'userinformation.xls');
            }).catch(err=>{
                console.log(err);
            });
      },
      uploadform(){
            request({
                method:'get',
                url:"/user/getformfile?type=2",
                responseType: 'blob',
                async:false
            }).then(res=>{
                this.downloadFile(res, '用户导入模板.xls');
            }).catch(err=>{
                console.log(err);
            });
      },
      upload(){
        this.dialogTableVisible=true
      },
      uploadweb(){
        if(this.user.file!=""){
              const param = new FormData();
                param.append("file", this.user.file);
                param.append("key", this.user.key);
                request({
                method:'post',
                url:'/user/downloadform',
                async:false,
                data:param
            }).then(res=>{
              if(res.data==2){
                ElMessage("格式错误")
              } else if(res.data==3){
                ElMessage("请上传xls文件")
              }else{
                this.dialogTableVisible=false;
              }
            }).catch(err=>{
                console.log(err);
            })
        }else{
          ElMessage("请选择上传文件")
        }
      },
      beforeUpload(file){
          this.user.file=file.raw;
          this.user.key="user"
      },
      downloadFile(res, fileName) {
        let blob = new Blob([res.data]); //res为从后台返回的数据
        if (!fileName) {
            fileName = res.headers['content-disposition'].split('filename=').pop();
        }
        if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
        }
      }
    }
}
</script>

<style>
.select{
    margin-bottom: 10px;
}
</style>