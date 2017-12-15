<template>
  <div class="modal fade" id="reservation" :class="'reservation-modal-' + _uid" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span>
          </button>
          <h3 class="modal-title" ref="reservation_title">New Reservation</h3>
        </div>
        <div class="modal-body">

          <div class="input-group dates">
            <span class='input-group-addon'>Check In</span>
            <input class='form-control' type="text" title='choose check-in date' :id="'check_in_' + _uid" ref="check_in">
            <span class='input-group-addon'>Check Out</span>
            <input class='form-control' type="text" title='choose check-out date' :id="'check_out_' + _uid" ref="check_out">
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Name</span>
            <input class='form-control' type="text" ref="guest_name" v-model="reservation.name">
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Address</span>
            <input class='form-control' type="text" v-model="reservation.address">
          </div>
          <div class="input-group">
            <span class='input-group-addon'>City</span>
            <input class='form-control' type="text" ref="city" v-model="city">

            <span class='input-group-addon'>State</span>
            <input class='form-control' type="text" ref="state" v-model="stateLabel">

            <span class='input-group-addon'>Zip</span>
            <input class='form-control' type="text" ref="zip" v-model="zip">
          </div>

          <div class="input-group">
            <span class='input-group-addon'>Phone Number</span>
            <input class='form-control' type='tel' ref="phoneNumber" v-on:keydown="formatPhoneNumber">
            
            <span class="input-group-addon">Email</span>
            <input type="email" class="form-control" v-model="reservation.email">
          </div>

          <div class="input-group">
            <span class='input-group-addon'>Comments</span>
            <textarea class='form-control' v-model="reservation.comments"></textarea>

          </div>

          <div class="form-group top">
            <label for="room-select">Select Room(s)</label>
            <select multiple class="form-control" id="room-select" ref="room_select" v-model="room_selection">
              <option :id="'room-' + room.room_id" :value="room.room_id" :class="'room-' + _uid" v-for='room in rooms' :key="room.room_id">Room {{ room.number}} | {{room.description}}</option>
            </select>
            <button class="btn btn-primary" @click="submitReservation">Confirm</button>
            <button class="btn btn-danger" data-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { EventBus } from "../lib/EventBus";
  import Api from "../lib/Api";
  import Data from '../lib/Data';
  import moment from 'moment';
  console.log('jquery is: ', $);


  export default {
    props: ['rooms', 'reservation', 'isNew'],
    data: function(){
      return {
        city: '',
        state: '',
        stateLabel: null,
        zip: null,
        input_phone_number: null,
        room_selection: [],
        check_in: null,
        check_out: null,
        stateMap: {},
        stateLookup: {},
      }
    },
    mounted: function(){
      $(this.$refs.check_in).datepicker({
        autoclose: true,
        format: 'mm-dd-yyyy',
        startDate: '0d',
      }).on('changeDate', e =>{
            // auto close is not working :(
            this.reservation.date_in = e.target.value;
            console.log('changed value to: ', e.target.value);

            // set start date on check out day to be after today
            $(this.$refs.check_out).datepicker('destroy').datepicker({
              autoclose: true,
              format: 'mm-dd-yyyy',
              startDate: moment(e.target.value, "MM-DD-YYYY").add(1, 'd').toDate(),
            }).on('changeDate', e =>{
              // auto cose is not working :(
              this.reservation.date_out = e.target.value;

              // reset available rooms based on availability
              let check_in = this.$refs.check_in.value;
              let check_out = e.target.value;
              console.log('searching between: ', check_in, check_out);

              // query reservations in range
              $(`.room-${this._uid}`).removeClass('hidden');
              Api.reservations_between(check_in, check_out, false).then((reservations)=>{
                reservations.data.forEach((res)=>{
                  res.room_ids.split(',').forEach((r)=>{
                    $(`#room-${r}.room-${this._uid}`).addClass('hidden');
                  })
                });
              });

              // hide datepicker
              $(e.target).datepicker('hide');
            });
            $(e.target).datepicker('hide');

          });

      // typeheads for autocomplete
      // pre fetch state data with 2 way key lookups
      let states = [];
      Data.states.forEach((state)=>{
        this.stateMap[state.name] = state;
        this.stateLookup[state.code] = state;
        states.push(state.name);
      });

      // state drop down typehead
      $(this.$refs.state).typeahead({
        source: (query, process)=> {
          process(states);
        },
        updater: (item)=> {
          this.state = this.stateMap[item].code;
          this.stateLabel = item;
          return item;
        },
        matcher: function (item) {
          if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
            return true;
          }
        },
        sorter: function (items) {
          return items.sort();
        },
        highlighter: function (item) {
          let regex = new RegExp( '(' + this.query + ')', 'gi' );
          return item.replace( regex, "<strong>$1</strong>" );
        }
      });

      this.setGuestsTypeahead();

      // also reset guests typeahead when new reservations are added
      EventBus.$on('reservation-change', ()=>{
        $(`.reservation-modal-${this._uid}`).modal('hide');
        this.resetForm();
      });

      console.log('mounted reservation: ', this);
      console.log('current res: ', this.reservation);
    },

    methods: {
      submitReservation: function(){
        // let str = this.$refs.phoneNumber.value;
        Api.add_or_update_reservation(this.reservation).then(results =>{
          console.log('submitReservation Response: ', results.data);
          EventBus.$emit('reservation-change');
        });
      },
      formatPhoneNumber: function(e) {
        const key = e.key;
        if (key === "Backspace" || key === "Delete") {
          this.reservation.phone_number = this.$refs.phoneNumber.value;
          return;
        }
        let str = this.$refs.phoneNumber.value.replace(/[^\w\s]/gi, '');
        if (str.length === 3) {
          let ind = str.substring(0, 3);
          this.$refs.phoneNumber.value = '('+ind+')';
        }
        if (str.length === 6) {
          let ind = `(${str.substring(0,3)})${str.substring(3,6)}-`;
          this.$refs.phoneNumber.value = ind;
        }
        this.reservation.phone_number = this.$refs.phoneNumber.value;
      },

      formatCSZ: function(){
        if (this.city){
          return this.city + ', ' + [this.state, this.zip].join(' ');
        } else {
          return [this.city, this.state, this.zip].join(' ');
        }
      },

      parseAddressSuffix: function(s){
        let pattern = /\s*?([a-zA-Z]+\s*[a-zA-Z]{3,20})\s?,?\s?([a-zA-Z]{2})?\s?(\d{5}?)?/;
        let matches = s.match(pattern);
        return {
          city: matches[1],
          state:  matches[2],
          zip: matches[3]
        }
      },

      resetForm: function(){
//        this.reservation = Object.assign({}, Data.reservation_template);
        $(this.$refs.guest_name).typeahead('destroy');
        this.setGuestsTypeahead();

        // clear static fields
        this.$refs.phoneNumber.value = '';
        this.$refs.check_in.value = '';
        this.$refs.check_out.value = '';
        this.address = null;
        this.city = null;
        this.stateLabel = null;
        this.zip = null;
        this.room_selection.length = 0;
      },

      setGuestsTypeahead: function(){
        // guest auto complete
        let guestMap = {};
        Api.guests().then((guests)=>{
          console.log('guests response: ', guests);
          $(this.$refs.guest_name).typeahead({
            source: function (query, process) {
              let autoComplete = [];
              guests.data.forEach(function(guest){
                autoComplete.push(guest.name);
                guestMap[guest.name] = guest;
              });

              process(autoComplete);
            },
            updater: (item) =>{
              // fill in other guest info
              let guest = guestMap[item];
              console.log('guest from auto complete: ', guest);
              this.reservation.name = item;
              this.$refs.phoneNumber.value = guest.phone_number;
              this.reservation.phone_number = guest.phone_number;
              this.reservation.email = guest.email;
              this.reservation.address = guest.address;
              let csz = this.parseAddressSuffix(guest.csz);
              this.city = csz.city;
              this.state = csz.state;
              this.stateLabel = this.stateLookup[csz.state].name;
              this.zip = csz.zip;
              //this.reservation.comments = guest.guest_comments;
              return item;
            },
            matcher: function (item) {
              if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
                return true;
              }
            },
            sorter: function(items) {
              return items.sort();
            },
            highlighter: function (item) {
              let regex = new RegExp( '(' + this.query + ')', 'gi' );
              return item.replace( regex, "<strong>$1</strong>" );
            }
          });
        });
      }
    },

    computed: {
      cityStZip(){
        return this.formatCSZ();
      }
    },

    watch: {
      cityStZip(){
        // set reservation csz
        this.reservation.csz = this.formatCSZ();
      },

      room_selection: function(){
        this.reservation.room_ids = this.room_selection.join(',');
      }
    },

    filters: {
      phoneNumber: this.formatPhoneNumber,
    }
  }

</script>

<style>

</style>