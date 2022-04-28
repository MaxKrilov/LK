<template lang="pug">
  .ert-document-item
    .ert-document-item__checkbox.mr-4.mr-lg-8
      ErtCheckbox(
        v-model="internalValue"
        hideDetails
      )
    .ert-document-item__info
      .ert-document-item__number.mb-4
        span {{ documentNumber }}
        span.status.ml-4(:class="statusClasses")
          template(v-if="isActSigned")
            //- Акт акцептован
            ErtIcon.mr-4(name="ok" small)
            span Акцептован
          template(v-else-if="isActCanceled")
            //- Отказ от акцептования
            ErtIcon.mr-4(name="cancel" small)
            span Не акцептован
          template(v-else-if="isContractSigned")
            //- Документ подписан
            ErtIcon.mr-4(name="ok" small)
            span Подписан
          template(v-else-if="isDocumentActive")
            //- Документ активный
            ErtIcon.mr-4(name="ok" small)
            span Активный
          template(v-else-if="isDocumentVerifying")
            //- Документ на проверке у менеджера
            ErtIcon(name="reload" small)
            span На проверке
          template(v-else-if="isDocumentCanceled")
            ErtIcon.mr-4(name="cancel" small)
            span Отменён
      .ert-document-item__description
        | {{ documentDescription }}
    .ert-document-item__actions.ml-auto
      button.ert-document-item__action(
        :disabled="isOpeningFile"
        @click="onOpenHandler"
      )
        ErtIcon(name="link_out" small)
        span {{ isOpeningFile ? 'Подождите' : 'Открыть' }}
      button.ert-document-item__action(
        v-if="isShowDownloadButton"
        :disabled="isDownloadingFile"
        @click="onDownloadHandler"
      )
        ErtIcon(name="download" small)
        span {{ isDownloadingFile ? 'Подождите' : 'Скачать' }}
      // Акт не акцептован или был отказ от акцептования
      template(v-if="isActNotSigned || isActCanceled")
        button.ert-document-item__action(
          @click="() => { onClickActStatusChange(1) }"
        )
          ErtIcon(name="doc_edit")
          span Акцептовать
        button.ert-document-item__action(
          @click="() => { onClickActStatusChange(0) }"
        )
          ErtIcon(name="cancel")
          span Отказаться
      // Документ можно подписать ЭЦП (signedWithDigitalSignature === 'Yes' && status === 'Готов для клиента')
      template(v-else-if="isContractReady && isDocumentSigned")
        button.ert-document-item__action(@click="getListCertificate")
          ErtIcon(name="doc_edit")
          span Подписать
        button.ert-document-item__action(@click="() => { isShowDialogCancel = true }")
          ErtIcon(name="cancel")
          span Отказаться
      // Документ может быть подписан вручную
      template(v-else-if="isContractReady && isDocumentNotSign")
        button.ert-document-item__action(@click="() => { isShowDialogManualSign = true }")
          ErtIcon(name="doc_edit")
          span Подписать
        button.ert-document-item__action(@click="() => { isShowDialogCancel = true }")
          ErtIcon(name="cancel")
          span Отказаться

    //- Модальные окна
    ///- Ошибка при загрузке файла
    ErtActivationModal(
      v-model="isDownloadedError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isDownloadedError = false }"
    )
      template(v-slot:message)
        | При загрузке документа произошла ошибка. Повторите попытку позже

    ///- Ошибка при открытии документа в отдельной вкладке (заблокировано браузером)
    ErtActivationModal(
      v-model="isOpenedError"
      cancelButtonText="Закрыть"
      confirmButtonText="Скачать"
      :isLoadingConfirmButton="isDownloadingFile"
      :isShowCancelButton="true"
      title="Произошла ошибка!"
      type="error"
      @confirm="onDownloadHandler"
    )
      template(v-slot:message)
        | Ваш браузер заблокировал возможность открытия окон. Пожалуйста, повторите попытку в другом браузере&nbsp;
        | или скачайте документ на Ваше устройство

    ///- Смена статуса акта
    ErtActivationModal(
      v-model="isShowDialogActStatusChange"
      cancelButtonText="Закрыть"
      :confirmButtonText="actStatusChangeInfo.button"
      :isLoadingConfirmButton="isActStatusChanging"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      :title="actStatusChangeInfo.title"
      type="question"
      @confirm="onChangeActStatusHandler"
    )
      template(v-slot:message)
        | {{ actStatusChangeInfo.description }}
      template(v-slot:description)
        .ert-document-item-dialog__comment(v-if="actStatusChangeInfo.status === 0")
          ErtForm(ref="act-cancel-form")
            ErtTextarea(
              v-model="actRejectReason"
              counter="900"
              :noResize="true"
              placeholder="Причина отказа (обязательное поле)"
              rows="3"
              :rules="actRejectReasonRules"
            )

    ErtActivationModal(
      v-model="isActStatusChangedError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isActStatusChangedError = false }"
    )
      template(v-slot:message)
        | При {{ actStatusChangeInfo.status === 0 ? 'отказе от акцептования' : 'акцептовании' }} акта произошла ошибка!&nbsp;
        | Повторите попытку позже.

    ErtActivationModal(
      v-model="isActStatusChangedSuccess"
      confirmButtonText="Закрыть"
      :title="actStatusChangeInfo.title"
      type="success"
      @confirm="() => { isActStatusChangedSuccess = false }"
    )
      template(v-slot:message)
        | {{ actStatusChangeInfo.status === 0 ? 'Отказ от акцептования' : 'Акцептование' }} акта произошёл успешно!

    //- Подписание ЭЦП
    ///- Выбор сертификата подписания
    ErtActivationModal(
      v-model="isShowDialogSelectCertificate"
      confirmButtonText="Подписать"
      :isLoadingConfirmButton="isDigitalSigningDocument"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      title="Выберите сертификат"
      @confirm="digitalSigningDocument"
    )
      template(v-slot:message)
        | Выберите сертификат для подписания документа
      template(v-slot:description)
        .ert-document-item-dialog__certificate-list
          button.ert-document-item-dialog__certificate-item(
            v-for="certificate in listCertificate"
            :key="certificate.thumbprint"
            :class="{ 'active': activeCertificate && certificate.thumbprint === activeCertificate.thumbprint }"
            @click="() => { activeCertificate = certificate }"
          )
            span {{ certificate.value }}
            ErtIcon(name="ok" small)

    ErtActivationModal(
      v-model="isErrorGotCertificate"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isErrorGotCertificate = false }"
    )
      template(v-slot:message)
        | Плагин КриптоПро недоступен или не установлен! Проверьте корректность установки плагина.&nbsp;
        a(href="https://www.cryptopro.ru/products/cades/plugin" rel="noopener" target="_blank") Подробнее

    ErtActivationModal(
      v-model="isDigitalSignedDocumentError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isDigitalSignedDocumentError = false }"
    )
      template(v-slot:message)
        | При подписании документа произошла ошибка! Повторите попытку позже

    ErtActivationModal(
      v-model="isDigitalSignedDocumentSuccess"
      confirmButtonText="Закрыть"
      title="Подписание документа"
      type="success"
      @confirm="() => { isDigitalSignedDocumentSuccess = false }"
    )
      template(v-slot:message)
        | Документ был успешно подписан

    //- Ручное подписание
    ErtActivationModal(
      v-model="isShowDialogManualSign"
      :confirmButtonText="manualSignConfirmButtonText"
      :isLoadingConfirmButton="isManualSignLoading"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      title="Подписать документ сканом"
      @confirm="onManualSignConfirm"
    )
      template(v-slot:message)
        .mb-32 Скачайте, подпишите и приложите скан с вашей подписью.
      template(v-slot:description)
        template(v-if="issetManualSignDocument")
          .ert-document-item-dialog__manual-file
            button.remove(@click="() => { manualSignFile = null }")
              ErtIcon(name="close" small)
            span {{ issetManualSignDocument ? manualSignFile.name : '' }}
        .caption2.text-color-black05
          | Допустимый формат файлов: .doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp Размер не должен превышать 2 МБ.
        .caption2.error--text(v-if="errorTextOfSelectManualSignDocument")
          | {{ errorTextOfSelectManualSignDocument }}

    ErtActivationModal(
      v-model="isManualSignError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isManualSignError = false }"
    )
      template(v-slot:message)
        | При отправке документа на проверку произошла ошибка! Повторите попытку позже

    ErtActivationModal(
      v-model="isManualSignSuccess"
      confirmButtonText="Закрыть"
      title="Подписание документа"
      type="success"
      @confirm="() => { isManualSignSuccess = false }"
    )
      template(v-slot:message)
        | Документ был успешно отправлен на проверку менеджеру

    //- Отказ от подписания документа
    ErtActivationModal(
      v-model="isShowDialogCancel"
      confirmButtonText="Отказаться"
      :isLoadingConfirmButton="isCancelingRequest"
      :isShowCancelButton="true"
      :isShowMessageBlockIcon="false"
      title="Отказаться от подписания"
      @confirm="onCancelRequestHandler"
    )
      template(v-slot:message)
        | Вы уверены, что хотите отказаться от подписания документа?

    ErtActivationModal(
      v-model="isCanceledError"
      confirmButtonText="Закрыть"
      title="Произошла ошибка!"
      type="error"
      @confirm="() => { isCanceledError = false }"
    )
      template(v-slot:message)
        | При отмене подписания документа произошла ошибка! Повторите попытку позже

    ErtActivationModal(
      v-model="isCanceledSuccess"
      confirmButtonText="Закрыть"
      title="Отказ от подписания"
      type="success"
      @confirm="() => { isCanceledSuccess = false }"
    )
      template(v-slot:message)
        | Отказ от подписания документов выполнен успешно!
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
