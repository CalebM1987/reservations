import 'babel-polyfill'; //polyfill
import axios from 'axios';

export default{
  API_BASE: 'https://flask-calebma.c9users.io',

  getRooms: function(id){
    return axios.get(this.API_BASE + '/rooms' + (id ? '/'+ id: ''));
  },

  format_date: function(d){
    // return d.format('YYYY-MM-DD');
    return d.format('MM-DD-YYYY');
  },

  reservations_between: function(from, to, guests=true){
    return axios.get(this.API_BASE + '/reservations', {
      params: {
        from: typeof from === 'object' ? this.format_date(from): from,
        to: typeof to === 'object' ? this.format_date(to): to,
        guests: guests
      }
    });
  },

  maintenance_between: function(from, to){
    return axios.get(this.API_BASE + '/maintenance', {
      params: {
        from: typeof from === 'object' ? this.format_date(from): from,
        to: typeof to === 'object' ? this.format_date(to): to
      }
    });
  },

  add_or_update_reservation: function(res){
    if (res.res_id){
      // update
      return axios.post(`${this.API_BASE}/reservations/update/${res.res_id}`, res);
    } else {
      // add new
      return axios.post(this.API_BASE + '/reservations/add', res);
    }
  },

  guests: function(id=null, reservations=false){
    let url = this.API_BASE + '/guests';
    if (id){
      url += `/${id}` + (reservations ? '/reservations': '');
    }
    return axios.get(url);
  },

  maintenance: function(id=null, params){
    let url = this.API_BASE + '/maintenance';
    if (id){
      url += `/${id}`;
    }
    return axios.get(url, {
      params: params
    });
  },

  applyEdits: function(endpoint, adds=[], updates=[], deletes=[]){
    return axios.post(`${this.API_BASE}/${endpoint}/applyEdits`, {
      adds: adds,
      updates: updates,
      deletes: deletes
    });
  }

}


