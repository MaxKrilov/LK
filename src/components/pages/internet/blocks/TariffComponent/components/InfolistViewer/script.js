var InfolistViewer_1;
import { __decorate } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
const _mime = require('mime-types');
// eslint-disable-next-line no-use-before-define
let InfolistViewer = InfolistViewer_1 = class InfolistViewer extends Vue {
    constructor() {
        super(...arguments);
        // Data
        this.file = '';
        this.fileName = 'Информационный лист Интернет.pdf';
        this.isLoading = false;
    }
    // Computed
    get isExistsFile() {
        return !!this.file;
    }
    // Proxy
    get internalValue() {
        return this.value;
    }
    set internalValue(val) {
        this.$emit('input', val);
    }
    // Methods
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
    downloadDocument() {
        this.isLoading = true;
        this.$store.dispatch('productnservices/productInfoList', {
            api: this.$api,
            id: this.id
        })
            .then(response => {
            if (response instanceof Blob) {
                this.__toBase64(response, this.fileName)
                    .then(resultBase64 => {
                    this.file = resultBase64;
                });
            }
        })
            .finally(() => {
            this.isLoading = false;
        });
    }
    downloadFileOnDevice() {
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = this.file;
        tempLink.setAttribute('download', this.fileName);
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function () {
            document.body.removeChild(tempLink);
        }, 0);
    }
};
InfolistViewer = InfolistViewer_1 = __decorate([
    Component({
        props: {
            id: String,
            value: Boolean
        },
        watch: {
            internalValue(val) {
                if (val && !this.isExistsFile) {
                    this.downloadDocument();
                }
            }
        }
    })
], InfolistViewer);
export default InfolistViewer;
//# sourceMappingURL=script.js.map