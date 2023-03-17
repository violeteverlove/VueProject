<template>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item disabled title="综合" />
      <van-dropdown-item
        v-model="value1"
        :options="option1"
        @change="showList(value1, value2)"
      />
      <van-dropdown-item
        v-model="value2"
        :options="option2"
        @change="showList(value1, value2)"
      />
    </van-dropdown-menu>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- <van-list
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
          v-show="blockShow == 2"
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
          v-show="blockShow == 1"
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
      </van-list> -->
      <van-grid
        :border="false"
        :column-num="2"
        square
        :gutter="10"
        v-show="blockShow == 1"
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
        v-show="blockShow != 1"
      >
        <van-grid-item
          v-for="item in dataList"
          :key="item.vid"
          @click="playVideo(item)"
        >
          <van-image width="175px" height="100px" :src="item.imgUrl" />
          <van-cell :value="item.desVal" />
        </van-grid-item>
      </van-grid>
    </van-pull-refresh>
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
      <van-tabbar-item name="home" icon="home-o" @click="toHome"
        >发现</van-tabbar-item
      >
      <van-tabbar-item name="search" icon="search">分类</van-tabbar-item>
      <van-tabbar-item name="friends" icon="friends-o" @click="toPerson"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import tabbar from "@/components/tabbar.vue";
export default {
  components: { tabbar },
  data() {
    return {
      blockShow: 1,
      user: {},
      active: "search",
      list: [],
      dataList: [],
      loading: false,
      finished: false,
      refreshing: false,
      value1: 0,
      value2: 0,
      option1: [
        { text: "全部", value: 0 },
        { text: "日本", value: 1 },
        { text: "欧美", value: 2 },
        { text: "中国", value: 3 },
      ],
      option2: [
        { text: "全部", value: 0 },
        { text: "热血", value: 1 },
        { text: "校园", value: 2 },
        { text: "魔法", value: 3 },
        { text: "战斗", value: 4 },
        { text: "恋爱", value: 5 },
        { text: "科幻", value: 6 },
      ],
    };
  },
  components: { tabbar },
  created() {
    this.user = this.$route.query.user;
    console.log("############Classify", this.user);
  },
  mounted() {
    this.getList();
    // console.log("输出结果", this.list);
    this.showList(0, 0);
  },
  methods: {
    getList() {
      this.$axios.get("http://localhost:8000/videoList").then((res) => {
        console.log(res.data.list);
        console.log(typeof res.data.list);
        this.list = res.data.list;
        this.dataList = res.data.list;
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
    showList(val1, val2) {
      // debugger;
      this.dataList = [];
      //两个参数都是0，全部、全部
      // debugger;
      this.blockShow = 2;
      if (val1 === 0 && val2 === 0) {
        for (let i = 0; i < this.list.length; i++) {
          this.dataList.push(this.list[i]);
        }
        // console.log("dataList", this.dataList);
        return;
      }
      //两个参数都不为0
      if (val1 !== 0 && val2 !== 0) {
        for (let i = 0; i < this.list.length; i++) {
          if (
            this.list[i].type.includes(this.option2[val2].text) &&
            this.list[i].country.includes(this.option1[val1].text)
          ) {
            this.dataList.push(this.list[i]);
          }
        }
        console.log("block的值", this.blockShow);
        return;
      }
      //第一个参数为0
      if (val1 === 0) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].type.includes(this.option2[val2].text)) {
            this.dataList.push(this.list[i]);
          }
        }

        return;
      }
      if (val2 === 0) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].country.includes(this.option1[val1].text)) {
            this.dataList.push(this.list[i]);
          }
        }
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
    toHome() {
      this.$router.push({
        name: "Home",
        query: {
          user: this.user,
        },
      });
    },
  },
};
</script>

<style>
</style>