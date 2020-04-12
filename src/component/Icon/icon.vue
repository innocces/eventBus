<!--
 * @Date: 2020-04-12 15:51:53
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 19:47:10
 * @FilePath: /eventBus/src/component/Icon/icon.vue
 * @Description: icon
 -->
<template>
  <button 
    class='icon-container'
    :class='iconCls'
    @click.stop='onClick'
  >
    <svg class='icon' aria-hidden='true'>
      <use :xlink:href='iconName'></use>
    </svg>
    <span class='icon-word'><slot /></span>
  </button>
</template>

<script>
import props from './props'
import icons from './type'

export default {
  props,
  name: 'Icon',
  computed: {
    iconCls() {
      const {
        avator,
        name
      } = this
      return {
        'icon-avator': avator || name === 'vue' || name === 'react'
      }
    },
    iconName() {
      return '#'+icons[this.name]
    }
  },
  methods: {
    onClick($event) {
      this.$emit('click', $event)
    }
  }
}
</script>

<style lang='less' src='./index.less'></style>