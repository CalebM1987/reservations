<template>
  <div class="panel-group">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a data-toggle="collapse" class="col-header" :href="'#panel-' + _uid + '-collapse'">{{ panel_title }}</a>
        </h4>
      </div>
      <div :id="'panel-' + _uid + '-collapse'" class="panel-collapse collapse">
        <div class="panel-body">
          <editable-table :items="items"
                          :fields="fields"
                          :item_key="item_key"
                          :action_btn_class="action_btn_class"
                          :action_btn_help="action_btn_help"
                          @on-add="addItem"
                          @on-delete="deleteItem"
                          @on-change="updateItem">
          </editable-table>
        </div>
        <div class="panel-footer">
          <button class="btn btn-primary" @click="submitChanges">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EditableTable from './EditableTable.vue';
  import swal from 'sweetalert';

  export default {
    mounted: function(){
      console.log('mounted EditablePanel: ', this);
    },
    components: {
      editableTable: EditableTable
    },
    data: function(){
      return {
        deletes: []
//        editable_items: items.slice(0)
      }
    },
    props: ['items', 'fields', 'item_key', 'panel_title', 'action_btn_class', 'action_btn_help'],
    methods: {
      addItem: function(){
        this.$emit('on-add');
      },

      updateItem: function(data){
        this.$emit('on-change', data);
      },

      deleteItem: function(item){
//        this.$emit('on-delete', item);
        swal('Are you sure you want to delete this Item?', {
          icon: 'warning',
          buttons: ['No', 'Yes']
        }).then((willDelete) =>{
          if (willDelete){
            let id = item[this.item_key];
            if (id > 0){
              this.deletes.push(id);
            }
            this.items.splice(this.items.indexOf(item), 1);
          }
        });

      },

      submitChanges: function(){
        this.$emit('on-submit-changes', {
          items: this.items,
          deletes: this.deletes
        });
      }
    }
  }

</script>

<style>

</style>