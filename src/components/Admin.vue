<template>
  <div class="panel-group">

    <!-- Edit Rooms -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#rooms-collapse">Edit Rooms</a>
          </h4>
        </div>
        <div id="rooms-collapse" class="panel-collapse collapse">
          <div class="panel-body">
            <rooms :rooms="rooms" :fields="room_fields"></rooms>
          </div>
          <div class="panel-footer">Panel Footer</div>
        </div>
      </div>
    </div>

    <!-- Maintenance -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#maintenance-collapse">Schedule Maintenance</a>
          </h4>
        </div>
        <div id="maintenance-collapse" class="panel-collapse collapse">
          <div class="panel-body">Panel Body</div>
          <div class="panel-footer">Panel Footer</div>
        </div>
      </div>
    </div>

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
  import Rooms from './Rooms.vue';
  export default {
    data: function(){
      return {
//        rooms: this.$parent.rooms, //do I need this?
        room_fields: ['number', 'description', 'rate']
      }
    },
    components: {
      rooms: Rooms
    },
    props: ['rooms']
  }
</script>

<style>
  .col-header{
    font-size: 1.4em;
  }
</style>