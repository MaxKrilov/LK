<template lang="pug">
  .ert-ecommerce-create-client-page.px-32.pt-64
    .ert-ecommerce-create-client-page__required-label.mb-16
      | &nbsp;- Обязательно к заполнению
    transition(name="component-fade" mode="out-in")
      .ert-ecommerce-create-client-page__inn(key="inn" v-if="isINNPage")
        ErtForm(ref="inn-form" @submit.prevent="onSubmitINN")
          ErtTextField(
            label="ИНН Организации"
            v-model="inn"
            :rules="getINNRules"
            autocomplete="off"
            :disabled="isLoadingINN"
            :errorMessages="errorMessages"
          )
            template(slot="append-outer")
              er-hint.ml-4
                | По указанному ИНН будет заполнена информация о вашей организации
          .inn-description(v-html="innDescription")
          .inn-submit.mb-32
            ErButton(
              type="submit"
              appendIcon="arrow_r"
              :loading="isLoadingINN"
              :disabled="isLoadingINN"
            ) Заполнить
      .ert-ecommerce-create-client-page__card.pb-64(key="card" v-else)
        ErRow.mb-16.mb-md-0
          ErFlex(xs12 xl6)
            ErRow(align-items-center)
              ErFlex(xs12 md10)
                ErtTextField(
                  label="ИНН Организации"
                  v-model="inn"
                  :rules="getINNRules"
                  autocomplete="off"
                  :disabled="isLoadingINN"
                  :errorMessages="errorMessages"
                  isShowRequiredLabel
                )
              ErFlex.ert-ecommerce-create-client-page__change-inn(xs12 md2)
                ErButton(
                  flat
                  @click="onSubmitINN"
                  :loading="isLoadingINN"
                  :disabled="isLoadingINN"
                ) Сменить ИНН
        ErtForm(ref="card-form" @submit.prevent="onSubmitCard")
          ErRow
            ErFlex(xs12 xl6)
              ErtTextField(
                label="Юридическое название"
                v-model="listClientData.companyName"
                :rules="[v => !!v || 'Поле обязательно к заполнению']"
                tabindex="1"
                key="companyName"
                :readonly="listReadonlyFlag.companyName"
                isShowRequiredLabel
                :disabled="isLoadingINN"
              )
          ErRow
            ErFlex(xs12 xl6)
              //- Сделано по той причине, что ErtAutocomplete не позволяет установить значение "программно"
              template(v-if="listReadonlyFlag.companyAddress")
                ErtTextField(
                  label="Юридический адрес"
                  v-model="listClientData.companyAddress"
                  tabindex="2"
                  key="companyAddress"
                  readonly
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
              template(v-else)
                ErtDadataSelect(
                  label="Юридический адрес"
                  v-model="listClientData.companyAddress"
                  :rules="[v => !!v || 'Поле обязательно к заполнению']"
                  tabindex="2"
                  key="companyAddress"
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
          ErRow
            template(v-if="isCorporation")
              ErFlex(xs12 xl6)
                ErtTextField(
                  label="КПП"
                  v-model="listClientData.registrationReasonCode"
                  :rules="[v => !!v || 'Поле обязательно к заполнению']"
                  tabindex="3"
                  key="RRC"
                  :readonly="listReadonlyFlag.registrationReasonCode"
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
            template(v-else)
              ErFlex(xs12 md4 xl2)
                ErtTextField(
                  label="Паспорт"
                  v-mask="'####-######'"
                  v-model="listClientData.passport"
                  :rules="[v => !!v || 'Поле обязательно к заполнению']"
                  tabindex="3"
                  key="passport"
                  :readonly="listReadonlyFlag.passport"
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
              ErFlex(xs12 md4 xl2)
                ErtTextField(
                  label="Дата выдачи"
                  v-mask="'##.##.####'"
                  v-model="listClientData.dateOfPassport"
                  :rules="[v => !!v || 'Поле обязательно к заполнению', v => isValidDate(v) || 'Некорректная дата']"
                  tabindex="4"
                  key="dateOfPassport"
                  :readonly="listReadonlyFlag.dateOfPassport"
                  ref="date-of-passport-input"
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
              ErFlex(xs12 md4 xl2)
                ErtTextField(
                  label="Код подразделения"
                  v-mask="'###-###'"
                  v-model="listClientData.departmentCodeOfPassport"
                  :rules="[v => !!v || 'Поле обязательно к заполнению']"
                  tabindex="5"
                  key="departmentCodeOfPassport"
                  :readonly="listReadonlyFlag.departmentCodeOfPassport"
                  ref="department-code-of-passport"
                  @blur="onBlurDepartmentCode"
                  isShowRequiredLabel
                  :disabled="isLoadingINN"
                )
          ErRow(v-if="!isCorporation")
            ErFlex(xs12 xl6)
              ErtSelect(
                label="Кем выдан"
                v-model="listClientData.passportIssuedBy"
                :items="listFMSUnit"
                :rules="[v => !!v || 'Поле обязательно к заполнению']"
                tabindex="6"
                key="passportIssuedBy"
                :readonly="listReadonlyFlag.passportIssuedBy"
                ref="passport-issued-by"
                item-text="value"
                isShowRequiredLabel
                :disabled="isLoadingINN"
              )
          ErRow(v-if="isUpdateError")
            ErFlex.error--text.caption2.d--flex.align-items-center(xs12 xl6)
              ErtIcon.mr-16(name="info")
              | Произошла ошибка при сохранении данных! Пожалуйста, повторите попытку позже
        ErActivationModal(
          type="error"
          v-model="isErrorAddress"
          title="Возникла ошибка"
          :isShowActionButton="false"
          :persistent="true"
          cancelButtonText="Закрыть"
        )
          template(v-slot:description)
            | Не удалось определить адрес - обратитесь, пожалуйста, к менеджеру
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
