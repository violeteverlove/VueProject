<template>
  <div class="home">
    <transition name="van-fade">
      <div v-show="$route.path === '/home'">
        <!-- 搜索模块 -->
        <van-sticky>
          <van-search
            v-model="searchVal"
            shape="round"
            background="#fff"
            disabled
            placeholder="请输入搜索关键词"
            @click="goToPopup"
          />
        </van-sticky>
        <!-- 轮播模块 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="darkred">
          <van-swipe-item
            v-for="item in tabbarList"
            :key="item.vid"
            @click="playVideo(item)"
            ><img
              :src="item.imgUrl"
              width="100%"
              height="262px"
              style="display: block"
              alt=""
          /></van-swipe-item>
        </van-swipe>
        <!-- 推荐视频列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-grid :border="false" :column-num="2" square :gutter="10">
              <van-grid-item
                v-for="item in list"
                :key="item.vid"
                @click="playVideo(item)"
              >
                <van-image width="175px" height="100px" :src="item.imgUrl" />
                <van-cell :value="item.desVal" />
              </van-grid-item>
            </van-grid>
          </van-list>
        </van-pull-refresh>
      </div>
    </transition>
    <!-- 底部导航栏 -->
    <!-- <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="home-o">发现</van-tabbar-item>
      <van-tabbar-item replace to="/classify" icon="search"
        >分类</van-tabbar-item
      >
      <van-tabbar-item replace to="/person" icon="friends-o"
        >我的</van-tabbar-item
      >
    </van-tabbar> -->
    <van-tabbar v-model="active">
      <van-tabbar-item name="home" icon="home-o">发现</van-tabbar-item>
      <van-tabbar-item name="search" icon="search" @click="toClassify"
        >分类</van-tabbar-item
      >
      <van-tabbar-item name="friends" icon="friends-o" @click="toPerson"
        >我的</van-tabbar-item
      >
    </van-tabbar>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      searchVal: "",
      tabbarList: [
        {
          vid: "1",
          imgUrl:
            "https://img-pre.ivsky.com/img/bizhi/pre/201601/05/jinji_de_juren-001.jpg",
          videoUrl:
            "http://vfx.mtime.cn/Video/2019/03/21/mp4/190321153853126488.mp4",
          desVal: "进击的巨人",
          country: "日本",
          type: "热血",
          videoDes: "123",
          match: "18755232",
        },
        {
          vid: "2",
          imgUrl:
            "http://img.mp.itc.cn/upload/20161203/7dd395182db2490caadaffd00e5bd8c4_th.jpeg",
          videoUrl:
            "http://vfx.mtime.cn/Video/2019/03/21/mp4/190321153853126488.mp4",
          desVal: "你的名字",
          country: "日本",
          type: "爱情",
          videoDes: "123",
          match: "18755232",
        },
        {
          vid: "3",
          imgUrl:
            "https://hbimg.huabanimg.com/825cacd5fe93b40519a3e9aa20937342368e6b331a9c9a-Z86RbW_fw658",
          videoUrl:
            "http://vfx.mtime.cn/Video/2019/03/21/mp4/190321153853126488.mp4",
          desVal: "Fate Zero",
          country: "日本",
          type: "战斗",
          videoDes: "123",
          match: "18745232",
        },
        {
          vid: "4",
          imgUrl:
            "https://c-ssl.duitang.com/uploads/item/201804/26/20180426131549_imxpd.thumb.1000_0.jpg",
          imgUrl:
            "https://hbimg.huabanimg.com/825cacd5fe93b40519a3e9aa20937342368e6b331a9c9a-Z86RbW_fw658",
          videoUrl:
            "http://vfx.mtime.cn/Video/2019/03/21/mp4/190321153853126488.mp4",
          desVal: "魔法使的新娘",
          country: "日本",
          type: "魔法",
          videoDes: "123",
          match: "18755232",
        },
      ],
      user: {},
      active: "home",
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  components: {},
  created() {
    this.user = this.$route.query.user;
    console.log("home_+_+_+_+_", this.user);
  },
  methods: {
    goToPopup() {
      //跳转路由
      this.$router.push({
        name: "MyPopup",
        query: {
          user: this.user,
        },
      });
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = this.list;
          this.refreshing = false;
        }

        for (let i = 0; i < 4; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 12) {
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
    playVideo(item) {
      console.log("点击视频准备跳转", item);
      if (this.user) {
        let flag = true;
        for (let a in this.user.records) {
          if (this.user.records[a].desVal == item.desVal) {
            flag = false;
            break;
          }
        }
        if (flag) {
          this.user.records.push(item);
          this.$axios
            .get("http://localhost:8000/updateRecords", {
              params: {
                userName: this.user.userName,
                records: item,
              },
            })
            .then((res) => {
              console.log("测试添加历史记录", res);
            });
          console.log("update", this.user);
        }
        // this.$bus.$emit("playVideo", 666);
        this.$router.push({
          name: "Play",
          query: {
            videoDes: item.videoDes,
            videoUrl: item.videoUrl,
            desVal: item.desVal,
            item: item,
            user: this.user,
          },
        });
      } else {
        this.$router.push({
          name: "Person",
        });
        this.$notify({ type: "danger", message: "请先登录用户" });
      }
    },
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
  },
  mounted() {
    this.$axios.get("http://localhost:8000/videoList").then((res) => {
      console.log(res.data.list);
      console.log(typeof res.data.list);
      this.list = res.data.list;
      // console.log("测试是否赋值", this.list);
    });
  },
};
</script>
<style lang="less" scoped>
// .slide-enter,
// .slide-leave-to {
//   right: -100%;
// }

// .slide-enter-active,
// .slide-leave-active {
//   transition: right 0.3s linear;
// }

// .slide-enter-to,
// .slide-leave {
//   right: 0;
// }
</style>
