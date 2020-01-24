<template lang="pug">
  .product-item-component
    .product-item-component__card
      .product-item-component__card__content
        .icon
          er-icon(:name="icon" :shadow="shadowIcon")
        .info
          .title
            | {{ title }}
            .toggle--desktop(@click="toggleDetail" :class="{ 'open': isOpen }")
              er-icon(name="corner_down")
              a {{ isOpen ? 'Свернуть' : 'Развернуть' }}
          .price
            .caption
              | Абонентская плата
            .price-group
              .value
                | {{ price | price }}
              .unit
                | &nbsp;₽/месяц
        .toggle--mobile(@click="toggleDetail" :class="{ 'open': isOpen }")
          er-icon(name="corner_down")
    er-slide-up-down(:active="isOpen")
      .product-item-component__card-detail
        .product-item-component__card-detail__item
          template(v-if="isLoading")
            .loading
              img(:src="require('@/assets/images/preloaders/2.svg')")
          template(v-else)
            template(v-for="service in subArray")
              .title-row
                .icon
                  er-icon(name="internet")
                .title
                  | {{ service.title }}
                .toggle--mobile
                  er-icon(name="corner_down")
              .detail-row
                .tariff
                  .caption
                    | Тариф
                  .name
                    a(href="#") {{ service.offerName }}
                .price
                  .caption
                    | Абонентская плата
                  .value
                    | {{ service.price | price }}
                  .unit
                    | ₽/месяц
</template>

<script lang="js" src="./script.js"></script>
<style lang="scss" src="./style.scss"></style>
