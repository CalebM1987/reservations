<template>
  <div class="container full-width">
    <table class="table table-striped table-bordered">
      <thead>
      <tr>
        <th v-for="(field, index) in fields">{{ field | titleCase }}</th>
      </tr>
      </thead>
      <tbody>
      <!--<today-res-item v-for="res in reservations" :fields="fields" :res="res" :key="res.res_id"></today-res-item>-->
      <tr v-for="res in reservations"
          :id="'today-res-' + res.reservation_number"
          :class="(res.status === 'checked_in' ? 'checked-in': '') + (res.status === 'checked_out' ? 'checked-out': '')">
       <td v-for="(field, index) in fields" :key="res.reservation_number">
         {{ res[field] }}
         <span v-if="index === fields.length-1" class="pull-right res-controls">
           <span
                   :class="'glyphicon glyphicon-copy pull-left' + (res.status === 'checked_in' ? ' checked-in': '')"
                   title="check in"
                   ref="check_in"
                   @click="checkIn(res.reservation_number)">
          </span>

           <span
                   :class="'left glyphicon glyphicon-paste' + (res.status === 'checked_out' ? ' checked-out': '')"
                   title="check out"
                   ref="check_out"
                   @click="checkOut(res.reservation_number)">
          </span>

          <span
                  class="glyphicon glyphicon-exclamation-sign"
                  :disabled="res.status !== 'reserved'"
                  title="cancel reservation"
                  @click="cancelRes(res.reservation_number)">
          </span>

           <span
                   class="glyphicon glyphicon-print"
                   :disabled="res.status !== 'checked_out'"
                   title="Print Receipt"
                   data-toggle="modal"
                   data-target="#receipt-modal"
                   @click="showReceipt(res.reservation_number)">
          </span>


        </span>

       </td>
      </tr>
      </tbody>
    </table>

    <receipt v-if="active_reservation.hasOwnProperty('res_id')" :reservation="active_reservation"></receipt>

  </div>
</template>

<script>
  import Api from '../lib/Api';
  import utils from '../lib/utils';
  import swal from 'sweetalert';
  import TodayResItem from './TodayResItem.vue';
  import Receipt from './Receipt.vue';
  import { EventBus } from '../lib/EventBus';

  export default {
    props: ['fields'],
    data: function(){
      return {
        reservations: [],
        res_lookup: {},
        active_reservation: {},
        check_out_times: {}
      }
    },
    components: {
      todayResItem: TodayResItem,
      receipt: Receipt
    },
    beforeMount: function(){
      this.fetchReservations();
    },

    mounted: function(){
      console.log('Mounted TodaysReservations: ', this);
      console.log('active_reservation: ', this.active_reservation, this.active_reservation.hasOwnProperty('res_id'));
//      $('#receipt-modal').modal({show: false});
      EventBus.$on('reservation-change', ()=>{
        this.fetchReservations();
      })
    },

    methods: {
      fetchReservations: function(params={}){
        if (!params.hasOwnProperty('data')){
          params.date = moment().format('MM-DD-YYYY')
        }
        params.guests = true;
        console.log('params in TodaysReservations: ', params);
        Api.reservations(params).then((response)=>{
          console.log('response from TodaysReservations: ', response.data);
          this.createTableSchema(response.data);
        });
      },

      createTableSchema: function(reservations){
        this.reservations.length = 0;
        for (var key in this.res_lookup) {
          delete this.res_lookup[key];
        }
        reservations.forEach((res)=> {
          console.log('res for todays res: ', res);
          let resSchema = {
            reservation_number: res.res_id,
            date_in: res.date_in,
            date_out: res.date_out,
            guest_name: res.guest_info.name,
            status: res.status,
            guest_info: res.guest_info,
            res_id: res.res_id,
            num_rooms: res.num_rooms,
            charges: res.additional_charges
          };
          this.res_lookup[res.res_id] = resSchema;
          this.reservations.push(resSchema);
        })
      },

      checkIn: function(id){
        console.log('res id from checkIn: ', id);
        Api.update_reservation(id, {status: 'checked_in'}).then((resp)=>{
          if (!resp.data.hasOwnProperty('error')){
            this.res_lookup[id].status = 'checked_in';
            swal('Success', `Checked in reservation #${resp.data.res_id}`, 'success');
          } else {
            swal('Error', `Could not check in reservation: ${resp.data.message}`);
          }
        });
      },

      checkOut: function(id){
        let today = moment().format('MM-DD-YYYY');
        Api.update_reservation(id, {
          status: 'checked_out',
          date_out: today // make sure date out is today
        }).then((resp)=>{
          if (!resp.data.hasOwnProperty('error')){
//            this.res_lookup[id].status = 'checked_out';
            if (this.res_lookup[id] !== today){
              // if checkout has changed, emit reservation-change
              EventBus.$emit('reservation-change');
            }
            swal('Success', `Checked in reservation #${resp.data.res_id}`, 'success');
          } else {
            swal('Error', `Could not check in reservation: ${resp.data.message}`);
          }
        });
      },

      cancelRes: function(id){
        Api.delete_reservation(id).then((resp)=>{
          if (!resp.data.hasOwnProperty('error')){
            EventBus.$emit('reservation-change');
            swal('Success', `Checked in reservation #${resp.data.res_id}`, 'success');
          } else {
            swal('Error', `Could not check in reservation: ${resp.data.message}`);
          }
        });
      },

      showReceipt: function(res){

        this.active_reservation = this.res_lookup[res];

        console.log('showing receipt for res: ', this.active_reservation);
//        $('#receipt-modal').modal().modal('show');
//        $('#receipt-modal').modal('show');

      }


    },

    filters: {
      titleCase: utils.titleCase
    }
  }
</script>

<style>
  .not-validated {
    color: gray;
  }
  .validated {
    color: green !important;
  }

  .checked-in {
    color: green !important;
    font-weight: bold;
  }

  .checked-out {
    color: darkorange !important;
    font-weight: bold;
  }

  /*.checked-in {*/
    /*color: white;*/
    /*background-color: #5cb85c;*/
    /*transparency: 0.5%;*/
  /*}*/

  /*.checked-in > td > span > span {*/
    /*color: white;*/
  /*}*/

  /*.checked-out {*/
    /*background-color: #fbca70;*/
    /*transparency: 0.5%;*/
  /*}*/

  .full-width {
    width: 100%;
  }

  .res-controls > span {
    margin: 0px 5px 0px 5px;
    color: gray;
    font-size: 1.2em
  }

  .glyphicon-exclamation-sign {
    color: red !important;
  }

  span[disabled] {
    cursor: not-allowed;
  }
</style>