import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import PeriodSelect from '../PeriodSelect/index.vue';
import PeriodList from '../PeriodList/index.vue';
const mockupPeriodList = [
    {
        days: 'Вт, Ср, Чт, Пт, Сб, Вс',
        time: '00:00 - 24:00'
    },
    {
        days: 'Пн',
        time: '00:30 - 08:00'
    }
];
const components = {
    PeriodSelect,
    PeriodList
};
let AddRedirectionForm = class AddRedirectionForm extends Vue {
    constructor() {
        super(...arguments);
        this.periodList = mockupPeriodList;
    }
    onClickAdd() {
        this.$emit('add');
    }
    onCancel() {
        this.$emit('cancel');
    }
};
AddRedirectionForm = __decorate([
    Component({
        name: 'add-redirection-form',
        components
    })
], AddRedirectionForm);
export default AddRedirectionForm;
//# sourceMappingURL=script.js.map