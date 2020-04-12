<!--
 * @Date: 2020-04-11 21:18:44
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 20:05:11
 * @FilePath: /eventBus/src/vue/app.vue
 * @Description: app vue
 -->
<template>
  <div class='app'>
    <Comment 
      :comment='info'
      @action='commentAction'
    />
  </div>
</template>

<script>
import Comment from '../component/Comment/comment.vue'

import {
  commentInfo
} from '../data/comment'

export default {
  name: 'App',
  data() {
    return {
      info: commentInfo('vue')
    }
  },
  components: {
    Comment
  },
  methods: {
    commentAction(type) {
      alert(type)
    }
  }
}
</script>

<style lang="less" src='../style/style.less'></style>