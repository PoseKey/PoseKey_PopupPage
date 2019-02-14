<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
  <v-app id="app">
    <v-toolbar fixed color="primary">
      <v-toolbar-title>PoseKey</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat icon @click="switched()">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
    </v-toolbar>
      <router-view></router-view>
    <v-bottom-nav shift style="margin:0px">
      <v-btn flat to="/"><span>gesture</span><v-icon>gesture</v-icon></v-btn>
      <v-btn flat to="/mirror"><span>Mirror</span><v-icon>face</v-icon></v-btn>
      <v-btn flat to="/setting"><span>Settings</span><v-icon>settings</v-icon></v-btn>
    </v-bottom-nav>
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
      if (this.boolean){
        chrome.runtime.sendMessage(
          {data:"ON"},
          (response)=>{
            console.log(response);
          }
        )
      }
      else{
        chrome.runtime.sendMessage(
          {data:"OFF"},
          (response)=>{
            console.log(response);
          }
        )
      }
    }
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
}
.v-bottom-nav{
  margin: 0px;
}
</style>
