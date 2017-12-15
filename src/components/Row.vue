<template>
  <tr>
    <!-- editable -->
    <td v-for="(field, index) in fields" v-if="fields.indexOf(field) >= 0" :key="field">
      <input type="text" v-model="data[field]" :class="'row-val-' + _uid">
      <span class="glyphicon glyphicon-remove-sign pull-right" title="delete this item" v-if="index === (fields.length-1) && allow_delete"></span>
    </td>

  </tr>
</template>

<script>
  export default {
    data: function(){
      return {

      }
    },
    props: ['data', 'fields', 'allow_delete', 'allow_edit'],
    mounted: function(){
      console.log('mounted Row: ', this);
      if (!this.allow_edit){
        $(`.row-val-${this._uid}`).attr('readOnly', true);
      }
    }
  }

</script>


<style>
  .glyphicon-remove-sign{
    color: red;
    font-size: 1.2em;
  }

</style>