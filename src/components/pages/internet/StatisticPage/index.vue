<template lang="pug">
  .statistic-internet-page
    .statistic-internet-page__filter.d--flex.flex-column.flex-sm-row.mb-40.main-content.main-content--h-padding
      .period
        er-date-picker(
          v-model="period"
          placeholder="Период"
        )
    .statistic-internet-page__info.main-content.main-content--h-padding.mb-22
      .statistic-internet-page__tariff.mb-8
        .caption.mb-4 Тарифный план
        template(v-if="isLoading")
          PuSkeleton
        template(v-else)
          .value {{ getTloName }}
      .statistic-internet-page__traffic.d--flex
        .internet.mr-32
          .caption.mb-4 Интернет-трафик
          template(v-if="isLoading")
            PuSkeleton
          template(v-else)
            .value(v-html="getInternetTraffic")
        .multimedia
          .caption.mb-4 Мультимедиа (ММ)
          template(v-if="isLoading")
            PuSkeleton
          template(v-else)
            .value
              span 000.0
              | КБ.
    template(v-if="pagCurrentPage === 1 && listStatistic.length === 0")
      .main-content.main-content--h-padding.d--flex.justify-content-center.caption.mt-16.mb-16 За выбранный период статистика не найдена.
    template(v-else)
      .statistic-internet-page__table.mb-24
        .statistic-internet-page__head.main-content.main-content--h-padding.py-8
          .filter--ip
            template(v-if="isLoading")
              PuSkeleton
            template(v-else)
              input(placeholder="IP адрес")
          .filter--start
            template(v-if="isLoading")
              PuSkeleton
            template(v-else)
              er-table-filter(
                title="Начало сессии"
                @change-filter="e => { sortBy('start', e) }"
                :value="sortField === 'start'"
                :order="sortField === 'start' ? sortDirection : 'asc'"
                )
          .filter--end
            template(v-if="isLoading")
              PuSkeleton
            template(v-else)
              er-table-filter(
                title="Конец сессии"
                @change-filter="e => { sortBy('end', e) }"
                :value="sortField === 'end'"
                :order="sortField === 'end' ? sortDirection : 'asc'"
                )
          .filter--volume
            template(v-if="isLoading")
              PuSkeleton
            template(v-else)
              er-table-filter(
                title="Объём"
                @change-filter="e => { sortBy('bytes', e) }"
                :value="sortField === 'bytes'"
                :order="sortField === 'bytes' ? sortDirection : 'asc'"
                )
          .filter--type
            template(v-if="isLoading")
              PuSkeleton
            template(v-else)
              er-table-filter(
                title="Тип"
                @change-filter="e => { sortBy('type', e) }"
                :value="sortField === 'type'"
                :order="sortField === 'type' ? sortDirection : 'asc'"
                )
        .statistic-internet-page__body
          template(v-if="isLoading")
            include ./internet-statistic-component-loading.pug
          template(v-else-if="listStatistic.length === 0")
          template(v-else)
            internet-statistic-component(
              v-for="(item, index) in computedListStatistic"
              :key="index"
              v-bind="item"
            )
      .main-content.main-content--h-padding.d--flex.justify-content-center
        er-pagination(
          v-model="pagCurrentPage"
          :length="pagLength"
          :total-visible="pagLength"
          )
    .statistic-internet-page__files.main-content.main-content--h-padding
      h2 Список файлов
      .statistic-internet-page__list-file
        file-component(
          v-for="(document, index) in getListFileStatistic"
          :key="index"
          :document="document"
        )
    er-activation-modal(
      v-model="isShowDialogForFile"
      type="question"
      title="Вы желаете сформировать файл статистики?"
      action-button-text="Скачать"
      :persistent="true"
      :is-loading-confirm="isLoadingFile"
      @confirm="getFileStatistic"
    )
    er-activation-modal(
      v-model="isShowDialogForFileSuccess"
      type="success"
      title="Уважаемый Клиент, файл статистики будет сформирован в ближайшее время и сохранен в данном разделе"
      :is-show-action-button="false"
      cancel-button-text="Закрыть"
    )
</template>
<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
