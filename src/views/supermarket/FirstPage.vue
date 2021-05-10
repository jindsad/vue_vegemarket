<template>
<div>
  <el-row class="demoRow" align="center" gutter="20" style="margin-top:10px">
        <el-col :span="14">  
          <el-card class="box-card-order ">
            <template #header>
              <div  class="card-header">
                <span style="font-weight:bold;font-size:16px;">待处理订单</span>
              </div>
            </template>
            <el-row>
              <el-col :span="8" v-for="(item,index) in order" :key="index">
                <div class="card-body" style="align-items: center;margin-top:20px">
                    <p :class="{active:item==0}" class="card-body-num">{{item}}</p>
                    <p class="card-body-title">{{orderTitle[index]}}</p>
                </div>
              </el-col>
          </el-row>
        </el-card>
    </el-col>
        <el-col :span="10">  
          <el-card >
            <template #header>
              <div class="card-header">
                <span style="font-weight:bold;font-size:16px">待处理反馈</span>
              </div>
            </template>
            <el-row>
              <el-col :span="12" v-for="(item,index) in remark" :key="index">
                <div class="card-body" style="align-items: center;margin-top:20px">
                    <p :class="{active:item==0,pbad:index==0}" class="card-body-num">{{item}}</p>
                    <p class="card-body-title">{{remarkTitle[index]}}</p>
                </div>
              </el-col>
          </el-row>
        </el-card>
    </el-col>
    </el-row>
      <el-row class="demoRow" align="center" gutter="20" style="margin-top:10px">
        <el-col :span="14">  
          <el-card class="box-card-order">
            <template #header>
              <div  class="card-header">
                <span style="font-weight:bold;font-size:16px;">今日总览</span>
              </div>
            </template>
            <el-row>
              <el-col :span="12" v-for="(item,index) in sale" :key="index">
                <div class="card-body" style="align-items: center;margin-top:20px">
                    <p :class="{active:item==0}" class="card-body-num">{{item}}</p>
                    <p class="card-body-title">{{saleTitle[index]}}</p>
                </div>
              </el-col>
          </el-row>
        </el-card>
    </el-col>
        <el-col :span="10">  
          <el-card class="box-card-remark">
            <template #header>
              <div class="card-header">
                <span style="font-weight:bold;font-size:16px">今日销量前三</span>
              </div>
            </template>
            <el-row>
              <el-col :span="8" v-for="(item,index) in product" :key="index">
                <div class="card-body" style="align-items: center;margin-top:20px">
                    <p :class="{active:item==0}" class="card-body-num">{{item}}</p>
                    <p class="card-body-title">{{productTitle[index]}}</p>
                </div>
              </el-col>
              <div  v-if="productTitle.length==0" style="min-height:150px">
                暂无数据
              </div>
          </el-row>
        </el-card>
    </el-col>
    </el-row>
</div>
</template>

<script>
import { request } from '../../network/request';
import cookie from 'js-cookie';
  export default {
    data() {
      return {
        order:[],
        orderTitle:["新订单","进行中订单","拒绝订单数"],
        remark:[],
        remarkTitle:["未回复差评","未回复评论"],
        sale:[],
        saleTitle:["今日订单","今日营销额"],
        product:[],
        productTitle:[],
      };
    },
    created(){
      this.getorder();
      this.getremark();
      this.getsale();
      this.getproduct();
    },
    methods: {
      getorder(){
        request({
          method:'get',
          url:"/order/getordernum?marketid="+JSON.parse(cookie.get('market')).sid,
          async:false,
          dataType:'json',
        }).then(res=>{
          this.order=res.data;
        }).catch(res=>{
          console.log(res);
        })
      },
      getremark(){
        request({
          method:'get',
          url:"/remark/getreviewnum?marketid="+JSON.parse(cookie.get('market')).sid,
          async:false,
          dataType:'json',
        }).then(res=>{
          this.remark=res.data;
        }).catch(res=>{
          console.log(res);
        })
      },
      getsale(){
        request({
          method:'get',
          url:"/order/getmarketnum?marketid="+JSON.parse(cookie.get('market')).sid,
          async:false,
          dataType:'json',
        }).then(res=>{
          this.sale=res.data;
          this.sale[1]="￥"+this.sale[1]
        }).catch(res=>{
          console.log(res);
        })
      },
      getproduct(){
        request({
          method:'get',
          url:"/order/getproduct?marketid="+JSON.parse(cookie.get('market')).sid,
          async:false,
          dataType:'json',
        }).then(res=>{
          for(let key  in res.data){
            this.product.push(res.data[key])
            this.productTitle.push(key)
          }
        }).catch(res=>{
          console.log(res);
        })
      }
    }
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

  .box-card-order {
    margin-left: 10px;
  }
  .card-body{
      height:130px;
  }
  .card-body-num{
    text-align:center;
    font-size:64px;
    color:#0091EA
  }
  .card-body-title{
  text-align:center;
  margin-top:10px;
  font-weight:bold;
  font-size:16px;
  color:#757575
  }
  .active{
    color:#CCCCCC ;
  }
  .pbad{
    color: #747474;
  }
</style>