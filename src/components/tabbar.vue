/<template>
  <van-tabbar v-model="active">
    <van-tabbar-item name="home" icon="home-o">发现</van-tabbar-item>
    <van-tabbar-item name="search" icon="search">分类</van-tabbar-item>
    <van-tabbar-item name="friends" icon="friends-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      active: "home",
    };
  },
  methods: {},
};
</script>

<style>
</style>