/*
 * @Date: 2020-04-11 21:42:54
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-12 16:44:05
 * @FilePath: /eventBus/src/react/app.jsx
 * @Description: react entry
 */
import React from 'react'

import '../style/style.less'
import Icon from '../vue/component/Icon/react.index.jsx'
console.log(Icon)

function App() {
  return <div className='react-app-word'>react content<Icon>123</Icon></div>
}

export default App