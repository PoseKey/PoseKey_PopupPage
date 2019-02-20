<template>
    <div>
        <v-card>
            <v-card-title>
                <h2>Customize</h2>
            </v-card-title>
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
                                    background-color="#E8EAF6"
                                    color="accent"
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
                    <v-card-text v-show="local">
                        <v-list>
                            <v-list-tile
                            v-for="item in customd"
                            :key="item.id"
                            style="margin-top:12px;"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.Description"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-overflow-btn
                                    v-model="customs[item.id - 1]"
                                    background-color="#E8EAF6"
                                    color="accent"
                                    style="width:250px;"
                                    :items="options"
                                    label="Functions"
                                    item-value="text"
                                    single-line
                                    clearable
                                    dense
                                    return-object
                                    @change="switchc(item.id - 1)"
                                    ></v-overflow-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-card-text v-show="!local">
                        You have not created <strong>your own model</strong>! PoseKey supports users to make their own unique poses that could be mapped with each functions! Go to the "Options Page" to create your own poses!!
                        <v-divider></v-divider>
                        <v-btn 
                            color="secondary"
                            href="chrome-extension://pifojknhlbglpfoehbppiddjlgebooom/options.html" target="_blank"
                        >Option Page</v-btn>
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
            details: [],
            options: ['volume down','volume up', 'stop video','forward 10sec', 'backward 10sec', 'next video', 'scroll up', 'scroll down', 'previous slide', 'next slide','go to top','go to bottom', 'close tab', 'move tab left', 'move tab right', 'close window', 'zoom-in', 'zoom-out', 'zoom-reset', 'back', 'forward', 'reload',],
            custom:false,//false
            step: 1,
            defaults:[],
            customs:[],
            local: false//false
        }
    },
    methods: {
        logout: function(){
            this.$auth.logout();
            this.$router.replace({name: 'login'})
        },
        switchd(num){
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
            if(this.customs[num] == undefined) this.customs[num]= null;
            let db = this.$db.requireDB();
            let uid = store.state.user.uid;
            db.collection('users').doc(uid).collection('model').doc('map').update({
                customs : this.customs,
                customd: this.customd,
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
                    this.customd = doc.data().customd;
                }
                else{
                    db.collection('users').doc(uid).collection('model').doc('map').set({
                        defaults:[null,null,null,null,null,null],
                        customs:[null,null,null,null,null,null],
                        customd:[
                            {Description:"Pose 1", id: 1},
                            {Description:"Pose 2", id: 2},
                            {Description:"Pose 3", id: 3},
                            {Description:"Pose 4", id: 4},
                            {Description:"Pose 5", id: 5},
                            {Description:"Pose 6", id: 6}
                        ],
                    });
                    this.defaults = [null,null,null,null,null,null];
                    this.customs  = [null,null,null,null,null,null];
                    this.customd = [
                        {Description:"Pose 1", id: 1},
                        {Description:"Pose 2", id: 2},
                        {Description:"Pose 3", id: 3},
                        {Description:"Pose 4", id: 4},
                        {Description:"Pose 5", id: 5},
                        {Description:"Pose 6", id: 6}
                    ];
                }
            }
        );
        chrome.runtime.sendMessage(
            {
                data:"login",
                uidm: uid
            },
            (response)=>{
                this.local = response.localm;
                this.custom = response.customm;
            }
        );
    },
}
</script>

<style scoped>

</style>
