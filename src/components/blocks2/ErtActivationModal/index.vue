<template lang="pug">
  ErtDialog(
    v-model="internalValue"
    contentClass="ert-activation-modal"
    :maxWidth="computedMaxWidth"
    v-bind="$attrs"
  )
    template(v-slot:activator="{ on, attrs }")
      slot(name="activator" v-bind="{ on, attrs }")
    .ert-activation-modal__content
      .ert-activation-modal__head
        .ert-activation-modal__title
          | {{ title }}
        button.ert-activation-modal__close(@click="onCloseHandler")
          ErtIcon(name="close" small)
      .ert-activation-modal__body
        .ert-activation-modal__body-content
          .ert-activation-modal__message-block(
            v-if="isShowMessageBlock"
            :class="[ type ]"
          )
            .icon(v-if="isShowMessageBlockIcon")
              ErtIcon(:name="computedIcon")
            .message
              slot(name="message")
          slot(name="description")
      .ert-activation-modal__footer
        .ert-document-item-dialog__action
          ErButton(
            :loading="isLoadingConfirmButton"
            @click="onClickConfirmHandler"
          )
            | {{ confirmButtonText }}
        .ert-document-item-dialog__action(v-if="isShowCancelButton")
          ErButton(
            :flat="true"
            @click="onCancelHandler"
          )
            | {{ cancelButtonText }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
