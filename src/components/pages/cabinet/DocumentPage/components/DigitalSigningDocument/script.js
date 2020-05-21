import { __decorate } from "tslib";
/* eslint no-undef: "off",  no-unused-vars: "off" */
import Vue from 'vue';
import Component from 'vue-class-component';
import DigitalSignature from '@/functions/digital_signature';
import { Watch } from 'vue-property-decorator';
import { dataURLtoFile, getFirstElement } from '@/functions/helper';
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue';
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents';
import moment from 'moment';
import { mapState } from 'vuex';
import { SCREEN_WIDTH } from '@/store/actions/variables';
import { BREAKPOINT_MD } from '@/constants/breakpoint';
const mime = require('mime-types');
let DigitalSigningDocument = class DigitalSigningDocument extends Vue {
    constructor() {
        super(...arguments);
        /**
         * Список сертификатов
         */
        this.listCertificate = [];
        /**
         * Флаг, отвечающий за показ модального окна со списком сертификатов
         */
        this.isShowListCertificateDialog = false;
        /**
         * Выбранный сертификат
         */
        this.selectedCertificate = null;
        /**
         * Флаг, отвечающий за успешное подписание документа
         */
        this.isSuccess = false;
        /**
         * Флаг, отвечающий за ошибку во время подписания документа
         */
        this.isError = false;
        /**
         * Данные для скачивания подписанного документа
         */
        this.linkDownload = '';
        /**
         * Текст ошибки
         */
        this.errorText = '';
        /**
         * Процесс подписания документа
         */
        this.isSigningDocument = false;
    }
    get internalValue() {
        return this.value;
    }
    set internalValue(val) {
        this.$emit('input', val);
    }
    get getMaxWidthDialog() {
        return this.screenWidth < BREAKPOINT_MD ? undefined : 484;
    }
    get fileName() {
        return this.signingDocument?.fileName;
    }
    onInternalValueChange(val) {
        val && this.getListCertificate();
    }
    /**
     * Действия, совершаемые при возникновении ошибки
     * @param message
     */
    errorHandler(message) {
        this.internalValue = false;
        this.isShowListCertificateDialog = false;
        this.isSigningDocument = false;
        this.errorText = message;
        this.isError = true;
    }
    /**
     * Получение списка сертификатов
     */
    getListCertificate() {
        if (!cadesplugin)
            return;
        DigitalSignature
            .getCertificatesList(cadesplugin)
            .then((response) => {
            this.listCertificate = response;
            this.isShowListCertificateDialog = true;
            // Хотя бы один сертификат есть, так как при их отсутствии выбрасывается исключение
            this.selectedCertificate = getFirstElement(this.listCertificate);
        })
            .catch(error => this.errorHandler(error.message));
    }
    /**
     * Подписание документа
     */
    async signDocument() {
        if (!this.$refs.certificate_form.validate())
            return;
        this.isSigningDocument = true;
        const visibleSignature = DigitalSignature.createVisibleSignature('Пушистый котик', this.selectedCertificate);
        let _signDocument;
        const header = ';base64,';
        const data = this.signingDocument.data.substr(this.signingDocument.data.indexOf(header) + header.length);
        try {
            _signDocument = await DigitalSignature
                .signDocument(cadesplugin, data, this.selectedCertificate, visibleSignature);
        }
        catch (error) {
            this.errorHandler(error.message);
            return false;
        }
        const _binaryFile = dataURLtoFile(_signDocument, this.signingDocument.fileName);
        const _filePath = `${moment().format('MMYYYY')}/${this.signingDocument.id}`;
        // Загрузка файла в хранилище
        const _resultUploadedFile = await this.$store.dispatch(`documents/${UPLOAD_FILE}`, {
            api: this.$api,
            file: _binaryFile,
            bucket: this.signingDocument.bucket,
            filePath: _filePath
        });
        if (!_resultUploadedFile) {
            this.errorHandler('Ошибка при отправке файла в хранилище');
            return false;
        }
        // Прикрепляем вложение
        await this.$store.dispatch(`documents/${ATTACH_SIGNED_DOCUMENT}`, {
            api: this.$api,
            id: this.signingDocument.id,
            fileName: this.signingDocument.fileName,
            relatedTo: this.signingDocument.relatedTo.id,
            type: this.signingDocument.type.id,
            filePath: _filePath
        });
        // if (!_attachResult) {
        //   this.errorHandler('Ошибка при прикреплении файла в системе')
        //   return false
        // }
        // Смена статуса
        const _changeStatusResult = await this.$store.dispatch(`fileinfo/changeContractStatus`, {
            api: this.$api,
            contractId: this.signingDocument.relatedTo.id,
            status: 1
        });
        if (_changeStatusResult) {
            this.internalValue = false;
            this.isSigningDocument = false;
            this.linkDownload = `data:${mime.lookup(this.signingDocument.fileName)};base64,${_signDocument}`;
            this.isShowListCertificateDialog = false;
            this.isSuccess = true;
            this.$emit('success');
        }
        else {
            this.errorHandler('Ошибка при прикреплении файла в системе');
            return false;
        }
    }
};
__decorate([
    Watch('internalValue')
], DigitalSigningDocument.prototype, "onInternalValueChange", null);
DigitalSigningDocument = __decorate([
    Component({
        components: {
            ErActivationModal
        },
        props: {
            value: Boolean,
            signingDocument: Object
        },
        computed: {
            ...mapState({
                screenWidth: (state) => state.variables[SCREEN_WIDTH]
            })
        }
    })
], DigitalSigningDocument);
export default DigitalSigningDocument;
//# sourceMappingURL=script.js.map