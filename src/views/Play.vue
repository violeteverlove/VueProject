/<template>
  <div>
    <!-- <video width="100%" controls autoplay>
      <source :src="getUrl" type="video/mp4" />
      <object data="movie.mp4" width="320" height="240">
        <embed width="320" height="240" src="movie.swf" />
      </object>
    </video> -->
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
    ></video-player>
    <!-- {{ getUrl }} -->
    <div class="intro">
      <van-button
        v-show="collbutton == 1"
        plain
        type="primary"
        @click="colVideo($route.query.item)"
        >{{ colbtn }}</van-button
      >
      <van-button
        v-show="collbutton == 2"
        plain
        type="primary"
        @click="cancelVideo($route.query.item)"
        >{{ colbtn }}</van-button
      >
      <span style="">简介</span><br />
      <p>{{ getVideoDes }}</p>
      <p />
    </div>

    <van-tabbar v-model="active">
      <van-tabbar-item name="home" icon="home-o" @click="toHome"
        >发现</van-tabbar-item
      >
      <van-tabbar-item name="search" icon="search" @click="toClassify"
        >分类</van-tabbar-item
      >
      <van-tabbar-item name="friends" icon="friends-o" @click="toPerson"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      colbtn: "收藏",
      collbutton: 1,
      user: {},
      active: "home",
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: "", // 路径
            type: "video/mp4", // 类型
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
    };
  },
  computed: {
    getUrl() {
      // `this` 指向 vm 实例
      return this.$route.query.item.videoUrl;
    },
    getDesVal() {
      // `this` 指向 vm 实例
      return this.$route.query.item.desVal;
    },
    getVideoDes() {
      return this.$route.query.item.videoDes;
    },
  },
  mounted() {
    for (let a in this.user.collect) {
      if (this.user.collect[a].desVal == this.$route.query.desVal) {
        this.collbutton = 2;
        this.colbtn = "取消收藏";
      }
    }
  },
  created() {
    this.playerOptions.sources[0].src = this.$route.query.videoUrl;
    this.user = this.$route.query.user;

    // console.log("#######Play", this.user);
    // console.log("sssss", this.$route.query);
  },
  beforeDestroy() {},
  methods: {
    toPerson() {
      this.$router.push({
        name: "Person",
        query: {
          user: this.user,
        },
      });
    },
    toClassify() {
      this.$router.push({
        name: "Classify",
        query: {
          user: this.user,
        },
      });
    },
    toHome() {
      this.$router.push({
        name: "Home",
        query: {
          user: this.user,
        },
      });
    },
    //收藏视频
    colVideo(item) {
      console.log("视频的名字", item, this.user.userName);
      // debugger;
      let flag = true;
      for (let a in this.user.collect) {
        if (this.user.collect[a].desVal == item.desVal) {
          flag = false;
          // this.$dialog.alert({
          //   message: "该视频已在你的收藏列表里",
          // });
          break;
        }
      }
      if (flag) {
        this.user.collect.push(item);
        console.log("收藏成功");
        this.$dialog.alert({
          message: "收藏成功",
        });
        // debugger;
        this.$axios
          .get("http://localhost:8000/collectVideo", {
            params: {
              collect: item,
              userName: this.user.userName,
            },
          })
          .then((res) => {
            console.log("测试添加历史记录", res);
          });
        console.log("update", this.user);
        this.collbutton = 2;
        this.colbtn = "取消收藏";
      }
    },
    //取消收藏
    cancelVideo(item) {
      console.log("取消收藏", item, this.user.collect);
      for (var i = 0; i < this.user.collect.length; i++) {
        if (this.user.collect[i].desVal === item.desVal) {
          this.user.collect.splice(i, 1);
        }
      }
      console.log("更新过后", this.user.collect);
      this.$axios
        .get("http://localhost:8000/delVideo", {
          params: {
            collect: item,
            userName: this.user.userName,
          },
        })
        .then((res) => {
          console.log("测试添加历史记录", res);
        });
      this.collbutton = 1;
      this.colbtn = "收藏";
    },
  },
};
</script>

<style lang="less" scoped>
.intro {
  margin-top: 1.25rem;
  span {
    font-size: 0.75rem;
    display: block;
  }
  p {
    font-weight: 400;
    font-size: 0.375rem;
  }
  .van-button {
    position: absolute;
    top: 5.8125rem;
    right: 0;
  }
}
</style>