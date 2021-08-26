import React from 'react'
import ReactDOM from 'react-dom'
import {} from '@/index'
import logoIcon from './images/logo.png'
import './index.css'

const App = (
  <div className='dm-box'>
    <img src={logoIcon} />
    <h1 className='dm-title'>hello plugin </h1>
    <p className='dm-info'>demo only</p>
  </div>
)

ReactDOM.render(App, document.querySelector('#app'))
