<template>
  <div class="panel-group">

    <!-- Edit Rooms -->
    <editable-panel :panel_title="'Edit Rooms'"
                    :items="editable_rooms"
                    :fields="room_fields"
                    :item_key="'room_id'"
                    @on-add="addRoom"
                    @on-submit-changes="pushRoomEdits">

    </editable-panel>


    <!-- Maintenance -->
    <editable-panel :panel_title="'Schedule Maintenance'"
                    :items="maintenance"
                    :fields="maint_fields"
                    :item_key="'maint_id'"
                    :action_btn_class="'glyphicon glyphicon-list edit-btn'"
                    :action_btn_help="'update room selection'"
                    @on-add="addMaintenance"
                    @on-submit-changes="pushMaintenanceEdits"
                    @on-action="updateRoomSelection"
    ></editable-panel>

    <!-- Additional Charges -->
    <editable-panel :panel_title="'Additional Charges'"
                    :items="charges"
                    :fields="charge_fields"
                    :item_key="'charge_id'"
                    :action_btn_help="'update charge selection'"
                    @on-add="addCharge"
                    @on-submit-changes="pushChargeEdits">
                    <!--@on-action="updateChargeslection"-->
    </editable-panel>

    <!-- Promos -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#promo-collapse">Promo Codes / Block Rates</a>
          </h4>
        </div>
        <div id="promo-collapse" class="panel-collapse collapse">
          <div class="panel-body">Panel Body</div>
          <div class="panel-footer">Panel Footer</div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#search-collapse">Search Reservations</a>
          </h4>
        </div>
        <div id="search-collapse" class="panel-collapse collapse">
          <div class="panel-body">Panel Body</div>
          <div class="panel-footer">Panel Footer</div>
        </div>
      </div>
    </div>

    <!-- Security/Admins -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#admins-collapse">Admins</a>
          </h4>
        </div>
        <div id="admins-collapse" class="panel-collapse collapse">
          <div class="panel-body">Panel Body</div>
          <div class="panel-footer">Panel Footer</div>
        </div>
      </div>
    </div>
    <maintenance :rooms="rooms"></maintenance>
    <charge></charge>
  </div>

</template>

<script>
  import EditableTable from './EditableTable.vue';
  import EditablePanel from './EditablePanel.vue';
  import Maintenance from './Maintenance.vue';
  import Charge from './Charge.vue'
  import { EventBus } from '../lib/EventBus';
  import Api from '../lib/Api';
  import swal from 'sweetalert';

  export default {
    data: function(){
      return {
//        rooms: this.$parent.rooms, //do I need this?
        room_fields: ['number', 'description', 'rate'],
        editable_rooms: this.rooms.slice(0),
        maint_fields: ['date_start', 'date_end', 'maint_description', 'maint_comments'],
        charge_fields: ['charge_description', 'amount'],
        maintenance: [],
        charges: [],
        block_rates: []
      }
    },
    components: {
      editableTable: EditableTable,
      editablePanel: EditablePanel,
      maintenance: Maintenance,
      charge: Charge
    },
    props: ['rooms'],
    beforeMount: function(){
//      Array.prototype.push.apply(this.editable_rooms, this.rooms);
      console.log('editable rooms from Admin: ', this.editable_rooms);

      // load maintenance
      Api.maintenance().then((resp)=>{
        this.maintenance = resp.data;
      });

      Api.charges().then(resp => {
        this.charges = resp.data;
      })


    },
    mounted: function(){
      console.log('mounted Admin Component: ', this);

      // listen for maintenance updates
      EventBus.$on('maintenance-change', ()=>{
        Api.maintenance().then((resp)=>{
          this.maintenance = resp.data;
        });
      });

      EventBus.$on('charges-change', ()=>{
        Api.charges().then(resp => {
          this.charges = resp.data;
        });
      });
    },
    methods: {
      addRoom: function () {
        this.editable_rooms.push({
          room_id: this.new_id -= 1,
          number: this.editable_rooms.length + 1,
          description: null,
          rate: null
        });
      },

      addMaintenance: function () {
        // create select
        $('#maintenance-modal').modal('show');

      },

      addCharge: function(){
        $('#charge-modal').modal('show');
      },

      pushRoomEdits: function (changes) {
        let updates = [];
        let adds = [];
        const deletes = changes.deletes;
        changes.items.forEach((room) => {
          if (room.room_id > 0) {
            updates.push(room);
          } else {
            let roomCopy = Object.assign({}, room);
            delete roomCopy['room_id'];
            adds.push(roomCopy);
          }
        });
        console.log('adds: ', adds, ', updates: ', updates, ', deletes: ', deletes);
        Api.applyEdits('rooms', adds, updates, deletes).then((resp) => {
          console.log('applyRoomEdits response: ', resp);
          EventBus.$emit('rooms-changed');
          swal('Successfully applied edits!')
        });
      },

      pushMaintenanceEdits: function (changes) {
        let updates = [];
        let adds = [];
        const deletes = changes.deletes;

        changes.items.forEach((maint) => {
          if (maint.maint_id > 0) {
            updates.push(maint);
          } else {
            let maintCopy = Object.assign({}, maint);
            delete maintCopy['maint_id'];
            adds.push(maintCopy);
          }
        });
        console.log('adds: ', adds, ', updates: ', updates, ', deletes: ', deletes);
        Api.applyEdits('maintenance', adds, updates, deletes).then((resp) => {
          console.log('applyMaintenanceEdits response: ', resp);
          EventBus.$emit('maintenance-changed');
          swal('Successfully applied edits!')
        });
      },

      pushChargeEdits: function(changes){
        let updates = [];
        let adds = [];
        const deletes = changes.deletes;

        changes.items.forEach((charge)=>{
          if (charge.charge_id > 0){
            updates.push(charge);
          } else {
            let chargeCopy = Object.assign({}, charge);
            delete chargeCopy['charge_id'];
            adds.push(chargeCopy);
          }
        });
        console.log('adds: ', adds, ', updates: ', updates, ', deletes: ', deletes);
        Api.applyEdits('charges', adds, updates, deletes).then((resp) => {
          console.log('applyChargeEdits response: ', resp);
          EventBus.$emit('charges-change');
          swal('Successfully applied edits!')
        });
      },

      updateRoomSelection: function (data) {
        let select = this.createRoomsSelect(data.maint_room_ids);
        console.log('select: ', select);
        swal({
          title: 'Select Rooms for Scheduled Maintenance',
          content: select,
          buttons: ['Cancel', true]
        }).then((didSelect)=>{
          if(didSelect) {
            console.log('select value: ', select.value);
            data.maint_room_ids = $(select).val().join(',')
          }
        });
      },

      createRoomsSelect: function(selected_rooms=''){
        // create select
        let select = document.createElement('select');
        select.multiple = true;
        this.rooms.forEach(function(room){
          let option = document.createElement('option');
          option.value = room.room_id;
          option.text = `Room ${room.number} | ${room.description}`;
          select.appendChild(option);
        });
        $(select).css('padding', '5px').val(selected_rooms.split(','));
        return select;
      }
    }

  }
</script>

<style>

  .col-header {
    font-size: 1.4em;
  }

  .edit-btn {
    font-size: 1.1em;
    margin-right: 5px;
    color: dimgray;
  }
</style>