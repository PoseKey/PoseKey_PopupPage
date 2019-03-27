<template>
  <div class="about">
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
        <h2>Model Setting</h2>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template #activator="data">
            <v-icon v-on="data.on" color="primary">help</v-icon>
          </template>
          <span>
            Setting Tab provides configuration options for the AI model running in your web browser.<br>
            Recommended Settings are as followed:<br>
            posenet model: 0.75 <br>
            image scale: 0.4 <br>
            frequency: 0.5 <br>
            accuracy: 0.6<br><br>
            However, if your device lags too much, you should try lowering the options.<br>
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
        <h2>Interface Setting</h2>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template #activator="data">
            <v-icon v-on="data.on" color="primary">help</v-icon>
          </template>
          <span>
            This setting allows you to change colors and location of the directive interface.<br>
            The palette beside the control panel shows you the color before you actually apply.
          </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <div style="display:flex">
          <v-container style="width:279px">
            <v-slider
              color="red"
              thumb-color="accent"
              v-model="ri"
              label="Red"
              min="0"
              max="255"
              thumb-label="always"
              @change="fill()"
            ></v-slider>
            <v-slider
              color="green"
              thumb-color="accent"
              v-model="gi"
              label="Green"
              min="0"
              max="255"
              thumb-label="always"
              @change="fill()"
            ></v-slider>
            <v-slider
              color="blue"
              thumb-color="accent"
              v-model="bi"
              label="Blue"
              min="0"
              max="255"
              thumb-label="always"
              @change="fill()"
            ></v-slider>
            <v-slider
              color="grey"
              thumb-color="accent"
              v-model="ti"
              label="Transparency"
              min="0"
              max="1"
              step="0.1"
              thumb-label="always"
              @change="opacity()"
            ></v-slider>
          </v-container>
          <v-container style="width:279px;align-item:center">
            <v-checkbox
            v-model="vi"
            label="Top"
            @change="interfaceIO()">
            </v-checkbox>
            <v-checkbox
            v-model="hi"
            label="Left"
            @change="interfaceIO()">
            </v-checkbox>
            <v-checkbox
            v-model="isDialog"
            label="Interface ON/OFF"
            @change="interfaceIO()">
            </v-checkbox>
            <canvas id="cvs" style="width:250px">
            </canvas>
          </v-container>
        </div>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <h2>Credits</h2>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template #activator="data">
            <v-icon v-on="data.on" color="primary">help</v-icon>
          </template>
          <span>
            Copyrights, Credits, and Special thanks
          </span>
        </v-tooltip>
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
      ri:56,
      gi:104,
      bi:188,
      ti:0.3,
      hi:true,
      vi:true,
      isDialog:true,
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
      chrome.runtime.sendMessage({
        data:"setting",
        pmm: this.pm,
        scm: this.sc,
        fqm: this.fq,
        acm: this.ac
      });
    },
    fill: function(){
      let c = document.getElementById('cvs');
      let ctx = c.getContext("2d");
      let color = "#" + this.pad(this.ri.toString(16),2) + this.pad(this.gi.toString(16),2) + this.pad(this.bi.toString(16),2);
      ctx.fillStyle = color;
      ctx.fillRect(0,0,390,163);
      let db = this.$db.requireDB();
      let uid = store.state.user.uid;
      db.collection('users').doc(uid).collection('model').doc('setting').update({
        ri: this.ri,
        gi: this.gi,
        bi: this.bi,
        ti: this.ti,
      });
      chrome.runtime.sendMessage({
        data:"interface",
        rim: this.ri,
        gim: this.gi,
        bim: this.bi,
        tim: this.ti,
      });
    },
    opacity: function(){
      let c = document.getElementById('cvs');
      c.style="width:250px;opacity:" + this.ti.toString();
      this.fill();
    },
    interfaceIO:function(){
      let db = this.$db.requireDB();
      let uid = store.state.user.uid;
      db.collection('users').doc(uid).collection('model').doc('setting').update({
        isDialog: this.isDialog,
        vi: this.vi,
        hi: this.hi
      });
      chrome.runtime.sendMessage({
        data:"interfaceIO",
        isDialogm: this.isDialog,
        vim: this.vi,
        him: this.hi
      });
    },
    logout: function(){
        this.$auth.logout();
        this.$router.replace({name: 'login'})
        chrome.runtime.sendMessage({
          data:"logout"
        })
    },
    pad: function(n, width) {
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
  },
  mounted (){
    let db = this.$db.requireDB();
    let uid = store.state.user.uid;
    db.collection('users').doc(uid).collection('model').doc('setting').get().then(
      (data)=>{
        if(data.exists){
          this.pm = data.data().pm;
          this.sc = data.data().sc;
          this.fq = data.data().fq;
          this.ac = data.data().ac;
          this.ri = data.data().ri;
          this.gi = data.data().gi;
          this.bi = data.data().bi;
          this.ti = data.data().ti;
          this.vi = data.data().vi;
          this.hi = data.data().hi;
          this.isDialog = data.data().isDialog;
        }
        else{
          db.collection('users').doc(uid).collection('model').doc('setting').set({
            pm: this.pm,
            sc: this.sc,
            fq: this.fq,
            ac: this.ac,
            ri: this.ri,
            gi: this.gi,
            bi: this.bi,
            ti: this.ti,
            vi: this.vi,
            hi: this.hi,
            isDialog: this.isDialog,
          })
        }
        
        this.opacity();
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

