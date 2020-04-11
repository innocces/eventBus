/*
 * @Date: 2020-04-11 20:57:28
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-11 21:36:25
 * @FilePath: /eventBus/src/vue.entry.js
 * @Description: vue enty
 */

import Vue from 'vue'
import App from './vue/app.vue'

new Vue({
  el: '#vue-app',
  render: h => h(App)
})