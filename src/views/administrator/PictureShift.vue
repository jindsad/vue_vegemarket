<template>
  <div class="container">
          <h2 style="margin-bottom:30px">点击切换图片</h2>
  <el-carousel :key="id" :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="(item,index) in carousel" :key="item.sid">
        <el-image :src="item.picture" @click="getpicture(index)" style="width:100%;height:400px;" ></el-image>
    </el-carousel-item>
  </el-carousel>
        <el-dialog title="轮播图更改" v-model="dialogTableVisible"  style="width: 400px;height: 400px" >
            <el-form
              label-width="100px"
              class="demo-ruleForm"
            >
    <el-form-item label="商店ID">
      <el-input
        placeholder="请输入商店ID"
        v-model="marketid"
        style="width: 70%"
      ></el-input>
          </el-form-item>
            <el-form-item label="图片">
            <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="beforeUpload"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 400px;height: 300px">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 400px;height: 300px"></i>
            </el-upload>
            </el-form-item>
        <el-button type="success" style="margin-right:10px;margin-top:10px"  @click="uploadpicture">更换</el-button>
          </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { request } from "../../network/request";
export default {
  data() {
    return {
      carousel:[],
      marketid: "",
      id: new Date().getTime(),
      srccopy: [],
      dialogTableVisible: false,
      imageUrl: "",
      index: "",
      picture: {
        file: "",
        key: "",
      },
    };
  },
  created() {
    this.getc();
    this.getdata();
  },

  methods: {
    getc(){
      for(let i=1;i<7;i++){
        this.carousel.push({sid:1,picture:"https://tuyun-1301564486.cos.ap-shanghai.myqcloud.com/pictureshift/"+i+".jpg"})
      }
    },
    getdata() {
            request({
              method: "get",
              url: "/manage/getallcarousel",
              dataType:'json',
              async: false,
            })
              .then((res) => {
                this.carousel=res.data;
              })
              .catch((err) => {
                console.log(err);
              });
    },
    beforeUpload(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.picture.file = file.raw;
    },
    getpicture(index) {
      this.dialogTableVisible = true;
      this.index = index;
      this.marketid=this.carousel[index].marketid
      this.imageUrl=this.carousel[index].picture
      this.picture.key = "/pictureshift/" + (index + 1) + ".jpg";
    },
    uploadpicture() {
      if (this.marketid != "") {
        const param = new FormData();
        param.append("file", this.picture.file);
        param.append("key", this.picture.key);
        request({
          method: "get",
          url:
            "/manage/carousel?marketid=" + this.marketid + "&sid=" +this.index,
          dataType: "json",
          async: false,
        })
          .then((res) => {
            res;
            request({
              method: "post",
              url: "/market/getpicture",
              // dataType:'json',
              async: false,
              data: param,
            })
              .then((res) => {
                res;
                this.carousel[this.index].picture = this.imageUrl;
                this.id = new Date().getTime();
                this.marketid = "";
                this.dialogTableVisible = false;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        ElMessage("商店ID不能为空");
      }
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}
.avatar {
  width: 400px;
  height: 300px;
  display: block;
}
</style>