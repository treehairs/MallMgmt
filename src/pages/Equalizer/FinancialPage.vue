<template>
  <div class="financial-container">
    <div class="header-box">
      <ul>
        <li class="border">
          <div class="icon"><q-icon name="sentiment_satisfied" /></div>
          <div class="info">
            <span class="data">123</span>
            <span class="text">本日销售额</span>
          </div>
        </li>
        <li class="border">
          <div class="icon"><q-icon name="attach_money" /></div>
          <div class="info">
            <span class="data">123</span>
            <span class="text">总销售额</span>
          </div>
        </li>
        <li class="border">
          <div class="icon"><q-icon name="date_range" /></div>
          <div class="info">
            <span class="data">123</span>
            <span class="text">总订单量</span>
          </div>
        </li>
        <li class="border">
          <div class="icon"><q-icon name="shopping_bag" /></div>
          <div class="info">
            <span class="data">123</span>
            <span class="text">总商品量</span>
          </div>
        </li>
        <li class="border">
          <div class="icon"><q-icon name="perm_identity" /></div>
          <div class="info">
            <span class="data">123</span>
            <span class="text">总用户量</span>
          </div>
        </li>

      </ul>
    </div>
    <div class="echarts-box border">
      <div class="title">全年销售额</div>
      <div id="sales_revenue" class="sales_revenue"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

/// 声明定义一下echart
let echart = echarts;

// 基础配置一下Echarts
function initChart() {
  let chart = echart.init(document.getElementById("sales_revenue"));
  // 把配置和数据放这里
  chart.setOption({
    xAxis: {
      type: "category",
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ]
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [
          820,
          932,
          901,
          934,
          1290,
          1330,
          1320,
          801,
          102,
          230,
          4321,
          4129
        ],
        type: "line",
        smooth: true
      }
    ]
  });
}

onMounted(initChart)
</script>

<style scoped lang="scss">
.financial-container {
  width: 100%;
  height: calc(100vh - 200px);
  padding: 30px 50px;
}

.header-box {
  width: 100%;
  height: 100px;
  margin-bottom: 25px;

  ul {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    height: 100%;

    li {
      width: calc(100% / 5 - 10px);
      min-width: 220px;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .icon {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #6f76fc11;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6f76fc;
        font-size: 40px;
      }

      .info {
        display: flex;
        justify-content: center;
        // align-items: center;
        flex-direction: column;

        .data {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .text {
          font-size: 14px;
          color: #aaa;
          font-family: yuanti;
        }
      }
    }
  }
}

.echarts-box {
  // width: calc((100% / 5) * 3 - 5px);
  width: 100%;

  .title {
    font-size: 20px;
    font-family: yuanti;
    margin-left: 40px;
    margin-top: 20px;

  }

  #sales_revenue {
    width: 90%;
    height: 500px;
  }
}

.body--dark {
  .border {
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
    border: 1px solid #3b3b3b;
    border-radius: 10px;
  }
}

.body--light {
  .border {
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
    border: 1px solid #f1f1f4;
    border-radius: 10px;
  }
}
</style>
