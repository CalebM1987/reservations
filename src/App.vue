<template>
  <div id="app_root">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Lamberton Motel</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a id="home-nav" href="#home" @click="$parent.switchTab">Home</a></li>
            <li><a href="#admin" id="admin-nav" @click="$parent.switchTab">Admin</a></li>
            <li><a href="#tools" id="tools-nav" @click="$parent.switchTab">Tools</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <section id="home">
      <div class="jumbotron">
        <div v-cloak id="main-content" class='container'>
          <div class="panel panel-primary">
            <div class='panel-header'>
              <h4 class="block-title">Reservation Schedule
                <!--@click='clickedNewRes = !clickedNewRes'-->
                <span class='glyphicon glyphicon-plus-sign right' data-toggle="modal" data-target="#reservation" title='create new reservation'></span>
                <span id='date-navigator' class='glyphicon glyphicon-calendar right' title="search for date"></span>
              </h4>
            </div>
            <!-- <div class="panel-body">
            </div> -->
          </div>

          <!-- reservation modal, only displays when add is clicked -->
          <reservation :rooms="$parent.rooms" :reservation="$parent.current_reservation" :isNew="$parent.isNewRes"></reservation>

          <div class="row">
            <calendar :activeRange="$parent.activeRange" :rooms="$parent.rooms"></calendar>

          </div>
        </div>
      </div>
    </section>

    <div id="admin" class="hidden top-space">
      <admin :rooms="$parent.rooms"></admin>

    </div>

    <div id="tools" class="hidden top-space">
      <tools></tools>
    </div>

  </div>
</template>

<!--<script>-->
<!--export default {-->
  <!--name: 'app',-->
  <!--data () {-->
    <!--return {-->
      <!--msg: 'Welcome to Your Vue.js App'-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<style>
  #admin{
    overflow-y: auto;
  }
</style>

