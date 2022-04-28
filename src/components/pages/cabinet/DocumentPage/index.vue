<template lang="pug">
  .ert-document-page.main-content--top-menu-fix.main-content--top-padding
    ErPageHeader.main-content--content(
      linkText="Назад на главную"
      title="Документы"
      backlink="/lk/"
    )

    .ert-document-page__navigation.mb-32.main-content--content
      ErtDocumentNavigation(
        v-model="navigationActive"
        :items="listNavigation"
      )

    //- Фильтрация
    ///- Фильтрация отчётных документов
    template(v-if="navigationActive === 1")
      ErFilterContainer(
        :active="isVisibleReportContainer"
        :iconClick="() => { isVisibleReportContainer = true }"
        @click-outside="() => { isVisibleReportContainer = false }"
      )
        div(slot="selected-filters" @click="() => { isVisibleReportContainer = true }")
          span.er-filter-container__active-filter.mr-16 {{ reportPeriodFormat }}
          span.er-filter-container__active-filter {{ reportType.value }}
        .ert-document-page__filter-wrap
          .ert-document-page__filter-wrap__list.main-content.main-content--content
            ErContainer.full.container--no-padding
              ErRow(align-items-center)
                ErFlex.xs12.sm8.md5.lg4.r-offset-sm4.r-offset-md0
                  ErDatePicker(
                    v-model="datePickerModelReport"
                    :disabledDate="disabledDateCallback"
                  )
                ErFlex.xs12.sm8.md5.lg3.r-offset-sm6.r-offset-md0
                  ErtSelect(
                    label="Тип"
                    v-model="reportType"
                    :items="reportListType"
                    returnObject
                    item-value="id"
                    item-text="value"
                  )
                ErFlex.md1.lg3.d--flex.align-items-center
                  ErFilterClose(@click="() => { isVisibleReportContainer = false }")

    template(v-if="navigationActive === 2")
      ErFilterContainer(
        :active="isVisibleContractContainer"
        :iconClick="() => { isVisibleContractContainer = true }"
        @click-outside="() => { isVisibleContractContainer = false }"
      )
        div(slot="selected-filters" @click="() => { isVisibleContractContainer = true }")
          span.er-filter-container__active-filter.mr-16 {{ contractPeriodFormat }}
          span.er-filter-container__active-filter {{ contractType.value }}
        .ert-document-page__filter-wrap
          .ert-document-page__filter-wrap__list.main-content.main-content--content
            ErContainer.full.container--no-padding
              ErRow(align-items-center)
                ErFlex.xs12.sm8.md5.lg4.r-offset-sm4.r-offset-md0
                  ErDatePicker(
                    v-model="datePickerModelContract"
                    :disabledDate="disabledDateCallback"
                  )
                ErFlex.xs12.sm8.md5.lg3.r-offset-sm6.r-offset-md0
                  ErtSelect(
                    label="Тип"
                    v-model="contractType"
                    :items="contractListType"
                    returnObject
                    item-value="id"
                    item-text="value"
                  )
                ErFlex.md1.lg3.d--flex.align-items-center
                  ErFilterClose(@click="() => { isVisibleContractContainer = false }")

    template(v-if="navigationActive === 3")
      ErFilterContainer(
        :active="isVisibleActContainer"
        :iconClick="() => { isVisibleActContainer = true }"
        @click-outside="() => { isVisibleActContainer = false }"
      )
        div(slot="selected-filters" @click="() => { isVisibleActContainer = true }")
          span.er-filter-container__active-filter.mr-16 {{ actPeriodFormat }}
        .ert-document-page__filter-wrap
          .ert-document-page__filter-wrap__list.main-content.main-content--content
            ErContainer.full.container--no-padding
              ErRow(align-items-center)
                ErFlex.xs12.sm8.md5.lg4.r-offset-sm4.r-offset-md0
                  ErDatePicker(
                    v-model="datePickerModelAct"
                    :disabledDate="disabledDateCallback"
                  )
                ErFlex.xs12.sm8.md5.lg3.r-offset-sm6.r-offset-md0
                ErFlex.md1.lg3.d--flex.align-items-center
                  ErFilterClose(@click="() => { isVisibleActContainer = false }")

    .ert-document-page__documents.main-content--content.mb-32
      ErtWindow(
        v-model="navigationActive"
      )
        //- Документы за текущий месяц (отчётные/контрактные/акты-сверки)
        ErtWindowItem(key="Последние")
          .body-font.mb-32
            | Вы обязаны обновлять список пользователей каждый квартал во исполнение требований&nbsp;
            a.link--dashed.body-font.ert-user-list-item__dialog-link(href="http://base.garant.ru/12155536/" target="_blank" rel="noopener") Правил оказания услуг связи
          template(v-if="isLoadingDocuments")
            .ert-document-page--loading
              ErtProgressCircular(indeterminate width="2")
              .title Загружаем документы
          template(v-else)
            ErtDocumentItem(
              v-for="document in listLastDocument"
              :key="document.id"
              :document="document"
              :value="listSelectedDocument.includes(document.id)"
              @select="() => { onSelectDocumentItemHandler(document.id) }"
            )
            ErtUserListItem
        ErtWindowItem(key="Отчётные")
          template(v-if="isLoadingDocuments")
            .ert-document-page--loading
              ErtProgressCircular(indeterminate width="2")
              .title Загружаем документы
          template(v-else-if="listReportDocument.length === 0")
            .ert-document-page--not-found
              | За выбранный период документы не найдены
          template(v-else)
            ErtDocumentItem(
              v-for="document in listReportDocument"
              :key="document.id"
              :document="document"
              :value="listSelectedDocument.includes(document.id)"
              @select="() => { onSelectDocumentItemHandler(document.id) }"
            )
        ErtWindowItem(key="Контрактные")
          .body-font.mb-32
            | Вы обязаны обновлять список пользователей каждый квартал во исполнение требований&nbsp;
            a.link--dashed.body-font.ert-user-list-item__dialog-link(href="http://base.garant.ru/12155536/" target="_blank" rel="noopener") Правил оказания услуг связи
          template(v-if="isLoadingDocuments")
            .ert-document-page--loading
              ErtProgressCircular(indeterminate width="2")
              .title Загружаем документы
          template(v-else-if="listContractDocument.length === 0")
            .ert-document-page--not-found
              | За выбранный период документы не найдены
          template(v-else)
            ErtDocumentItem(
              v-for="document in listContractDocument"
              :key="document.id"
              :document="document"
              :value="listSelectedDocument.includes(document.id)"
              @select="() => { onSelectDocumentItemHandler(document.id) }"
            )
        ErtWindowItem(key="Акты сверки")
          template(v-if="isLoadingDocuments")
            .ert-document-page--loading
              ErtProgressCircular(indeterminate width="2")
              .title Загружаем документы
          template(v-else-if="listActReconciliation.length === 0")
            .ert-document-page--not-found
              | За выбранный период документы не найдены
          template(v-else)
            ErtDocumentItem(
              v-for="document in listActReconciliation"
              :key="document.id"
              :document="document"
              :value="listSelectedDocument.includes(document.id)"
              @select="() => { onSelectDocumentItemHandler(document.id) }"
            )

    .ert-document-page__actions.main-content--content
      .ert-document-page__action.mb-8.mb-sm-0.mr-sm-12
        ErButton(
          :disabled="listSelectedDocument.length === 0"
          @click="() => { isShowDialogSendEmail = true }"
        ) Отправить на E-mail
      .ert-document-page__action.ml-sm-12
        ErButton(
          :flat="true"
          @click="$router.push('/lk/support?form=order_a_document')"
        ) Заказать дубликат

    ErtActivationModal(
      v-model="isShowDialogSendEmail"
      confirmButtonText="Отправить"
      :isLoadingConfirmButton="isSendingRequest"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      title="Отправить на эл. почту"
      @confirm="onSendEmailHandler"
    )
      template(v-slot:message)
        | Выберите адрес эл. почты
      template(v-slot:description)
        ErtCombobox(
          v-model="email"
          :items="lazyListEmail"
          label="Эл. почта для чека"
          :search-input.sync="searchEmail"
          :rules="validateRulesEmail"
        )
          template(v-slot:no-data)
            ErtListItem
              ErtListItemContent
                ErtListItemTitle
                  | Нажмите <kbd>Enter</kbd> для добавления &laquo;{{ searchEmail }}&raquo;

    ErtActivationModal(
      v-model="isSendError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isSendError = false }"
    )
      template(v-slot:message)
        | При отправке документов на e-mail произошла ошибка! Повторите попытку позже

    ErtActivationModal(
      v-model="isSendSuccess"
      confirmButtonText="Закрыть"
      title="Отправка на эл. почту"
      type="success"
      @confirm="() => { isSendSuccess = false }"
    )
      template(v-slot:message)
        | Документы успешно отправлены на выбранный e-mail
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
