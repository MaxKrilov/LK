<template lang="pug">
  .product-item-component
    .product-item-component__card(:class="{ open: isOpen }")
      .content.d--flex.pb-20
        .icon
          er-icon(:name="getTopIcon()")
        .info.d--flex.flex-column.mt-20.flex-sm-row.mt-md-20.align-items-md-center.mt-xl-24
          .title.mb-8
            | {{ title | vcName }}
            .toggle--desktop
              button(@click="toggleDetail")
                er-icon(name="corner_down")
                span {{ isOpen ? 'Свернуть' : 'Развернуть' }}
          .price.ml-sm-auto
            .caption.mb-4.mb-md-0
              | Абонентская плата
            .value
              span {{ price | price }}
              | &nbsp;₽/месяц
        .toggle--mobile.mt-16.ml-auto
          button(@click="toggleDetail")
            er-icon(name="corner_down")
    .product-item-component__detail
      er-slide-up-down(:active="isOpen")
        .content
          template(v-if="isLoading")
            .item.loading
              img(:src="require('@/assets/images/preloaders/2.svg')")
          template(v-else)
            .item.d--flex(v-for="(item, index) in getListDetail" :key="index")
              .icon.mr-8
                er-icon(:name="getSubIcon(item.title)")
              .info.d--flex.flex-column.flex-sm-row
                .d--flex.flex-column.flex-xl-row
                  .title.mb-16
                    | {{ item.title | vcName }}
                  .offer-name.ml-16.mb-16.ml-sm-0.mx-xl-auto
                    .caption
                      | Тариф
                    .value
                      a(href="#") {{ item.offerName }}
                .price.ml-sm-auto
                  .caption
                    | Абонентская плата
                  .value
                    span {{ item.price | price }}
                    | &nbsp;₽/месяц
</template>

<script lang="js" src="./script.js"></script>
<style lang="scss" src="./style.scss"></style>
