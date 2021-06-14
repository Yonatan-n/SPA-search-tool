import { createSlice } from '@reduxjs/toolkit'
import { PROTOCOLS, ACTIONS } from './consts'
export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    source_port: "",
    dest_port: "",
    protocols: PROTOCOLS,
    actions: ACTIONS,
    query_result: [],
    page: 0,
    total: null,
    auto_complete: [],
    complete_field: "",
  },
  reducers: {
    change_str_prop: (state, action) => {
      const { value, prop } = action.payload;
      state[prop] = value;
    },
    toggle_list_value: (state, action) => {
      const { list, value } = action.payload;
      if (state[list].includes(value))
        state[list] = state[list].filter(item => item !== value)
      else state[list].push(value);
    },
    change_page: (state, action) => {
      const { value } = action.payload;
      state.page += value
    },
    update_total: (state, action) => {
      state.total = action.payload.value
    },
    set_auto_complete: (state, action) => {
      state.auto_complete = action.payload.value;
    },
    set_query_result: (state, action) => {
      const { results, page, total } = action.payload
      state.query_result = results
      state.page = page
      state.total = total
    },
    set_complete_field: (state, action) => {
      const { value } = action.payload;
      state.complete_field = value;
    },
    move_page: (state, action) => {
      const { value } = action.payload;
      state.page = value;
    }

  },
})

// Action creators are generated for each case reducer function
export const { change_str_prop,
  toggle_list_value,
  change_page,
  update_total,
  set_auto_complete,
  set_query_result,
  set_complete_field,
  move_page
} = searchSlice.actions


export default searchSlice.reducer
