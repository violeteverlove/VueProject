<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-grid
          :border="false"
          :column-num="2"
          square
          :gutter="10"
          v-if="blockShow == 2"
        >
          <van-grid-item
            v-for="item in list"
            :key="item.vid"
            @click="playVideo(item.videoUrl, item.desVal)"
          >
            <van-image width="130px" :src="item.imgUrl" />
            <van-cell :value="item.desVal" />
          </van-grid-item>
        </van-grid>
        <van-grid
          :border="false"
          :column-num="2"
          square
          :gutter="10"
          v-if="blockShow == 1"
        >
          <van-grid-item
            v-for="item in dataList"
            :key="item.vid"
            @click="playVideo(item.videoUrl, item.desVal)"
          >
            <van-image width="130px" :src="item.imgUrl" />
            <van-cell :value="item.desVal" />
          </van-grid-item>
        </van-grid>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blockShow: 2,
      list: [
        {
          vid: "1",
          imgUrl:
            "https://img-pre.ivsky.com/img/bizhi/pre/201601/05/jinji_de_juren-001.jpg",
          videoUrl: require("../mp4/juren.mp4"),
          desVal: "进击的巨人",
          country: "日本",
          type: "热血",
        },
        {
          vid: "2",
          imgUrl:
            "http://img.mp.itc.cn/upload/20161203/7dd395182db2490caadaffd00e5bd8c4_th.jpeg",
          videoUrl: require("../mp4/juren.mp4"),
          desVal: "你的名字",
          country: "日本",
          type: "恋爱",
        },
        {
          vid: "3",
          imgUrl:
            "https://hbimg.huabanimg.com/825cacd5fe93b40519a3e9aa20937342368e6b331a9c9a-Z86RbW_fw658",
          videoUrl: require("../mp4/juren.mp4"),
          desVal: "Fate Zero",
          country: "日本",
          type: "战斗",
        },
        {
          vid: "4",
          imgUrl:
            "https://p3.ssl.qhimgs1.com/sdr/400__/t0195fdb5ea3014742d.jpg",
          videoUrl: require("../mp4/mofashi.mp4"),
          desVal: "魔法使的新娘",
          country: "日本",
          type: "魔法",
        },
      ],
      dataList: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  mounted() {
    this.$bus.$on("searchVideo", this.videoMatch);
  },
  beforeDestroy() {
    this.$bus.$off("searchVideo");
  },
  components: {},
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 4; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 10) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    videoMatch(value) {
      console.log("收到数据了", value);
      if (value) {
        console.log(this.list);
        this.dataList = [];
        this.blockShow = 1;
        let i = 0;
        // let regStr =  '';
        // // 初始化正则表达式
        //  for(let i=0; i<value.length; i++){
        //   regStr = regStr + '(' + value[i] + ')([\\s]*)'; //跨字匹配
        // }
        // let reg = new RegExp(regStr);
        // console.log(reg);
        for (i = 0; i < this.list.length; i++) {
          //  let desVal = this.list[i].desVal; //按照名字匹配
          //   let regMatch = desVal.match(reg);
          //   if(null !== regMatch) {// 将匹配的数据放入结果列表中
          //      this.dataList.push(this.list[i]);
          //   }

          if (this.list[i].desVal.includes(value)) {
            this.dataList.push(this.list[i]);
          }
        }
      } else {
        (this.dataList = []), (this.blockShow = 2);
      }
    },
    playVideo(videoUrl, desVal) {
      console.log("点击视频准备跳转", videoUrl, desVal);
      // this.$bus.$emit("playVideo", 666);
      this.$router.push({
        name: "Play",
        params: {
          videoUrl,
          desVal,
        },
      });
    },
  },
};
</script>

<style>
</style>