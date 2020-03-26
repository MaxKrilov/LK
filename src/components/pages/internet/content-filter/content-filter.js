import PointComponent from './blocks/PointComponent'

export default {
  name: 'content-filter-page',
  components: {
    PointComponent
  },

  data () {
    return {
      pre: 'content-filter-page',
      isOpen: false,
      data: [
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          date: '17.08.2018',
          stopped: false,
          type: 'VOIP шлюз, Софтофон',
          status: 'configure'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          date: '17.08.2018',
          stopped: false,
          type: 'VOIP шлюз, Софтофон',
          status: 'cancel'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          date: '17.08.2018',
          status: 'cancel',
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          status: '',
          date: '17.08.2018',
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          date: '17.08.2018',
          status: '',
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          status: '',
          date: '17.08.2018',
          stopped: true,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          status: '',
          date: '17.08.2018',
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          addres: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100',
          status: '',
          date: '17.08.2018',
          stopped: true,
          type: 'VOIP шлюз, Софтофон'
        }
      ]
    }
  }
}
