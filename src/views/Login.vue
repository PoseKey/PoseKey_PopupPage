<template>
    <button v-on:click="loginG">signIn</button>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'Login',
    computed: {
        ...mapGetters(['user']),
        nextRoute () {
            return this.$route.query.redirect || '/'
        }
    },
    watch: {
        user (auth) {
            if(!!auth){
                this.$router.replace(this.nextRoute)
            }
        }
    },
    methods: {
        async loginG () {
            const auth = await this.$auth.loginG()
        }
    }
}
</script>

<style scoped>

</style>
