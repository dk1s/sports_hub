/* ------------------------------------------------------------------
   RTK Query integration layer.

   `sportsApi` is the single source of truth for data fetching. Each
   endpoint that a UI component subscribes to produces auto-generated
   hooks (useGetCatalogQuery, useCreateOrderMutation, …) with built-in
   request deduplication, caching, tag-based invalidation and error
   normalisation.

   Today every endpoint resolves through the mock localStorage layer in
   `services/api.js`. To go live:
     1. point `API.baseUrl` at the backend (config/app.js)
     2. swap `mockBaseQuery` for `fetchBaseQuery({ baseUrl, credentials })`
     3. keep the exact same endpoint names/hook signatures — the UI is
        unaware of the switch.
------------------------------------------------------------------ */
import { createApi } from '@reduxjs/toolkit/query/react'
import { getCatalog, saveCatalog, resetCatalog } from '../data/products'
import {
  ordersApi,
  customOrdersApi,
  usersApi,
  messagesApi,
  settingsApi,
  couponsApi,
  addressesApi,
  wishlistApi,
  adminSeedReset,
  invalidateAll,
} from './api'

const mockBaseQuery = async ({ fn, params, mutation }) => {
  try {
    if (mutation) invalidateAll()
    const data = await fn(params)
    return { data }
  } catch (err) {
    return { error: { status: 400, data: { message: err?.message || 'Something went wrong.' } } }
  }
}

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Catalog', 'Order', 'Custom', 'Message', 'User', 'Setting', 'Address', 'Wishlist'],
  endpoints: (b) => ({
    /* ---------------- reads ---------------- */
    getCatalog: b.query({
      query: () => ({ fn: () => getCatalog() }),
      providesTags: ['Catalog'],
    }),

    getOrdersMine: b.query({
      query: (uid) => ({ fn: () => ordersApi.mine(), params: { uid } }),
      providesTags: ['Order'],
    }),
    getOrderById: b.query({
      query: (id) => ({ fn: () => ordersApi.byId({ id }), params: { id } }),
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    getAdminOrders: b.query({
      query: () => ({ fn: () => ordersApi.all() }),
      providesTags: ['Order'],
    }),
    getStats: b.query({
      query: () => ({ fn: () => ordersApi.stats() }),
      providesTags: ['Order', 'Custom'],
    }),

    getCustomMine: b.query({
      query: (uid) => ({ fn: () => customOrdersApi.mine(), params: { uid } }),
      providesTags: ['Custom'],
    }),
    getCustomAll: b.query({
      query: () => ({ fn: () => customOrdersApi.all() }),
      providesTags: ['Custom'],
    }),

    getUsers: b.query({
      query: () => ({ fn: () => usersApi.all() }),
      providesTags: ['User'],
    }),

    getMessages: b.query({
      query: () => ({ fn: () => messagesApi.all() }),
      providesTags: ['Message'],
    }),

    getMyAddresses: b.query({
      query: (uid) => ({ fn: () => addressesApi.list(), params: { uid } }),
      providesTags: ['Address'],
    }),
    getMyWishlist: b.query({
      query: (uid) => ({ fn: () => wishlistApi.list(), params: { uid } }),
      providesTags: ['Wishlist'],
    }),

    getSettings: b.query({
      query: () => ({ fn: () => settingsApi.get() }),
      providesTags: ['Setting'],
    }),
    getCoupons: b.query({
      query: () => ({ fn: () => couponsApi.list() }),
      providesTags: ['Coupon'],
    }),

    /* ---------------- mutations ---------------- */
    createOrder: b.mutation({
      query: (payload) => ({ fn: () => ordersApi.create(payload), params: payload, mutation: true }),
      invalidatesTags: ['Order'],
    }),
    setOrderStatus: b.mutation({
      query: (payload) => ({ fn: () => ordersApi.updateStatus(payload), params: payload, mutation: true }),
      invalidatesTags: ['Order'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getAdminOrders', undefined, (draft) => {
            const o = draft.find((x) => x._id === payload.id)
            if (o) {
              o.status = payload.status
              o.updatedAt = new Date().toISOString()
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    submitCustomOrder: b.mutation({
      query: (payload) => ({ fn: () => customOrdersApi.submit(payload), params: payload, mutation: true }),
      invalidatesTags: ['Custom'],
    }),
    setCustomStatus: b.mutation({
      query: (payload) => ({ fn: () => customOrdersApi.updateStatus(payload), params: payload, mutation: true }),
      invalidatesTags: ['Custom'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getCustomAll', undefined, (draft) => {
            const r = draft.find((x) => x._id === payload.id)
            if (r) {
              r.status = payload.status
              r.updated = new Date().toISOString()
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    setCustomNotes: b.mutation({
      query: (payload) => ({ fn: () => customOrdersApi.setNotes(payload), params: payload, mutation: true }),
      invalidatesTags: ['Custom'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getCustomAll', undefined, (draft) => {
            const r = draft.find((x) => x._id === payload.id)
            if (r) {
              r.adminNotes = payload.notes
              r.updated = new Date().toISOString()
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    submitMessage: b.mutation({
      query: (payload) => ({ fn: () => messagesApi.submit(payload), params: payload, mutation: true }),
      invalidatesTags: ['Message'],
    }),
    setMessageStatus: b.mutation({
      query: (payload) => ({ fn: () => messagesApi.setStatus(payload), params: payload, mutation: true }),
      invalidatesTags: ['Message'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getMessages', undefined, (draft) => {
            const r = draft.find((x) => x._id === payload.id)
            if (r) r.status = payload.status
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    deleteMessage: b.mutation({
      query: (payload) => ({ fn: () => messagesApi.remove(payload), params: payload, mutation: true }),
      invalidatesTags: ['Message'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getMessages', undefined, (draft) => {
            const idx = draft.findIndex((x) => x._id === payload.id)
            if (idx >= 0) draft.splice(idx, 1)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    toggleBlockUser: b.mutation({
      query: (payload) => ({ fn: () => usersApi.toggleBlock(payload), params: payload, mutation: true }),
      invalidatesTags: ['User'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const u = draft.find((x) => x._id === payload.userId)
            if (u) u.blocked = !u.blocked
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    saveAddress: b.mutation({
      query: ({ uid, ...address }) => ({
        fn: () => addressesApi.save(address),
        params: address,
        mutation: true,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: b.mutation({
      query: ({ uid, ...payload }) => ({
        fn: () => addressesApi.remove(payload),
        params: payload,
        mutation: true,
      }),
      invalidatesTags: ['Address'],
    }),

    toggleWishlist: b.mutation({
      query: ({ productId }) => ({
        fn: () => wishlistApi.toggle({ productId }),
        params: { productId },
        mutation: true,
      }),
      invalidatesTags: ['Wishlist'],
      async onQueryStarted({ productId, uid }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          sportsApi.util.updateQueryData('getMyWishlist', uid, (draft) => {
            const idx = draft.indexOf(productId)
            if (idx >= 0) draft.splice(idx, 1)
            else draft.push(productId)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    updateSettings: b.mutation({
      query: (payload) => ({ fn: () => settingsApi.update(payload), params: payload, mutation: true }),
      invalidatesTags: ['Setting'],
    }),

    /* admin catalog (persists to localStorage via data/products.js) */
    catalogSave: b.mutation({
      query: (list) => ({ fn: () => { saveCatalog(list); return list }, params: list, mutation: true }),
      invalidatesTags: ['Catalog'],
    }),
    catalogReset: b.mutation({
      query: () => ({ fn: () => { resetCatalog(); return true }, mutation: true }),
      invalidatesTags: ['Catalog'],
    }),
    adminSeedReset: b.mutation({
      query: () => ({ fn: () => { adminSeedReset(); return true }, mutation: true }),
      invalidatesTags: ['Catalog', 'Order', 'Custom', 'Message', 'User', 'Setting', 'Address', 'Wishlist'],
    }),
  }),
})

export const {
  useGetCatalogQuery,
  useGetOrdersMineQuery,
  useGetOrderByIdQuery,
  useGetAdminOrdersQuery,
  useGetStatsQuery,
  useGetCustomMineQuery,
  useGetCustomAllQuery,
  useGetUsersQuery,
  useGetMessagesQuery,
  useGetMyAddressesQuery,
  useGetMyWishlistQuery,
  useGetSettingsQuery,
  useGetCouponsQuery,
  useCreateOrderMutation,
  useSetOrderStatusMutation,
  useSubmitCustomOrderMutation,
  useSetCustomStatusMutation,
  useSetCustomNotesMutation,
  useSubmitMessageMutation,
  useSetMessageStatusMutation,
  useDeleteMessageMutation,
  useToggleBlockUserMutation,
  useSaveAddressMutation,
  useDeleteAddressMutation,
  useToggleWishlistMutation,
  useUpdateSettingsMutation,
  useCatalogSaveMutation,
  useCatalogResetMutation,
  useAdminSeedResetMutation,
} = sportsApi