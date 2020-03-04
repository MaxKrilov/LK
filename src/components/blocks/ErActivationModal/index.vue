<template lang="pug">
  .er-activation-modal
    er-dialog(
      :max-width="getMaxWidth"
      v-model="internalValue"
    )
      template(v-slot:activator="{ on }")
        slot(name="activator" v-bind="{ on }")
      .er-activation-modal--modal
        .er-activation-modal__content.d--flex.flex-column.pa-16.pa-md-24
          .er-activation-modal__head.d--flex.justify-content-between.mb-16
            .icon(:class="[ type ]")
              er-icon(:name="getIconByType")
            .close
              button
                er-icon(name="close")
          .er-activation-modal__title.mb-8
            | {{ title }}
          .er-activation-modal__description
            slot(name="description")
          .er-activation-modal__actions.d--flex.mt-auto
            .er-activation-modal__actions--mobile.d--flex.justify-content-between.justify-content-sm-end
              .er-activation-modal__action.cancel(v-if="isShowCancelButton")
                button(@click="closeDialog")
                  | {{ cancelButtonText }}
              .er-activation-modal__action.confirm.ml-sm-32(v-if="isShowActionButton")
                button(@click="confirmDialog")
                  | {{ actionButtonText }}
            .er-activation-modal__actions--desktop
              .er-activation-modal__action--cancel
              .er-activation-modal__action--confirm
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
