<template lang="pug">
  mixin dateNTime ()
    span.date {{ getModifiedWhen.format('DD.MM.YY') }}&nbsp;
    span.time {{ getModifiedWhen.format('HH:mm') }}
  mixin cornerDown ()
    a(@click.prevent="toggleDetail")
      er-icon(name="corner_down")
  .b-request__item
    .request-item-detail
      er-slide-up-down(:active="isOpenDetail")
        .request-item-detail__content--mobile
          .d--flex
            .request-item-detail__toggle
              +cornerDown()
            .request-item-detail__info
              .request-item-detail__row
                .request-item-detail__number
                  | №&nbsp;
                  span.number
                    | {{ ticketName | ticketName }}
                .request-item-detail__status(:class="getLabelStatus.id")
                  span {{ getLabelStatus.name }}
              .request-item-detail__row
                .request-item-detail__address
                  .request-item-detail__caption
                    | Адрес подключения
                  .request-item-detail__value
                    | {{ location }}
                .request-item-detail__updated
                  span.caption Обновлена:&nbsp;
                  +dateNTime()
              .request-item-detail__row(v-for="item in getDetailInfoMobile", :key="item.caption")
                .request-item-detail__detail(v-if="item.value")
                  .request-item-detail__caption
                    | {{ item.caption }}
                  .request-item-detail__value
                    | {{ item.value }}
              .request-item-detail__row(v-if="listFile.length !== 0")
                .request-item-detail__detail
                  .request-item-detail__caption
                    | Список файлов
                  ErTooltip(
                    v-for="(item, index) in listFile"
                    :key="index"
                  )
                    template(v-slot:activator="{ on }")
                      .request-item-detail__value.file-name(
                        v-on="on"
                      )
                        a(href="#" @click.prevent="() => {}") {{ item.file_name }}
                    | {{ item.file_name }}
          template(v-if="getLabelStatus.id === 'created'")
            .request-item-detail__note-closed
              er-icon(name="warning")
              span Заявку можно отменить только до  момента принятия её в работу
            .request-item-detail__action
              er-button(@click="openCancelDialog")
                | Отменить заявку
          template(v-else)
            er-dialog(fullscreen, v-model="isOpenHistory" transition="dialog-bottom-transition")
              template(v-slot:activator="{ on }")
                .request-item-detail__action
                  er-button(flat v-on="on")
                    | История заявки
              .request-item-detail__history--mobile
                .request-item-detail__head.d--flex.align-items-center.px-16
                  .title.mr-8
                    | История заявки&nbsp;
                  .number
                    | №&nbsp;{{ ticketName | ticketName }}
                  a.close(@click.prevent="toggleHistoryMobile")
                    er-icon(name="close")
                .request-item-detail__body
                  .request-item-detail__history-item(
                    v-for="historyItem in getHistoryArray"
                    :key="historyItem.id"
                  )
                    .head.d--flex.mb-8.align-items-center
                      .label(:class="historyItem.id")
                      .updated
                        | {{ $moment(historyItem.time).format('DD.MM.YYYY') }}&nbsp;&nbsp;{{ $moment(historyItem.time).format('HH:mm') }}
                    .body
                      .title.mb-8
                        | {{ historyItem.name }}
                      .description
                        | {{ historyItem.text }}
                      .icon
                        er-icon(name="arrow_l")
        .request-item-detail__content--desktop
          .d--flex
            .request-item-detail__info
              .request-item-detail__caption
                | Номер заявки&nbsp;
              .request-item-detail__value.ticket-id
                | {{ ticketName | ticketName }}
              template(v-for="item in getDetailInfoDesktop")
                template(v-if="item.value")
                  .request-item-detail__caption
                    | {{ item.caption }}
                  .request-item-detail__value
                    | {{ item.value }}
              template(v-if="listFile.length !== 0")
                .request-item-detail__caption
                  | Список файлов
                ErTooltip(
                  v-for="(item, index) in listFile"
                  :key="index"
                  right
                )
                  template(v-slot:activator="{ on }")
                    .request-item-detail__value.file-name(
                      v-on="on"
                    )
                      a(href="#") {{ item.file_name }}
                  | {{ item.file_name }}
            .request-item-detail__history
              .request-item-detail__history-row(v-for="historyItem in getHistoryArray", :key="historyItem.id")
                .request-item-detail__history-text
                  | {{ historyItem.text }}
                .request-item-detail__history-label(:class="historyItem.id")
                  span {{ historyItem.name }}
                  er-icon(name="arrow_l")
                .request-item-detail__history-date
                  span.date {{ $moment(historyItem.time).format('DD.MM.YY') }}&nbsp;
                  span.time {{ $moment(historyItem.time).format('HH:mm') }}
            .request-item-detail__toggle
              +cornerDown()
          template(v-if="getLabelStatus.id === 'created'")
            .request-item-detail__note-closed
              er-icon(name="warning")
              span Заявку можно отменить только до  момента принятия её в работу
            .request-item-detail__action
              er-button(@click="openCancelDialog")
                | Отменить заявку
    .request-item-component(v-if="!isOpenDetail" @dblclick="toggleDetail")
      .request-item-component__row.top.d--flex
        .request-item-component__toggle--mobile
          +cornerDown()
        .request-item-component__ticket-id
          | №&nbsp;
          span.number
            | {{ ticketName | ticketName }}
          span.ticket-type
            | {{ ticketType | localisationTicketType }}
        .request-item-component__address--desktop
          | {{ location }}
        .request-item-component__status(:class="getLabelStatus.id")
          span {{ getLabelStatus.name }}
          div.updated
            +dateNTime()
        .request-item-component__toggle--desktop
          +cornerDown()
      .request-item-component__row.bottom
        .request-item-component__address--mobile
          | {{ location }}
        .request-item-component__updated--mobile
          span.caption Обновлена:&nbsp;
          +dateNTime()
    er-dialog(v-model="isOpenCancel", max-width="544")
      .request-item-component__cancel-request-dialog
        .content
          .icon
            er-icon(name="question")
          .title
            | Вы действительно хотите отменить заявку?
          er-form.text-field(ref="cancel_form")
            er-textarea(v-model="reasonOfCancel" label="Укажите причину" is-show-label-required :rules="[v => !!v || 'Поле обязательно к заполнению']")
          er-row.actions.d--flex
            er-flex.action.xs12.sm6.px-16.order-sm2
              er-button(@click="cancelRequest" :loading="loadingCancel")
                | Отменить
            er-flex.action.xs12.sm6.px-16.order-sm1
              er-button(flat, @click="closeCancelDialog")
                | Не отменять
    er-activation-modal(
      type="success"
      v-model="isSuccessCancel"
      :title="`Заявка успешно отменена`"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Спасибо за обращение!
    er-activation-modal(
      type="error"
      v-model="resultDialogError"
      title="При запросе возникла ошибка"
      :is-show-action-button="false"
      cancel-button-text="Спасибо"
    )
      template(slot="description")
        | Попробуйте повторить попытку позже или обратитесь к Вашему персональному менеджеру
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss"></style>
