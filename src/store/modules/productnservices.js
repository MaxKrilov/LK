import { TYPE_ARRAY } from '@/constants/type_request';
const state = {};
const getters = {};
const actions = {
    /**
     * Получение локаций с названием тарифа (и/или суммарной ценой) по типу продукта и биллинг-аккаунту
     * @param context
     * @param payload
     */
    locationOfferInfo(context, payload) {
        const { api, productType } = payload;
        const { toms: clientId } = context.rootGetters['auth/user'];
        const billingAccountId = context.rootGetters['user/getActiveBillingAccount'];
        return new Promise((resolve, reject) => {
            api
                .setWithCredentials()
                .setData({
                clientId,
                billingAccountId,
                productType
            })
                .query('/order/management/points')
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    },
    /**
     * Получение клиентских продуктов (по Интернету)
     * @param context
     * @param payload
     */
    customerProduct(context, payload) {
        const { toms: clientId } = context.rootGetters['auth/user'];
        const data = { clientId, id: clientId };
        payload.parentId && (data.parentId = payload.parentId);
        payload.code && (data.code = payload.code);
        payload.locationId && (data.locationId = payload.locationId);
        return new Promise((resolve, reject) => {
            payload.api
                .setWithCredentials()
                .setData(data)
                .query('/customer/product/all')
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    },
    /**
     * Получение клиентских продуктов (по массиву точек)
     * @param context
     * @param payload
     */
    customerProducts(context, payload) {
        const { toms: clientId } = context.rootGetters['auth/user'];
        const data = {
            clientId
        };
        payload.parentIds && (data.parentIds = payload.parentIds);
        payload.code && (data.code = payload.code);
        return new Promise((resolve, reject) => {
            payload.api
                .setWithCredentials()
                .setData(data)
                .setType(TYPE_ARRAY)
                .query('/customer/product/all-slo')
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    },
    billingPacket(context, { api, product }) {
        const billingAccountId = context.rootGetters['user/getActiveBillingAccount'];
        return new Promise((resolve, reject) => {
            api
                .setWithCredentials()
                .setData({
                id: billingAccountId,
                product
            })
                .query('/billing/packets/index')
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    },
    productInfoList(context, { api, id }) {
        const { toms: clientId } = context.rootGetters['auth/user'];
        return new Promise((resolve, reject) => {
            api
                .setWithCredentials()
                .setResponseType('blob')
                .setData({
                clientId,
                id
            })
                .query('/customer/product/infolist')
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }
};
const mutations = {};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=productnservices.js.map