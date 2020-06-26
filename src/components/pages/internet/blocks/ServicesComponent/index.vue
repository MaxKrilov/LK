<template lang="pug">
  .services-component
    .services-component__head.mb-16
      h2
        | Сервисы
      .count
        | Подключено {{ lengthIsOn }}
    .services-component__list.d--flex.flex-wrap
      router-link.services-component__service(v-for="service in listService", :key="list.name", :to="service.link")
        template(v-if="isLoadingCustomerProduct")
          PuSkeleton
        template(v-else)
          .services-component__item(:class="{ 'on': service.isOn }")
            .content
              .icon
                er-icon(:name="service.icon")
              .title
                | {{ service.name }}
              .status
                er-icon(name="ok")
                | Подключен
          .services-component__title
            | {{ service.name }}
          .services-component__status
            er-icon(name="ok")
            | Подключен
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
