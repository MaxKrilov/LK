<template lang="pug">
  .er-stories(v-show="computedBannerList.length >= 1")
    // Слайдер
    .er-stories__head.mb-24
      h2.er-stories__head-title Для вас
      .er-stories__head-buttons
        button.er-stories__head-button.er-stories__head-button--prev.mr-8(
          :id="`${computedID}--prev`"
        )
          ErtIcon(name="corner_down" small)
        button.er-stories__head-button.er-stories__head-button--next.ml-8(
          :id="`${computedID}--next`"
        )
          ErtIcon(name="corner_down" small)
    .er-stories__content
      .swiper(ref="swiper")
        .swiper-wrapper
          template(v-for="(banner, idx) in computedBannerList")
            .er-story.swiper-slide(
              :style="{ backgroundImage: `url(${banner.images.preview})` }"
              @click="() => { openStoryDialog(idx + 1) }"
            )
              .mt-auto.mx-24.mb-24 {{ banner.bannerTitle }}
    .er-stories__pagination
    // Модальное окно
    ErtDialog(
      v-model="isOpenDialog"
      maxWidth="379"
      transition="dialog-bottom-transition"
      contentClass="er-stories-dialog"
    )
      .er-stories__dialog
        .er-stories__dialog-navigation-buttons
          button.er-stories__dialog-navigation-button--prev(
            @click="onPrevStoryHandler"
          )
            ErtIcon(name="corner_big")
          button.er-stories__dialog-navigation-button--next(
            @click="onNextStoryHandler"
          )
            ErtIcon(name="corner_big")
        .er-stories__dialog-content
          .er-stories__dialog-timer
            .er-stories__dialog-timer-line(
              :style="{ width: getTimerWidth }"
            )
          template(v-for="(banner, idx) in computedBannerList")
            .er-story-detail(
              v-show="activeSlideNumber === (idx + 1)"
              @mousedown="() => { isMouseDown = true }"
              @mouseup="() => { isMouseDown = false }"
              :style="{ backgroundImage: `url(${banner.images.full})` }"
            )
              .pa-32.d--flex
                h4.er-story-detail__title.mb-16.mt-auto(v-if="getStoryTitle(banner)")
                  | {{ getStoryTitle(banner) }}
                .er-story-detail__description.body-font
                  | {{ getStoryDescription(banner) }}
                .er-story-detail__button.mt-16(
                  v-if="banner.button.text"
                )
                  ErButton(
                    :color="banner.button.color"
                    @click="() => { onStoryButtonClickHandler(banner) }"
                  )
                    | {{ banner.button.text }}

    ErPlugProduct(
      v-model="isPlugProduct"
      :isSendManagerRequest="true"
      :requestData="getRequestDataForConnect"
    )
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
