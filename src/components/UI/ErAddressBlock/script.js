import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
let ErAddressBlock = class ErAddressBlock extends Vue {
    constructor() {
        super(...arguments);
        this.current = 0;
        this.isOpened = false;
    }
    get currentItem() {
        return this.list[this.value];
    }
    get totalCount() {
        return this.list.length;
    }
    onItemClick(argh) {
        this.$emit('input', argh);
    }
    onShowConnections() {
        this.$emit('show');
        this.isOpened = true;
    }
    onHideConnections() {
        this.$emit('hide');
        this.isOpened = false;
    }
    onToggleConnections() {
        this.$emit('toggle');
        this.isOpened = !this.isOpened;
    }
};
__decorate([
    Prop({ type: Array, default: () => [] })
], ErAddressBlock.prototype, "list", void 0);
__decorate([
    Prop({ type: Number, default: 0 })
], ErAddressBlock.prototype, "value", void 0);
ErAddressBlock = __decorate([
    Component
], ErAddressBlock);
export default ErAddressBlock;
//# sourceMappingURL=script.js.map