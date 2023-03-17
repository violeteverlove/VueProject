<template>
  <div>
    <div class="history" @click="login">
      <div class="top">
        <van-icon name="manager-o" />
        <p>{{ showUserName }}</p>
      </div>
    </div>
    <!-- 个人功能 -->
    <van-grid column-num="3">
      <van-grid-item icon="setting-o" text="修改密码" @click="change" />
      <van-grid-item icon="eye-o" text="浏览记录" @click="recordList" />
      <van-grid-item icon="gift-o" text="礼物" />
      <van-grid-item icon="like-o" text="充能" />
    </van-grid>
    <van-grid column-num="3">
      <van-grid-item icon="goods-collect-o" text="礼物" />
      <van-grid-item icon="diamond-o" text="预约" />
      <van-grid-item icon="star-o" text="收藏" @click="collectList" />
      <van-grid-item icon="bar-chart-o" text="排行" @click="matchList" />
    </van-grid>
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
      <van-tabbar-item name="search" icon="search" @click="toClassify"
        >分类</van-tabbar-item
      >
      <van-tabbar-item name="friends" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
    <!-- 登录弹框 -->
    <van-popup v-model="show">
      <van-form @submit="onSubmit">
        <van-field
          v-model="userName"
          name="userName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            v-show="btn == 1"
            >登录</van-button
          >
          <van-button
            round
            block
            type="info"
            native-type="button"
            v-show="btn == 2"
            @click="loginOut()"
            >退出</van-button
          >
          <van-button
            round
            block
            type="info"
            native-type="button"
            v-show="btn == 1"
            @click="register({ userName, password })"
            >注册</van-button
          >
        </div>
      </van-form>
    </van-popup>
    <!-- 修改密码弹框 -->
    <van-popup v-model="block">
      <van-form style="height: 450px">
        <van-field
          v-model="newpassword"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入新密码"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="redirect(newpassword)"
            >修改</van-button
          >
        </div>
      </van-form>
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="newpassword"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />
    </van-popup>
    <!-- 浏览记录弹框 -->
    <van-popup v-model="rcdShow">
      <div v-if="showUserName != ''" style="width: 350px; height: 730px">
        <van-grid :border="false" :column-num="1">
          <van-grid-item
            v-for="(item, index) in user.records"
            :key="index"
            @click="playVideo(item)"
          >
            <van-image
              width="175px"
              height="100px"
              :src="item.imgUrl"
            /><van-cell center :value="item.desVal" />
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
    <!-- 视频排行榜弹框 -->
    <van-popup v-model="matchShow">
      <div style="width: 350px; height: 730px">
        <van-grid :border="false" :column-num="1">
          <van-grid-item
            v-for="(item, index) in list"
            :key="index"
            @click="playVideo(item.videoUrl, item.desVal)"
          >
            <van-image
              width="175px"
              height="100px"
              :src="item.imgUrl"
            /><van-cell center :value="item.desVal" />
            <van-cell center :value="item.match" />
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
    <!-- 收藏排行榜弹框 -->
    <van-popup v-model="collectShow">
      <div v-if="showUserName != ''" style="width: 350px; height: 730px">
        <van-grid :border="false" :column-num="1">
          <van-grid-item
            v-for="(item, index) in user.collect"
            :key="index"
            @click="playVideo(item)"
          >
            <van-image
              width="175px"
              height="100px"
              :src="item.imgUrl"
            /><van-cell center :value="item.desVal" />
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import tabbar from "@/components/tabbar.vue";
export default {
  data() {
    return {
      showUserName: "",
      userName: "",
      password: "",
      newpassword: "",
      user: {},
      list: "",
      active: "friends",
      showKeyboard: false,
      show: false,
      block: false,
      rcdShow: false,
      matchShow: false,
      collectShow: false,
      btn: 1,
    };
  },
  components: { tabbar },
  methods: {
    login() {
      console.log("登录");
      if (this.showUserName != "未登录" && this.user) {
        this.userName = this.user.userName;
        this.password = this.user.password;
        this.btn = 2;
      }
      this.show = true;
    },
    // 登录
    onSubmit(values) {
      console.log("submit", values);
      this.$axios.get("http://localhost:8000/about").then((res) => {
        // console.log(typeof res);
        // console.log(res);
        // console.log(res.data);
        let users = res.data.users;
        let flag = false;
        for (let user in users) {
          console.log("123123123", users[user]);
          if (
            users[user].userName === values.userName &&
            users[user].password === values.password
          ) {
            //登录成功
            flag = true;
            this.showUserName = users[user].userName;
            this.user = users[user];
            // console.log("+++++++++++++", this.user);
            this.$router.push({
              name: "Home",
              query: {
                user: this.user,
              },
            });
            setTimeout(() => {
              this.btn = 2;
            }, 500);
            break;
          }
        }

        if (flag) {
          this.$notify({ type: "success", message: "登录成功" });

          this.show = false;
        } else {
          this.$notify({ type: "danger", message: "登录失败" });
        }
      });
    },
    //退出
    loginOut() {
      this.$notify({ type: "success", message: "退出成功" });
      this.show = false;
      this.userName = "";
      this.password = "";
      this.btn = 1;
      this.showUserName = "未登录";
    },
    // 注册
    register(values) {
      let falg2 = false;
      let users = this.users;
      for (let user in users) {
        console.log(users[user]);
        if (users[user].userName !== values.userName) {
          //注册成功
          // let params = {
          //   userName: values.userName,
          //   password: values.password,
          //   records: [],
          // };
          // let users = JSON.stringify(params);
          // console.log(a);
          this.$axios
            .get("http://localhost:8000/register", {
              params: {
                userName: values.userName,
                password: values.password,
              },
            })
            .then((data) => {
              // console.log(data);
              console.log("213123123123", data);
              // flag = true;
              // this.showUserName = data.data.userName;
              this.userName = "";
              this.password = "";
              this.$notify({ type: "success", message: "注册成功" });
            });
          // .catch(console.log("错误请求"));
          // this.showUserName = users[user].userName;
        } else {
          this.$notify({ type: "danger", message: "用户已存在" });
          return;
        }
        break;
      }
    },
    // 修改密码弹框
    change() {
      if (this.showUserName) {
        console.log("修改密码");
        this.block = true;
      } else {
        this.$notify({ type: "danger", message: "请先登录用户" });
      }
    },
    // 修改密码
    redirect(newpassword) {
      console.log("新密码", newpassword);
      this.$axios
        .get("http://localhost:8000/redirect", {
          params: {
            userName: this.user.userName,
            password: newpassword,
          },
        })
        .then((res) => {
          console.log("111", res);
          this.$notify({ type: "success", message: "修改成功" });
          this.block = false;
        });
    },
    //浏览记录弹框
    recordList() {
      this.rcdShow = true;
    },
    matchList() {
      this.matchShow = true;
    },
    collectList() {
      this.collectShow = true;
    },
    playVideo(item) {
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
  },
  created() {
    this.user = this.$route.query.user;
    console.log("############Person", this.user);
    this.showUserName = this.user.userName;
  },
  mounted() {
    this.$axios.get("http://localhost:8000/about").then((res) => {
      this.users = res.data.users;
      console.log(this.users);
    });
    this.$axios.get("http://localhost:8000/videoList").then((res) => {
      console.log(res.data.list);
      // console.log(typeof res.data.list);
      // this.list = res.data.list;
      // console.log("测试是否赋值", this.list);
      //创建数组元素arr
      let arr = res.data.list;
      // debugger;
      console.log("arr的数据", arr);
      //创建每次循环存储最大值得变量
      let max = {};
      //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
      for (let i = 0; i < arr.length; i++) {
        //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
        for (let j = i; j < arr.length; j++) {
          if (arr[i].match < arr[j].match) {
            //如果arr[j]大就把此时的值赋值给最大值变量max
            max = arr[j];
            // debugger;
            // console.log("max的值", max);
            arr[j] = arr[i];
            arr[i] = max;
          }
        }
      }
      console.log("排序后的数组", arr);
      this.list = arr;
      console.log("初始化list", this.list);
    });
  },
};
</script>

<style  lang="less"scoped>
.history {
  padding: 0 2%;
  background: #fff;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    font-size: 0.75rem;
    p {
      font-size: 0.5625rem;
    }
  }
}
.van-form {
  width: 8.25rem;
  height: 9.625rem;
  padding-top: 0.875rem;
}
.van-field {
  margin-bottom: 0.5rem;
}
.van-button {
  margin-bottom: 0.5rem;
}
.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>