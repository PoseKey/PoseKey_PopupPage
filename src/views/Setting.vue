<template>
  <div class="about">
    <v-layout row wrap align-center="">
      <v-avatar size="30">
        <img :src="this.user.photoURL" alt="avatar">
      </v-avatar>
      <h3> {{displayName}} </h3>
      <v-btn color="primary" round v-on:click="logout">Sign Out</v-btn>
    </v-layout>
    <v-card>
      <v-card-title>
        <h1>Setting</h1>
      </v-card-title>
      <v-card-text>
        <v-slider
          label = "posenet model"
          :tick-labels="ticksLabels"
          :max="3"
          step="1"
          ticks="always"
          tick-size="2"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          label = "image scale"
          min="20"
          thumb-label="always"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          label="frequency"
          min="2"
          max="10"
          thumb-label="always"
        ></v-slider>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <h1>Credits</h1>
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
  methods: {
      logout: function(){
          this.$auth.logout();
          this.$router.replace({name: 'login'})
      }
  },
  data (){
    return {
      value: 0,
      ticksLabels: [
        '0.5',
        '0.75',
        '1.0',
        '1.01'
      ]
    }
  }
}
</script>

<style scoped>
.v-avatar {
  margin:10px
}
</style>

