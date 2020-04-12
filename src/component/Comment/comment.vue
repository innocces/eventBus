<!--
 * @Date: 2020-04-12 18:37:40
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 22:48:33
 * @FilePath: /eventBus/src/component/Comment/comment.vue
 * @Description: comment
 -->
<template>
  <div class='comment'>
    <div class='comment-header'>
      <Icon
        :name='comment.type'
      >
        {{ comment.type }}
      </Icon>
      <span class='comment-day'>{{ comment.data }}</span>
    </div>
    <div class='comment-body'>
      <p class='comment-body-words'>{{ comment.content }}</p>

      <CommentAction 
        v-if='!$slots.action'
        v-model='showAction'
        :CommentEventBus='CommentEventBus'
      />
      <slot 
        v-else
        name='action'  
        :slotScope='comment.type'
      />
    </div>
  </div>
</template>

<script>
import props from './props'
import Icon from '../Icon/icon.vue'
import CommentAction from './CommentAction/action.vue'

import Vue from 'vue'

export default {
  props,
  name: 'Comment',
  components: {
    Icon,
    CommentAction
  },
  data() {
    return {
      CommentEventBus: null,
      showAction: false
    }
  },
  created() {
    // 创建状态bus监听事件
    const CommentEventBus = new Vue()
    this.CommentEventBus = CommentEventBus

    CommentEventBus.$on('commentAction', this.commentAction)
    CommentEventBus.$on('commentActionVisible', this.changeActionVisible)
  },
  methods: {
    commentAction(type) {
      this.$emit('action', type)
    },
    changeActionVisible() {
      this.showAction = !this.showAction
    }
  }
}
</script>

<style lang='less' src='./index.less'></style>