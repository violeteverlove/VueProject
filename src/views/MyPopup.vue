<template>
  <div class="popup">
    <van-search
      v-model="searchKey"
      show-action
      placeholder="请输入关键词"
      @cancel="onCancel"
      @change="inputChange"
    />
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
            @click="playVideo(item)"
          >
            <van-image width="175px" height="100px" :src="item.imgUrl" />
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
            @click="playVideo(item)"
          >
            <van-image width="175px" height="100px" :src="item.imgUrl" />
            <van-cell :value="item.desVal" />
          </van-grid-item>
        </van-grid>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import HistoryHot from "@/components/HistoryHot.vue";
import Video from "@/components/Video.vue";
export default {
  name: "MyPopup",
  data() {
    return {
      user: {},
      searchKey: "",
      //1.代表历史记录和热门区块
      //2.代表列表区块
      //3.代表视频区块
      blockShow: 1,
      blockShow: 2,
      list: [],
      dataList: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  components: {
    HistoryHot,
    Video,
  },
  methods: {
    onCancel() {
      // this.$router.push("/home");
      this.$router.go(-1);
    },
    inputChange() {
      this.$bus.$emit("searchVideo", this.searchKey);
      // this.blockShow=2
    },
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
    // playVideo(item) {
    //   if (this.user) {
    //     let flag = true;
    //     for (let a in this.user.records) {
    //       if (this.user.records[a].desVal == item.desVal) {
    //         flag = false;
    //         break;
    //       }
    //     }
    //     if (flag) {
    //       this.user.records.push(item);
    //       this.$axios
    //         .get("http://localhost:8000/updateRecords", {
    //           params: {
    //             userName: this.user.userName,
    //             records: item,
    //           },
    //         })
    //         .then((res) => {
    //           console.log("测试添加历史记录", res);
    //         });
    //       console.log("update", this.user);
    //     }
    //     // this.$bus.$emit("playVideo", 666);
    //     this.$router.push({
    //       name: "Play",
    //       query: {
    //         videoDes: item.videoDes,
    //         videoUrl: item.videoUrl,
    //         desVal: item.desVal,
    //         user: this.user,
    //       },
    //     });
    //   } else {
    //     this.$router.push({
    //       name: "Person",
    //     });
    //     this.$notify({ type: "danger", message: "请先登录用户" });
    //   }
    // },
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
  },
  created() {
    this.user = this.$route.query.user;
    console.log("myPopup+_+_+_+_", this.user);
  },
  mounted() {
    this.$bus.$on("searchVideo", this.videoMatch);
    this.$axios.get("http://localhost:8000/videoList").then((res) => {
      console.log(res.data.list);
      console.log(typeof res.data.list);
      let a = res.data.list;
      this.list = a.reverse();
      // console.log("测试是否赋值", this.list);
    });
  },
  beforeDestroy() {
    this.$bus.$off("searchVideo");
  },
};
</script>

<style lang="less" scoped>
.popup {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background: #efefef;
}
</style>