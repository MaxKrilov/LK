<template lang="pug">
  .ert-redirection-item
    .ert-redirection-item__content.main-content.main-content--h-padding
      .ert-redirection-item__from-phone
        | {{ fromPhone | formatPhone }}
      .ert-redirection-item__to-phone
        template(v-if="toPhone && isActiveRedirection")
          | {{ toPhone | formatPhone }}
        template(v-else)
          | В процессе {{ isDisconnectInProgress ? 'отключения' : isActivationInProgress ? 'подключения' : 'изменения' }}
      .ert-redirection-item__type-redirection
        | {{ (isActiveRedirection && type) || '' }}
      .ert-redirection-item__period
        span.days(v-if="isActiveRedirection") {{ period | formatPeriodDays }}
        span.hours(v-if="hoursFrom && hoursTo && isActiveRedirection")
          | {{ hoursFrom }}:
          span 00
          | &nbsp;-
          | {{ hoursTo }}:
          span 00
      .ert-redirection-item__actions
        button.mr-8(
          title="Удалить"
          @click="() => { getIsActive ? (isDeleteConfirm = true) : (isNotAccessChange = true) }"
        )
          ErtIcon(name="trashbox")
        //- button.ml-8(
        //-   title="Настройки"
        //-   @click="() => { getIsActive ? (isShowSettingsDialog = true) : (isNotAccessChange = true) }"
        //- )
        //-   ErtIcon(name="settings")
    //- Modals
    ErActivationModal(
      v-model="isNotAccessChange"
      type="info"
      title="Действия с этой переадресацией недоступны!"
      :isShowActionButton="false"
      cancelButtonText="Закрыть"
    )
      template(v-slot:description)
        | Для номера телефона {{ fromPhone | formatPhone }} выполняется заказ. Пожалуйста, попробуйте позже.
    ErActivationModal(
      v-model="isDeleteConfirm"
      actionButtonText="Отключить"
      :isLoadingConfirm="isDeleteRequest"
      :persistent="isDeleteRequest"
      title="Вы уверены, что хотите отключить переадресацию?"
      type="question"
      @confirm="onDeleteHandler"
    )
      template(v-slot:description)
        | Переадресация с номера <b>{{ fromPhone | formatPhone }}</b> на номер <b>{{ toPhone | formatPhone }}</b> будет отключена

    ErActivationModal(
      type="error"
      v-model="isRequestError"
      title="Возникла ошибка"
      :isShowActionButton="false"
      :persistent="true"
      cancelButtonText="Закрыть"
    )
      template(slot="description")
        div Уважаемый Клиент, в данный момент операция не доступна, обратитесь к персональному менеджеру

    ErtDialog(
      v-model="isShowSettingsDialog"
      maxWidth="603"
    )
      .ert-redirection-item-settings__content
        .ert-redirection-item-settings__head.mb-16
          .title
            | Переадресация
          .close
            button(@click="() => { isShowSettingsDialog = false }")
              ErtIcon(name="close" small)
        .ert-redirection-item-settings__body
          .phones.mb-24
            .from
              | {{ fromPhone | formatPhone }}
            .arrow.mr-4.ml-4
              ErtIcon(name="arrow_r_long")
            .to
              | {{ toPhone | formatPhone }}
          .type
            .title.mb-16 Признак переадресации
            .value.mb-16
              template(v-for="typeRedirection in listTypeRedirection")
                ErtCheckbox(
                  v-model="internalType"
                  :label="typeRedirection"
                  :value="typeRedirection"
                  hideDetails
                  @change="crossingValidate"
                )
          .period.mb-24
            .title.mb-16 Период переадресации
            .value
              .days.mr-sm-12
                .caption2.mb-16 Дни недели
                .days-value
                  ErtCheckbox(
                    v-for="day in getDaysOfWeek"
                    v-model="internalPeriod"
                    :key="day.value"
                    :label="day.name"
                    :value="day.value"
                    hideDetails
                    @change="crossingValidate"
                  )
                .error.error--text.caption2(v-if="isErrorSettingsDays")
                  | Необходимо выбрать хотя бы один день
              .time.ml-sm-12
                .caption2.mb-16 Период времени
                .time-value
                  .from.mr-12.mr-sm-8.mr-md-12
                    ErtTextField(
                      v-model="internalHoursFrom"
                      hideDetails
                      ref="time-from"
                      @blur="onBlurTimeFromHandler"
                    )
                  .to.ml-12.ml-sm-8.ml-md-12
                    ErtTextField(
                      v-model="internalHoursTo"
                      hideDetails
                      ref="time-to"
                      @blur="onBlurTimeToHandler"
                    )
                .error.error--text.caption2(v-if="isErrorSettingsTime")
                  | {{ errorSettingsTimeText }}
          .error--text.caption2(v-if="isErrorSettingsCrossing")
            | Имеется пересечение с одной из переадресаций
          .actions
            .action.mb-8.mb-sm-0.mr-sm-8
              ErButton(
                :loading="isUpdateRequest"
                @click="onUpdateHandler"
              ) Изменить
            .action.ml-sm-8
              ErButton(flat @click="onCloseSettingsDialogHandler") Отмена
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
