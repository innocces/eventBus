import React, { useCallback } from 'react'

import './index.less'

import Icon from '../../Icon/icon.jsx'

const actionArray = [
  { name: 'pinglun', slot: '评论' },
  { name: 'cai', slot: '踩' },
  { name: 'share', slot: '分享' },
]

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