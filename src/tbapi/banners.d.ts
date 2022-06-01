export interface IBannerImage {
  preview: string
  full: string
}

export interface IBannerButtonPosition {
  top: number
  bottom: number
  middle: number
}

export interface IBannerButton {
  position: IBannerButtonPosition
  text: string
  color: string
  action: string
}

export interface IBanner {
  images: IBannerImage
  bannerTitle: string
  bannerUrl?: string
  button: IBannerButton | []
  storyBackground: string
  additionalFields: any
}

export interface IBannerList {
  all: IBanner[],
  client: IBanner[]
}
