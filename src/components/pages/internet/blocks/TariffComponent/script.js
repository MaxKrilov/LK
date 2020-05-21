var TariffComponent_1;
import { __decorate } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import * as d3 from 'd3';
import moment from 'moment';
import { tweenText } from '@/components/pages/internet/functions/animation';
import { price } from '@/functions/filters';
import InfolistViewer from './components/InfolistViewer/index.vue';
import { getLastElement, uniq } from '@/functions/helper';
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue';
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue';
const SPEED_N_LIMIT_WIDTH = 104;
const STROKE_WIDTH = 2;
const CURRENT_SPEED_IN_CHARS = 'Скорость доступа, до (Мбит/с)';
// const OFFER_CODE_SPEED_INCREASE = 'LOCMMSPEED'
const OFFER_CODE_TEMP_SPEED_INCREASE = 'SPEEDUP';
const CHARS_SPEED_INCREASE = CURRENT_SPEED_IN_CHARS;
const CHARS_TURBO_SPEED_INCREASE = 'Увеличение скорости ДО (Мбит/с)';
const CHAR_START_DATE_TURBO = 'Дата активации';
const CHAR_STOP_DATE_TURBO = 'Дата окончания';
const arc = d3.arc()
    .startAngle(0)
    .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
    .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH);
// eslint-disable-next-line no-use-before-define
let TariffComponent = TariffComponent_1 = class TariffComponent extends Vue {
    constructor() {
        super(...arguments);
        // Data
        this.isBlur = false;
        this.isShowInfolistViewer = false;
        this.internetSpeed = this.currentSpeed;
        this.isTurboActivation = false;
        this.turboPeriod = [];
        this.isInfinity = false;
        this.isLoadingConnect = false;
        this.isShowOfferDialog = false;
        this.isShowErrorDialog = false;
        this.isOffering = false;
        this.isOffer = false;
        this.isOfferAccepting = false;
    }
    // Computed
    /**
     * Дата активации тарифа
     */
    get actualStartDate() {
        return this.customerProduct && this.customerProduct.tlo && this.customerProduct.tlo.actualStartDate
            ? moment(this.customerProduct.tlo.actualStartDate).format('D MMMM YYYY')
            : null;
    }
    /**
     * Имя тарифного плана
     */
    get offerOriginalName() {
        return this.customerProduct?.tlo?.offer?.originalName || null;
    }
    /**
     * Текущая скорость
     */
    get currentSpeed() {
        return this.customerProduct
            ? Number(this.customerProduct.tlo.chars[CURRENT_SPEED_IN_CHARS].replace(/[\D]+/g, ''))
            : null;
    }
    /**
     * Максимальная доступная скорость для смены
     */
    get maxAvailableSpeedIncrease() {
        return this.customerProduct
            ? getLastElement(this.listAvailableSpeedIncrease).speed
            : null;
    }
    /**
     * Проверка - доступен ли турбо-режим для подключения
     * Возвращает элемент SLO, если доступен или false в противном случае
     */
    get isAvailableTurbo() {
        return this.customerProduct?.slo?.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE) || false;
    }
    /**
     * Возвращает продуктовые предложения по смене скорости в случае их наличия
     * или false в противном случае
     */
    get isAvailableSpeedIncrease() {
        return this.customerProduct?.tlo?.offer?.prices || false;
    }
    /**
     * Список доступных скоростей
     */
    get listAvailableSpeedIncrease() {
        if (!this.customerProduct)
            return [];
        if (this.isTurboActivation && this.isAvailableTurbo) {
            return this.isAvailableTurbo.prices
                .map(price => this.__mapAvailableSpeed(price, CHARS_TURBO_SPEED_INCREASE))
                .sort((a, b) => a.speed - b.speed);
        }
        else if (!this.isTurboActivation && this.isAvailableSpeedIncrease) {
            return uniq(this.isAvailableSpeedIncrease
                .map(price => this.__mapAvailableSpeed(price, CHARS_SPEED_INCREASE))
                .sort((a, b) => a.speed - b.speed)
                .filter(price => price.speed > (this.currentSpeed || 0)), 'speed');
        }
        else {
            return [];
        }
    }
    /**
     * Проверка - подключен ли Турбо-режим
     */
    get isOnTurbo() {
        return this.customerProduct
            ? this.customerProduct.slo.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE)?.activated
            : false;
    }
    /**
     * Валюта для расчётов
     */
    get currencyCode() {
        return this.customerProduct
            ? this.customerProduct.tlo.purchasedPrices.recurrentTotal.currency.currencyCode
            : '₽';
    }
    /**
     * Абонентская плата за Интернет
     */
    get recurrentTotal() {
        return this.customerProduct
            ? Number(this.customerProduct.tlo.purchasedPrices.recurrentTotal.value)
            : 0;
    }
    get parentId() {
        return this.customerProduct
            ? this.customerProduct.tlo.id
            : '';
    }
    get turboPrice() {
        return this.isOnTurbo
            ? this.customerProduct.slo.find(slo => slo.code === OFFER_CODE_TEMP_SPEED_INCREASE)
                .purchasedPrices?.recurrentTotal?.value || 0
            : 0;
    }
    get priceAfterIncrease() {
        if (!this.customerProduct)
            return 0;
        if (!this.internetSpeed || this.internetSpeed === this.currentSpeed)
            return this.recurrentTotal;
        return this.listAvailableSpeedIncrease.find((speed) => speed.speed === this.internetSpeed).amount;
    }
    get connectTitle() {
        return this.isTurboActivation
            ? `Вы уверены, что хотите временно увеличить скорость до ${this.internetSpeed} Мбит/с`
            : `Вы уверены, что хотите увеличить скорость до ${this.internetSpeed} Мбит/с`;
    }
    get connectActionButtonText() {
        return this.isTurboActivation
            ? `Подключить`
            : `Изменить`;
    }
    get turboPriceAfterIncrease() {
        if (!this.customerProduct || !this.isTurboActivation)
            return 0;
        if (this.isInfinity)
            return this.priceAfterIncrease;
        const [from, to] = this.turboPeriod;
        const diff = Math.ceil(Math.abs(to.getTime() - from.getTime()) / (1000 * 3600 * 24));
        const daysInMonth = (new Date(from.getFullYear(), from.getMonth() + 1, 0)).getDate();
        return this.priceAfterIncrease / daysInMonth * diff;
    }
    get offerIdTLO() {
        return this.customerProduct?.tlo?.offer.id || '';
    }
    get offerIdTurbo() {
        return this.isAvailableTurbo
            ? this.isAvailableTurbo.id
            : '';
    }
    // Methods
    generateLoadingDonut(selector) {
        const svg = d3.select(selector)
            .append('svg')
            .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
            .append('g')
            .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`);
        svg.append('path')
            .datum({ endAngle: 2 * Math.PI })
            .attr('fill', 'none')
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', 'rgba(0, 0, 0, 0.05)')
            // @ts-ignore
            .attr('d', arc);
    }
    getBillingPacket() {
        if (!this.customerProduct)
            return;
        this.$store.dispatch('productnservices/billingPacket', {
            api: this.$api,
            product: this.customerProduct.tlo.id
        });
    }
    getInfoList() {
        this.isShowInfolistViewer = true;
    }
    generateSpeedChart() {
        const speed = this.currentSpeed;
        let speedPercentage = speed * 0.875 / this.maxAvailableSpeedIncrease;
        speedPercentage = speedPercentage > 0.875 ? 0.875 : speedPercentage;
        const svg = d3.select('.tariff-component__speed .chart')
            .append('svg')
            .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
            .append('g')
            .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`);
        svg.append('path')
            .datum({ endAngle: 2 * Math.PI })
            .attr('fill', 'none')
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', 'rgba(0, 0, 0, 0.05)')
            // @ts-ignore
            .attr('d', arc);
        const foreground = svg.append('path')
            .datum({ endAngle: speedPercentage * 2 * Math.PI })
            .attr('fill', 'none')
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', '#FFDD00')
            // @ts-ignore
            .attr('d', arc);
        foreground
            .transition()
            .delay(300)
            .duration(1000)
            .attrTween('d', function (d) {
            const start = { startAngle: 0, endAngle: 0 };
            const interpolate = d3.interpolate(start, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });
        const text = svg.append('g')
            .classed('text', true);
        text.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .classed('top', true)
            .text('0');
        text.select('.top')
            .transition()
            .delay(300)
            .duration(1000)
            .tween('text', tweenText(speed));
        text.append('text')
            .attr('x', 0)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .classed('bottom', true)
            .text('Мбит/с');
    }
    generateLimitChart() {
        // todo После реализации метода - убрать все заглушки
        const wastedPercentage = 0.875; // todo Вычислять
        const svg = d3.select('.tariff-component__limit .chart')
            .append('svg')
            .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
            .append('g')
            .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`);
        svg.append('path')
            .datum({ endAngle: 2 * Math.PI })
            .attr('fill', 'none')
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', 'rgba(0, 0, 0, 0.05)')
            // @ts-ignore
            .attr('d', arc);
        const foreground = svg.append('path')
            .datum({ endAngle: wastedPercentage * 2 * Math.PI })
            .attr('fill', 'none')
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', '#FFDD00')
            // @ts-ignore
            .attr('d', arc);
        foreground
            .transition()
            .delay(300)
            .duration(1000)
            .attrTween('d', function (d) {
            const start = { startAngle: 0, endAngle: 0 };
            const interpolate = d3.interpolate(start, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });
        // todo Сделать зависимость от того, безлимитный ли у нас трафик
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const text = svg.append('g')
                .classed('text', true);
            text.append('text')
                .attr('x', 0)
                .attr('y', 6)
                .attr('text-anchor', 'middle')
                .classed('infinite', true)
                .text('∞');
        }
        else {
            const text = svg.append('g')
                .classed('text', true);
            text.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .classed('top', true)
                .text('0');
            text.select('.top')
                .transition()
                .delay(300)
                .duration(1000)
                .tween('text', tweenText(500)); // todo убрать
            text.append('text')
                .attr('x', 0)
                .attr('y', 10)
                .attr('text-anchor', 'middle')
                .classed('dash', true)
                .text('—');
            text.append('text')
                .attr('x', 0)
                .attr('y', 22)
                .attr('text-anchor', 'middle')
                .classed('bottom', true)
                .text(1000) // todo убрать
                .append('tspan')
                .text(' Гб');
        }
    }
    openBlur(isTurbo = false) {
        if (isTurbo) {
            this.isTurboActivation = true;
            this.internetSpeed = getLastElement(this.listAvailableSpeedIncrease).speed;
            this.initSpeedComponent();
            // Устанавливаем период в 1 день
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.turboPeriod = [
                today,
                tomorrow
            ];
        }
        this.$nextTick(() => { this.isBlur = true; });
    }
    closeBlur() {
        this.isBlur = false;
        this.isTurboActivation = false;
        this.internetSpeed = this.currentSpeed;
        this.initSpeedComponent();
    }
    initSpeedComponent() {
        this.$nextTick(() => {
            this.$refs['speed-component'].init();
        });
    }
    createSaleOrder() {
        if (!this.locationId || !this.customerProduct)
            return;
        const locationId = this.locationId;
        const bpi = this.customerProduct.tlo.id;
        if (!bpi)
            return;
        const offerId = this.isTurboActivation
            ? this.offerIdTurbo
            : this.offerIdTLO;
        if (!offerId)
            return;
        const choosingInternetSpeed = this.internetSpeed;
        let char = {};
        if (this.isTurboActivation) {
            if (!this.isAvailableTurbo)
                return;
            const price = this.isAvailableTurbo.prices
                .find(price => price.chars && price.chars.hasOwnProperty(CHARS_TURBO_SPEED_INCREASE) &&
                Number(price.chars[CHARS_TURBO_SPEED_INCREASE].replace(/[\D]+/g, '')) === choosingInternetSpeed);
            if (!price)
                return;
            char = [];
            char.push({ [CHARS_TURBO_SPEED_INCREASE]: price.chars[CHARS_TURBO_SPEED_INCREASE] });
            if (!this.isInfinity) {
                const [from, to] = this.turboPeriod;
                char.push({ [CHAR_START_DATE_TURBO]: moment(from).format() }, { [CHAR_STOP_DATE_TURBO]: moment(to).format() });
            }
        }
        else {
            if (!this.isAvailableSpeedIncrease)
                return;
            const price = this.isAvailableSpeedIncrease
                .find(price => price.chars && price.chars.hasOwnProperty(CHARS_SPEED_INCREASE) &&
                Number(price.chars[CHARS_SPEED_INCREASE].replace(/[\D]+/g, '')) === choosingInternetSpeed);
            if (!price)
                return;
            char[CHARS_SPEED_INCREASE] = price.chars[CHARS_SPEED_INCREASE];
        }
        this.isLoadingConnect = true;
        this.$store.dispatch('salesOrder/createSaleOrder', {
            locationId,
            bpi,
            offerId,
            chars: char
        })
            .then(() => {
            this.isShowOfferDialog = true;
            this.isOffering = true;
        })
            .catch(() => {
            this.isShowErrorDialog = true;
        })
            .finally(() => {
            this.isLoadingConnect = false;
        });
    }
    sendSailOrder() {
        if (!this.isOffer)
            return;
        const offerAcceptedOn = moment().format();
        this.isOfferAccepting = true;
        this.$store.dispatch('salesOrder/send', { offerAcceptedOn })
            .then(() => {
            // Success
        })
            .catch(() => {
            this.isShowErrorDialog = true;
        })
            .finally(() => {
            this.isOfferAccepting = false;
            this.isOffering = false;
            this.$nextTick(() => {
                this.isShowOfferDialog = false;
            });
        });
    }
    cancelSailOrder() {
        this.$store.dispatch('salesOrder/cancel')
            .finally(() => {
            this.isOffering = false;
            this.isOffer = false;
        });
    }
    __mapAvailableSpeed(elementPrice, chars) {
        return {
            id: elementPrice.id,
            amount: Number(elementPrice.amount),
            speed: elementPrice.chars && elementPrice.chars.hasOwnProperty(chars)
                ? Number(elementPrice.chars[chars].replace(/[\D]+/g, ''))
                : 0
        };
    }
    // Hooks
    mounted() {
        this.generateLoadingDonut('.tariff-component__speed .chart-loading');
        this.generateLoadingDonut('.tariff-component__limit .chart-loading');
    }
};
TariffComponent = TariffComponent_1 = __decorate([
    Component({
        components: {
            InfolistViewer,
            SpeedComponent,
            ErActivationModal
        },
        filters: {
            price
        },
        props: {
            customerProduct: {
                type: Object,
                default: null
            },
            isLoadingCustomerProduct: Boolean,
            locationId: [String, Number]
        },
        watch: {
            customerProduct(val) {
                if (val) {
                    this.generateSpeedChart();
                    this.getBillingPacket();
                    this.generateLimitChart();
                    this.initSpeedComponent();
                }
            },
            isShowOfferDialog(val) {
                !val && this.isOffering && this.cancelSailOrder();
            }
        }
    })
], TariffComponent);
export default TariffComponent;
//# sourceMappingURL=script.js.map