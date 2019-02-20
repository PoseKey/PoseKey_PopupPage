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
        <v-list-tile>
          <v-list-tile-avatar size="30px">
            <img :src="this.user.photoURL" alt="avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <h3> {{displayName}} </h3>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn color="secondary" round flat  outline v-on:click="logout">Sign Out</v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-tooltip right>
          <template #activator="data">
           <h2 v-on="data.on">Setting</h2>
          </template>
          <span>Recommended 
            posenet model: 0.75
            image scale: 0.4
            frequency: 0.5
            accuracy: 0.6
          </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-slider
          color="secondary"
          thumb-color="accent"
          v-model="pm"
          label = "posenet model"
          :tick-labels="ticksLabels"
          :max="3"
          step="1"
          ticks="always"
          tick-size="2"
          persistent-hint
          hint="Increasing this value will detect your pose better, but this will also increase the delay of loading websites."
          @change="change()"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          color="secondary"
          thumb-color="accent"
          v-model="sc"
          label = "image scale"
          step="0.01"
          min="0.2"
          max="1.0"
          thumb-label="always"
          persistent-hint
          hint="Increasing this value will detect your pose better, but this may cause the computer to lag"
          @change="change()"
          >
        </v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          color="secondary"
          thumb-color="accent"
          v-model="fq"
          label="frequency"
          step="100"
          min="100"
          max="1000"
          thumb-label="always"
          persistent-hint
          hint="Increasing this value will detect your pose faster, but this might cause the computer to lag."
          @change="change()"
        ></v-slider>
      </v-card-text>
      <v-card-text>
        <v-slider
          color="secondary"
          thumb-color="accent"
          v-model="ac"
          label="Accuracy"
          min="50"
          max="100"
          ticks="always"
          tick-size="2"
          step="10"
          thumb-label="always"
          persistent-hint
          hint="Increasing this value will decrease mis-recognition, but in trade off, it will require the user to show accurate poses."
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
  </div>
</template>

<script>
import {mapState} from 'vuex'
import store from '../store'

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
      sc:0.4,
      fq:500,
      ac:70,
    }
  },
  methods: {
    change: function(){
      let db = this.$db.requireDB();
      let uid = store.state.user.uid;
      db.collection('users').doc(uid).collection('model').doc('setting').update({
        pm: this.pm,
        sc: this.sc,
        fq: this.fq,
        ac: this.ac,
      });
      chrome.runtime.sendMessage(
        {
          data:"setting",
          pmm: this.pm,
          scm: this.sc,
          fqm: this.fq,
          acm: this.ac
        }
      );
    },
    logout: function(){
        this.$auth.logout();
        this.$router.replace({name: 'login'})
        chrome.runtime.sendMessage({
          data:"logout"
        })
    },
  },
  mounted (){
    // chrome.runtime.sendMessage(
    //   {data:"?"},
    //   (response)=>{
    //     console.log(response);
    //     this.pm = response.pmm;
    //     this.sc = response.scm;
    //     this.fq = response.fqm;
    //     this.ac = response.acm;
    //   }
    // )
    let db = this.$db.requireDB();
    let uid = store.state.user.uid;
    db.collection('users').doc(uid).collection('model').doc('setting').get().then(
      (data)=>{
        if(data.exists){
          this.pm = data.data().pm;
          this.sc = data.data().sc;
          this.fq = data.data().fq;
          this.ac = data.data().ac;
        }
        else{
          db.collection('users').doc(uid).collection('model').doc('setting').set({
            pm: this.pm,
            sc: this.sc,
            fq: this.fq,
            ac: this.ac,
          })
        }
      }
    );
    chrome.runtime.sendMessage({
        data:"login",
        uidm: uid
    });
  }
}
</script>

<style scoped>
.v-avatar {
  margin:10px
}
</style>

