<template>
  <table class="table table-striped table-bordered editable">
    <thead class="editable">
    <tr class="header-row editable">
      <th class="editable" v-for="(field, index) in fields">{{ field | titleCase }}
        <span class="glyphicon glyphicon-plus-sign add-new pull-right" v-if="index === (fields.length-1)" @click="additem" title="add new item"></span>
      </th>
    </tr>
    </thead>

    <tbody class="editable">
    <row v-for="item in items"
         :data="item"
         :fields="fields"
         :allow_delete="true"
         :allow_edit="true"
         :action_btn_class="action_btn_class"
         :action_btn_help="action_btn_help"
         key="item[item_key]"
         @on-delete="onDelete"
         @on-change="onChange"></row>
    </tbody>
  </table>

</template>

<script>
  import Row from './Row.vue';
  import utils from '../lib/utils';

  export default {
    data: function(){
      return {

      }
    },
    props: ['fields', 'items', 'item_key', 'action_btn_class', 'action_btn_help'],
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
      titleCase: utils.titleCase
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