<!--
 * @Date: 2020-04-11 21:18:44
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 18:16:44
 * @FilePath: /eventBus/src/vue/app.vue
 * @Description: app vue
 -->
<template>
  <div class='app'>
    vue content
    <Icon>
      dsjdsndsjdjshdjhsd
    </Icon>
  </div>
</template>

<script>
import Icon from './component/Icon/vue.index'
console.log(Icon)

export default {
  name: 'App',
  data() {
    return {

    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="less" src='../style/style.less'></style>