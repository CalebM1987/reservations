<template>
  <div class="panel-group">

    <!-- Today's checkouts -->
    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" class="col-header" href="#todays-reservations-collapse">Today's Reservations</a>
          </h4>
        </div>
        <div id="todays-reservations-collapse" class="panel-collapse collapse in">
          <div class="panel-body">
            <todays-reservations :fields="['reservation_number', 'date_in', 'date_out', 'guest_name', 'status']"></todays-reservations>
          </div>
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


  </div>

</template>

<script>
  import TodaysReservations from './TodaysReservations.vue';

  export default {
    components: {
      todaysReservations: TodaysReservations
    },

    props: []

  }

</script>

<style>

</style>