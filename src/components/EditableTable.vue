<template>
  <table class="table table-striped editable">
    <thead class="editable">
    <tr class="header-row editable">
      <th class="editable" v-for="(field, index) in fields">{{ field | titleCase }}
        <span class="glyphicon glyphicon-plus-sign add-new pull-right" v-if="index === (fields.length-1)" @click="additem"></span>
      </th>
    </tr>
    </thead>

    <tbody class="editable">
    <row v-for="item in items" :data="item" :fields="fields" :allow_delete="true" :allow_edit="true" key="item[item_key]" @on-delete="onDelete" @on-change="onChange"></row>
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
    props: ['fields', 'items', 'item_key'],
    components: {
      row: Row
    },

    methods: {
      additem: function(){
        this.$emit('on-add');
      },
      onDelete: function(data){
        // bubble up delete and update events
        this.$emit('on-delete', data);
      },
      onChange: function(data){
        this.$emit('on-change', data);
      }
    },

    mounted: function(){
      console.log('mounted items: ', this);
      console.log('items from EditableTable Component: ', this.items);
    },

    filters: {
      titleCase: function(str) {
        return str.toLowerCase().split('_').map(function(word) {
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

  thead.editable, tbody.editable tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  tbody.editable {
    display: block;
    max-height: 250px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  /*td {*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
  /*}*/

</style>