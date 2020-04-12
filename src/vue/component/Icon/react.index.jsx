/*
 * @Date: 2020-04-12 15:51:59
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 16:06:43
 * @FilePath: /eventBus/src/vue/component/Icon/react.index.js
 * @Description: react icon
 */
import React from 'react'
function Icon(props, h, slots) {
  return <button>{ props.children || slots || slots.default }</button>
}

export default Icon