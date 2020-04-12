import React  from 'react'
import classnames from 'classnames'

import './index.less'
import icons from './type'

const Icon = ({
  name,
  avator,
  onClick,
  children
}) => {
  const iconCls = {
    'icon-avator': avator || name === 'vue' || name === 'react'
  }
  const iconName = '#'+icons[name]

  return (
    <button 
      className={ classnames('icon-container', iconCls) }
      onClick={ onClick }
    >
      <svg className='icon' aria-hidden='true'>
        <use xlinkHref={ iconName }></use>
      </svg>
      <span className='icon-word'>{ children }</span>
    </button>
  )
}

export default Icon