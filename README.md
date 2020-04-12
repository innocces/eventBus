# 本项目搭配本文食用更佳

# 状态管理
> 🤔其实各类框架都是以组件为基础的(💻`web-component`也不例外)。而组件的柯里化其实我个人觉得是因人而异的, 一些人可能会以业务(💼)为基准, 而有些人会以功能(🔩)为基准。
所以, 不好总体说些什么。 但是有一个事情，是无论你的基准是什么都也许或大概率会碰到的。那就是组件之间以及跨组件状态共享、事件共享。

## 小提醒💡
本文的所以示例代码均可在[🚪🏃传送门](https://github.com/innocces/eventBus)内查看。简易版的多框架cli。请勿吐槽😛   
> 😭其实我本来想偷个懒直接都写`SFC`的，奈何我这简易版的架子有点问题, `vue`的组件编译成功但是展示不出来。你问我为啥不知道在`script`中写`renderjsx`, 你就有点不懂我的初衷了。    
> 所有的`props`都均使用`JS`原生类型(`React`的也不使用`propTypes`)
```javascript
/* components/componentName/props.js */
export default {
  propsName: PropType.oneOfType(JsOriginType) // 样例🌰
}
```

## 我们常用的[`Vue`](https://cn.vuejs.org/)组件之间参数互传有下面几种:
- `props`
- `customer event`
- `slot slotScope`
- `vuex`
- `eventBus`
- `inject provider`
> 今天我们主要讨论的是`eventBus🚌`, 并会结合类似的`react`例子来进行比较，如果你看完本文有其他框架比如`angular`、`svelet`等的例子的话，欢迎pr🎇。

## 正文
我们以一个评论条目作为拆分主体进行分析并渗透代码。先看具体模样(😅有点丑哈，不要介意; 也可能刻意分的很细, 只是为了迎合🐖体)

### 预览
![eventBus](https://mmbiz.qpic.cn/mmbiz_png/ELZpPficmGibgTxDKIicOy67SLKRLnKU4jov08qxrv6cqKrwveT91vNvX42iaCYWFRCh8Tx7GfrZ4H6L7udADAmTEA/0?wx_fmt=png)

### 概述
组件`Comment`主要由`CommentAction`和其他自有代码组成，其中`CommentAction`由`Icon`组成。
```bash
Comment
  - CommentAction
    - Icon
  - other code
```
其中, 在`CommentAction`组件的每个`Icon`点击的时候, 都会触发事件并反映给最终调用`Comment`组件的父组件, 触发当前的`action`事件。

#### 常规思路
* Vue
```js
  Icon(click -> emit('click')) 
  => 
  CommentAction(recieve('click') -> emit('CommentAction', type)) 
  => 
  Comment(recieve('CommentAction', type) => emit('action', type))
  =>
  Parent(recieve('action', type))
```
* React
```js
  Icon(click -> props.onClick()) 
  => 
  CommentAction(onClick(props.CommentAction(type)) 
  => 
  Comment(CommentAction(props.action(type)))
  =>
  Parent(action(type))
```
我们不难看出，为了在最上层的父组件触发`action`函数, 整个调用链路相当的长, 而且在书写过程中也会存在大量的冗余代码。(🤮一些看官大人👱坐不住了, 不是可以上`vuex`或者`redux`么; 又有一些看官大人👩说, `vue`上`slot`不仅减少了参数的传递, 还让组件减少了大部分的事件链路传递, `react`的`renderProps`不香么; 远方又传来声音👄, 都是渣渣, 我写在一起，什么父子, 都是一体。)    
emmmm~ 远方的声音忽略。至于所说的`vuex`和`redux`并不适用于`UI`级别的组件，我们倾向于不和业务过度耦合(什么耦不耦合, 你还不是写的都是业务相关的代码, 你这么较真, 那我还真就是了怎么滴😕)。`slot`和`renderProps`确实可以实现减少调用链路的情况, 但是我们需要重复书写一部分代码在每次调用的地方(你会不会用啊，说的都是些什么(σ｀д′)σ, 你行你来你来🙄)。当然`mixins`也是一种解决方式, 但既然已经被抛弃了, 我们就只提一下。   
今天, 我们用`EventBus`的方式来实现调用链路缩短，共享深嵌套组件事件状态分发。    
其中`React`部分使用`useReducer`来实现, 官方有这么一句话[`使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数 `](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)

#### Code
* [`comment.vue`](https://github.com/innocces/eventBus/blob/master/src/component/Comment/comment.vue#L56)
```vue
<template>
  <div class='comment'>
    ...
      <CommentAction 
        v-if='!$slots.action'
        v-model='showAction'
        :CommentEventBus='CommentEventBus'
      />
    ...
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
```
- [`vm.$on(event, callback)`](https://cn.vuejs.org/v2/api/#vm-on): 使用`$on`可以在选定时机开始监听实例上的自定义事件, 并在需要时使用`$emit`来触发。(又有些人坐不住了, 你这个代码用`provider+inject`不是也🙆么, 我的os🙄)。其实说白一点就是利用一个实例来作为`props`桥接不同深度的子组件和最上层父组件之间的事件链路。
* [`CommentAction/action.vue`](https://github.com/innocces/eventBus/blob/master/src/component/Comment/CommentAction/action.vue#L57)
```vue
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
...
export default {
  ...
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
```
* [`comment.jsx`](https://github.com/innocces/eventBus/blob/master/src/component/Comment/comment.jsx#L23)
```jsx
import React, {
  useState,
  useReducer,
  useCallback
} from 'react'

import './index.less'

import Icon from '../Icon/icon.jsx'
import CommentAction from './CommentAction/action.jsx'

// 使用reducer来代替eventBus
const initialState = {
  showAction: false
}


const Comment = ({
  comment = {},
  commentAction,
  children
}) => {
  function reducer(state, action) {
    switch(action.type) {
      case 'commentActionVisible': 
        return { showAction: !state.showAction }
      case 'commentAction':
        commentAction(action.payload.type)
        return state
    }
  }

  const [ state, dispatch ] = useReducer(reducer, initialState)

  return (
    <div className='comment'>
      ...

        {
          !children
          ?
          <CommentAction 
            value={ state.showAction }
            CommentEventBus={ dispatch }
          />
          :
          <>
            { children }
          </>
        }
      ...
    </div>
  )
}

export default Comment
```
- `useReducer + dispatch`: 其实这个组合拳写`redux`的时候就有渗透, 但是在`hook`出来之后, 我们可以在局部组件内营造小范围状态共享, 无需接入总的`store tree`。这使得代码和项目业务本身的耦合度就大幅度的降低。而一路透传`dispatch`也让我们的组件无需透传各种参数, 代码线路和逻辑也会更明了。
* [`CommentAction/action.jsx`](https://github.com/innocces/eventBus/blob/master/src/component/Comment/CommentAction/action.jsx)
```jsx
import React, { useCallback } from 'react'
...
const CommentAction = ({
  value,
  CommentEventBus
}) => {

  const changeActionVisible = useCallback(() => {
    CommentEventBus({
      type: 'commentActionVisible'
    })
  }, [])

  const action = useCallback(type => {
    CommentEventBus({
      type: 'commentAction',
      payload: {
        type
      }
    })
  }, [])

  return (
    <div 
      className='action'
      onMouseLeave={ changeActionVisible }
      onMouseEnter={ changeActionVisible }
    >
      <Icon 
        name='zan'
        onClick={ () => action('zan') }
      >
        赞
      </Icon>
      {
        value 
        &&
        <>
          { 
            actionArray.map(iconItem => (
              <Icon
                key={ iconItem.name }
                name={ iconItem.name }
                onClick={ () => action(iconItem.name) }
              >
                { iconItem.slot }
              </Icon>
            ))
          }
        </> 
      }
    </div>
  )
}
export default CommentAction
```

### 结语
当然, `EventBus`🚌的用法不仅仅于此, 但举一反三大家还是可以的✿✿ヽ(°▽°)ノ✿。至于`React`的替代方案当然也不止`useReduce`一种, 大家也可以选择使用`useContext`这种的方案以及等等。毕竟实现一个事情方法是千千万万的。以上~    
