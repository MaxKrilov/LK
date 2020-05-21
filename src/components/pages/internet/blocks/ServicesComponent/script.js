import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { SERVICE_ADDITIONAL_IP, SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT } from '@/constants/internet';
import { getNoun } from '@/functions/helper';
let ServicesComponent = class ServicesComponent extends Vue {
    constructor() {
        super(...arguments);
        this.list = [];
    }
    // Computed
    get listService() {
        const result = [
            { icon: 'stat', name: 'Статистика', isOn: true },
            { icon: 'reload', name: 'Обратные зоны', isOn: true }
        ];
        const additionalServices = [SERVICE_CONTENT_FILTER, SERVICE_DDOS_PROTECT, SERVICE_ADDITIONAL_IP];
        if (this.customerProduct === null) {
            result.push({ icon: 'filter', name: 'Контент-фильтрация', isOn: false }, { icon: 'deffence_ddos', name: 'Защита от DDoS-атак', isOn: false }, { icon: 'add_ip', name: 'Дополнитель. IP адреса', isOn: false });
            return result;
        }
        this.customerProduct.slo.forEach(slo => {
            if (additionalServices.includes(slo.code)) {
                result.push({
                    ...this.getIconNNameByService(slo.code),
                    isOn: slo.activated
                });
            }
        });
        return result;
    }
    get lengthIsOn() {
        const length = this.listService.filter(item => item.isOn).length;
        return `${length} ${getNoun(length, 'сервис', 'сервиса', 'сервисов')}`;
    }
    getIconNNameByService(service) {
        switch (service) {
            case SERVICE_DDOS_PROTECT:
                return { icon: 'deffence_ddos', name: 'Защита от DDoS-атак' };
            case SERVICE_CONTENT_FILTER:
                return { icon: 'filter', name: 'Контент-фильтрация' };
            case SERVICE_ADDITIONAL_IP:
                return { icon: 'add_ip', name: 'Дополнитель. IP адреса' };
            default:
                return undefined;
        }
    }
};
ServicesComponent = __decorate([
    Component({
        props: {
            customerProduct: {
                type: Object,
                default: () => ({})
            },
            isLoadingCustomerProduct: Boolean
        }
    })
], ServicesComponent);
export default ServicesComponent;
//# sourceMappingURL=script.js.map