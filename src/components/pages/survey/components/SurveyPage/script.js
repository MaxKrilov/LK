import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import { isTextQuestion } from '@/functions/survey.ts';
let SurveyPage = class SurveyPage extends Vue {
    constructor() {
        super(...arguments);
        this.text = '';
    }
    get isTextQuestion() {
        return isTextQuestion(this.type);
    }
    onInput(variant) {
        this.$emit('selected', variant);
    }
    onInputText(value) {
        this.$emit('input-text', value);
    }
};
__decorate([
    Prop([String, Number])
], SurveyPage.prototype, "id", void 0);
__decorate([
    Prop(String)
], SurveyPage.prototype, "title", void 0);
__decorate([
    Prop({ type: Array, default: [] })
], SurveyPage.prototype, "variants", void 0);
__decorate([
    Prop(String)
], SurveyPage.prototype, "type", void 0);
SurveyPage = __decorate([
    Component
], SurveyPage);
export default SurveyPage;
//# sourceMappingURL=script.js.map