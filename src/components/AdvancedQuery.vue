<template>
  <div>
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
</template>

<script>
  import Data from '../lib/Data';
  import Api from '../lib/Api';
  import { EventBus } from '../lib/EventBus';

  export default {
    data: function(){
      return {


      }
    }
  }
</script>

<style>

</style>