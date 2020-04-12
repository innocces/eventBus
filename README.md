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