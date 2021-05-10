<template>
    <div style="margin-bottom:20px">
    <el-input v-model="city" placeholder="请输入城市" style="width:200px"></el-input>
      <!-- <el-button type="success" @click="getcity">确认</el-button> -->
      <el-input v-model="place" placeholder="请输入详细地址" style="width:300px;margin-left:50px"></el-input>
      <el-button type="success" @click="getplace" style="10px">确认</el-button>
      </div>
    <div id="container" style="width: 80%;height: 450px"></div>
    <p>经度{{gps.longitude}}：              维度：{{gps.latitude}}</p>
</template>
<script>
import BMap from 'BMap'
export default {
    data() {
      return {
        gps:{
            latitude:"",
            longitude:""
        },
        city:"",
        place:"",
        map:""
      };
    },created() {
      this.gps=this.ugps
    },   
     props:{ugps:Object},
    mounted(){
      this.getAdress()
    },
    methods: {
      getAdress(){
            let __this = this;
            let map = new BMap.Map('container')
            let point = new BMap.Point(116.404, 39.915)
            map.centerAndZoom(point, 15)
            map.enableScrollWheelZoom(true)
            console.log(map)
            map.addEventListener('click', function (e) {
            map.clearOverlays();
            __this.gps.latitude= e.point.lat;
            __this.gps.longitude=e.point.lng;
            let point = new BMap.Point( e.point.lng, e.point.lat)
            let marker = new BMap.Marker(point);   
            map.addOverlay(marker); 
            });
            __this.map=map
      },
      getplace(){
            let map = this.map
            let myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上，并调整地图视野
            myGeo.getPoint(this.place, function(point){
                if(point){
                    map.centerAndZoom(point, 16);
                }else{
                    alert('您选择的地址没有解析到结果！');
                }
            }, this.city)
      }
    }
  }
</script>