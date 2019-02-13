<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
  <v-app>
    <v-card height="680">
      <v-toolbar color="primary">
        <v-toolbar-title>PoseKey</v-toolbar-title>
          <!-- <v-switch label="ON/OFF"></v-switch> -->
      </v-toolbar>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-bottom-nav absolute>
        <v-btn flat to="/"><span>gesture</span><v-icon>gesture</v-icon></v-btn>
        <v-btn flat to="/mirror"><span>Mirror</span><v-icon>face</v-icon></v-btn>
        <v-btn flat to="/setting"><span>Settings</span><v-icon>settings</v-icon></v-btn>
      </v-bottom-nav>
    </v-card>
  </v-app>
</template>


<script>

export default {
  name: 'App',
  components:{
  },
  data:{
  },
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
</style>
