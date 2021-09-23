<template lang="pug">
  .e-commerce-digital-signing
    h3.e-commerce-digital-signing__title Подписать документы ЭЦП
    p.e-commerce-digital-signing__subtitle.mb--xl
      | В вашем браузере должен быть установлен и запущен плагин «КриптоПро». Если плагин не установлен, попробуйте подписать другими способами.
      a(
        href="https://www.cryptopro.ru/products/cades/plugin"
        target="_blank"
        rel="noopener"
      ) Инструкция «КриптоПро»
    .e-commerce-digital-signing__document.mb--m(
      v-for="(document, key) in (documents || {})"
      :key="key"
    )
      .e-commerce-digital-signing__document__title.mb--m
        h4 {{ document.type.name }} (Договор № {{ key }})
        a.download(
          :disabled="listViewerFlag[key]"
          @click.prevent="onDownloadDocumentHandler(document, key)"
        )
          ErtIcon(name="download_1")
          span {{ listViewerFlag[key] ? 'Подождите' : 'Скачать' }}
      .e-commerce-digital-signing__document__signatory.mb--m
        .e-commerce-digital-signing__signatory-name.info-block
          .e-commerce-digital-signing__signatory-name__caption.caption.mr--s Подписант
          .e-commerce-digital-signing__signatory-name__value.value
            | {{ `${document.contractSignee.firstName || ''} ${document.contractSignee.lastName || ''} ${document.contractSignee.secondName || ''}`.trim() }}
      .e-commerce-digital-signing__document__success(v-if="isSuccess[document.contractId] || document.contractStatus === 'Подписан'")
        ErtIcon(name="erth__check")
        span Документ успешно подписан, можно оплачивать
      .e-commerce-digital-signing__document__action(v-else)
        ErButton(
          @click="checkCertificate(document)"
        ) Подписать
      .e-commerce-digital-signing__document__error.caption1.error--text.mt--s(v-if="isError")
        | Произошла ошибка! Убедитесь, что плагин установлен корректно и/или имеются сертификаты для подписания
    ErtDialog(
      v-model="isOpenDialogOfListCertificate"
      maxWidth="586"
      contentClass="e-commerce-digital-signing__list-certificate-dialog"
    )
      .e-commerce-digital-signing__list-certificate-dialog-content.pt--l.px--m.pb--xl
        .e-commerce-digital-signing__list-certificate-dialog-head.mb--m
          h3 Выберите сертификат ЭЦП
          button(@click="() => { isOpenDialogOfListCertificate = false }" :disabled="isSigning")
            ErtIcon(name="erth__close")
        .e-commerce-digital-signing__list-certificate-dialog-body
          .description.mb--m
            | Вы можете выбрать доступный сертификат для подписи
          ul.list.mb--xl
            li.mb--xs(
              v-for="certificate in listCertificate"
              :key="certificate.value"
              :class="{ 'selected': certificate.value === selectedCertificate.value }"
              @click="selectCertificate(certificate)"
            )
              span.name {{ certificate.value }}
              span.selected
                ErtIcon(name="erth__check")
          .error--text.mb--s.caption1(v-if="isDialogError")
            | Произошла ошибка при подписании документа
          .actions
            .action.mb-8.mb-md-0.mr-md-24
              ErButton(@click="signDocument" :loading="isSigning") Подписать
            .action.mb-8.mb-md-0.mr-md-24
              ErButton(flat @click="() => { isOpenDialogOfListCertificate = false }" :disabled="isSigning") Закрыть
            .terms-of-use
              | Нажимая на кнопку, вы принимаете&nbsp;
              a(href="#") условия оплаты и безопасности
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
