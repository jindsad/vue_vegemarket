<template>
<div class="container">
<div class="select">
<el-input v-model="input" placeholder="输入名称" style="width:150px; margin-right:10px"></el-input>
<el-button type="success" style="margin-right:50px" @click="select">名称查询</el-button>
<el-button type="success" style="margin-right:50px" @click="add">新增</el-button>
</div>
  <el-table
    :data="tableData"
    max-height:8
    style="width: 100% ">
    <el-table-column
      prop="name"
      label="名称"
      align="center"
      width="160px">
    </el-table-column>
    <el-table-column
      prop="typename"
      label="一级类别"
      align="center"
      width="120px">
    </el-table-column>
        <el-table-column
      prop="ttypename"
      label="二级类别"
      align="center"
      width="120px">
    </el-table-column>
    <el-table-column
      prop="price"
      label="单价"
      align="center"
      width="80px">
    </el-table-column>
    <el-table-column
      prop="introduction"
      label="详情"
      align="center">
    </el-table-column>
        <el-table-column  label="图片" align="center"  width="100px"><template #default="scope">
        <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.picture"
            :preview-src-list="[scope.row.picture]"
        ></el-image>
    </template>
    </el-table-column>
    <el-table-column
      prop="inventory"
      label="库存"
      width="80px"
      align="center">
    </el-table-column>
    <el-table-column 
        label="操作"
        align="center"
        width="200px">
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelect(scope.$index, scope.row.sid)">删除</el-button>
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
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item prop="name" label="商品名称">
            <el-input v-model="form.name" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item  prop="price" label="商品单价">
            <el-input type="number" v-model="form.price" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item prop="typeid"  label="一级类别">
            <el-select v-model="form.typeid" placeholder="请选择一级类别" @change="typechange(form.typeid)">
            <el-option v-for="item in firstttype" :label="item.name" :value="item.sid" :key="item.sid"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="ttypeid" label="二级类别">
            <el-select v-model="form.ttypeid" placeholder="请选择二级类别(可为空)">
            <el-option v-for="item in secondtype" :label="item.name" :value="item.sid" :key="item.sid"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="图片" >
            <el-upload
            class="avatar-uploader"
            action=""
            ref="upload"
            :http-request="uploadpicture"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="beforeUpload"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
                <el-form-item prop="inventory" label="库存"> 
            <el-input type="number" v-model="form.inventory" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="详情">
            <el-input type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  type="primary" @click="onSubmit" v-if="form.name!=''&form.typeid!=''&form.inventory!=''&form.price!=''" >确定</el-button>
            <el-button  type="primary" @click="onSubmit" v-else disabled>确定</el-button>
            <el-button @click="withdraw">取消</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
    </div>
</template>
<script>
import {request} from "../../network/request";
import cookie from 'js-cookie';

export default {
    data() {
      return {
        imageUrl: '',
        dialogTableVisible: false,
        currentPage:1,
        input:"",
        index:1,
        total:2,
        pageSize:7,
        isselect:false,
        tableData:[],
        firstttype: [],
        secondtype: [],
        product:{
            key:'',
            file:''
        },
        form: {
          introduction: "",
          inventory: "",
          name: "",
          picture: "",
          price:"" ,
          sid: "",
          ttypeid: "",
          ttypename: "",
          typeid: "",
          typename: "",
        },
        rules:{
          inventory: [
                    { required: true, message: "请输入库存", trigger: "blur" }
                ],
          name: [
                    { required: true, message: "请输入商品名", trigger: "blur" }
                ],
          price:[
                    { required: true, message: "请输入价格", trigger: "blur" }
                ],
          typeid: [
                    { required: true, message: "请输入类别", trigger: "blur" }
                ],
        }
      }
    },
    computed(){
    },
    created() {
      this.getTotal(1);
      this.getData(0);
      this.getType();
    },
    methods: {
        getData(val) {
              request({
                method:'get',
                url:'/product/websearch?marketid='+JSON.parse(cookie.get('market')).sid+'&count='+val,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.tableData=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
          getType() {
              request({
                method:'get',
                url:'/type/searchfirst?marketid='+JSON.parse(cookie.get('market')).sid,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.firstttype=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
          getDataBykey(val) {
              request({
                method:'get',
                url:'/product/websearchkey?marketid='+JSON.parse(cookie.get('market')).sid+'&count='+val+"&key="+this.input,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.tableData=res.data;
            }).catch(err=>{
                console.log(err);
            })
        },
         getTotal(type){
              request({
                method:'get',
                url:'/product/gettotal?sid='+JSON.parse(cookie.get('market')).sid+'&type='+type+"&key="+this.input,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.total=res.data;
            }).catch(err=>{
                console.log(err);
            })
            },
        handleCurrentChange(val) {
          if(!this.isselect)
            this.getData(val-1)
          else
          this.getDataBykey(val-1)
      },
      select(){
        if(this.input==""){
          this.getData(0);
          this.getTotal(1);}
        else{
          this.isselect=true;
          this.getDataBykey(0);
          this.getTotal(2);
        }
          this.currentPage=1;
      },
          getTypeSecond(typeid,ischange) {
              request({
                method:'get',
                url:'/type/searchsecond?marketid='+JSON.parse(cookie.get('market')).sid+'&typeid='+typeid,
                dataType:'json',
                async:false,
            }).then(res=>{
                this.secondtype=res.data;
                if(this.secondtype.length>0&ischange==1)
                  this.form.ttypeid=this.secondtype[0].sid;
                else if(this.secondtype.length==0)
                  this.form.ttypeid="";
            }).catch(err=>{
                console.log(err);
            })
        },
        typechange(val){
          this.getTypeSecond(val,1)
        },
      
        handleEdit(index){
          this.dialogTableVisible=true;
          this.form=this.tableData[index];
          this.index=index;
          this.imageUrl=this.form.picture;
          this.getTypeSecond(this.tableData[index].typeid,2)

        },
        handleDelect(index,sid){
                  this.$confirm('此操作将永久删除此商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             request({
                method:'get',
                url:'/product/delete?productid='+sid,
                dataType:'json',
                async:false,
            }).then(res=>{
              res
              this.tableData.splice(index,1)
            }).catch(err=>{
                console.log(err);
            })
        }).catch(() => {
          this.isdelete=false
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        }, 
        onSubmit() {
        this.form.marketid=JSON.parse(cookie.get('market')).sid;
              request({
                method:'post',
                url:'/product/add',
                dataType:'json',
                async:false,
                data:this.form
            }).then(res=>{
              console.log(res)
              this.product.key="/picture/product/"+res.data+".jpg"
              console.log(this.product)
              this.uploadpicture(this.product);
              // this.$refs.upload.submit();
            }).catch(err=>{
                console.log(err);
            })
            this.dialogTableVisible=false;
      },
      withdraw(){
          this.dialogTableVisible=false;
      },      
      beforeUpload(file) {
          this.imageUrl=URL.createObjectURL(file.raw);
          this.product.file=file.raw;
      },
      add(){
          this.dialogTableVisible=true;
          this.form={
          introduction: "",
          inventory: "",
          name: "",
          picture: "",
          price:"" ,
          sid: "",
          ttypeid: null,
          ttypename: "",
          typeid: "",
          typename: "",
        }
          this.imageUrl=''
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
      }
};
</script>
<style scoped>
.select{
    margin-bottom: 20px;
}
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>