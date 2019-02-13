<template>
    <div>
        
        <v-data-table
            :headers="headers"
            :items="details"
            class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{props.item.name}}</td>
                <td class="text-xs-right">{{ props.item.Description }}</td>
                <td class="text-xs-right">{{ props.item.Function }}</td>
            </template>
            <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">
                    Sorry, nothing to display here :(
                </v-alert>
            </template>
        </v-data-table>
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
        return{
            headers:[
                {
                    text: 'name',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: "Description", value: 'Description'},
                { text: "Function", value: 'Function'}
            ],
            details: [
            ]
        }
    },
    methods: {
        logout: function(){
            this.$auth.logout();
            this.$router.replace({name: 'login'})
        }
    },
    created(){
        let db = this.$db.requireDB();
        db.collection('poses').onSnapshot(
            res=>{
                const changes = res.docChanges();

                changes.forEach(change =>{
                    if (change.type ==='added'){
                        this.details.push({
                            ...change.doc.data(),
                            id: change.doc.id
                        })
                    }
                });
                console.log(this.headers);
                console.log(this.details);
            }
        );
    }
}
</script>

<style scoped>

</style>
