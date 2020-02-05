<template>
	<div id="app" class="tree">
		<node :root="root"></node>

		<div class="landing" v-if="!hasChildren">
			<div class="words">Click to split</div>
		</div>
	</div>
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
				children: []
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
