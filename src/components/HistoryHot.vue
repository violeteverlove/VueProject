<template>
  <div>
    <div class="history">
      <div class="top">
        <p>历史记录</p>
        <van-icon name="delete-o" />
      </div>
      <div class="down">
        <van-tag type="default">标签</van-tag>
        <van-tag type="default">标签</van-tag>
        <van-tag type="default">标签</van-tag>
        <van-tag type="default">标签</van-tag>
        <van-tag type="default">标签</van-tag>
        <van-tag type="default">标签</van-tag>
      </div>
    </div>

    <div class="history">
      <div class="top">
        <p style="color='red'">热门搜索</p>
        <van-icon name="delete-o" />
      </div>
      <div class="down">
        <van-tag type="default">热门</van-tag>
        <van-tag type="default">热门</van-tag>
        <van-tag type="default">热门</van-tag>
        <van-tag type="default">热门</van-tag>
        <van-tag type="default">热门</van-tag>
        <van-tag type="default">热门</van-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style  lang="less"scoped>
.history {
  padding: 0 2%;
  background: #fff;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.25rem;
    font-size: 0.75rem;
    p {
      font-size: 0.5625rem;
    }
  }
  .down {
    .van-tag {
      font-size: 0.48rem;
      margin-right: 0.65rem;
      margin-bottom: 0.425rem;
      padding: 0.0625rem;
    }
  }
}
</style>