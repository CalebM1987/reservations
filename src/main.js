import $ from 'jquery'; // not necessary?
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
import {EventBus} from './lib/EventBus';
import Data from './lib/Data';

window.moment = moment;

// css
// require('style-loader!css-loader!./css/style.css');
//require("style-loader!css-loader!bootstrap/dist/css/bootstrap.css");
// import 'bootstrap/dist/css/bootstrap.css';
console.log('moment from holidays.js is: ', moment);
// test
function dateRange(mom, days){
  if (!mom){
    let d = new Date();
    mom = moment(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} 00:00:00`);
  }
  if (!days){
    days = 5;
  }
  var arr = [];
  for (var i=1; i <= days; ++i){
    arr.push(mom.clone().add(i, 'd'));
  }
  return arr;
}

Vue.component('calendar', Calendar);
Vue.component('reservation', Reservation);
Vue.component('admin', Admin);

function init(json){
  let vue = new Vue({
    el: '#app',
    render: h => h(App),
    data: json,
    mounted: function(){
      EventBus.$on('date-range-changed', ()=>{
        this.updateDateRange();
      });
      EventBus.$on('reservation-change', ()=>{
        // clear template
        this.current_reservation = Object.assign({}, Data.reservation_template);
      });
    },
    methods: {
      dateRange: dateRange,
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
    activeRange: dateRange(moment().subtract(2,'d'), 5),
    rooms: rooms,
    roomTypes: roomTypes,
    current_reservation: Object.assign({}, Data.reservation_template),
    isNewRes: true
  };

  // init vue instance
  init(json);
});
