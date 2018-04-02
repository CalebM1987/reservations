<template>
  <div id="receipt-modal" :class="'modal fade receipt-modal-' + reservation.res_id" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog" style="width: 75%;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span>
          </button>
          <h3 class="modal-title" ref="reservation_title">Receipt for Reservation #{{ reservation.res_id }} </h3>
        </div>
        <div class="modal-body">
          <div :id="'receipt-' + reservation.res_id" ref="receipt">
            <div class="row receipt-header">
              <div class="guest-info col-sm">
                <p>{{ reservation.guest_info.name }}</p>
                <p>{{ reservation.guest_info.address }}</p>
                <p>{{ reservation.guest_info.csz }}</p>
              </div>

              <!--<img src="../assets/lamberton.jpeg" alt="Lamberton Motel" class="receipt-logo">-->
              <div class="col-sm" style="margin: 0px 50px 0px 50px;">
                <img src="../assets/lamberton.png" alt="Lamberton Motel" class="receipt-logo">
              </div>

              <div class="hotel-info col-sm">
                <p>Lamberton Motel</p>
                <p>601 1st Ave W</p>
                <p>Lamberton, MN 56152</p>
                <p>507-752-7242</p>
                <p style="margin-top: 25px;">Date In: {{  reservation.date_in }}</p>
                <p>Date Out: {{ reservation.date_out }}</p>
                <p>Number of Rooms: {{ reservation.num_rooms }}</p>
              </div>
            </div>

            <div class="container full-width">
              <h2>Reservation #{{ reservation.res_id }}</h2>
              <p class="check-out-time" v-if="check_out_time">Check Out Time: {{ check_out_time | out_time }}</p>
              <table class="table table-striped table-bordered">
                <thead>
                <tr>
                  <th>Description</th>
                  <th>Charge</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>John</td>
                  <td>Doe</td>
                  <td>john@example.com</td>
                </tr>
                <tr>
                  <td>Mary</td>
                  <td>Moe</td>
                  <td>mary@example.com</td>
                </tr>
                <tr>
                  <td>July</td>
                  <td>Dooley</td>
                  <td>july@example.com</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="form-group top">
            <button class="btn btn-primary" data-dismiss="modal" v-on:click="savePDF">Save As PDF</button>
            <button class="btn btn-danger" data-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';

  export default {
    props: ['reservation', 'check_out_time'],
    data(){
      return {
        itemized: []
      }
    },
    beforeMount: function(){
      if (this.reservation.promo_code > 1){
        //
      } else {
        this.itemized.push({'description': 'Room Rate', 'charge': 59});
        this.reservation.additional_charges.forEach((c)=>{
          this.itemized.push({'description': c.charge_description, 'charge': c.amount});
        })
      }
    },
    mounted: function(){
      $(this.$refs.modal).modal();
      hook.receipt = this;
    },
    filters: {
      out_time: function(d){
        return `${d.toLocaleDateString('en-ZA')} ${d.toLocaleTimeString('en-ZA')}`;
      }
    },
    methods: {
      savePDF: function () {
//        let pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        let source = $(this.$refs.receipt)[0];
        console.log('source: ', source);
        let ratio = source.clientHeight / source.clientWidth;
        html2canvas(source, {background: "#ffffff"}).then(function(canvas){
          console.log('canvas is: ', canvas);
          let img=canvas.toDataURL("image/jpeg", canvas.width, canvas.height);//5, 5);
          let pdf = new jsPDF('l', 'mm', 'letter');
          let width = pdf.internal.pageSize.width;
          let height = pdf.internal.pageSize.height;
          height = ratio * width;
          pdf.addImage(canvas, 'JPEG', 5, 5,width-10,height);
          return pdf.save('test.pdf');
        });
      }
    }
  }

</script>

<style>

  .receipt-header {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
  }

</style>