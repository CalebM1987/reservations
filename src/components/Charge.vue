<template>
  <div class="modal fade" id="charge-modal" :class="'maintenance-modal-' + _uid" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span>
          </button>
          <h3 class="modal-title" ref="charge_title">Add New Charge</h3>
        </div>
        <div class="modal-body">


          <div class="input-group">
            <span class='input-group-addon'>Charge Description</span>
            <input class='form-control' type="text" v-model="charge.charge_description"></input>
          </div>
          <div class="input-group">
            <span class='input-group-addon'>Amount</span>
            <input type="number"
                   data-number-to-fixed="2"
                   class="form-control currency"
                   v-model="charge.amount"
            />
          </div>

          <div class="form-group top">
            <button class="btn btn-primary" data-dismiss="modal" @click="submitCharge">Confirm</button>
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
    // props: ['charge'],
    data: function(){
      return {
        charge: Object.assign({}, Data.charge_template),
      }
    },
    mounted: function(){
      console.log('mounted Charge: ', this);


    },
    methods: {
      submitCharge: function(){
        console.log('submitting charge: ', this.charge);
        Api.add_or_update_charge(this.charge).then(function(resp){
          if (!resp.data.hasOwnProperty('error')) {
            EventBus.$emit('charges-change');
            swal('Success', `Added Charge: ${resp.data.charge_description}`, 'success');
          } else {
            swal('Error', resp.data.message, 'error');
          }
        });
      }
    },

  }

</script>

<style>

</style>