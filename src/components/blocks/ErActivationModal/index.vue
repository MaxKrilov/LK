<template lang="pug">
  .er-activation-modal
    er-dialog(
      :max-width="getMaxWidth"
      v-model="internalValue"
      :persistent="persistent"
      :contentClass="contentClass"
    )
      template(v-slot:activator="{ on }")
        slot(name="activator" v-bind="{ on }")
      .er-activation-modal--modal
        .er-activation-modal__content.d--flex.flex-column.pa-16.pa-md-24
          .er-activation-modal__head.d--flex.justify-content-between.mb-16
            .icon(:class="[ type ]")
              er-icon(:name="getIconByType")
            .close
              button(
                @click="closeDialog"
                :data-ga-category="analyticCloseCategory"
                :data-ga-label="analyticCloseLabel"
              )
                er-icon(name="close")
          .er-activation-modal__title.mb-8
            | {{ title }}
          .er-activation-modal__description
            slot(name="description")
          .er-activation-modal__activation-form-services
            slot(name="activation")
          .er-activation-modal__offer.d--flex.align-items-center.mb-8(v-if="offerLink && !isNotThreeDays")
            er-toggle(
              view="radio-check"
              v-model="isAcceptOffer"
              :data-ga-category="analyticAcceptCategory"
              :data-ga-label="analyticAcceptLabel"
            )
            .text
              span
                | Вы должны принять
              | &nbsp;
              a(
                :href="offerLink"
                target="_blank"
                :data-ga-category="analyticOfferCategory"
                :data-ga-label="analyticOfferLabel"
              ) условия оферты
          .er-activation-modal__actions.d--flex.mt-auto.flex-column-reverse.flex-sm-row
            .er-activation-modal__action.pr-sm-8(v-if="isShowCancelButton")
              er-button(
                @click="closeDialog"
                flat
                :disabled="isLoadingConfirm"
                :data-ga-category="analyticCancelCategory"
                :data-ga-label="analyticCancelLabel"
              )
                | {{ cancelButtonText }}
            .er-activation-modal__action.mb-8.mb-sm-0.pl-sm-8(v-if="isShowActionButton")
              er-button(
                @click="confirmDialog"
                :loading="isLoadingConfirm"
                :disabled="isDisabledActionButton"
                :data-ga-category="analyticConfirmCategory"
                :data-ga-label="analyticConfirmLabel"
              )
                | {{ actionButtonText }}
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
