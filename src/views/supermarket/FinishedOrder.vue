<template>
<div class="container">
  <el-input v-model="input" placeholder="订单号查询" style="width:150px; margin-right:10px"></el-input>
<el-button type="success" style="margin-right:50px" @click="sidselect">订单号查询</el-button>
    <el-date-picker
      v-model="time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button @click="selectbydate()" type="success" style="margin-left:10px">日期查询</el-button>
  <el-table
    v-model:data="OrderData"
    border
    max-height:8
    style="width: 100%;margin-top:30px">
    <el-table-column
      prop="order_id"
      label="订单号"
      align="center"
      width="300px">
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户名"
      align="center"
      width="80px">
    </el-table-column>
      <el-table-column
      prop="phone"
      label="手机号"
      align="center"
      width="160px">
    </el-table-column>
    <el-table-column
      prop="order_time"
      label="下单时间"
      align="center"
      width="200px">
    </el-table-column>
      <el-table-column
      prop="get_time"
      label="完成时间"
      align="center"
      width="200px">
    </el-table-column>
    <el-table-column
      prop="price"
      label="总价"
      align="center"
      width="80px">
    </el-table-column>
     <el-table-column
       label="商品">
     <template #default="scope">
         {{scope.row.goods}}
      <el-button
          @click="getproduct(scope.$index)"
          type="text"
          size="small">
           详情
        </el-button>
      </template>
    </el-table-column>
        <el-table-column
      label="总价"
      align="center"
      width="80px">
           <template #default="scope">
             <p v-if="scope.row.isagree==4">被拒绝</p>
             <p v-else>已完成</p>
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
    <el-dialog title="订单详情" v-model="dialogTableVisible" >
        <el-table 
        :data="ProductData"
        border>
            <el-table-column property="name" label="名称"  align="center"></el-table-column>
            <el-table-column property="price" label="单价"  align="center"></el-table-column>
            <el-table-column property="num" label="数量" align="center"></el-table-column>
            <el-table-column  label="图片" align="center"><template #default="scope">
                        <el-image
                            style="width: 50px; height: 50px"
                            :src="scope.row.picture"
                            :preview-src-list="[scope.row.picture]"
                        ></el-image>
                    </template>
            </el-table-column>
        </el-table>
    </el-dialog>
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
        ProductData:[],
        dialogTableVisible: false,
        total:2,
        pageSize:7,
        currentPage:1,
        OrderData:[],
        isselect:false,
        isdateselect:false,
      }
    },computed:{

    },
    created() {
      this.getData(0)
      this.getTotal()
    },
    methods: {
 getTotal(){
              request({
                method:'get',
                url:'/order/gettotal?sid='+JSON.parse(cookie.get('market')).sid+'&type=2',
                dataType:'json',
                async:false,
            }).then(res=>{
                this.total=res.data;
            }).catch(err=>{
                console.log(err);
            })
            },
            getTotalTime(){
              request({
                method:'get',
                url:'/order/gettotal?sid='+JSON.parse(cookie.get('market')).sid+'&data1='+this.time[0].getTime()+'&data2='+this.time[1].getTime()+'&type=2',
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
                url:'/order/websearchlist?sid='+JSON.parse(cookie.get('market')).sid+'&mcount='+val+'&type=2',
                dataType:'json',
                async:false,
            }).then(res=>{
                this.OrderData=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
        getproduct(index){
            this.dialogTableVisible=true;
            this.ProductData=this.OrderData[index].goodsList;
        },
          handleCurrentChange(val) {
            if(!this.isselect){
              if(!this.isdateselect){
                  this.getData(val-1);
                  }
              else{
                this.dateselect(val-1);
              }
              }
      },sidselect(){
        if(this.input!=''){
                request({
                method:'get',
                url:'/order/getbysid?orderid='+this.input+'&marketid='+JSON.parse(cookie.get('market')).sid,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.OrderData=[res.data];
                this.currentPage=1;
                this.total=this.OrderData.length;
                this.isselect=true;
            }).catch(err=>{
                console.log(err);
            })
            }else{
              this.getData(0);
              this.getTotal();
              this.currentPage=1;
              this.isselect=false;
              this.isdateselect=false;
            }
      },selectbydate(){
        this.dateselect(0);
        this.currentPage=1;
      },
      dateselect(val){
                request({
                method:'get',
                url:'/order/getbydata?data1='+this.time[0].getTime()+'&data2='+this.time[1].getTime()+'&sid='+JSON.parse(cookie.get('market')).sid+'&mcount='+val,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.OrderData=res.data;
                this.getTotalTime()
                this.isdateselect=true
            }).catch(err=>{
                console.log(err);
            })
      },

    },
};
</script>