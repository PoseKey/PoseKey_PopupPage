<template>
  <div class="about">
    <!-- <v-layout row wrap align-center=""> -->
<!--       
      <v-avatar size="30">
        <img :src="this.user.photoURL" alt="avatar">
      </v-avatar>
      <h3> {{displayName}} </h3>
      <v-btn color="primary" round v-on:click="logout">Sign Out</v-btn> -->

    <!-- </v-layout> -->
    <v-card>
      <v-card-title>
        <h2>Signed in as</h2>
      </v-card-title>
      <v-card-text>
        <v-list-tile align-content-end>
          <v-list-tile-avatar>
            <img :src="this.user.photoURL" alt="avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
          <h3> {{displayName}} </h3>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn color="primary" round flat v-on:click="logout">Sign Out</v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <h2>Setting</h2>
      </v-card-title>
      <v-card-text>
        <v-slider
          v-model="pm"
          label = "posenet model"
          :tick-labels="ticksLabels"
          :max="3"
          step="1"
          ticks="always"
          tick-size="2"
          @change="change()"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          v-model="sc"
          label = "image scale"
          step="0.01"
          min="0.2"
          max="1.0"
          thumb-label="always"
          @change="change()"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          v-model="fq"
          label="frequency"
          step="100"
          min="100"
          max="1000"
          thumb-label="always"
          @change="change()"
        ></v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          v-model="ac"
          label="Accuracy"
          min="50"
          max="100"
          ticks="always"
          tick-size="2"
          step="10"
          thumb-label="always"
          @change="change()"
        ></v-slider>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <h2>Credits</h2>
      </v-card-title>
      <v-card-text>
        <div>All Icons are made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
      </v-card-text>
    </v-card>
    <!-- <v-layout>
      <v-flex xs12>
        <v-slider
          label = "posenet model"
          :tick-labels="ticksLabels"
          :max="3"
          step="1"
          ticks="always"
          tick-size="2"
          >
        </v-slider>
        <v-slider
          label = "image scale"
          min="20"
          thumb-label="always"
          >
        </v-slider>
        <v-slider
          label=""
        ></v-slider>
      </v-flex>
    </v-layout> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
    displayName () {
      return !!this.user ? this.user.displayName : ''
    },
  },
  data (){
    return {
      value: 0,
      ticksLabels: [
        '0.5',
        '0.75',
        '1.0',
        '1.01'
      ],
      pm:1,
      sc:0.5,
      fq:500,
      ac:70,
    }
  },
  methods: {
    logout: function(){
        this.$auth.logout();
        this.$router.replace({name: 'login'})
    },
    change: function(){
      console.log(this.pm);
      chrome.runtime.sendMessage(
        {
          data:"setting",
          pmm: this.pm,
          scm: this.sc,
          fqm: this.fq,
          acm: this.ac
        }
      );
    }
  },
  mounted (){
    chrome.runtime.sendMessage(
      {data:"?"},
      (response)=>{
        console.log(response);
        this.pm = response.pmm;
        this.sc = response.scm;
        this.fq = response.fqm;
        this.ac = response.acm;
      }
    )
  }
}
</script>

<style scoped>
.v-avatar {
  margin:10px
}
</style>

