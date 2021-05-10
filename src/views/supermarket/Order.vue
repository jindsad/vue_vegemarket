<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="接收订单" name="first"><get-order /></el-tab-pane>
    <el-tab-pane label="历史订单" name="second"><finished-order /></el-tab-pane>
  </el-tabs>
</template>
<script>
import GetOrder from './GetOrder.vue';
import FinishedOrder from './FinishedOrder.vue';

export default {
  components: { 
      GetOrder, 
      FinishedOrder },
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>