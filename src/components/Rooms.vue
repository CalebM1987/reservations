<template>
  <table class="table table-striped">
    <thead>
      <tr class="header-row">
        <th v-for="field in fields">{{ field | titleCase }}</th>
      </tr>
    </thead>

    <tbody>
      <row v-for="room in rooms" :data="room" :fields="fields" :allow_delete="true" :allow_edit="true" key="room.room_id"></row>
    </tbody>
  </table>

</template>

<script>
  import Row from './Row.vue';

  export default {
    data: function(){
      return {

      }
    },
    props: ['fields', 'rooms'],
    components: {
      row: Row
    },

    mounted: function(){
      console.log('mounted Rooms: ', this);
      console.log('rooms from Component: ', this.rooms);
    },

    filters: {
      titleCase: function(str) {
        return str.toLowerCase().split(' ').map(function(word) {
          return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
      }
    }
  }

</script>

<style>
  .header-row{
    background-color: #337ab7;
    color: white;
  }

</style>