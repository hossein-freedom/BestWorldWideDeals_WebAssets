import { configureStore } from '@reduxjs/toolkit'
import searchTermsReducer from '../src/Components/Reducers/SearchReducer'


export default configureStore({
  reducer: {
    searchTerm: searchTermsReducer,
  },
})