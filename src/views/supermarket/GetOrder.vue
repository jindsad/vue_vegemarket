<template>
<div v-if="OrderData!=[]">
<div for v-for="(order,index) in OrderData" :key="order" style="margin-top:10px">
<el-card class="box-card" >
  <template #header>
    <div class="card-header">
      <span class="orderid">{{order.order_id.substr(-4)}}</span>
      <span  style="font-size:14px; margin-right:400px"> 下单时间:{{order.order_time}}</span>
      <div >
        <el-button
          size="mini"
          v-if="order.isagree==1"
          @click="handleAccpet(index, order.sid)">接收</el-button>
        <el-button
          size="mini"
          type="danger"
          v-if="order.isagree==1"
          @click="handleReject(index, order.sid)">拒绝</el-button>
        <el-button
          size="mini"
          v-if="order.isagree==5"
          style="visibility:hidden">完成</el-button>
        <el-button
          size="mini"
          v-if="order.isagree==5"
          @click="handleComplete(index, order.sid)">完成</el-button>
      </div>
    </div>
  </template>
  <p style="font-size:20px; font-weight:bold" class="box-cards-span">{{order.name}}</p>
  <p style="font-size:14px" class="box-cards-span">手机号:{{order.phone}}</p>
    <p style="font-size:14px" class="box-cards-span" v-if="order.note!=NULL">详情:{{order.note}}</p>
    <p style="font-size:14px" class="box-cards-span" v-else>详情:无</p>
</el-card>
<el-card class="box-card" style="margin-top:5px">
  <template #header>
    <div class="card-header">
      <span style="font-size:18px; font-weight:bold" >商品</span>
      <span style="margin-left:500px;font-weight:bold">总价:{{order.price}}</span>
 <el-button   type="text" @click="gproduct(index)" >{{visb[index]}}</el-button >
    </div>
  </template >
  <div v-if="dialogTableVisible[index]">
  <div v-for="product in order.goodsList" :key="product"  style="display: flex; justify-content: space-between; align-items: center; border-bottom:1px solid #F5F5F5" >
    <span class="proudct-span">{{product.name}}</span>
    <span style="margin-left:100px;font-weight:bold">X{{product.num}}</span>
    <span  style="width:50px">{{product.price}}</span>
  </div>
  </div>
</el-card>
</div>
</div>
<div class="container" style="width:850px;height:50px;padding:0px 30px" v-if="total>7">
    <div class="pagination" style="margin:10px 0">
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total,prev, pager, next"
        :total="total">
        </el-pagination>
    </div>
    </div>
</template>

<script>
import {request} from "../../network/request";
import cookie from 'js-cookie';
export default {
    data() {
      return {
        input:'',
        time: [new Date(2021, 2, 11, 0, 0), new Date(2021, 4, 11, 0, 0)],
        dialogTableVisible: [],
        visb: [],
        total:2,
        pageSize:7,
        OrderData:[],
      }
    },
    computed(){
    },
     created() {
      this.getData(0)
      this.getTotal()
    },
    methods: { 
            getTotal(){
              request({
                method:'get',
                url:'/order/gettotal?sid='+JSON.parse(cookie.get('market')).sid+'&type=1',
                dataType:'json',
                async:false,
            }).then(res=>{
                this.total=res.data;
            }).catch(err=>{
                console.log(err);
            })
            },
            getData(val) {
              request({
                method:'get',
                url:'/order/websearchlist?sid='+JSON.parse(cookie.get('market')).sid+'&mcount='+val+'&type=1',
                dataType:'json',
                async:false,
            }).then(res=>{
                console.log(res.data);
                this.OrderData=res.data;
                this.dialogTableVisible=[false,false,false,false,false,false,false,false,false,false];
                this.visb=['展开','展开','展开','展开','展开','展开','展开','展开','展开','展开'];
            }).catch(err=>{
                console.log(err);
            })
        },
          gproduct(index){
            console.log(index)
            if(this.dialogTableVisible[index]==false){
                this.dialogTableVisible[index]=true;
                this.visb[index]='收起'
                }
            else{
              this.dialogTableVisible[index]=false;
              this.visb[index]='展开'
            }
        },
          handleCurrentChange(val) {
            this.getData(val-1)
      },
       handleReject(index,sid){
        this.updateState(index,sid,4)
    },
      handleAccpet(index,sid){
        this.updateState(index,sid,5)
    },handleComplete(index,sid){
        this.updateState(index,sid,3)
    },updateState(index,sid,type){
              request({
                method:'get',
                url:'/order/updatestate?sid='+sid+'&type='+type,
                dataType:'json',
                async:false,
            }).then(res=>{
              console.log(res);
              this.OrderData[index].isagree=type;
              // if(this.OrderData[index].isagree!=1|this.OrderData[index].isagree!=5){
              //   this.OrderData.
              // }
            }).catch(err=>{
                console.log(err);
            })
    }
    },
    }
</script>
<style scoped>
 .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
    
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width:910px;
  }
  .orderid{
    font-size: 20px;
    width:50px;
    color:chartreuse;
    font-weight:bold
  }
  .box-cards-span{
    padding: 5px;
  }
  .proudct-span{
    padding: 10px;
    width: 500px;
  }
</style>
