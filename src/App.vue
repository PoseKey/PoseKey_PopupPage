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
      <v-btn dark flat icon @click.stop="dialog = true">
        <v-icon>bug_report</v-icon>
      </v-btn>
      <v-btn dark flat icon @click="switched()">
        <v-icon>power_settings_new</v-icon>
      </v-btn>

      <v-dialog
      v-model="dialog"
      max-width="290"
      >
      <v-card>
        <v-card-title class="headline">Bug Report!</v-card-title>
          <v-container>
            <v-textarea
              name="input-7-1"
              label="What Happened?!"
              hint="The more detail, the better."
              v-model="bug"
            ></v-textarea>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat="flat"
            @click="sendBugReport()"
          >
            Send
          </v-btn>

          <v-btn
            color="accent"
            flat="flat"
            @click="cancelBugReport()"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <!-- <v-btn v-if="!this.$auth.user" dark round flat v-on:click="logout">Sign Out</v-btn> -->
      <v-tabs 
        slot="extension"
        color="primary"
        dark
        slider-color="accent"
        grow
        fixed-tabs>
        <v-tab to="/"><v-icon>accessibility_new</v-icon></v-tab>
        <v-tab to="/mirror"><v-icon>face</v-icon></v-tab>
        <v-tab to="/setting"><v-icon>settings</v-icon></v-tab>
      </v-tabs>
    </v-toolbar>
    <v-container
      class="scroll-y">
      <!-- <v-layout
        column
        align-center
        justify-center
        style="max-height:500px;margin-top:30px;margin-bottom:30px;"
      > -->
        <router-view></router-view>
      <!-- </v-layout> -->
    </v-container>
    <!-- <v-container style="height 50px; max-height:50px;">
        <v-card>
          <v-bottom-nav absolute active.sync="gesture" shift style="margin:0px">
            <v-btn flat value="gesture" to="/"><span>gesture</span><v-icon>gesture</v-icon></v-btn>
            <v-btn flat value="mirror" to="/mirror"><span>Mirror</span><v-icon>face</v-icon></v-btn>
            <v-btn flat value="setting" to="/setting"><span>Settings</span><v-icon>settings</v-icon></v-btn>
          </v-bottom-nav>
        </v-card>
    </v-container> -->
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
      dialog:false,
      bug:""
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
    sendBugReport: function(){
      this.dialog = false;
      if(bug != ""){
        let db = this.$db.requireDB();
        db.collection('bug').add({
          content: this.bug,
        });
        bug = "";
      }
    },
    cancelBugReport: function(){
      this.dialog = false;
      bug = "";
    }

  },
  mounted(){
    chrome.runtime.sendMessage(
      {data:"?"},
      (response)=>{
        // console.log(response);
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
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  max-height: 489px
}
</style>
