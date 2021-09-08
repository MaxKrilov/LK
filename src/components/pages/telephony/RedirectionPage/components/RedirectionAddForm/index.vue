<template lang="pug">
  .ert-redirection-add-form.main-content.main-content--h-padding
    .ert-redirection-add-form__inactive(v-if="!isOpenForm")
      ErButton(
        color="blue"
        @click="onOpenFormHandler"
      ) Добавить переадресацию
    .ert-redirection-add-form__active
      ErSlideUpDown(:active="isOpenForm")
        template(v-for="(model, idx) in listModel")
          ErtForm.ert-redirection-add-form__form.py-32(:ref="`add-form-${idx}`")
            .ert-redirection-add-form__from-phone.pr-sm-24.pr-md-32
              ErtAutocomplete(
                v-model="model.fromNumber"
                :items="getListPhone"
                itemText="phone"
                itemValue="id"
                label="С номера"
                returnObject
                :rules="rulesFromPhone"
                @blur="crossingValidate(model, idx)"
              )
            .ert-redirection-add-form__to-phone.pl-sm-24.pr-md-16.pl-md-16
              ErtTextField(
                v-model="model.toNumber"
                label="На номер"
                :ref="`to-phone-${idx}`"
                :rules="rulesToPhone"
              )
            .ert-redirection-add-form__type.pr-sm-24.pl-md-32.pr-md-0
              ErtAutocomplete(
                v-model="model.type"
                :items="getListTypeRedirection"
                label="Вид переадресации"
                :rules="rulesType"
                @blur="crossingValidate(model, idx)"
              )
            .ert-redirection-add-form__days-n-time.mb-32
              .ert-redirection-add-form__days.mr-sm-12
                .caption2
                  | День недели
                .value
                  ErtCheckbox(
                    v-for="day in getDaysOfWeek"
                    v-model="model.date"
                    :key="day.value"
                    :label="day.name"
                    :value="day.value"
                    hideDetails
                    @change="crossingValidate(model, idx)"
                  )
                .error.error--text.caption2(v-if="model.isErrorDate")
                  | Необходимо выбрать хотя бы один день
              .ert-redirection-add-form__time.ml-sm-12
                .caption2.mb-16
                  | Период времени
                .value
                  .from.mr-12.mr-sm-8.mr-md-12
                    ErtTextField(
                      v-model="model.timeFrom"
                      hideDetails
                      :ref="`time-from-${idx}`"
                      @input="onBlurTimeFromHandler(model, idx)"
                    )
                  .to.ml-12.ml-sm-8.ml-md-12
                    ErtTextField(
                      v-model="model.timeTo"
                      hideDetails
                      :ref="`time-to-${idx}`"
                      @input="onBlurTimeToHandler(model, idx)"
                    )
                .error.error--text.caption2(v-if="model.isErrorTime")
                  | {{ model.errorTimeText }}
            .ert-redirection-add-form__remove
              .ert-redirection-add-form__crossing.error--text.caption2.mb-8(v-if="model.isErrorCrossing")
                | Имеется пересечение с одной из переадресаций
              button(
                type="button"
                @click="onRemoveRedirectionItem(idx)"
              )
                ErtIcon.mr-8(name="trashbox")
                span Удалить
        .ert-redirection-add-form__add-redirection-button.mb-32
          ErButton(
            flat
            preIcon="circle_add"
            @click="onAddRedirectionHandler"
          ) Добавить переадресацию
        .ert-redirection-add-form__actions
          .action.mb-8.mb-sm-0.mr-sm-8
            ErButton(
              color="blue"
              :loading="isAddRequest"
              :disabled="!isActiveConnectButton"
              @click="onClickHandler"
            ) Подключить
          .action.ml-sm-8
            ErButton(flat @click="onCloseFormHandler" :disabled="isAddRequest") Отмена
    ErActivationModal(
      type="success"
      v-model="isAddSuccess"
      title="Заказ успешно создан"
      :isShowActionButton="false"
      cancelButtonText="Спасибо"
      :persistent="true"
    )
      template(slot="description")
        | Заказ создан успешно. Выполнение заказа может занять некоторое время.&nbsp;
        | Актуальный статус можно узнать в&nbsp;
        router-link(to="/lk/orders") разделе Заказы.

    ErActivationModal(
      type="error"
      v-model="isAddError"
      title="Возникла ошибка"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
    )
      template(slot="description")
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру

    ErActivationModal(
      v-model="isWarningDialog"
      type="info"
      title="Внимание!"
      actionButtonText="Подключить"
      :isShowActionButton="getListPhoneInProgressModification.length !== listModel.length"
      :isLoadingConfirm="isAddRequest"
      :persistent="isAddRequest"
      @confirm="onConnectRedirectionHandler"
    )
      template(v-slot:description)
        | {{ getListPhoneInProgressModification.length !== listModel.length ? 'Подключение будет выполнено частично. ' : '' }}Для номера (-ов) телефона <b>{{ formatListPhoneInProgressModification }}</b>&nbsp;
        | выполняется заказ. Пожалуйста, попробуйте позже.
</template>

<script lang="ts" src="./script.ts"></script>

<style lang="scss" src="./style.scss"></style>
