/*
 * @Date: 2020-04-12 15:26:18
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 18:20:33
 * @FilePath: /eventBus/src/utils/functional.js
 * @Description: transform funtional for vue
 */
import Vue from 'vue'
import SlotsMixin from './slotsMixin'

const inheritKey = [
  'ref',
  'style',
  'class',
  'attrs',
  'nativeOn',
  'directives',
  'staticClass',
  'staticStyle',
]

const mapInheritKey = { nativeOn: 'on' }

function isFunction(val) {
  return typeof val === 'function'
}

function install(ComponentOptions, Vue) {
  const { name } = ComponentOptions
  Vue.component(name, ComponentOptions)
}

function unifySlots(context) {
  // 兼容2.1.x 之前的
  const scopedSlots = context.scopedSlots || context.data.scopedSlots || {}
  const slots = context.slots
  
  Object.keys(slots).forEach(key => {
    if (!scopedSlots[key]) {
      scopedSlots[key] = slots[key]
    }
  })

  return scopedSlots
}

function transformFunctionComponent(sfc) {
  console.log(sfc)
  return {
    functional: true,
    props: sfc.props,
    model: sfc.model,
    render: (h, context) => {
      sfc(h, context.props, unifySlots(context), context)
    }
  }
}

export function inherit(ctx, inheritListeners) {
  const result = inheritKey.reduce(
    (obj, key) => {
      if (ctx.data[key]) {
        // vue的jsx事件支持 on 和 nativeOn两种
        obj[mapInheritKey[key] || key] = ctx.data[key]
      }
      return obj
    },
    {}
  )
  if (inheritListeners) {
    result.on = result.on || {}
    Object.assign(result.on, ctx.data.on)
  }
  return result
}

export function emit(ctx, eventName, ...rest) {
  const listeners = ctx.listeners[eventName]
  if (listeners) {
    if (Array.isArray(listeners)) {
      listeners.forEach(listener => listener(...rest))
    } else {
      listeners(...rest)
    }
  }
}

export function mount(Component, data) {
  const instance = new Vue({
    el: document.createElement('div'),
    props: Component.props,
    render(h) {
      return h(
        Component,
        {
          props: this.$props,
          ...data
        }
      )
    }
  })

  document.body.appendChild(instance.$el)

  return instance
}

export function createComponent(name) {
  return function (sfc) {
    if (isFunction(sfc)) {
      sfc = transformFunctionComponent(sfc)
    }

    if (!sfc.functional) {
      sfc.mixins = sfc.mixins || []
      sfc.mixins.push(SlotsMixin)
    }

    sfc.name = name
    sfc.install = install

    return sfc
  }
}