import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
let ListPointComponent = class ListPointComponent extends Vue {
    constructor() {
        super(...arguments);
        this.isOpen = false;
        this.isOpenModal = false;
    }
    closeModal() {
        this.isOpenModal = false;
    }
    toggleList() {
        this.isOpen = !this.isOpen;
    }
    get countList() {
        return this.list.length;
    }
    get getActiveFulladdress() {
        return this.value?.fulladdress;
    }
    get getIsLoadingListPoint() {
        return this.$parent && this.$parent.isLoadingListPoint;
    }
    setActivePoint(point) {
        this.$emit('input', point);
        this.isOpenModal = false;
    }
};
__decorate([
    Prop({ type: Array, default: () => ([]) })
], ListPointComponent.prototype, "list", void 0);
__decorate([
    Prop({ type: Object })
], ListPointComponent.prototype, "value", void 0);
ListPointComponent = __decorate([
    Component
], ListPointComponent);
export default ListPointComponent;
//# sourceMappingURL=script.js.map