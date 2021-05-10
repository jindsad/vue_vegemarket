<template>
<div class="container">
<div class="select">
  <el-button type="success" style="margin-right:10px" @click="download">批量导出</el-button>
  <el-button type="success"  style="margin-right:10px" @click="upload">批量导入</el-button>
    <el-button type="success"  @click="uploadform">模板下载</el-button>
  </div>
    <el-table
    v-model:data="marketData"
    border
    max-height:8
    style="width: 100%;margin-top:30px">
    <el-table-column
      prop="name"
      label="超市名称"
      width="200px"
      align="center">
    </el-table-column>
    <el-table-column
      label="超市图片"
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
      prop="phone"
      label="手机号"
      align="center">
    </el-table-column>
      <el-table-column
      prop="grade"
      label="评分"
      align="center">
    </el-table-column>
          <el-table-column
      prop="amount"
      label="月销量"
      align="center">
    </el-table-column>
      <el-table-column
      prop="productNum"
      label="产品数量"
      align="center">
    </el-table-column>
     <el-table-column
      label="背景图片"
      align="center"
      width="100px">
      <template #default="scope">
        <el-image
         v-if="scope.row.background!=''&&scope.row.background!=undefined"
            style="width: 50px; height: 50px"
            :src="scope.row.background"
            :preview-src-list="[scope.row.background]"
        ></el-image>
    </template>
    </el-table-column>
      <el-table-column
      label="营业执照"
      align="center"
      width="100px">
      <template #default="scope">
        <el-image
            v-if="scope.row.license!=''&&scope.row.license!=undefined"
            style="width: 50px; height: 50px"
            :src="scope.row.license"
            :preview-src-list="[scope.row.license]"
        ></el-image>
    </template>
    </el-table-column>
    <el-table-column
      prop="placeIntr"
      label="地址详情"
      align="center"
      width="300px">
    </el-table-column>
      <el-table-column
      label="地址"
      align="center"
      width="100px">
     <template #default="scope">
      <el-button
          @click="getplace(scope.row)"
          type="text"
          size="small">
           详情
        </el-button>
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
      <el-dialog title="地图" v-model="dialogTableVisible" append-to-body=true style="width: 500px;height: 500px" >
    <div  id="container" style="width: 100%;height: 500px"></div>
    </el-dialog>
      <el-dialog title="批量导入" v-model="dialogFormVisible"  style="width: 500px;height: 500px" >
        <div>
        <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :on-change="beforeUpload"
        action=""
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
        </div>
    </el-dialog>
</div>
</template>

<script>
import { request } from '../../network/request';
import { ElMessage } from 'element-plus'
import BMap from 'BMap';
export default {
    data(){
        return {
            marketData:[],
            map:"",
            dialogTableVisible:false,
            dialogFormVisible:false,
            gps:{
                latitude:'',
                longitude:''
            },
            total:0,
            pageSize:6,
            currentPage:1,
            market:{
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
    updated(){
    if (this.dialogTableVisible) {
        if(this.map==""){
        let map = new BMap.Map('container')
        this.map=map
        }
        setTimeout(() => {
        let map = this.map
        let point = new BMap.Point(this.gps.longitude,this.gps.latitude)
        map.centerAndZoom(point, 15)
        map.enableScrollWheelZoom(true)
        // map.clearOverlays();
        let marker = new BMap.Marker(point);   
        map.addOverlay(marker); 
        }, 300);
    }
    },
    methods:{
        getData(count){
            request({
                method:'get',
                url:"/market/getallweb?count="+count,
                dataType:'json',
                async:false
            }).then(res=>{
                this.marketData=res.data
            }).catch(err=>{
                console.log(err);
            });
        },
        getplace(market){
            this.gps.latitude=market.latitude
            this.gps.longitude=market.longitude
            this.dialogTableVisible=true
        },
        getCount(){
            request({
                method:'get',
                url:"/market/count",
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
                url:"/market/getfile?fileName=marketinformation.xls",
                responseType: 'blob',
                async:false
            }).then(res=>{
                this.downloadFile(res, 'marketinformation.xls');
            }).catch(err=>{
                console.log(err);
            });
      },
      uploadform(){
            request({
                method:'get',
                url:"/user/getformfile?type=1",
                responseType: 'blob',
                async:false
            }).then(res=>{
                this.downloadFile(res, '商店导入模板.xls');
            }).catch(err=>{
                console.log(err);
            });
      },
      upload(){
        this.dialogFormVisible=true;
      },
      uploadweb(){
        if(this.market.file!=""){
              const param = new FormData();
                param.append("file", this.market.file);
                param.append("key", this.market.key);
                request({
                method:'post',
                url:'/market/downloadform',
                async:false,
                data:param
            }).then(res=>{
              if(res.data==2){
                ElMessage("格式错误")
              } else if(res.data==3){
                ElMessage("请上传xls文件")
              }else{
                this.dialogFormVisible=false;
              }
            }).catch(err=>{
                console.log(err);
            })
        }else{
          ElMessage("请选择上传文件")
        }
      },
        beforeUpload(file){
          this.market.file=file.raw;
          this.market.key="market"
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