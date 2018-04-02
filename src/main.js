// import $ from 'jquery'; // not necessary?
// import 'bootstrap';
// require('bootstrap-webpack');
// require('bootstrap-datepicker');
import Vue from 'vue'
import App from './App.vue'
import moment from './lib/holidays';
import Api from './lib/Api';
import Calendar from './components/Calendar.vue';
import Reservation from './components/Reservation.vue';
import Admin from './components/Admin.vue';
import Tools from './components/Tools.vue';
import {EventBus} from './lib/EventBus';
import Data from './lib/Data';
import utils from './lib/utils';

window.moment = moment;

// css
// require('style-loader!css-loader!./css/style.css');
Vue.component('calendar', Calendar);
Vue.component('reservation', Reservation);
Vue.component('admin', Admin);
Vue.component('tools', Tools);

function init(json){
  let vue = new Vue({
    el: '#app',
    render: h => h(App),
    data: json,
    mounted: function(){
      // allow navigation from calendar button
      $('#date-navigator').datepicker({
        autoclose: true
      }).on('changeDate', (e)=>{
        console.log('changed navigator', this, e.date)
        this.updateDateRange(utils.dateRange(new moment(e.date).subtract(1, 'd'), 5));
        $(e.target).datepicker('hide');
      });

      EventBus.$on('date-range-changed', this.updateDateRange);
      EventBus.$on('reservation-change', ()=>{
        // clear template
        this.current_reservation = Object.assign({}, Data.reservation_template);
      });
    },
    methods: {
      updateDateRange: function(range){
        this.activeRange = range;
      },

      switchTab: function(e){
        console.log('switching tab on event: ', e)
        let tabs = ['home', 'admin', 'tools'];
        tabs.forEach(tab =>{
          console.log('checking tab: ', tab, e.target.id, `#${tab}`)
          if (e.target.getAttribute('href') === `#${tab}`){
            $(`#${tab}`).removeClass('hidden');
            console.log('active parent:', $('#' + e.target.id).parent())
            let parent = $('#' + e.target.id).parent();
            parent.addClass('active');
          } else {
            $(`#${tab}`).addClass('hidden');
            $('#' + e.target.id).parent().removeClass('active');
          }
        })
      }

    }
    // components: {
    //   calendar: Calendar,
    //   reservation: Reservation,
    // }

  });
  window.vue = vue;
  window.Api = Api;

}

let roomTypes = [];
Api.getRooms().then(function(resp){
  let rooms = resp.data;
  console.log('rooms is: ', rooms);
  // get room types
  rooms.forEach(function(room){
    if (roomTypes.indexOf(room.description) < 0){
      roomTypes.push(room.description);
    }
  });

  let json = {
    clickedNewRes: false,
    activeRange: utils.dateRange(moment().subtract(2,'d'), 5),
    rooms: rooms,
    roomTypes: roomTypes,
    current_reservation: Object.assign({}, Data.reservation_template),
    isNewRes: true
  };

  // init vue instance
  init(json);
});
