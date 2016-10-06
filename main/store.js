import { combineReducers, createStore } from 'redux'

function data (state = {}, action) {
  switch (action.type) {
  }
  return state
}

let reducer = combineReducers({
  data
})

let store = createStore(reducer)

export default store
