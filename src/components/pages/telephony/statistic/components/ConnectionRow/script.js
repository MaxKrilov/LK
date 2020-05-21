import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MISSED_CALL, INCOMING_CALL, OUTGOING_CALL } from '@/constants/telephony_statistic';
const ICONS = {
    [MISSED_CALL]: 'missed_call',
    [INCOMING_CALL]: 'incoming_call',
    [OUTGOING_CALL]: 'outgoing_call'
};
let ConnectionRow = class ConnectionRow extends Vue {
    constructor() {
        super(...arguments);
        this.pre = 'connection-row';
        this.region = 'Москва';
    }
    get iconName() {
        return ICONS[this.type];
    }
    getCSSClass() {
        const classMod = `${this.pre}--missed`;
        return [
            [classMod]
        ];
    }
};
__decorate([
    Prop({ type: String, default: 'missed' })
], ConnectionRow.prototype, "type", void 0);
ConnectionRow = __decorate([
    Component
], ConnectionRow);
export default ConnectionRow;
//# sourceMappingURL=script.js.map