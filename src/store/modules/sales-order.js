import { API } from '@/functions/api';
import { TYPE_JSON } from '@/constants/type_request';
const ACTION_ADD = 'add';
const QUERY = {
    CREATE: '/order/management/create',
    ADD_ELEMENT: '/order/management/add-element',
    SAVE: '/order/management/save',
    UPDATE_ELEMENT: '/order/management/update-element',
    DELETE_ELEMENT: '/order/management/delete-element',
    CANCEL: '/order/management/cancel',
    SEND_ORDER: '/order/management/send-order'
};
const api = () => new API();
const getClientId = (context) => context.rootGetters['auth/user']?.toms;
const state = {
    orderId: null,
    orderItemId: null,
    bpi: null,
    currentResponse: null
};
const getters = {
    orderId: (state) => state.orderId,
    orderItemId: (state) => state.orderItemId,
    bpi: (state) => state.bpi,
    currentResponse: (state) => state.currentResponse
};
const actions = {
    create(context, { locationId, bpi }) {
        if (!locationId || !bpi)
            throw new Error('Missing required parameter');
        const clientId = getClientId(context);
        const marketingBrandId = context.rootGetters['user/getMarketingBrandId'];
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                marketingBrandId,
                locationId
            })
                .query(QUERY.CREATE)
                .then((response) => {
                context.commit('createSuccess', {
                    ...response,
                    bpi
                });
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('createError');
                context.commit('responseError');
                reject(error);
            });
        });
    },
    addElement(context, { offerId }) {
        if (!offerId)
            throw new Error('Missing required parameter');
        const clientId = getClientId(context);
        const orderItemId = context.getters.orderItemId;
        if (!orderItemId)
            throw new Error('Order Item ID not found');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                offerId,
                orderItemId
            })
                .query(QUERY.ADD_ELEMENT)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    save(context) {
        const clientId = getClientId(context);
        const orderId = context.getters.orderId;
        if (!orderId)
            throw new Error('Order ID not found');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                id: orderId
            })
                .query(QUERY.SAVE)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    updateElement(context, { chars }) {
        if (!chars)
            throw new Error('Missing required parameter');
        const clientId = getClientId(context);
        const currentResponse = context.getters.currentResponse;
        const bpi = context.getters.bpi;
        const orderId = context.getters.orderId;
        const orderItemIdIndex = currentResponse.orderItems.findIndex(item => item.customerProductId === bpi);
        if (orderItemIdIndex < 0)
            throw new Error('Unknown error');
        const orderItemElement = currentResponse.orderItems[orderItemIdIndex].orderItems
            .find(item => item.action && item.action.toLowerCase() === ACTION_ADD);
        if (orderItemElement === null)
            throw new Error('Unknown error');
        const elementId = orderItemElement.id;
        if (!elementId)
            throw new Error('Unknown error');
        const elements = Array.isArray(chars)
            ? chars.map(char => ({
                id: elementId,
                chars: char
            }))
            : [{
                    id: elementId,
                    chars
                }];
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setType(TYPE_JSON)
                .setData({
                clientId,
                id: orderId,
                elements
            })
                .query(QUERY.UPDATE_ELEMENT)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    deleteElement(context, { productId, disconnectDate }) {
        const currentResponse = context.getters.currentResponse;
        function finder(data, id) {
            let result = null;
            const rec = (data, id, f) => {
                data.forEach((el) => {
                    if (el.customerProductId === id) {
                        result = el?.id;
                    }
                    if (el?.orderItems) {
                        f(el.orderItems, id, f);
                    }
                });
            };
            rec(data, id, rec);
            return result;
        }
        const orderItemId = finder(currentResponse.orderItems, productId);
        const clientId = getClientId(context);
        const orderId = context.getters.orderId;
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setType(TYPE_JSON)
                .setData({
                clientId,
                id: orderId,
                orderItemIds: [orderItemId],
                disconnectDate,
                primaryDisconnectReason: '9154707822713202000',
                secondaryDisconnectReason: '9154707827913202000'
            })
                .query(QUERY.DELETE_ELEMENT)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    cancel(context) {
        const clientId = getClientId(context);
        const orderId = context.getters.orderId;
        if (!orderId)
            throw new Error('Order ID not found');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                id: orderId
            })
                .query(QUERY.CANCEL)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    send(context, { offerAcceptedOn }) {
        const clientId = getClientId(context);
        const orderId = context.getters.orderId;
        if (!orderId)
            throw new Error('Order ID not found');
        const data = { clientId, id: orderId, offerIdentifier: 'version 1.0' };
        if (offerAcceptedOn)
            data.offerAcceptedOn = offerAcceptedOn;
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData(data)
                .query(QUERY.SEND_ORDER)
                .then((response) => {
                context.commit('responseSuccess', response);
                resolve(response);
            })
                .catch((error) => {
                context.commit('responseError');
                reject(error);
            });
        });
    },
    createSaleOrder(context, { locationId, bpi, offerId, chars }) {
        return new Promise((resolve, reject) => {
            context.dispatch('create', { locationId, bpi })
                .then(() => {
                context.dispatch('addElement', { offerId })
                    .then(() => {
                    if (!chars) {
                        context.dispatch('save')
                            .then(response => resolve(response))
                            .catch(err => reject(err));
                    }
                    else {
                        context.dispatch('updateElement', { chars })
                            .then(() => {
                            context.dispatch('save')
                                .then(response => resolve(response))
                                .catch(err => reject(err));
                        })
                            .catch(err => reject(err));
                    }
                })
                    .catch(err => reject(err));
            })
                .catch(err => reject(err));
        });
    },
    createDisconnectOrder(context, { locationId, bpi, productId, disconnectDate }) {
        return new Promise((resolve, reject) => {
            context.dispatch('create', { locationId, bpi })
                .then(() => {
                context.dispatch('deleteElement', { productId, disconnectDate })
                    .then(() => {
                    context.dispatch('save')
                        .then(response => resolve(response))
                        .catch(err => reject(err));
                })
                    .catch(err => reject(err));
            })
                .catch(err => reject(err));
        });
    }
};
const mutations = {
    createSuccess(state, payload) {
        state.orderId = payload.id;
        state.bpi = payload.bpi;
        const orderItemIdIndex = payload.orderItems.findIndex(item => item.customerProductId === payload.bpi);
        if (orderItemIdIndex < 0) {
            throw Error('Unknown error');
        }
        state.orderItemId = payload.orderItems[orderItemIdIndex].id;
    },
    createError(state) {
        state.orderId = null;
        state.bpi = null;
        state.orderItemId = null;
    },
    responseSuccess(state, payload) {
        state.currentResponse = payload;
    },
    responseError(state) {
        state.currentResponse = null;
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=sales-order.js.map