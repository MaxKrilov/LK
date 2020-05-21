import { ERROR_MODAL } from '@/store/actions/variables';
import { logError } from '@/functions/logging.ts';
import { getFirstElement } from '@/functions/helper';
import { CONTRACT, GROUP_CONTRACT } from '@/constants/document';
import { isReportDocument, isContractDocument, isUserListDocument, isBlankDocument, isOtherDocument } from '@/functions/document';
import { TYPE_FILE, TYPE_JSON } from '@/constants/type_request';
const state = {
    listDocument: [],
    listReportDocument: [],
    listContractDocument: [],
    listOtherDocument: []
};
const getters = {
    /**
     * Получение количества документов и/или пакетов документов со статусом "Готов для клиента"
     * @param state
     */
    getCountUnsignedDocument: (state) => state.listDocument.filter(document => getFirstElement(document)?.contractStatus?.match(new RegExp(CONTRACT.IS_READY, 'ig'))).length,
    /**
     * Получение отчётных документов и/или пакетов документов
     * @param state
     */
    getListReportDocument: (state) => state.listReportDocument,
    /**
     * Получение контрактных докуметов и/или пакетов документов
     * @param state
     */
    getListContractDocument: (state) => state.listContractDocument,
    getListOtherDocument: (state) => state.listOtherDocument
};
const actions = {
    /**
     * Получение списка документов
     * @param {ActionContext<IState, {}>} context
     * @param {{ api: API }} payload
     */
    downloadListDocument(context, payload) {
        const { toms: clientId } = context.rootGetters['auth/user'];
        // const billingAccountId = context.rootGetters['user/getActiveBillingAccount']
        return new Promise((resolve, reject) => {
            payload.api
                .setWithCredentials()
                .setData({
                clientId
                // billingAccountId
            })
                .query('/customer/management/fileinfo')
                .then((data) => {
                context.commit('downloadListDocumentSuccess', data);
                resolve();
            })
                .catch((error) => {
                logError(error);
                context.commit(ERROR_MODAL, true, { root: true });
                reject(error);
            })
                .finally(() => {
                context.commit('loading/loadingDocuments', false, { root: true });
            });
        });
    },
    downloadFile(context, payload) {
        return new Promise((resolve) => {
            payload.api
                .setWithCredentials()
                .setResponseType('blob')
                .setData({
                bucket: payload.bucket,
                key: payload.key
            })
                .query('/docs/s3/get')
                .then((response) => {
                resolve(response);
            })
                .catch(() => {
                resolve(false);
            });
        });
    },
    changeContractStatus(context, payload) {
        const { toms: clientId } = context.rootGetters['auth/user'];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                payload.api
                    .setWithCredentials()
                    .setData({
                    clientId,
                    contractId: payload.contractId,
                    status: payload.status
                })
                    .query('/order/contract/edit')
                    .then(() => { resolve(true); })
                    .catch((err) => {
                    if (err.message.toLowerCase().match(/заказ не может быть отправлен в исполнение автоматически/ig)) {
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                });
            }, 2000);
        });
    },
    uploadFile(context, { api, bucket, file, filePath }) {
        return new Promise((resolve, reject) => {
            api
                .setWithCredentials()
                .setType(TYPE_FILE)
                .setData({
                bucket,
                file,
                key: filePath
            })
                .query('/docs/s3/set')
                .then(() => resolve(true))
                .catch(() => reject(false));
        });
    },
    sendOnEmail(context, { api, files, email }) {
        return new Promise((resolve) => {
            api
                .setWithCredentials()
                .setType(TYPE_JSON)
                .setData({
                files,
                email
            })
                .query('/docs/s3/send-mail')
                .then(response => resolve(response))
                .catch(() => resolve(false));
        });
    }
};
const mutations = {
    /**
     * Группировка:
     * 1. Разделяем контрактные и отчётные документы
     * 2. В контрактной документации группируем только следующие типы документов:
     *    2.1. Договор
     *    2.2. Доп. соглашение
     *    2.3. Акт сдачи/приёмки услуги
     *    2.4. Первичный счёт
     *    2.5. Список пользователей
     */
    downloadListDocumentSuccess(state, payload) {
        state.listContractDocument = [];
        state.listReportDocument = [];
        state.listOtherDocument = [];
        state.listDocument = [];
        payload.forEach(document => {
            if (isReportDocument(document)) {
                state.listReportDocument.push(document);
            }
            if ((isContractDocument(document) || isUserListDocument(document) || isBlankDocument(document))) {
                if (GROUP_CONTRACT.includes(String(document.type.id))) {
                    const findIndex = state.listContractDocument.findIndex(_document => {
                        return Array.isArray(_document) &&
                            getFirstElement(_document).relatedTo.id === document.relatedTo.id &&
                            GROUP_CONTRACT.includes(getFirstElement(_document).type.id);
                    });
                    findIndex > -1
                        ? state.listContractDocument[findIndex].push(document)
                        : state.listContractDocument.push([document]);
                }
                else {
                    state.listContractDocument.push([document]);
                }
            }
            if (isOtherDocument(document)) {
                state.listOtherDocument.push(document);
            }
        });
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
//# sourceMappingURL=fileinfo.js.map