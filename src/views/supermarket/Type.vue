<template>
<div class="container">
<div class="custom-tree-container">
  <div class="block">
    <el-button type="primary"  v-if="active!=3" @click="append(type)" style="margin-bottom:20px">新增</el-button>
    <el-tree
      :data="type"
      node-key="sid"
      :expand-on-click-node="false">
      <template #default="{ node, data }" >  
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button
                size="mini"
                type="success"
                v-show="data.top==-1"
              @click="append(data)">
              添加
            </el-button>
                <el-button
                size="mini"
                type="success"
                v-show="data.top!=-1"
                disabled
              @click="append(data)">
              添加
            </el-button>
            <el-button
                type="danger"
                size="mini"
                v-show="node.isLeaf"
              @click="remove(node, data)">
              删除
            </el-button>
            <el-button
                type="danger"
                size="mini"
                v-show="!node.isLeaf"
                disabled
              @click="remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</div>
<el-dialog title="类别名称" v-model="dialogTableVisible">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="类别名称">
                <el-input v-model="form.name" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="onSubmit(data1)">立即添加</el-button>
            <el-button @click="withdraw">取消</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
</div>
</template>

<script>
import { request } from '../../network/request';
import cookie from 'js-cookie';
  export default {
    data() {
      return{
        type:[],
        data1:{},
        input:"",
        dialogTableVisible:false,
        form: {
            name: ''
        }
    };
    },
    created() {
      this.getData()
    },
    methods: {
      getData(){
               request({
                method:'get',
                url:'/type/searchweb?marketid='+JSON.parse(cookie.get('market')).sid,
                dataType:'json',
                async:false,
            }).then(res=>{
              for(let i=0 ;i<res.data.length;i++){
                if(res.data[i].topId==null){
                  const newChild = { id: res.data[i].sid, label: res.data[i].name, children: [], top:-1 };
                  this.type.push(newChild)
                }else{
                  for(let j=0 ;j<this.type.length;j++){
                    if(this.type[j].id==res.data[i].topId){
                      const newChild = { id: res.data[i].sid, label: res.data[i].name, top:this.type[j].id};
                      this.type[j].children.push(newChild)
                    }

                  }
                }
              }
              console.log(this.type)
            }).catch(err=>{
                console.log(err);
            })
      },

      append(data) {
        this.data1=data
        this.dialogTableVisible=true
      },
      onSubmit(data){
        if(data.top!=undefined){
              request({
              method:'post',
              url:'/type/add',
              dataType:'json',
              async:false,
              data:{topId:data.id,marketId:JSON.parse(cookie.get('market')).sid,name:this.form.name}
            }).then(res=>{
              const newChild = { id: res.data.sid, label: this.form.name, children: [], top:res.data.topId };
              data.children.push(newChild);
              this.dialogTableVisible=false
              this.form.name=""
            }).catch(err=>{
              console.log(err);
            })
        }else{
            request({
              method:'post',
              url:'/type/add',
              dataType:'json',
              async:false,
              data:{marketId:JSON.parse(cookie.get('market')).sid,name:this.form.name}
            }).then(res=>{
              const newChild = { id:res.data.sid, label: res.data.name, children: [], top:-1 };
              this.type.push(newChild)
              this.dialogTableVisible=false
              this.form.name=""
            }).catch(err=>{
              console.log(err);
            })
        }
      },
      remove(node, data) {
        this.$confirm('此操作将永久删除此类别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        request({
          method:'post',
          url:'/type/delete',
          dataType:'json',
          async:false,
          data:{marketId:JSON.parse(cookie.get('market')).sid,name:children[index].name,sid:children[index].id}
        }).then(res=>{
          res
        children.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
      withdraw(){
        this.dialogTableVisible=false;
      }
    },
  };
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree-node__content{
      height:30px
  }
</style>
