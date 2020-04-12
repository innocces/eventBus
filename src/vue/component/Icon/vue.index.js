/*
 * @Date: 2020-04-12 15:51:53
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 18:16:14
 * @FilePath: /eventBus/src/vue/component/Icon/vue.index.js
 * @Description: vue icon
 */
import {
  createComponent
} from '../../../utils/functional'

function Icon(h, props, slots, ctx) {
  return (
    <button val={ props.name }>{ slots.default && slots.default() }</button>
  )
}

Icon.props = {
  name: {
    type: String,
    default: 'bb'
  }
}
console.log(Icon)

export default createComponent('Icon')(Icon)