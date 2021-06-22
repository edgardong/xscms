import React from 'react'
import ReactDOM from 'react-dom'
import BaseRouter from '@/router'
import '@/global.less'
import zhCN from 'antd/es/locale-provider/zh_CN'
import { ConfigProvider } from 'antd'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

let store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
)
let persistor = persistStore(store)

// const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseRouter />
      </PersistGate>
    </Provider>
  </ConfigProvider>,
  document.getElementById('app')
)


export default store;