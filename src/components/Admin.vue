<template>
  <div class="panel-group">

    <!-- Edit Rooms -->
    <editable-panel :panel_title="'Edit Rooms'" :items="editable_rooms" :fields="room_fields" :item_key="'room_id'" @on-add="addRoom" @on-submit-changes="pushRoomEdits"></editable-panel>


    <!-- Maintenance -->
    <editable-panel :panel_title="'Schedule Maintenance'" :items="maintenance" :fields="maint_fields" :item_key="'maint_id'" @on-add="addMaintenance" @on-submit-changes="pushMaintenanceEdits"></editable-panel>
    <!--<div class="panel-group">-->
      <!--<div class="panel panel-default">-->
        <!--<div class="panel-heading">-->
          <!--<h4 class="panel-title">-->
            <!--<a data-toggle="collapse" class="col-header" href="#maintenance-collapse">Schedule Maintenance</a>-->
          <!--</h4>-->
        <!--</div>-->
        <!--<div id="maintenance-collapse" class="panel-collapse collapse">-->
          <!--<div class="panel-body">Panel Body</div>-->
          <!--<div class="panel-footer">Panel Footer</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

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

  </div>
</template>

<script>
  import EditableTable from './EditableTable.vue';
  import EditablePanel from './EditablePanel.vue';
  import Api from '../lib/Api';
  import swal from 'sweetalert';

  export default {
    data: function(){
      return {
//        rooms: this.$parent.rooms, //do I need this?
        room_fields: ['number', 'description', 'rate'],
        editable_rooms: this.rooms.slice(0),
        maint_fields: ['date_start', 'date_end', 'maint_description', 'maint_comments'],
        maintenance: [],
      }
    },
    components: {
      editableTable: EditableTable,
      editablePanel: EditablePanel
    },
    props: ['rooms'],
    beforeMount: function(){
//      Array.prototype.push.apply(this.editable_rooms, this.rooms);
      console.log('editable rooms from Admin: ', this.editable_rooms);

      // load maintenance
      Api.maintenance().then((resp)=>{
        this.maintenance = resp.data;
      });


    },
    mounted: function(){
      console.log('mounted Admin Component: ', this);
    },
    methods: {
      addRoom: function(){
        this.editable_rooms.push({
          room_id: this.new_id -= 1,
          number: this.editable_rooms.length + 1,
          description: null,
          rate: null
        });
      },

      addMaintenance: function(){
        // create select
        var select = document.createElement('select');
        select.multiple = true;
        this.rooms.forEach(function(room){
          let option = document.createElement('option');
          option.value = room.room_id;
          option.text = `Room ${room.number} | ${room.description}`
          select.appendChild(option);
        });
        console.log('select is: ', select);
        swal({
          title: 'Select Rooms for Scheduled Maintenance',
          content: select, //select.prop('outerHTML'),
          buttons: ['Cancel', true]
        }).then((didSelect)=>{
          if (didSelect){
            console.log('select value: ', select.value);
            this.maintenance.push({
              maint_id: -1,
              date_start: null,
              date_end: null,
              maint_description: null,
              maint_comments: null,
              maint_room_ids: $(select).val().join(',')//select.value.join(',')
            });
          }

        });

      },

      pushRoomEdits: function(changes){
        let updates = [];
        let adds = [];
        const deletes = changes.deletes;
        changes.items.forEach((room)=>{
          if (room.room_id > 0){
            updates.push(room);
          } else {
            let roomCopy = Object.assign({}, room);
            delete roomCopy['room_id'];
            adds.push(roomCopy);
          }
        });
        console.log('adds: ', adds, ', updates: ', updates, ', deletes: ', deletes);
        Api.applyEdits('rooms', adds, updates, deletes).then((resp)=>{
          console.log('applyRoomEdits response: ', resp)
          swal('Successfully applied edits!')
        });
      },

      pushMaintenanceEdits: function(changes){
        let updates = [];
        let adds = [];
        const deletes = changes.deletes;
        changes.items.forEach((maint)=>{
          if (maint.maint_id > 0){
            updates.push(maint);
          } else {
            let maintCopy = Object.assign({}, maint);
            delete maintCopy['maint_id'];
            adds.push(maintCopy);
          }
        });
        console.log('adds: ', adds, ', updates: ', updates, ', deletes: ', deletes);
        Api.applyEdits('maintenance', adds, updates, deletes).then((resp)=>{
          console.log('applyMaintenanceEdits response: ', resp);
          swal('Successfully applied edits!')
        });
      }
    }
  }
</script>

<style>
  .col-header{
    font-size: 1.4em;
  }
</style>