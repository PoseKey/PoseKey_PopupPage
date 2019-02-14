<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
  <v-app id="app">
    <v-toolbar dark color="primary">
      <v-toolbar-title>PoseKey</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn dark flat icon @click="switched()">
        <v-icon>power_settings_new</v-icon>
      </v-btn>
      <v-btn v-if="!this.$auth.user" dark round flat v-on:click="logout">Sign Out</v-btn>
      <v-tabs 
        slot="extension"
        color="primary"
        dark
        slider-color="white"
        grow
        fixed-tabs>
        <v-tab to="/"><v-icon>gesture</v-icon></v-tab>
        <v-tab to="/mirror"><v-icon>face</v-icon></v-tab>
        <v-tab to="/setting"><v-icon>settings</v-icon></v-tab>
      </v-tabs>
    </v-toolbar>
    <router-view></router-view>
    <!-- <v-card>
      <v-bottom-nav absolute active.sync="gesture" shift style="margin:0px">
        <v-btn flat value="gesture" to="/"><span>gesture</span><v-icon>gesture</v-icon></v-btn>
        <v-btn flat value="mirror" to="/mirror"><span>Mirror</span><v-icon>face</v-icon></v-btn>
        <v-btn flat value="setting" to="/setting"><span>Settings</span><v-icon>settings</v-icon></v-btn>
      </v-bottom-nav>
    </v-card> -->
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components:{
  },
  data(){
    return {
      boolean: false,
    };
  },
  methods:{
    switched: function(){
      // console.log('switch');
      chrome.runtime.sendMessage(
        {data:"trigger"}
      );
      // if (this.boolean){
      //   chrome.runtime.sendMessage(
      //     {data:"ON"},
      //     (response)=>{
      //       console.log(response);
      //     }
      //   )
      // }
      // else{
      //   chrome.runtime.sendMessage(
      //     {data:"OFF"},
      //     (response)=>{
      //       console.log(response);
      //     }
      //   )
      // }
    },
    logout: function(){
        this.$auth.logout();
        this.$router.replace({name: 'login'})
    },
  },
  mounted(){
    chrome.runtime.sendMessage(
      {data:"?"},
      (response)=>{
        console.log(response);
        if(response.data==true){
          this.boolean =true;
        }
        else this.boolean =false;
      }
    )
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  max-height: 489px
}
</style>
