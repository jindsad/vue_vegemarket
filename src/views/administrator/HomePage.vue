<template>
<div>
  <el-row class="demoRow" align="center" gutter="20" style="margin-top:10px">
        <el-col :span="14">  
          <el-card class="box-card-order ">
            <template #header>
              <div  class="card-header">
                <span style="font-weight:bold;font-size:16px;">系统数据</span>
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
        <el-col :span="10" >  
          <el-card >
            <template #header>
              <div class="card-header">
                <span style="font-weight:bold;font-size:16px">商家销量前三</span>
              </div>
            </template>
            <el-row>
              <el-col :span="8" v-for="(item,index) in market" :key="index">
                <div class="card-body" style="align-items: center;margin-top:20px" >
                    <p :class="{active:item==0}" class="card-body-num">{{item}}</p>
                    <p class="card-body-title">{{marketTitle[index]}}</p>
                </div>
              </el-col>
              <div  v-if="marketTitle.length==0" style="min-height:150px">
                暂无数据
              </div>
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
        <el-col :span="10" >  
            <el-row>
          <div id="myChart" style="padding:20px 0px 0px 20px;height:230px;background:white;width:96%"></div>
          </el-row>
    </el-col>
    </el-row>
</div>
</template>

<script>
const echarts = require('echarts');
import { request } from '../../network/request';
  export default {
    data() {
      return {
        order:[],
        orderTitle:["未处理审批","今日新增用户","今日新增商家"],
        sale:[],
        saleTitle:["今日订单","今日营销额"],
        market:[],
        marketTitle:[],
        sumsale:[],
        sumsaleTime:[],
      };
    },
    created(){
      this.getmanage()
      this.getsale()
      this.getmarket()
    }, 
    mounted() {
    this.drawLine();    
    },
    methods: {
        getmanage(){
          request({
          method:'get',
          url:"/manage/increase",
          async:false,
          dataType:'json',
        }).then(res=>{
          this.order=res.data;
        }).catch(res=>{
          console.log(res);
        })
        },
        getsale(){
          request({
          method:'get',
          url:"/manage/sale",
          async:false,
          dataType:'json',
        }).then(res=>{
          this.sale=res.data;
          this.sale[1]="￥"+this.sale[1]
        }).catch(res=>{
          console.log(res);
        })
        },
        getmarket(){
          request({
          method:'get',
          url:"/manage/getmarket",
          async:false,
          dataType:'json',
        }).then(res=>{
          for(let key  in res.data){
            this.market.push(res.data[key])
            this.marketTitle.push(key)
          }
        }).catch(res=>{
          console.log(res);
        })
        },
      drawLine() {
          var myChart=echarts.init(document.getElementById("myChart"));
          request({
          method:'get',
          url:"/manage/sumsale",
          async:false,
          dataType:'json',
        }).then(res=>{
          this.sumsale=res.data;
                    for(let i=4;i>=0;i--){
            var day = new Date();
            day.setTime(day.getTime()-24*60*60*1000*i);
            this.sumsaleTime.push((day.getMonth()+1) + "-" + day.getDate());
          }
    var option={
        title:{
          text:'每日营销额统计'
        },
        legend:{
            data:['销量']
        },
        xAxis:{
            data:this.sumsaleTime
        },
        yAxis:{},
        series:[{
            name:'销量',
            type:'line',
            data:this.sumsale
        }]
    };
    myChart.setOption(option);
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