<template lang="pug">
  .ert-wifi-personalization-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="Конструктор страницы авторизации"
      backlink="/lk"
    )

    .ert-wifi-personalization-page__list-point
      ErListPoints(
        :list="listPoint"
        v-model="activePoint"
        :isLoading="isLoadingListPoint"
      )
    template(v-if="isLoadingCustomerProduct || isLoadingWifiData")
      .ert-wifi-personalization-page__loading
        ErtProgressCircular(indeterminate width="2")
        .title Загружаем сервисы авторизации
    template(v-else-if="isErrorLoad")
      .ert-wifi-personalization-page__error
        .title При загрузке возникла ошибка! Повторите запрос позднее
    template(v-else-if="activePoint.status === statusSuspended || activePoint.status === isStoppedProduct")
      .ert-wifi-personalization-page__suspended.mb-24
        | Услуга приостановлена! Восстановите услугу для дальнейшего использования
      er-button.ert-wifi-personalization-page__restore-button(
        @click="$router.push('/lk/support?form=restoring_a_contract_or_service')"
      ) Восстановить
    template(v-else-if="!isActiveProduct")
      ErPromo(
        banner="personalization.png"
        :featureList="promoFeatureList"
        :isLoadingConnectButton="isShowPlugProductPlugin || isCheckingMoney"
        @click="onConnect"
      )
      .h4.mt-16 Стоимость услуги - {{ getPriceForConnection }} ₽/месяц
      ErPlugProduct(
        v-model="isShowPlugProductPlugin"
        :orderData="getOrderData"
        isSendOrder
        @cancelOrder="() => { isShowPlugProductPlugin = false }"
        @errorOrder="() => { isShowPlugProductPlugin = false }"
        @successOrder="() => { isShowPlugProductPlugin = false }"
      )
        template(v-slot:offerDescription)
          div.caption1.my-8
            | Стоимость услуги составит {{ getPriceForConnection | priceFormatted }} ₽/мес

      ErActivationModal(
        type="info"
        v-model="isShowMoneyModal"
        actionButtonText="Пополнить счёт"
        @confirm="onToPayment()"
        cancel-button-text="Закрыть"
      )
        template(v-slot:description)
          .h4 Уважаемый клиент, для завершения заказа на лицевом счете не достаточно денежных средств. Пополните лицевой счет и повторите покупку.
          .caption.text-color-black08 Стоимость подключения: <b>{{ getPriceForConnection }}</b> ₽
          .caption.text-color-black08 Ваши доступные средства: <b>{{ availableFundsAmt }}</b> ₽

      ErActivationModal(
        type="error"
        v-model="isErrorMoney"
        title="Возникла ошибка"
        :isShowActionButton="false"
        :persistent="true"
        cancelButtonText="Закрыть"
      )
        template(slot="description")
          div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру

    template(v-else)
      ErtWifiPersonalizationSettings.mb-24.mb-sm-16.mb-md-32(
        :listScreenOrientation="listScreenOrientation"
        :listLanguage="listLanguage"
        :modelScreenOrientation="modelScreenOrientation"
        :modelLanguage="modelLanguage"
        @change:screen-orientation="val => { modelScreenOrientation = val }"
        @change:language="val => { modelLanguage = val }"
      )
      .ert-wifi-personalization-page__canvas
        transition(name="fade" mode="out-in")
          ErtWifiPersonalizationScreen(
            v-for="screenOrientation in listScreenOrientation"
            v-if="screenOrientation.value === modelScreenOrientation.value"
            :key="screenOrientation.value"
            :orientation="screenOrientation.value"
            :language="modelLanguage.value"
            :logo="getLogo"
            :customBodyStyle="getFieldCustomBodyStyle"
            :banner="getBanner"
            :backgroundImage="getBackgroundImage"
            :isFullscreen="getIsFullscreen"
            :buttons="getButtons"
            :buttonStyles="getButtonStyles"
            @open:logo="openDialogLogo"
            @open:background="openDialogBackground"
            @open:buttons="openDialogButton"
          )
      .ert-wifi-personalization-page__actions.mt-16
        .action.mr-16
          ErButton(@click="onSave" :loading="isLoadingSetData")
            | Сохранить
        .action
          ErButton(flat @click="() => { isShowDisconnectProductPlugin = true }" :loading="isShowDisconnectProductPlugin")
            | Отключить
      //- Диалоговое окно для изменения логотипа
      ErtWifiPersonalizationDialogLogo(
        v-model="dialogLogo"
        :image="getLogo"
        @change="onSaveLogo"
      )

      ErtWifiPersonalizationDialogBackground(
        v-model="dialogBackground"
        :customBodyStyle="getFieldCustomBodyStyle"
        :backgroundImage="getBackgroundImage"
        :banner="getBanner"
        :isFullscreen="getIsFullscreen"
        @change="onSaveBackground"
      )

      ErtWifiPersonalizationDialogButton(
        v-model="dialogButton"
        :buttons="getButtons"
        :buttonStyles="getButtonStyles"
        :socialNetworks="getSocialNetworks"
        :isActiveSocialNetwork="isActiveSocialNetwork"
        @save="onSaveButtons"
      )

      //- Диалоговые окна статуса сохранения данных
      ErActivationModal(
        type="error"
        title="Произошла ошибка"
        v-model="isErrorSetData"
        :isShowActionButton="false"
        cancel-button-text="Закрыть"
      )
        template(v-slot:description)
          .caption Повторите попытку позднее

      ErActivationModal(
        title="Сохранение выполнилось успешно"
        type="success"
        :isShowCancelButton="false"
        actionButtonText="Спасибо"
        @confirm="isSuccessSetData = false"
        v-model="isSuccessSetData"
      )
      //- Плагин отключения услуги
      ErDisconnectProduct(
        v-model="isShowDisconnectProductPlugin"
        :deleteOrderData="getDisconnectData"
        isSendOrder
        @cancelOrder="() => { isShowDisconnectProductPlugin = false }"
        @errorOrder="() => { isShowDisconnectProductPlugin = false }"
        @successOrder="() => { isShowDisconnectProductPlugin = false }"
      )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
