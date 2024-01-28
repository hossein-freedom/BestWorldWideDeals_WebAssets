import { createSlice } from '@reduxjs/toolkit'

export const search = createSlice({
    name: "searchTerms",
    initialState: {
        loading: false,
        filterOpen: false,
        value : { 
            searchType: "",
            searchValue: ""
        },
    },
    reducers: {
      updateSearchTerm: (state, newValue) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes.
        // Also, no return statement is required from these functions.
        if(state.value.searchType !== newValue.payload.searchType ||
                                            state.value.searchValue !== newValue.payload.searchValue  ){
                state.value = newValue.payload
        }else{
          return;
        }
      },
      updateFiltersOpen: (state, idOpen) => {
        state.filterOpen = idOpen;
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { updateSearchTerm, updateFiltersOpen } = search.actions
  
  export default search.reducer