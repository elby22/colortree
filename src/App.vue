<template lang="pug">
	v-app#app.tree
		node(:root="root")
		.landing(v-if="!hasChildren")
			.words Click to split
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
				width: 100,
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
	*{
		box-sizing: border-box;
	}
	body{
		margin: 0px;
	}
	#app{
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
