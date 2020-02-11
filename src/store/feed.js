import Vue from 'vue'

const state = {
  category: [],
  feeds: [],
  loading: true,
  page: 0,
  lastPage: 0,
  limit: 10,
  ord: 'asc',
  total: 0
}

const getters = {
  feeds(state) {
    return state.feeds
  },
  loading(state) {
    return state.loading
  },
  limit(state) {
    return state.limit
  },
  ord(state) {
    return state.ord
  },
  category(state) {
    return state.category
  }
}

const mutations = {
  setFeeds(state, list) {
    const { data, total, current_page, last_page } = list
    state.page = current_page
    state.total = total
    state.lastPage = last_page
    if (state.page > 0) {
      state.feeds = [...state.feeds].concat(data)
    } else {
      state.feeds = data
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setCategory(state, category) {
    state.category = category
  },
  setOrd(state, ord) {
    state.ord = ord
  }
}

const actions = {
  initFeeds({ commit }, params) {
    commit('setOrd', params.ord || 'asc')
    commit('setFeeds', {
      current_page: 0,
      total: 0,
      last_page: 0,
      data: []
    })
  },
  async fetchFeeds({ commit, state, getters }) {
    try {
      if (state.page > 0 && state.page >= state.lastPage) {
        commit('setLoading', false)
        return
      }

      commit('setLoading', true)
      const {
        data: { list }
      } = await Vue.axios.get('/api/list', {
        params: {
          page: state.page + 1,
          ord: state.ord,
          category: state.category.map((item) => item.id),
          limit: state.limit
        }
      })

      const categories = getters.category
      list.data.forEach((feed) => {
        const categoryName = categories.find((category) => category.id === feed.category_id).name
        feed.category_name = categoryName
      })

      commit('setLoading', false)
      commit('setFeeds', list)
    } catch (error) {
      throw new Error(error)
    }
  },
  async fetchCategory({ commit }) {
    try {
      const {
        data: { list }
      } = await Vue.axios.get('/api/category')

      commit('setCategory', list)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}