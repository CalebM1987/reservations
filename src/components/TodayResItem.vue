<template>
  <tr
      :id="'today-res-' + res.res_id"
      :class="(res.status === 'checked_in' ? 'checked-in': '') + (res.status === 'checked_out' ? 'checked-out': '')">
    <td v-for="(field, index) in fields" :key="res.reservation_number">
      {{ res[field] }}
      <span v-if="index === fields.length-1" class="pull-right res-controls">
             <span
                     :class="'glyphicon glyphicon-copy pull-left' + (res.status === 'checked_in' ? ' validated': '')"
                     title="check in"
                     ref="check_in"
                     :data-res-id="res.res_id"
                     @click="checkIn">
            </span>

             <span
                     :class="'left glyphicon glyphicon-paste' + (res.status === 'checked_out' ? ' validated': '')"
                     title="check out"
                     ref="check_out"
                     @click="checkOut(res.res_id)">
            </span>

            <span
                    class="glyphicon glyphicon-exclamation-sign"
                    :disabled="res.status !== 'reserved'"
                    title="cancel reservation"
                    @click="cancelRes(res.res_id)">
            </span>
          </span>
    </td>
  </tr>
</template>

<script>
  export default {
    props: ['res', 'fields'],
    methods: {
//      checkIn: function(e){
//        let id = e.target.getAttribute('data-res-id');
//        console.log('res id from checkIn: ', id)
//        Api.update_reservation(id, {status: 'checked_in'}).then((resp)=>{
//          if (!res.data.hasOwnProperty('error')){
//            swal('Success', `Checked in reservation #${resp.data.res_id}`, 'success');
//            $(`#today-res-${id}`).addClass('checked-in')
//          } else {
//            swal('Error', `Could not check in reservation: ${resp.data.message}`);
//          }
//        });
//      }
    }
  }

</script>

<style>

</style>