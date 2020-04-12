/*
 * @Date: 2020-04-12 15:46:15
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 15:50:46
 * @FilePath: /eventBus/src/utils/slotsMixin.js
 * @Description: slots mixins
 */
import Vue from 'vue'
export default Vue.extend({
  methods: {
    slots(name, props) {
      const {
        $slots,
        $scopedSlots
      } = this

      const scopedSlot = $scopedSlots[name]
      if (scopedSlot) {
        return scopedSlot(props)
      }

      return $slots[name]
    }
  }
})