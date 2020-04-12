<!--
 * @Date: 2020-04-12 19:59:55
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 22:52:26
 * @FilePath: /eventBus/src/component/Comment/CommentAction/action.vue
 * @Description: comment action
 -->
<template>
  <div 
    class='action'
    @mouseleave='changeActionVisible'
    @mouseenter='changeActionVisible'
  >
    <Icon 
      name='zan'
      @click='action("zan")'
    >
      赞
    </Icon>
    <transition-group name='fade'>
      <Icon
        v-show='value'
        v-for='iconItem in actionArray'
        :key='iconItem.name'
        :name='iconItem.name'
        @click='action(iconItem.name)'
      >
        {{ iconItem.slot }}
      </Icon>
    </transition-group>
  </div>
</template>

<script>
import props from './props'

import Icon from '../../Icon/icon.vue'

const actionArray = [
  { name: 'pinglun', slot: '评论' },
  { name: 'cai', slot: '踩' },
  { name: 'share', slot: '分享' },
]

export default {
  props,
  name: 'CommentAction',
  components: {
    Icon
  },
  data() {
    return {
      actionArray
    }
  },
  methods: {
    action(type) {
      this.CommentEventBus.$emit('commentAction', type)
    },
    changeActionVisible() {
      this.CommentEventBus.$emit('commentActionVisible')
    }
  }
}
</script>

<style lang='less' src='./index.less'></style>