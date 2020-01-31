<template lang="pug">
  div.support-page.main-content.main-content--padding.main-content--top-menu-fix
    er-page-header(title="Поддержка")
    .b-request
      .b-request__content
        er-row.b-request__head(align-items-center)
          er-flex(tag="h2" xs6 sm3) Заявки
          er-flex.filter--mobile(tag="a" xs6 sm3 order-sm2, @click="toggleFilterRequest")
            | {{ typeFilterRequest | filterTypeFilterRequest }}
          er-flex.filter--desktop(lg3 order-lg3)
            a.mr-56(
              :data-count="getCountActiveRequest"
              :class="{ 'active': isActiveFilterRequest(getTypeFilterRequestActive) }"
              @click="() => { setFilterRequest(getTypeFilterRequestActive) }"
              ) Активные
            a(
              :data-count="getCountRequest"
              :class="{ 'active': isActiveFilterRequest(getTypeFilterRequestAll) }"
              @click="() => { setFilterRequest(getTypeFilterRequestAll) }"
              ) Все
          er-flex(xs12 sm6 order-sm order-sm1)
            er-select(:items="getListNameCity", placeholder="Город", v-model="city")
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
                @cancel="() => { requestItem.cancelledWhen = requestItem.modifiedWhen = Number(new Date()) }"
              )
              .b-request__tbody--empty(v-if="listRequestComputed.length === 0")
                | У вас нет {{ isActiveFilterRequest(getTypeFilterRequestActive) ? 'активных' : '' }} заявок
          .b-request__pagination(v-if="listRequestComputed.length > getVisibleRequest")
              er-pagination(
                v-model="currentPage"
                :length="getLengthPagination"
                :total-visible="getTotalVisiblePagination"
              )
          .b-request__create
            create-request-component
    contact-info-component
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss"></style>
