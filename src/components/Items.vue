<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-grid :border="false" :column-num="2" square :gutter="10">
          <van-grid-item v-for="item in list" :key="item">
            <van-image width="130px" :src="item.url" />
            <van-cell :value="item.desVal" />
          </van-grid-item>
        </van-grid-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          url: "https://p3.ssl.qhimgs1.com/sdr/400__/t0195fdb5ea3014742d.jpg",
          desVal: "魔法使的新娘",
        },
      ],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  methods: {
    // onLoad() {
    //   setTimeout(() => {
    //     if (this.refreshing) {
    //       this.list = [];
    //       this.refreshing = false;
    //     }

    //     for (let i = 0; i < 4; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     this.loading = false;

    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>

<style>
</style>