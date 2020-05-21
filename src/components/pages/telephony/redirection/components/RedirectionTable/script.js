import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import CONST from '../../constants';
let RedirectionTable = class RedirectionTable extends Vue {
    onClickAdd() {
        this.$emit('add');
    }
    getRowCSSClass(row) {
        const cssClass = [];
        if (row.status === CONST.S_ADDED) {
            cssClass.push('t-b-row--added');
        }
        return cssClass;
    }
};
__decorate([
    Prop({ type: Array, default: () => ([]) })
], RedirectionTable.prototype, "list", void 0);
RedirectionTable = __decorate([
    Component({
        name: 'redirection-table'
    })
], RedirectionTable);
export default RedirectionTable;
//# sourceMappingURL=script.js.map