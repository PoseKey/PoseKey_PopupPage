<template>
  <div class="about">
    <v-layout row wrap right align-center="">
      <v-avatar size="30">
        <img :src="this.user.photoURL" alt="avatar">
      </v-avatar>
      <h3> {{displayName}} </h3>
      <v-btn color="accent" v-on:click="logout">Log out</v-btn>
    </v-layout>
    <v-divider></v-divider>
    <v-layout></v-layout>
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
}
</script>

<style scoped>
.v-avatar {
  margin:10px
}
</style>

