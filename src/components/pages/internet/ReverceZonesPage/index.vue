<template lang="pug">
  .reverce-zones-page
    .reverce-zones-page__hint
    .reverce-zones-page__select-ip.main-content.main-content--h-padding
      .content
        template(v-if="isLoadingIP")
          PuSkeleton
        template(v-else)
          er-select(
            :items="listIP"
            v-model="currentIP"
          )
    .reverce-zones-page__list
      .reverce-zones-page__list__head.main-content.main-content--h-padding
        .ip-n-reverce-zone
          span.title IP адрес и обратная зона
        .ip
          span.title IP адрес
        .reverce-zone
          span.title Обратная зона
      .reverce-zones-page__list__body
        template(v-if="isLoadingReverceZone")
          include ./loading-block.pug
        template(v-else)
          reverce-zone-item-component(
            v-for="(item, index) in listReverceZone"
            :key="item"
            :ip="currentIP"
            :reverce-zone="item"
            :is-show-remove-button="listReverceZone.length > 1"
            @change="(newVal) => { listReverceZone[index] = newVal }"
            @delete="() => { deleteReverceZone(item) }"
          )
    .reverce-zones-page__add.main-content.main-content--h-padding
      er-slide-up-down(:active="isOpenAdding")
        er-form(ref="form")
          er-row.mb-md-40
            er-flex.mb-32.mb-md-0(xs12 md5)
              .reverce-zones-page__add-ip-select
                er-select(
                  :items="listIP"
                  v-model="model.ip"
                  placeholder="IP-адрес"
                  :rules="[v => !!v || 'Поле обязательно к заполнению']"
                )
            er-flex(xs12 md7)
              .reverce-zones-page__add-domain.mb-32.mb-md-0
                er-text-field(
                  v-model="model['domain']"
                  label="Домен"
                  :rules="fieldDomainRule['fieldDomain']"
                  :class="[showFieldDomainDisplay]"
                  @input="isFieldDomainTouched = true"
                )
                .er-messages(v-if="isFieldDomainError")
                  .er-messages__wrapper
                    .er-messages__message(v-if="isFieldDomainError" :style="styleErMessage")
                      | Недопустимый ввод
          .reverce-zones-page__actions.d--flex.flex-column.flex-sm-row
            .reverce-zones-page__action.mr-sm-16.mb-8.mb-sm-0
              er-button(
                @click="addReverceZone"
                :loading="isLoadingAddReverceZone"
                :disabled="!isFieldDomainValid"
              )
                | Добавить
            .reverce-zones-page__action
              er-button(flat @click="() => { isOpenAdding = false }" :disabled="isLoadingAddReverceZone")
                | Отмена
      er-slide-up-down(:active="!isOpenAdding")
        .reverce-zones-page__add-button
          er-button(color="blue" @click="() => { isOpenAdding = true }")
            | Добавить обратную зону
    ErActivationModal(
      type="error"
      v-model="isErrorOfAddingReverceZone"
      title="На данном IP уже добавлена обратная зона"
      :isShowCancelButton="false"
      actionButtonText="Закрыть"
      :persistent="true"
      @confirm="() => { isErrorOfAddingReverceZone = false }"
    )
      template(slot="description")
        | Произошла ошибка при добавлении обратной зоны.&nbsp;
        | Повторите попытку позже или обратитесь к Вашему персональному менеджеру
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
