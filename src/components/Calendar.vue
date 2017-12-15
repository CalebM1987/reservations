<template>

  <table id='calendar' class='table-responsive table-bordered table-hover col-md-6 col-sm-6'>
    <thead>
      <tr>
        <th class='room-num tbl-header'>Room #</th>
        <th v-for='(day, i) in activeRange' v-bind:class='isToday(day) ? "tbl-header today": "tbl-header"'>
          <span v-if='i == 0 ' class='glyphicon glyphicon-triangle-left left' @click='previousRange()' title="previous week"></span>
          {{ day.toString() | dateLabel }}
          <span v-if='i == 4' class='glyphicon glyphicon-triangle-right right' @click='nextRange()' title='next week'></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='room in rooms'>
        <td class='room-num tbl-header'>{{ room.number }}</td>
        <td v-for='i in 5' :id="room.room_id + '-' + (i - 1)"></td>
      </tr>
    </tbody>
  </table>

</template>

<script>
  import moment from '../lib/holidays';
  import Api from '../lib/Api';
  import {EventBus} from '../lib/EventBus';
  export default {
//    data: function(){
//      return {
//        activeRange: this.activeRange
//      }
//    },
    props: ['activeRange', 'rooms'],
    mounted: function(){
      console.log('mounted calendar: ', this);
      console.log('calendar parent: ', this.$parent);
      console.log(`activeRange is: ${this.activeRange}`);
      this.showReservations();

      // listen for add/update reservations
      EventBus.$on('reservation-change', this.showReservations);
    },
    methods: {
      dateRange: function(mom, days){
        if (!mom){
          mom = moment();
        }
        if (!days){
          days = 5;
        }
        var arr = [];
        for (var i=1; i <= days; ++i){
          arr.push(mom.clone().add(i, 'd'));
        }
        return arr;
      },
      isToday: function(day){
        return day.format().split("T")[0] == moment().format().split("T")[0];
      },

//      dateRange: this.$parent.dateRange,

      nextRange: function(){
        let range = this.dateRange(this.activeRange[this.activeRange.length-1], 5);
        EventBus.$emit('date-range-changed', range);
        return range;
      },

      previousRange: function(){
        let range = this.dateRange(this.activeRange[0].subtract(6, 'd'), 5);
        EventBus.$emit('date-range-changed', range);
        return range;
      },

      randomNumber: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      },

      randomColor: function(opacity){
        let nums = [
          this.randomNumber(75,175),
          this.randomNumber(75,175),
          this.randomNumber(75,175),
          opacity
        ];
        return `rgba(${nums.join(',')})`
      },

      setCalendarCells: function(din, dout, rooms, elm){
        if (typeof rooms === "string"){
          rooms = rooms.split(',');
        }

        // get date indices
        let date_indices = [];
        this.activeRange.forEach((mom, i) => {
          let m = moment(`${mom.format('YYYY-MM-DD')} 00:00:00`); // do not touch this!
          if (m.isSameOrAfter(din) && m.isSameOrBefore(dout)){
            console.log('set cells moment: ', m);
            date_indices.push(i);
          }
        });

        // match to all rooms
        rooms.forEach(room =>{
          date_indices.forEach(di => {
            // add elm to each day
            let selector = `td#${room}-${di}`;
            $(selector).append(elm.clone());
          });

        });

      },

      showReservations: function(from=this.activeRange[0], to=this.activeRange[this.activeRange.length-1]){
        // remove all existing reservations
        $('.reservation').empty();

        // fetch reservations in current date range
        Api.reservations_between(from, to, true).then(results =>{
          console.log('reservations in current range: ', this.activeRange[0].format('YYYY-MM-DD'), this.activeRange[4].format('YYYY-MM-DD'), results.data);

          // iterate through results and add to calendar
          results.data.forEach(res => {
            console.log('res: ', res)

            // get date in and out
            let din = new moment(res.date_in);
            let dout = new moment(res.date_out);
            let reservation = $('<div/>', {
              class: 'reservation',
              html: `<p>#${res.res_id}</p><p>${res.guest_info.name}</p><p>${res.guest_info.phone_number}</p>`,
              css: {
                'background-color': this.randomColor(0.5)
              }
            });

            this.setCalendarCells(din, dout, res.room_ids, reservation);

          });
        });

        // TODO: fill in maintenance records
      },

    },
    filters: {
      dateLabel: function(s){
        try{
          return s.split(' ').slice(0,3).join(' ');
        }catch(er){
          return s;
        }
      }

    },
    computed: {
      todayIndex: function () {
        var self = this;
        this.activeRange.forEach(function (day, i) {
          if (self.isToday(day)) {
            console.log(day, i)
            return i;
          }
          return -1;
        })
      }
    },

    watch: {
      activeRange: function(){
        this.showReservations();
      }
    }

  }

</script>

<style>
  .today{
    background-color: #B0C4DE;
  }
  .room-num{
    background-color: #BC8F8F;
  }
  .room-type-text{
    color: gray;
  }
  #room-select{
    margin-bottom: 15px;
  }
  #calendar{
    width: 100%;
  }
  @media screen only and (max-width: 760px){
    #calendar{
      margin: 20px;
    }
  }
  #calendar > thead > tr, #calendar > tbody > tr {
    height: 80px;
    text-align: center;
  }

  .tbl-header{
    font-size: 1.25em;
    font-weight: bold;
    text-align: center;
  }

  .reservation{
    /*background-color: orange;*/
    /*opacity: 0.5;*/
    z-index: 1000;
  }
</style>