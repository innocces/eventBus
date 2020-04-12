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
      <div className='comment-header'>
        <Icon
          name={ comment.type }
        >
          { comment.type }
        </Icon>
        <span className='comment-day'>{ comment.data }</span>
      </div>
      <div className='comment-body'>
        <p className='comment-body-words'>{ comment.content }</p>

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
      </div>
    </div>
  )
}

export default Comment