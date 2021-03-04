<template lang="pug">
  div.support-page.main-content.main-content--padding.main-content--top-menu-fix
    er-page-header(title="Поддержка")
    .b-request
      .b-request__content
        .b-request__head.align-items-center.no-gutters-child
          h2 Заявки
          .filter--mobile(tag="a" @click="toggleFilterRequest")
            | {{ typeFilterRequest | filterTypeFilterRequest }}

          .filter--desktop
            a(
              :data-count="getCountActiveRequest"
              :class="{ 'active': isActiveFilterRequest(getTypeFilterRequestActive) }"
              @click="() => { setFilterRequest(getTypeFilterRequestActive) }"
              )
                span Активные
            a(
              :data-count="getCountRequest"
              :class="{ 'active': isActiveFilterRequest(getTypeFilterRequestAll) }"
              @click="() => { setFilterRequest(getTypeFilterRequestAll) }"
              )
                span Все
          er-select.select-city(:items="getListNameCity", placeholder="Город", v-model="city")

        .b-request__create
          create-request-component

        .b-request__body
          .b-request__thead
            .b-request__thead-item(
                v-for="(headTitle, i) in listHeadTitle"
                :key="i"
                :class="[headTitle.id, { 'sort': isSortField(headTitle.id), 'desc': isSortField(headTitle.id) && isDesc }]"
              )
              a(@click="() => { setSortField(headTitle.id) }")
                span.title {{ headTitle.name }}
                span.icon
                  er-icon(name="funnel")
          er-preloader(:active="loadingRequest" icon icon-type="2")
            .b-request__tbody
              request-item-component(
                v-for="requestItem in listRequestComputedByPagination"
                v-bind="requestItem"
                :key="requestItem.ticketId"
                @cancel="() => { cancellRequest(requestItem) }"
              )
              .b-request__tbody--empty(v-if="listRequestComputed.length === 0")
                | У вас нет {{ isActiveFilterRequest(getTypeFilterRequestActive) ? 'активных' : '' }} заявок
          .b-request__pagination(v-if="listRequestComputed.length > getVisibleRequest")
              er-pagination(
                v-model="currentPage"
                :length="getLengthPagination"
                :total-visible="getTotalVisiblePagination"
              )

    .director-feedback-block
      er-slide-up-down(:active="!isVisibleDirectorFeedback")
        er-button(
          flat
          @click="onShowDirectorFeedback"
        ) Написать директору

      director-feedback(v-model="isVisibleDirectorFeedback")

    contact-info-component
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss"></style>
