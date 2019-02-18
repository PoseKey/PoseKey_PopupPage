<template>
    <!-- <div>
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
    </div> -->
    <div>
        <v-card>
            <v-card-title>
                <h2>Customize</h2>
            </v-card-title>
                <!-- <v-divider></v-divider> -->
            <v-card-text>
                <v-list>
                    <v-list-tile ripple>
                        <v-list-tile-title>
                            Custom model
                        </v-list-tile-title>
                        <v-list-tile-action>
                            <v-switch v-model="custom"></v-switch>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card>
            <v-window v-model="custom">
                <v-window-item :value="false">
                    <v-card-title>
                        <h2>Default Model Setting</h2>
                    </v-card-title>
                    <v-card-text>
                        <!-- <v-overflow-btn :items="options"
                                    label="Functions"
                                    item-text="text"
                                    dense clearable
                                    @change="switched(value)">
                        </v-overflow-btn> -->
                        <v-list>
                            <v-list-tile
                            v-for="item in details"
                            :key="item.name"
                            style="margin-top:12px;"
                            >
                                <v-list-tile-avatar>
                                    <img :src="item.image"/>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.Description"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-overflow-btn
                                    v-model="defaults[item.id - 1]"
                                    background-color="secondary"
                                    style="width:250px;"
                                    :items="options"
                                    label="Functions"
                                    item-value="text"
                                    single-line
                                    clearable
                                    dense
                                    return-object
                                    @change="switchd(item.id - 1)"
                                    ></v-overflow-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-window-item>
                <v-window-item :value="true">
                    <v-card-title>
                        <h2>Custom Model Setting</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile
                            v-for="item in details"
                            :key="item.name"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.Description"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-overflow-btn
                                    v-model="customs[item.id - 1]"
                                    color="blue" style="width:230px;" 
                                    :items="options"
                                    label="Functions"
                                    item-value="text"
                                    clearable
                                    dense
                                    single-line
                                    return-object
                                    @change="switchc(item.id - 1)"
                                    ></v-overflow-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-window-item>
            </v-window>
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
            details: [],
            options: ['volume down','volume up', 'stop video','forward 10sec', 'backward 10sec', 'next video', 'scroll up', 'scroll down', 'previous slide', 'next slide'],
            custom:false,
            step: 1,
            defaults:[],
            customs:[]
        }
    },
    methods: {
        logout: function(){
            this.$auth.logout();
            this.$router.replace({name: 'login'})
        },
        switchd(num){
            // console.log(item, this.defaults);
            // console.log(this.defaults[num]);
            if(this.defaults[num] == undefined) this.defaults[num]= null;
            let db = this.$db.requireDB();
            let uid = store.state.user.uid;
            db.collection('users').doc(uid).collection('model').doc('map').update({
                defaults: this.defaults,
            });
            chrome.runtime.sendMessage(
            {
                data:"poses",
                customm: this.custom,
                defaultsm: this.defaults,
                customsm: this.customs
            }
      );
        },
        switchc(num){
            // console.log(item, this.defaults);
            // console.log(this.customs[num]);
            if(this.customs[num] == undefined) this.customs[num]= null;
            let db = this.$db.requireDB();
            let uid = store.state.user.uid;
            db.collection('users').doc(uid).collection('model').doc('map').update({
                customs : this.customs,
            });
            chrome.runtime.sendMessage({
                data:"poses",
                customm: this.custom,
                defaultsm: this.defaults,
                customsm: this.customs
            });
        }
    },
    created(){
        let db = this.$db.requireDB();
        let uid = store.state.user.uid;
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
            }
        );
        db.collection('users').doc(uid).collection('model').doc('map').get().then(
            (doc)=>{
                if(doc.exists){
                    this.defaults = doc.data().defaults;
                    this.customs = doc.data().customs;
                }
                else{
                    db.collection('users').doc(uid).collection('model').doc('map').set({
                        defaults:[null,null,null,null,null,null],
                        customs:[null,null,null,null,null,null]
                    });
                    this.defaults = [null,null,null,null,null,null];
                    this.customs  = [null,null,null,null,null,null];
                }
            }
        );
    },
}
</script>

<style scoped>

</style>
