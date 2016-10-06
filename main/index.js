import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Main from './Main'
import store from './store'
require('!!style!css!stylus?sourceMap!./global.styl')

document.addEventListener('drop', function (e) {
  e.preventDefault()
  e.stopPropagation()
})
document.addEventListener('dragover', function (e) {
  e.preventDefault()
  e.stopPropagation()
})

let el = document.getElementById('content')

ReactDOM.render((
  <Provider store={store}>
    <Main />
  </Provider>
), el, function () {
})
