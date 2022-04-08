<template lang="pug">
  .ert-bottom-navigation
    .ert-bottom-navigation__tabs(
      :class="{ 'ert-bottom-navigation__tabs--showArrows': isShowPrevNextIcon }"
      ref="tabs-container"
    )
      button.ert-bottom-navigation-tabs__prev(
        :class="{ 'ert-bottom-navigation-tabs__prev--disabled': isStartScroll }"
        @click="onPrevClickHandler"
      )
        ErtIcon(name="corner_big")
      .ert-bottom-navigation-tabs(
        ref="tabs"
      )
        .ert-bottom-navigation-tabs__item.mr-4(
          v-for="(menuItem, idx) in listMenuItem"
          :key="idx"
          :class="{ 'ert-bottom-navigation-tabs__item--active': idx === menuItemModel }"
          @click="() => { onTabClickHandler(idx) }"
        )
          span
            span {{ menuItem }}
            ErtIcon.ml-4(name="corner_down" small)
      button.ert-bottom-navigation-tabs__next(
        :class="{ 'ert-bottom-navigation-tabs__next--disabled': isEndScroll }"
        @click="onNextClickHandler"
      )
        ErtIcon(name="corner_big")
    template(v-for="(_, index) in listMenuItem")
      component(
        :is="$ert.breakpoint.mdAndDown ? 'ErtDialog' : 'ErtMenu'"
        v-model="listFlag[index]"
        v-bind="isMobile ? dialogAttrs : menuAttrs"
      )
        .ert-bottom-navigation__menu-container
          .ert-bottom-navigation__menu-head
            .ert-bottom-navigation__menu-head__tabs(
              ref="mobile-tabs"
            )
              .ert-bottom-navigation__menu-head__prev(
                :class="{ 'ert-bottom-navigation__menu-head__prev--disabled': isStartScrollMobileHead }"
                @click="onPrevMobileHeadHandler"
              )
                ErtIcon(name="corner_big")
              .ert-bottom-navigation__menu-head-tabs(
                :style="styles"
              )
                .ert-bottom-navigation__menu-head__tabs-item(
                  v-for="(menuItem, idx) in listMenuItem"
                  :key="idx"
                  :class="{ 'ert-bottom-navigation__menu-head__tabs-item--active': idx === menuItemModel }"
                  @click="() => { onTabClickHandler(idx) }"
                )
                  span
                    span {{ menuItem }}
              .ert-bottom-navigation__menu-head__next(
                :class="{ 'ert-bottom-navigation__menu-head__next--disabled': isEndScrollMobileHead }"
                @click="onNextMobileHeadHandler"
              )
                ErtIcon(name="corner_big")
            button.ert-bottom-navigation__menu-head__close(@click="() => { onCloseDialogHandler() }")
              ErtIcon(name="close_big")
          .ert-bottom-navigation__menu-content.flex-column.flex-lg-row(:class="{ 'services': menuItemModel === 0 }")
            template(v-if="menuItemModel === 0")
              template(v-for="service in serviceList")
                .ert-bottom-navigation__menu__menu-item.service
                  router-link.ert-bottom-navigation__menu__menu-title(:to="service.path")
                    | {{ service.service }}
                  ul(v-if="service.children")
                    li.mb-16.mb-lg-8(
                      v-for="(serviceChildren, idx) in service.children"
                      :key="idx"
                    )
                      router-link(:to="serviceChildren.path")
                        | {{ serviceChildren.service }}
            template(v-if="menuItemModel === 1")
              .ert-bottom-navigation__menu__menu-item
                router-link.ert-bottom-navigation__menu__menu-title(to="/lk/payments") Баланс
                ul
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/payments/history") Все операции
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/payments/promise-payments") Обещанный платёж
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/support?form=erroneous_payment") Заявление об ошибке в платеже
              .ert-bottom-navigation__menu__menu-item
                .ert-bottom-navigation__menu__menu-title Пополнить баланс картой
                .ert-bottom-navigation__menu__payment
                  ErtTextField(
                    v-model="amountToPayment"
                    suffix="₽"
                    hideDetails
                    mask="money"
                    label="Рекомендуемая сумма"
                  )
                  ErButton(
                    @click="() => { $router.push(`/lk/payments/card-payment?total_amount=${amountToPayment}`) }"
                  ) Пополнить
            template(v-if="menuItemModel === 2")
              .ert-bottom-navigation__menu__menu-item
                router-link.ert-bottom-navigation__menu__menu-title(to="/lk/documents") Документы
                ul
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/documents?open=report-documents") Отчётные документы
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/documents?open=contract-documents") Контрактные документы
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/support?form=order_a_document") Заказать документ
            template(v-if="menuItemModel === 3")
              .ert-bottom-navigation__menu__menu-item
                router-link.ert-bottom-navigation__menu__menu-title(to="/lk/support") Поддержка
                ul
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/support") Заявки
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/support#support-instructions") Инструкции
              .ert-bottom-navigation__menu__menu-item
                .ert-bottom-navigation__menu__menu-title.mb-16 Персональный менеджер
                .ert-bottom-navigation__menu__manager-name.mb-8 {{ getManagerName }}
                .ert-bottom-navigation__menu__manager-phone.mb-8 {{ getManagerPhone }}
              .ert-bottom-navigation__menu__menu-item
                .ert-bottom-navigation__menu__menu-title.mb-16 Вам нужна помощь
                p.mb-16 Вы можете оставить заявку на обслуживание, сообщить о проблеме, оставить благодарность или выразить претензию.
                ErButton(
                  @click="() => { $router.push('/lk/support') }"
                  :style="{ width: '167px' }"
                ) Оставить заявку
            template(v-if="menuItemModel === 4")
              .ert-bottom-navigation__menu__menu-item
                router-link.ert-bottom-navigation__menu__menu-title(to="/lk/orders") Заказы
                ul
                  li.mb-16.mb-lg-8
                    router-link(to="/lk/orders") Все заказы
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
