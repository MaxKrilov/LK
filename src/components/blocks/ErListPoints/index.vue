<template lang="pug">
  .list-point-component.mb-48.mb-md-56.mb-xl-48
    .list-point-component--mobile
      template(v-if="getIsLoadingListPoint")
        .list-point-component__point
          .list-point-component__content.preloader
            img(:src="require('@/assets/images/preloaders/2.svg')")
      template(v-else-if="list.length === 0")
        .list-point-component__point
          .list-point-component__content.not-found
            er-icon(name="no")
            | Не найдены точки
      template(v-else)
        er-dialog(fullscreen transition="dialog-bottom-transition" v-model="isOpenModal")
          template(v-slot:activator="{ on }")
            .list-point-component__point(v-on="on" v-if="list.length !== 0")
              .list-point-component__content
                .icon
                  er-icon(name="geolocation")
                .address
                  | {{ getActiveFulladdress  }}
                .point-status(v-if="showSuspendedStatus && currentIsSuspendedStatus")
                  | Приостановлено
                .toggle
                  er-icon(name="corner_down")
          .list-point-component__modal
            .list-point-component__head
              .title
                | Выберите точку подключения
              button(@click="closeModal")
                er-icon(name="close")
            .list-point-component__body
              .list-point-component__item(
                v-for="point in list"
                :key="point.bpi"
                @click="setActivePoint(point)"
              )
                .icon
                  er-icon(name="geolocation")
                .content
                  .address
                    | {{ point.fulladdress }}
                  .tariff
                    | Тариф:&nbsp;
                    span {{ point.offerName }}
                .point-status(v-if="showSuspendedStatus && isSuspendedStatus(point.status)")
                  | Приостановлено

    .list-point-component--desktop(:class="{ 'open': isOpen }")
      template(v-if="getIsLoadingListPoint")
        .list-point-component__item.preloader
          .content
            img(:src="require('@/assets/images/preloaders/2.svg')")
      template(v-else-if="list.length === 0")
        .list-point-component__item.not-found
          .content
            er-icon.mr-8(name="no")
            | Не найдены точки
      template(v-else)
        .list-point-component__item(
          v-for="point in list"
          :key="point.bpi"
          :class="{ 'active': value && point.bpi === value.bpi }"
          @click="setActivePoint(point)"
        )
          .content
            .icon.mr-4
              er-icon(name="geolocation")
            .d--flex.flex-column
              .address
                | {{ point.fulladdress }}
              .tariff
                | Тариф:&nbsp;
                span {{ point.offerName }}
            template(v-if="showSuspendedStatus && isSuspendedStatus(point.status)")
              .point-status Приостановлено

        .list-point-component__toggle
          .line
          button(@click="toggleList")
            er-icon(name="corner_down")
          .text
            | Все подключения ({{ countList }})
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
