import { __decorate } from "tslib";
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex';
import { LIST_COMPLAINT_THEME, LIST_REQUEST_THEME, LIST_TECHNICAL_REQUEST_THEME } from '@/store/actions/dictionary';
import ErPhoneSelect from '@/components/blocks/ErPhoneSelect';
import ErTimePickerRange from '@/components/blocks/ErTimePickerRange';
import ErTextareaWithFile from '@/components/blocks/ErTextareaWithFile';
import ErDadataSelect from '@/components/blocks/ErDadataSelect';
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue';
import { SCREEN_WIDTH } from '@/store/actions/variables';
import { BREAKPOINT_XL } from '@/constants/breakpoint';
import { getFirstElement } from '@/functions/helper';
import { CREATE_REQUEST, GET_REQUEST, GET_SERVICES_BY_LOCATION } from '@/store/actions/request';
import moment from 'moment';
// @ts-ignore
let CreateRequestComponent = class CreateRequestComponent extends Vue {
    constructor() {
        super(...arguments);
        this.publicPath = process.env.BASE_URL;
        this.isOpenForm = false;
        this.isOpenFormDesktop = false;
        // ===== DATA =====
        // ===== MODELS =====
        // Global
        this.requestTheme = { id: '9154749993013188903', value: 'Общие вопросы', form: 'general_issues', requestName: 'request' };
        this.phoneNumber = '';
        this.address = {};
        this.name = '';
        this.comment = '';
        this.time = [];
        // Restoring a contract or services
        this.services = [];
        this.recoverFrom = new Date();
        this.isWholeContract = false;
        // Money transfer
        this.firstPersonalAccount = '';
        this.secondPersonalAccount = '';
        this.sumTransfer = '';
        // Transfer point or service
        this.street = '';
        // Suspension of a contract or service
        this.stoppedFrom = new Date();
        // Erroneous payment
        this.payer = '';
        this.paymentOrderNumber = '';
        this.datePayment = new Date();
        this.sumPayment = '';
        // Change of Internet Protocol
        this.service = {};
        this.internetProtocol = '';
        // Termination of a contract or service
        this.terminateFrom = new Date();
        // Technocal issues
        this.technicalRequestTheme = {};
        // complaint
        this.complaintTheme = '9156211043213279417';
        this.email = '';
        this.post = '';
        this.loadingService = false;
        this.listService = [];
        this.ticketName = '';
        this.resultDialogSuccess = false;
        this.resultDialogError = false;
        this.loadingCreating = false;
        this.file = '';
        this.requiredRule = [
            (v) => !!v || 'Поле обязательно к заполнению'
        ];
        this.requiredRuleArray = [
            (v) => (Array.isArray(v) && v.length) !== 0 || 'Поле обязательно к заполнению'
        ];
    }
    get isReadonlyName() {
        return this.getPhoneList.includes(this.phoneNumber.replace(/[\D]+/g, ''));
    }
    get getLinkDeclaration() {
        switch (this.requestTheme?.form) {
            case 'renewal_of_the_contract':
                return `${this.publicPath}documents/zayavlenie_na_pereoformlenie.docx`;
        }
    }
    get getPhoneList() {
        return this.getListContact.map((item) => item.phone?.value).filter(item => item);
    }
    get getEmailList() {
        return this.getListContact.map((item) => item.email?.value).filter(item => item);
    }
    get listServiceComputed() {
        return this.listService.filter((item) => !!item.typeAuth);
    }
    get computedTicketName() {
        return this.ticketName.split(' ').slice(0, 2).join(' ');
    }
    onRequestThemeChange() {
        this.reset();
    }
    onFirstPersonalAccountChange() {
        this.secondPersonalAccount = '';
    }
    onScreenWidthChange(val) {
        if (val > BREAKPOINT_XL && this.isOpenForm) {
            this.isOpenForm = false;
            this.isOpenFormDesktop = true;
        }
        else if (val < BREAKPOINT_XL && this.isOpenFormDesktop) {
            this.isOpenForm = true;
            this.isOpenFormDesktop = false;
        }
    }
    onPhoneNumberChange(val) {
        const _val = val.replace(/[\D]+/, '');
        const findingValue = this.getListContact.find((item) => item.phone?.value === _val);
        if (findingValue !== undefined && findingValue.firstName && findingValue.name) {
            this.name = findingValue.name;
        }
    }
    onAddressChange(val) {
        if (!val.locationId)
            return;
        this.loadingService = true;
        this.services = [];
        this.service = {};
        this.$store.dispatch(`request/${GET_SERVICES_BY_LOCATION}`, {
            api: this.$api,
            locationId: val.locationId
        })
            .then(response => {
            this.listService = response.filter((item) => item?.offer?.isRoot).map((item) => ({
                id: item.id,
                // value: item.chars['Имя в счете'] || item.name,
                value: item.chars && item.chars['Имя в счете'] ? item.chars['Имя в счете'] : item.name,
                typeAuth: item.chars && item.chars['Тип авторизации'] ? item.chars['Тип авторизации'] : undefined
            }));
            this.loadingService = false;
        });
    }
    onIsWholeContract(val) {
        if (val) {
            this.services = [];
            this.address = {};
        }
    }
    closeForm() {
        if (this.screenWidth < BREAKPOINT_XL) {
            this.isOpenForm = false;
        }
        else {
            this.isOpenFormDesktop = false;
        }
    }
    openDesktopForm() {
        this.isOpenFormDesktop = true;
    }
    toggleSlideUpDown() {
        this.isOpenFormDesktop = !this.isOpenFormDesktop;
    }
    createRequest() {
        if (!this.$refs[this.requestTheme?.form || 'form'].validate())
            return;
        this.loadingCreating = true;
        // Наименование проблемы
        const requestName = this.requestTheme?.requestName;
        // Идентификатор адреса
        const location = this.address?.id || getFirstElement(this.getAddressList)?.id;
        // Описание проблемы
        const description = this.getDescriptionText();
        // Идентификатор типа заявки
        const type = this.requestTheme?.id;
        // Идентификатор контакта кастомера
        let customerContact = this.getListContact.find((item) => item.phone?.value === this.phoneNumber.replace(/[\D]+/g, ''));
        let customerContactId, phoneId, complainantPhone;
        if (customerContact !== undefined) {
            customerContactId = customerContact.id;
            phoneId = customerContact.phone.id;
        }
        else {
            customerContact = this.getListContact.find((item) => item.isLPR) || getFirstElement(this.getListContact);
            if (customerContact !== undefined) {
                customerContactId = customerContact.id;
                phoneId = customerContact.phone.id;
                complainantPhone = this.phoneNumber.replace(/[\D]+/g, '');
            }
        }
        this.$store.dispatch(`request/${CREATE_REQUEST}`, {
            requestName,
            location,
            description,
            type,
            customerContact: customerContactId,
            phoneNumber: phoneId,
            api: this.$api,
            problemTheme: this.technicalRequestTheme.id,
            service: this.service.id,
            file: this.file,
            complaintTheme: this.complaintTheme,
            complainantPhone,
            complainantContactName: complainantPhone ? this.name : undefined
            // emailAddress
        })
            .then((answer) => {
            if (typeof answer === 'string' && answer !== '') {
                this.ticketName = answer;
                this.resultDialogSuccess = true;
                this.closeForm();
                this.reset();
                setTimeout(() => {
                    this.$store.dispatch(`request/${GET_REQUEST}`, { api: this.$api });
                });
            }
            else {
                this.resultDialogError = true;
            }
        })
            .catch(() => {
            this.resultDialogError = true;
        })
            .finally(() => {
            this.loadingCreating = false;
            this.$scrollTo('.support-page');
        });
    }
    getDescriptionText() {
        const comment = `Заявка сформирована из ЛК B2B: ${this.comment}`;
        const phone = `Контактный номер телефона: ${this.phoneNumber}`;
        const name = `Как обращаться к клиенту: ${this.name}`;
        const agreementOrServices = this.isWholeContract
            ? `Номер договора: ${this.agreementNumber}`
            : `Услуги: ${this.services.map((item) => item.value)};
        Адрес: ${this.address.value}`;
        const address = `Адрес: ${this.address.value}`;
        const services = `Услуги: ${this.services.map((item) => item.value)}`;
        // @ts-ignore
        const service = `Услуга: ${this.service.value}`;
        switch (this.requestTheme?.form) {
            case 'general_issues':
            case 'order_a_document':
            case 'change_of_details':
                return `
          ${comment};
          ${phone};
          ${name}.`;
            case 'restoring_a_contract_or_service':
                return `
          ${comment};
          Восстановить с: ${moment(this.recoverFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`;
            case 'transfer_point_or_service':
                return `
          ${comment};
          ${address};
          ${services};
          Адрес куда перенести: ${this.street.value};
          ${phone};
          ${name}.`;
            case 'change_of_internet_protocol':
                return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`;
            case 'change_of_tariff':
                return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`;
            case 'suspension_of_a_contract_or_service':
                return `
          ${comment};
          Приостановить с ${moment(this.stoppedFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`;
            case 'termination_of_a_contract_or_service':
                return `
          ${comment};
          Расторгнуть с ${moment(this.terminateFrom).format('LL')};
          ${agreementOrServices};
          ${phone};
          ${name}.`;
            case 'erroneous_payment':
                return `
          ${comment};
          Плательщик: ${this.payer};
          Номер платежного поручения: ${this.paymentOrderNumber};
          Дата платежа: ${moment(this.datePayment).format('LL')};
          Сумма платежа: ${this.sumPayment.replace('₽', 'руб.')};
          ${phone};
          ${name}.`;
            case 'money_transfer':
                return `
          ${comment};
          Перевести с л/с ${this.firstPersonalAccount} на л/с ${this.secondPersonalAccount};
          Сумма перевода: ${this.sumTransfer.replace('₽', 'руб.')};
          ${phone};
          ${name}.`;
            case 'renewal_of_the_contract':
                return `
          ${comment};
          ${agreementOrServices};
          ${phone};
          ${name}.`;
            case `technical_issues`:
                return `
          ${comment};
          ${address};
          ${service};
          ${phone};
          ${name}.`;
            case 'complaint':
                return `
          ${comment};
          ${address};
          ${phone};
          Адрес электронной почты: ${this.email};
          ${name};
          Должность: ${this.post}
        `;
        }
    }
    reset() {
        this.phoneNumber = '';
        this.address = {};
        this.name = '';
        this.comment = '';
        this.time = [];
        this.services = [];
        this.recoverFrom = new Date();
        this.isWholeContract = false;
        this.firstPersonalAccount = '';
        this.secondPersonalAccount = '';
        this.sumTransfer = '';
        this.street = '';
        this.stoppedFrom = new Date();
        this.payer = '';
        this.paymentOrderNumber = '';
        this.datePayment = new Date();
        this.sumPayment = '';
        this.service = {};
        this.internetProtocol = '';
        this.terminateFrom = new Date();
        this.technicalRequestTheme = '';
    }
    mounted() {
        if (this.$route.query && this.$route.query.open && this.$route.query.open === 'document') {
            this[this.screenWidth <= BREAKPOINT_XL ? 'isOpenForm' : 'isOpenFormDesktop'] = true;
            this.requestTheme = this.listRequestTheme.find((item) => item.form === 'order_a_document');
            this.$nextTick(() => {
                this.screenWidth >= BREAKPOINT_XL && this.$scrollTo('.create-request-component');
            });
        }
    }
};
__decorate([
    Watch('requestTheme')
], CreateRequestComponent.prototype, "onRequestThemeChange", null);
__decorate([
    Watch('firstPersonalAccount')
], CreateRequestComponent.prototype, "onFirstPersonalAccountChange", null);
__decorate([
    Watch('screenWidth')
], CreateRequestComponent.prototype, "onScreenWidthChange", null);
__decorate([
    Watch('phoneNumber')
], CreateRequestComponent.prototype, "onPhoneNumberChange", null);
__decorate([
    Watch('address')
], CreateRequestComponent.prototype, "onAddressChange", null);
__decorate([
    Watch('isWholeContract')
], CreateRequestComponent.prototype, "onIsWholeContract", null);
CreateRequestComponent = __decorate([
    Component({
        computed: {
            ...mapState({
                clientInfo: (state) => state.user.clientInfo,
                listRequestTheme: (state) => state.dictionary[LIST_REQUEST_THEME],
                listTechnicalRequestTheme: (state) => state.dictionary[LIST_TECHNICAL_REQUEST_THEME],
                listComplaintRequestTheme: (state) => state.dictionary[LIST_COMPLAINT_THEME],
                screenWidth: (state) => state.variables[SCREEN_WIDTH],
                listBillingAccount: (state) => state.user.listBillingAccount.map((item) => item.accountNumber)
            }),
            ...mapGetters('user', ['getAddressList', 'getListContact', 'agreementNumber'])
        },
        components: {
            ErPhoneSelect,
            ErTimePickerRange,
            ErTextareaWithFile,
            ErDadataSelect,
            ErActivationModal
        }
    })
], CreateRequestComponent);
export default CreateRequestComponent;
//# sourceMappingURL=script.js.map