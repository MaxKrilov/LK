<template lang="pug">
  include ./_list_form
  .create-request-component
    .create-request-component--mobile
      er-dialog(
        fullscreen
        transition="dialog-bottom-transition"
        v-model="isOpenForm"
      )
        template(v-slot:activator="{ on }")
          .create-request-component__button
            er-button(pre-icon="add" v-on="on")
              span
                | Создать заявку
        .create-request-component__dialog
          .create-request-component__head
            .title
              | Создать заявку
            .required
              | - Поля обязательные к заполнению
            .close
              button(@click="closeForm")
                er-icon(name="close")
          .create-request-component__body
            transition(name="fade-transition" mode="out-in")
              +listForm
    .create-request-component--desktop
      er-slide-up-down(:active="isOpenFormDesktop")
        .create-request-component__slide-up-down
          .create-request-component__head.d--flex.justify-content-between.align-items-center.mb-40
            .title
              | Создать заявку
            .required
              | - Поля обязательные к заполнению
          .create-request-component__body
            transition(name="fade-transition" mode="out-in")
              +listForm
      template(v-if="!isOpenFormDesktop")
        .create-request-component__button
          er-button(pre-icon="add", @click="openDesktopForm")
            span
              | Создать заявку
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"/>
