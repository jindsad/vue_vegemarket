<template>
<div class="container">
    <el-table
    v-model:data="marketData"
    border
    max-height:8
    style="width: 100%;margin-top:30px">
    <el-table-column
      prop="name"
      label="超市名称"
      align="center">
    </el-table-column>
    <el-table-column
      label="超市图片"
      align="center"
      width="100px">
      <template #default="scope">
        <el-image
        v-if="scope.row.picture!=''"
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
      label="背景图片"
      align="center"
      width="100px">
      <template #default="scope">
        <el-image
         v-if="scope.row.background!=''"
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
         v-if="scope.row.license!=''"
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
    <el-table-column 
        label="操作"
        align="center"
        width="200px">
      <template #default="scope">
        <el-button
          size="mini"
          @click="Accpet(scope.$index,scope.row.sid,1)">同意</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="Refuse(scope.$index,scope.row.sid,-1)">拒绝</el-button>
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
        <el-dialog title="回复原因" v-model="dialogRefuseVisible" >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="30"
            show-word-limit
          ></el-input>
          <el-button type="primary" style="margin-top:10px;" @click="send()" >发送</el-button>
        </el-dialog>
</div>
</template>

<script>
import { request } from '../../network/request';
import BMap from 'BMap';
export default {
    data(){
        return {
            marketData:[],
            map:"",
            dialogTableVisible:false,
            dialogRefuseVisible:false,
            gps:{
                latitude:'',
                longitude:''
            },
            total:0,
            sid:"",
            index:"",
            pageSize:6,
            currentPage:1,
            textarea:""
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
                url:"/market/verify?count="+count,
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
                url:"/market/verifycount",
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
      Refuse(index,sid){
          this.sid=sid
          this.index=index
          this.dialogRefuseVisible=true
      },
      Accpet(index,sid,state){
            request({
                method:'get',
                url:"/market/approve?sid="+sid+"&state="+state+"&context=恭喜你商店注册成功",
                dataType:'json',
                async:false
            }).then(res=>{
                res
                this.marketData.splice(index,1)
            }).catch(err=>{
                console.log(err);
            });
      },send(){
            request({
                method:'get',
                url:"/market/approve?sid="+this.sid+"&state=-1"+"&context="+this.textarea,
                dataType:'json',
                async:false
            }).then(res=>{
                res
                this.marketData.splice(this.index,1)
                this.dialogRefuseVisible=false
            }).catch(err=>{
                console.log(err);
            });
      }
    }
}
</script>

<style>

</style>