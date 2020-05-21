import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
let TBodyCollapser = class TBodyCollapser extends Vue {
    constructor() {
        super(...arguments);
        this.isVisible = this.startOpened;
    }
    onToggle() {
        this.isVisible = !this.isVisible;
    }
};
__decorate([
    Prop(Number)
], TBodyCollapser.prototype, "columns", void 0);
__decorate([
    Prop(String)
], TBodyCollapser.prototype, "title", void 0);
__decorate([
    Prop(Boolean)
], TBodyCollapser.prototype, "startOpened", void 0);
TBodyCollapser = __decorate([
    Component
], TBodyCollapser);
export default TBodyCollapser;
//# sourceMappingURL=script.js.map