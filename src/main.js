import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
    render: h => h(App),

    data:{
		height: 0,
		contextMenuPosition: null
	},

    vuetify,

    methods: {
		
	}
}).$mount('#app')
