<template>
<div class="container">
<div class="select">
    <el-checkbox v-model="checked" @click="notfive">只显示未五星</el-checkbox>
</div>
  <el-table
    :data="tableData"
    border
    max-height:8
    style="width: 100% ">
    <el-table-column
      prop="sid"
      label="订单号"
      align="center"
      width="80px">
    </el-table-column>
        <el-table-column
      prop="name"
      label="用户名"
      align="center"
      width="80px">
    </el-table-column>
    <el-table-column
      prop="time"
      label="评价时间"
      align="center"
      width="200px">
    </el-table-column>
    <el-table-column
      align="center"
      label="评分"
      width="150px">
        <template #default="scope">
        <el-rate
            v-model="scope.row.grade"
            disabled
            text-color="#ff9900"
            score-template="{value}">
        </el-rate>
        </template>
    </el-table-column>
     <el-table-column
      prop="introduce"
      label="评价"
      align="center">
    </el-table-column>
    <el-table-column  label="图片" align="center"  width="100px"><template #default="scope">
        <el-image
        v-if="scope.row.contentpicture!=undefined"
            style="width: 50px; height: 50px"
            :src="scope.row.contentpicture"
            :preview-src-list="[scope.row.contentpicture]"
        ></el-image>
    </template>
    </el-table-column>
     <el-table-column
        width="80px"
       label="订单详情"
       align="center">
     <template #default="scope">
      <el-button
          @click="getproduct(scope.row.sid)"
          type="text"
          size="small">
          详情
        </el-button>
      </template>
    </el-table-column>
    <el-table-column 
        label="回复"
        align="center"
        width="100px">
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleAccpet(scope.$index,scope.row.sid)" v-if="scope.row.marketreviewid==null">回复</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div class="pagination">
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        v-model:currentPage="currentPage"
        layout="total,prev, pager, next"
        :total="total">
        </el-pagination>
    </div>
        <el-dialog title="订单详情" v-model="dialogTableVisible" >
            <p class="pa">订单号：{{OrderData.order_id}}</p>
            <p class="pa">日期：{{OrderData.order_time}}</p>
            <p class="pa">备注：{{OrderData.note}}</p>
            <p class="pa">用户名：{{OrderData.name}}</p>
            <p class="pa">手机号：{{OrderData.phone}}</p>
            <el-table :data="OrderData.goodsList" border>
                <el-table-column property="name" label="名称"  align="center"></el-table-column>
                <el-table-column  label="图片" align="center"><template #default="scope">
                        <el-image
                            style="width: 50px; height: 50px"
                            :src="scope.row.picture"
                            :preview-src-list="[scope.row.picture]"
                        ></el-image>
                    </template>
                    </el-table-column>
                <el-table-column property="price" label="单价"  align="center"></el-table-column>
                <el-table-column property="num" label="数量" align="center"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="回复" v-model="dialogRemarkVisible" >
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
import {request} from "../../network/request";
import cookie from 'js-cookie';
export default {
    data() {
      return {
        textarea:"",
        checked:false,
        dialogTableVisible: false,
        dialogRemarkVisible:false,
        input:"",
        total:2,
        currentPage:1,
        pageSize:7,
        requestid:1,
        index:1,
        tableData:[],
        OrderData:{
        }
      }
    },
      created() {
      this.getData(0,1);
      this.getTotal(1)
    },
    computed(){
    },
    methods: {
            getData(val,type) {
              request({
                method:'get',
                url:'/remark/websearchlist?marketid='+JSON.parse(cookie.get('market')).sid+'&mcount='+val+'&type='+type,
                dataType:'json',
                async:false,
            }).then(res=>{
              console.log(res);
                this.tableData=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
         getTotal(val){
              request({
                method:'get',
                url:'/remark/gettotal?sid='+JSON.parse(cookie.get('market')).sid+'&type='+val,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.total=res.data;
            }).catch(err=>{
                console.log(err);
            })
            },


        getproduct(sid){
            this.dialogTableVisible=true;
                request({
                method:'get',
                url:'/order/getbysid?sid='+sid,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.OrderData=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
        handleCurrentChange(val) {
          if(!this.checked)
            this.getData(val-1,1)
          else
              this.getData(val-1,2)
      },
      handleAccpet(index,sid){
        this.dialogRemarkVisible=true;
        this.index=index;
        this.requestid=sid;
        console.log(this.requestid)
      },
      notfive(){
        if(!this.checked){
          this.currentPage=1;
          this.getData(0,2);}
        else{
          this.currentPage=1;
          this.getData(0,1);}
    },
    send(){
            request({
                method:'post',
                url:'/remark/addM',
                dataType:'json',
                async:false,
                data:{
                  marketId:JSON.parse(cookie.get('market')).sid,
                  intro:this.textarea,
                  userreviewId:this.requestid,
                }
            }).then(res=>{
                res;
                this.tableData[this.index].marketreviewid=1;
                this.dialogRemarkVisible=false;
                this.textarea="";
                this.total=this.total-1;
            }).catch(err=>{
                console.log(err);
            })
    }
}
}
</script>
<style scoped>
.select{
    margin-bottom: 20px;
}
.pa{
    padding: 10px;
}
</style>