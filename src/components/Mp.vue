<template>
  <div>
    <!-- <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
    ></video-player> -->
    <video width="100%" controls autoplay>
      <source :src="vurl" type="video/mp4" />
      <object data="movie.mp4" width="320" height="240">
        <embed width="320" height="240" src="movie.swf" />
      </object>
    </video>
    <div class="intro">
      <span style="">简介</span><br /><br />
      <p>{{ desVal }}</p>
      <p />
    </div>

    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="home-o">发现</van-tabbar-item>
      <van-tabbar-item replace to="/classify" icon="search"
        >分类</van-tabbar-item
      >
      <van-tabbar-item replace to="/person" icon="friends-o"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "Mp",
  data() {
    return {
      vurl: "",
      desVal: "",
      // playerOptions: {
      //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      //   autoplay: false, //如果true,浏览器准备好时开始回放。
      //   muted: false, // 默认情况下将会消除任何音频。
      //   loop: false, // 导致视频一结束就重新开始。
      //   preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      //   language: "zh-CN",
      //   aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      //   sources: [
      //     {
      //       src: require("../mp4/48361267-1-64.mp4"), // 路径
      //       type: "video/mp4", // 类型
      //     },
      //   ],
      //   poster: "", //你的封面地址
      //   // width: document.documentElement.clientWidth,
      //   notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //   controlBar: {
      //     timeDivider: true,
      //     durationDisplay: true,
      //     remainingTimeDisplay: false,
      //     fullscreenToggle: true, //全屏按钮
      //   },
      // },
    };
  },
  mounted() {
    this.$bus.$on("playVideo", (data) => {
      console.log("传输成功", data);
      // this.vurl = url;
      // this.desVal = desVal;
    });
  },
  beforeDestroy() {
    this.$bus.$off("playVideo");
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.intro {
  margin-top: 1.25rem;
  span {
    font-size: 0.75rem;
  }
  p {
    font-weight: 400;
    font-size: 0.375rem;
  }
}
</style>