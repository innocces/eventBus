/*
 * @Date: 2020-04-11 21:42:54
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-13 00:27:20
 * @FilePath: /eventBus/src/react/app.jsx
 * @Description: react entry
 */
import React, {
  useCallback
} from 'react'

import '../style/style.less'

import Comment from '../component/Comment/comment.jsx'

import {
  commentInfo
} from '../data/comment'

const App = () => {

  const commentAction = useCallback(type => alert(type), [])

  return <Comment comment={ commentInfo('react') } commentAction={ commentAction }/>
}

export default App