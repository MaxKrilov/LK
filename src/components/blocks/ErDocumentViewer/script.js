import { __decorate } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import * as Document from '@/constants/document';
const _mime = require('mime-types');
/**
 * Просмотрщик документов
 * Подписываем именно договор!
 */
let ErDocumentViewer = class ErDocumentViewer extends Vue {
    constructor() {
        super(...arguments);
        // Data
        this.listFile = new Map();
        this.currentDocument = this.listDocument[0];
        this.currentDocumentFile = '';
        this.currentType = this.computedListType[0];
    }
    // Computed
    get computedListType() {
        return this.listDocument.map(item => ({
            ...item.type,
            documentId: item.id
        }));
    }
    get isExistsFile() {
        return !!this.currentDocumentFile;
    }
    // Proxy
    get internalValue() {
        return this.value;
    }
    set internalValue(val) {
        this.$emit('input', val);
    }
    // Watchers
    onInternalValueChanged(val) {
        if (val && this.listFile.size === 0)
            this.downloadFile(this.listDocument[0]);
    }
    async onCurrentTypeChanged(val) {
        const _document = this.listDocument.find(item => String(item.id) === String(val.documentId));
        const changeEmbed = () => {
            const oldEmbed = this.$refs.modal.querySelector('embed');
            if (oldEmbed) {
                const parentNode = oldEmbed.parentNode;
                const newEmbed = document.createElement('embed');
                newEmbed.setAttribute('src', this.currentDocumentFile);
                parentNode.replaceChild(newEmbed, oldEmbed);
            }
        };
        // Проверяем - загружали ли ранее документ
        if (this.listFile.has(val.documentId)) {
            this.currentDocumentFile = this.listFile.get(val.documentId);
            this.currentDocument = _document;
            changeEmbed();
        }
        else {
            this.downloadFile(_document)
                .then((result) => {
                this.currentDocument = _document;
                if (result !== '') {
                    changeEmbed();
                }
            });
        }
    }
    onListDocumentChange(val) {
        this.currentDocument = val[0];
        this.currentType = this.computedListType[0];
    }
    // Methods
    downloadFile(downloadDocument) {
        return new Promise((resolve) => {
            this.$store.dispatch('fileinfo/downloadFile', {
                api: this.$api,
                bucket: downloadDocument.bucket,
                key: downloadDocument.filePath
            })
                .then(response => {
                if ((typeof response === 'boolean' && !response) ||
                    (response instanceof Blob && response.size === 0)) {
                    this.currentDocumentFile = '';
                    resolve('');
                }
                else if (response instanceof Blob) {
                    if (!this.listFile.has(downloadDocument.id.toString())) {
                        this.__toBase64(response, downloadDocument.fileName)
                            .then(base64File => {
                            this.listFile.set(downloadDocument.id.toString(), base64File);
                            this.currentDocumentFile = base64File;
                            resolve(base64File);
                        });
                    }
                }
            });
        });
    }
    downloadFileOnDevice() {
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = this.currentDocumentFile;
        tempLink.setAttribute('download', this.currentDocument.fileName);
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function () {
            document.body.removeChild(tempLink);
        }, 0);
    }
    __toBase64(file, fileName) {
        const mime = _mime.lookup(fileName);
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result
                    .replace('application/octet-stream', mime);
                resolve(result);
            };
        });
    }
    // Методы для подписания
    __signing(eventName) {
        let documentForSignature = this.listDocument.find(item => String(item.type.id) === Document.CONTRACT_ID);
        documentForSignature = documentForSignature || this.listDocument[0];
        if (!this.listFile.has(String(documentForSignature.id))) {
            this.downloadFile(documentForSignature)
                .then(data => {
                this.$emit(eventName, {
                    id: documentForSignature.id,
                    data
                });
            });
        }
        else {
            this.$emit(eventName, {
                id: documentForSignature.id,
                data: this.listFile.get(String(documentForSignature.id))
            });
        }
    }
    /**
     * Ручное подписание
     */
    manualSigning() {
        this.internalValue = false;
        this.__signing('signing:manual');
    }
    /**
     *  Подписание с помощью ЭЦП
     */
    digitalSigning() {
        this.internalValue = false;
        this.__signing('signing:digital');
    }
};
__decorate([
    Watch('internalValue')
], ErDocumentViewer.prototype, "onInternalValueChanged", null);
__decorate([
    Watch('currentType')
], ErDocumentViewer.prototype, "onCurrentTypeChanged", null);
__decorate([
    Watch('listDocument')
], ErDocumentViewer.prototype, "onListDocumentChange", null);
ErDocumentViewer = __decorate([
    Component({
        props: {
            value: Boolean,
            listDocument: {
                type: Array,
                default: () => ([])
            },
            isManualSigning: Boolean,
            isDigitalSigning: Boolean
        }
    })
], ErDocumentViewer);
export default ErDocumentViewer;
//# sourceMappingURL=script.js.map