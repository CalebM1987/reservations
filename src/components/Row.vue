<template>
  <tr>
    <!-- editable -->
    <td v-for="(field, index) in fields" v-if="fields.indexOf(field) >= 0" :key="field">

      <textarea v-if="field.indexOf('description') >= 0 || field.indexOf('comments') >= 0"
                type="text"
                ref="field"
                :data-field="field"
                v-model="data[field]"
                :class="'row-val-' + _uid + (field.indexOf('date') >= 0 ? ' date-field-' + _uid: '')"
                @change="onChange">
      </textarea>

      <input v-else type="text"
             v-model="data[field]"
             :data-field="field"
             ref="field"
             :class="'row-val-' + _uid + (field.indexOf('date') >= 0 ? ' date-field-' + _uid: '')"
             @change="onChange">

      <span class="glyphicon glyphicon-remove-sign pull-right" title="delete this item" v-if="index === (fields.length-1) && allow_delete" @click="onDelete"></span>
    </td>

  </tr>
</template>

<script>
  import moment from 'moment';

  export default {
    data: function(){
      return {

      }
    },
    props: ['data', 'fields', 'allow_delete', 'allow_edit'],
    methods: {
      onDelete: function(){
        this.$emit('on-delete', this.data);
      },
      onChange: function(){
        this.$emit('on-change', this.data);
      }
    },
    mounted: function(){
      console.log('mounted Row: ', this);
      if (!this.allow_edit){
        $(`.row-val-${this._uid}`).attr('readOnly', true);
      }

      // set datpickers for any date fields
      let dates = $(`.date-field-${this._uid}`);
      dates.each((i, el)=>{
        if (!(el.value)){
          // set date in datepicker to existing value
          el.value = moment(this.data[el.getAttribute('data-field')]).format('mm-dd-yyyy');
        }
      });
      dates.datepicker({
        format: 'mm-dd-yyyy',
        startDate: '0d',
        forceParse: false,
      }).on('changeDate', e =>{
        // auto close doesn't work??
        this.data[e.target.getAttribute('data-field')] = e.target.value;
        $(e.target).datepicker('hide');
      })
    }
  }

</script>


<style>
  .glyphicon-remove-sign{
    color: red;
    font-size: 1.2em;
  }

</style>