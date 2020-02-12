<template lang="pug">
	v-app#app.tree
		node(:root="root")
		v-footer
			v-flex.text-center Right click a color to split
</template>

<script>
import Node from './components/Node';
export default {
	name: 'app',
	components: {
		Node
	},
	data(){
		return {
			root: {
				color: 'blue',
				percent: 100,
				children: [],
				depth: 0
			}
		}
	},
	computed: {
		hasChildren(){
			return this.root.children.length;
		}
	},
	methods: {
	}  
}
</script>

<style>
	html{
		overflow-y: auto! important;
	}
	*{
		box-sizing: border-box;
	}
	body{
		margin: 0px;
	}
	#app{
		background-color: black;
		height: 100vh;
		width: 100vw;
		position: relative;
	}
	.landing{
		top: 0px;
		position: absolute;
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
</style>
