/*
 * @Date: 2020-04-12 18:59:06
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 19:28:35
 * @FilePath: /eventBus/src/component/Icon/type.js
 * @Description: icon type
 */
const prefix = 'icon-'

function iconType(name) {
  return `${prefix}${name}`
}

const types = [ 'coder', 'share', 'zan', 'cai', 'pinglun', 'vue', 'react' ]

const formatTypes = {}
types.forEach(name => formatTypes[name]= iconType(name))

export default formatTypes