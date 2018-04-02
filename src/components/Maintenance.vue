<template>
  <div class="modal fade" id="maintenance-modal" :class="'maintenance-modal-' + _uid" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span>
          </button>
          <h3 class="modal-title" ref="reservation_title">Schedule New Maintenance</h3>
        </div>
        <div class="modal-body">

          <div class="input-group dates">
            <span class='input-group-addon'>Date Start</span>
            <input class='form-control' type="text" title='choose check-in date' :id="'date_start_' + _uid" ref="date_start">
            <span class='input-group-addon'>Date End</span>
            <input class='form-control' type="text" title='choose check-out date' :id="'date_start_' + _uid" ref="date_end">
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Description</span>
            <textarea class='form-control' type="text" ref="guest_name" v-model="maintenance.maint_description"></textarea>
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Comments</span>
            <textarea class='form-control' type="text" v-model="maintenance.maint_comments"></textarea>
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Estimated Cost</span>
            <input type="number" value="1000" min="0" step="50"
                   data-number-to-fixed="2"
                   data-number-stepfactor="100"
                   class="form-control currency"
                   v-model="maintenance.estimated_cost"
            />
          </div>

          <div class="form-group top">
            <label for="room-select">Select Room(s)</label>
            <select multiple class="form-control" id="room-select" ref="room_select" v-model="room_selection">
              <option :id="'room-' + room.room_id" :value="room.room_id" :class="'room-' + _uid" v-for='room in rooms' :key="room.room_id">Room {{ room.number}} | {{room.description}}</option>
            </select>
            <button class="btn btn-primary" data-dismiss="modal" @click="submitMaintenance">Confirm</button>
            <button class="btn btn-danger" data-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Data from '../lib/Data';
  import Api from '../lib/Api';
  import { EventBus } from '../lib/EventBus';

  export default {
    props: ['rooms'],
    data: function(){
      return {
        maintenance: Object.assign({}, Data.maintenance_template),
        room_selection: []
      }
    },
    mounted: function(){
      console.log('mounted Maintenance: ', this);
      $(this.$refs.date_start).datepicker({
        autoclose: true,
        format: 'mm-dd-yyyy',
        startDate: '0d',
      }).on('changeDate', e =>{
        // auto close is not working :(
        this.maintenance.date_start = e.target.value;
        console.log('changed value to: ', e.target.value);

        // set start date on check out day to be after today
        $(this.$refs.date_end).datepicker('destroy').datepicker({
          autoclose: true,
          format: 'mm-dd-yyyy',
          startDate: moment(e.target.value, "MM-DD-YYYY").add(1, 'd').toDate(),
        }).on('changeDate', e =>{
          // auto cose is not working :(
          this.maintenance.date_end = e.target.value;

          // reset available rooms based on availability
          let date_start = this.$refs.date_start.value;
          let date_end = e.target.value;
          console.log('searching between: ', date_start, date_end);

          // query reservations in range
          $(`.room-${this._uid}`).removeClass('hidden');
          Api.reservations_between(date_start, date_end, false).then((reservations)=>{
            reservations.data.forEach((res)=>{
              res.room_ids.split(',').forEach((r)=>{
                $(`#room-${r}.room-${this._uid}`).addClass('hidden');
              })
            });
          });

          // make sure there are still rooms available at this time
          if ($(`.room-${this._uid}:not(.hidden)`).length === 0){
            swal('Error', 'All rooms are already reserved for the selected date range', 'error');
          }

          // hide datepicker
          $(e.target).datepicker('hide');
        });
        $(e.target).datepicker('hide');

      });
    },
    methods: {
      submitMaintenance: function(){
        console.log('submitting maintenance: ', this.maintenance);
        Api.add_or_update_maintenance(this.maintenance).then(function(resp){
          if (!resp.data.hasOwnProperty('error')) {
            EventBus.$emit('maintenance-changed');
            swal('Success', `Added Maintenance: ${resp.data.maint_description}`, 'success');
          } else {
            swal('Error', resp.data.message, 'error');
          }
        });
      }
    },

    watch: {
      room_selection: function(){
        this.maintenance.maint_room_ids = this.room_selection.join(',');
      }
    }
  }

</script>

<style>

</style>