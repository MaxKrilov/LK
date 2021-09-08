<template lang="pug">
  .wifi-index-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
    er-page-header(
      linkText="Назад на главную"
      title="WiFi зона"
      backlink="/lk"
    )
    .wifi-index-page__map.mb-32(
      v-if="!isErrorClient"
      :class="{ 'show': listAddressUnit.length > 0 }"
    )
      l-map(
        :zoom="mapZoom"
        :options="mapOptions"
        :center="mapCenter"
        style="height: 100%; z-index: 1"
      )
        l-tile-layer(
          :url="mapUrl"
          :attribution="mapAttribution"
        )
        l-marker(
          v-for="(addressUnit, index) in listAddressUnit"
          :lat-lng="latLng(addressUnit.latitude, addressUnit.longitude)"
          :icon="mapIcon"
          :ref="`popup__${index}`"
          :key="addressUnit.id"
          @popupopen="() => { openPopup(addressUnit.id) }"
        )
          l-popup(
            :options="mapPopupOptions"
          )
            .wifi-index-page__map-popup__head.mb-16
              button.left.mr-8(
                :disabled="index === 0"
                @click="() => { openPrevPopup(index) }"
              )
                er-icon(name="corner_down")
              span.order
                | {{ index + 1 }}
                span /{{ countListPoint }}
              button.right.ml-8(
                :disabled="index === listAddressUnit.length - 1"
                @click="() => { openNextPopup(index) }"
              )
                er-icon(name="corner_down")
            template(v-if="isStopped(getBPIByAddressUnit(addressUnit.id))")
              er-button.wifi-index-page__restore-button(color="yellow"  @click="$router.push('/lk/support?form=restoring_a_contract_or_service')") Восстановить
            template(v-else)
              .wifi-index-page__map-popup__title
                template(v-if="!issetCustomerProduct(getBPIByAddressUnit(addressUnit.id))")
                  PuSkeleton
                template(v-else)
                  | {{ institutionName(getBPIByAddressUnit(addressUnit.id)) }}
              .wifi-index-page__map-popup__address.mb-32
                | {{ addressUnit.formattedAddress }}
              .wifi-index-page__map-popup__services
                template(v-if="!issetCustomerProduct(getBPIByAddressUnit(addressUnit.id))")
                  PuSkeleton.mr-24(height="32px" width="32px")
                template(v-else)
                  button.mr-24(
                    :class="{ 'on': isOnContent(getBPIByAddressUnit(addressUnit.id)) }"
                  )
                    er-icon(name="filter")

                template(v-if="!issetCustomerProduct(getBPIByAddressUnit(addressUnit.id))")
                  PuSkeleton.mr-24(height="32px" width="32px")
                template(v-else)
                  button.mr-24(
                    :class="{ 'on': isOnAnalytic(getBPIByAddressUnit(addressUnit.id)) }"
                    @click="$router.push({ name: 'analytics-visitors', params: { bpi: getBPIByAddressUnit(addressUnit.id) } })"
                  )
                    er-icon(name="stat")

                template(v-if="!issetCustomerProduct(getBPIByAddressUnit(addressUnit.id))")
                  PuSkeleton.mr-24(height="32px" width="32px")
                template(v-else)
                  button.mr-8(
                    :class="{ 'on': isOnServiceAuth(getBPIByAddressUnit(addressUnit.id)) }"
                    @click="$router.push({ name: 'wifi-services-auth', params: { bpi: getBPIByAddressUnit(addressUnit.id) } })"
                  )
                    er-icon(name="settings")
                  .count.mr-24
                    | {{ countOfActiveAuthService(getBPIByAddressUnit(addressUnit.id)) }}
                    span /{{ countOfAuthService(getBPIByAddressUnit(addressUnit.id)) }}

                template(v-if="!issetCustomerProduct(getBPIByAddressUnit(addressUnit.id))")
                  PuSkeleton.mr-8(height="32px" width="32px")
                template(v-else)
                  button.mr-8(
                    :class="{ 'on': isOnPersonalisation(getBPIByAddressUnit(addressUnit.id)) }"
                    @click="$router.push({ name: 'wifi-personalization', params: { bpi: getBPIByAddressUnit(addressUnit.id) } })"
                  )
                    er-icon(name="page_constructor")
    .wifi-index-page__points
      er-card-products(
        v-for="point in listPoint"
        :key="point.bpi"
        :date="point.offer.name"
        :price="point.amount.value"
        :stopped="point.status === getStatusSuspended"
        @open="() => getCustomerProductById(point.bpi, point.marketId)"
      )
        template
          | {{ point.fulladdress }}
        template(slot="slider-content")
          template(v-if="point.status === getStatusSuspended")
            er-button.wifi-index-page__restore-button(color="yellow"  @click="$router.push('/lk/support?form=restoring_a_contract_or_service')") Восстановить
          template(v-else)
            template(v-if="point.bundle")
              er-bundle-info(
                :name="point.bundle.name"
                :id="point.bundle.id"
                :show-info="false"
              )

            .wifi-index-page__points__head.d--flex.mb-40
              .item.d--flex.mr-40
                .icon.mr-16
                  er-icon(name="wifi")
                .info
                  .caption.mb-8
                    | Тариф
                  .title
                    | {{ point.offer.name }}
              .item.d--flex.mr-40
                .icon.mr-16
                  er-icon(name="speedup")
                .info
                  .caption.mb-8
                    | Скорость
                  .title
                    template(v-if="issetCustomerProduct(point.bpi)")
                      | {{ getSpeed(point.bpi) }}&nbsp;
                      span Мбит/с
                    template(v-else)
                      PuSkeleton
              .item.d--flex.mr-40
                .icon.mr-16
                  er-icon(name="time")
                .info
                  .caption.mb-8
                    | Активен с
                  .title
                    template(v-if="issetCustomerProduct(point.bpi)")
                      | {{ actualStartDate(point.bpi) }}
                    template(v-else)
                      PuSkeleton
            services-component(
              :isOnAnalitic="isOnAnalytic(point.bpi)"
              :isOnContentFilter="isOnContent(point.bpi)"
              :isLoadingCustomerProduct="!issetCustomerProduct(point.bpi)"
              :isOnServiceAuth="isOnServiceAuth(point.bpi)"
              :isOnPersonalisation="isOnPersonalisation(point.bpi)"
              :bpi="point.bpi"
            )
            WifiDeviceComponent(:productId="point.bpi", :listOfDevices="DEVICES")
        template(slot="date-title")
          | Тариф

    .wifi-index-page__footer
      er-button(
        color="blue"
        @click="onClickPlug"
      ) Подключить
</template>

<script lang="ts" src="./script.ts"></script>
<style src="leaflet/dist/leaflet.css"></style>
<style lang="scss" src="./style.scss"></style>
