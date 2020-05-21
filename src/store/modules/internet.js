import { API } from '@/functions/api';
const REVERCE_ZONE_QUERY = {
    GET: '/internet/revercezonebss/list',
    ADD: '/internet/revercezonebss/add',
    EDIT: '/internet/revercezonebss/edit',
    DELETE: '/internet/revercezonebss/del'
};
const api = () => new API();
const actions = {
    getListReverceZone(context, { ip }) {
        if (!ip)
            throw Error('Missing required parameter');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({ ip })
                .query(REVERCE_ZONE_QUERY.GET)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
    },
    addReverceZone(context, { ip, domain }) {
        if (!ip || !domain)
            throw Error('Missing required parameter');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({ ip, domain })
                .query(REVERCE_ZONE_QUERY.ADD)
                .then((response) => resolve(response)) // todo Проверить
                .catch((error) => reject(error));
        });
    },
    editReverceZone(context, { ip, domain, domainOld }) {
        if (!ip || !domain || !domainOld)
            throw Error('Missing required parameter');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({ ip, domain, domainOld })
                .query(REVERCE_ZONE_QUERY.EDIT)
                .then((response) => resolve(response)) // todo Проверить
                .catch((error) => reject(error));
        });
    },
    deleteReverceZone(context, { ip, domain }) {
        if (!ip || !domain)
            throw Error('Missing required parameter');
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({ ip, domain })
                .query(REVERCE_ZONE_QUERY.DELETE)
                .then((response) => resolve(response)) // todo Проверить
                .catch((error) => reject(error));
        });
    },
    getStatistic(context, { fromDate, toDate, productInstance }) {
        const billingAccountId = context.rootGetters['user/getActiveBillingAccount'];
        const { toms: clientId } = context.rootGetters['auth/user'];
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                id: billingAccountId,
                dateFrom: fromDate,
                dateTo: toDate,
                productInstance
            })
                .query('/billing/packets/events')
                .then(response => resolve(response))
                .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    },
    getContentFilterLink(context, { login }) {
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                login
            })
                .setBranch('contentfilter')
                .query('/internet/contentfilter-new/urlsettings')
                .then(response => resolve(response))
                .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    },
    getFileStatistic(context, { fromDate, toDate, productInstance }) {
        const billingAccountId = context.rootGetters['user/getActiveBillingAccount'];
        const { toms: clientId } = context.rootGetters['auth/user'];
        return new Promise((resolve, reject) => {
            api()
                .setWithCredentials()
                .setData({
                clientId,
                id: billingAccountId,
                dateFrom: fromDate,
                dateTo: toDate,
                productInstance
            })
                .query('/billing/packets/report')
                .then(response => resolve(response))
                .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
};
export default {
    namespaced: true,
    actions
};
//# sourceMappingURL=internet.js.map