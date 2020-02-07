<template>
	<div class="node" :style="nodeStyle">
		<div class="children" v-if="hasChildren" @contextmenu.prevent="destroy(0)">
			<node :root="root.children[0]" :class="{'highlight': hoveringDragHandle || isDragging}"></node>
			<div 
				:style="dragHandleStyle" 
				class="drag-handle"

				:class="{'highlight': hoveringDragHandle || isDragging}"
				@mousedown="startDrag" 
				@mouseover="hoveringDragHandle = true"  
				@mouseout="hoveringDragHandle = false" 
			>
				<div class="visible-part"></div>
			</div>
			<node :root="root.children[1]" :class="{'highlight': hoveringDragHandle || isDragging}"></node>
		</div>
		<div 
			class="leaf" 
			v-else
			@click="split"  
		></div>
	</div>
</template>

<script>
import chroma from 'chroma-js';
export default {
	name: 'node',
	props: {
		root: {
			type: Object,
			required: true
		}
	},
	data(){
		return {
			mousemoveHandler: null,
			mouseupHandler: null,
			isDragging: false,
			hoveringDragHandle: false
		}
	},
	mounted(){
		this.mousemoveHandler = document.addEventListener('mousemove', this.drag.bind(this));
		this.mouseupHandler = document.addEventListener('mouseup', this.endDrag.bind(this));
	},
	computed: {
		nodeStyle(){
			let style = {
				'flex-basis': `${this.root.width}%`
			}
			if(!this.hasChildren){
				style['background-color'] = this.root.color;
			}
			return style;
		},
		// nodeclass(){
		// 	let classes = [];
		// 	if(this.hoveringDragHandle) classes.push('node-highlight')
		// },
		dragHandleStyle(){
			return {
				left: `${this.childrenWidths[0]}%`,
			}
		},
		childrenWidths(){
			return [this.root.children[0].width, this.root.children[1].width];
		},
		hasChildren(){
			return this.root.children.length;
		}
	},
	methods: {
		split(e){
			if(this.hasChildren) return;
			console.log(e)

			this.root.children.push({
				color: this.root.color ,
				width: 50,
				children: [], 
				depth: this.root.depth + 1
			})

			
			this.root.children.push({
				color: this.root.color = chroma.random(),
				width: 50,
				children: [],
				depth: this.root.depth + 1
			});

			this.$root.$data.height++;

		},
		destroy(index){
			console.log(index);
			if(!this.hasChildren) return;
			this.root.children = [];
			this.$root.$data.height--;

		},
		startDrag(e){
			console.log(e)
			this.isDragging = true;
		},
		endDrag(){
			if(this.isDragging) this.isDragging = false;
		},
		drag(e){
			if(this.isDragging){ 
				console.log(e);
				let offset = this.$el.offsetLeft;
				let x = e.clientX;
				let total = this.$el.clientWidth;
				console.log(offset, x, total);
				let left =  ((x - offset) / total) * 100;
				let right = 100 - left;

				console.log(left, right);

				this.root.children[0].width = left;
				this.root.children[1].width = right;
			}
		},
	},
	beforeDestroy(){
		this.mousemoveHandler = document.removeEventListener('mousemove', this.drag);
		this.mouseupHandler = document.removeEventListener('mouseup', this.endDrag);
	},
}
</script>

<style>
	#app{
		background-color: black;
	}
	.node{
		display: flex;
		height: 100%;
	   transition: opacity .25s ease-in-out;
		-moz-transition: opacity .25s ease-in-out;
		-webkit-transition: opacity .25s ease-in-out;
		opacity: 1	
	}

	.children{
		width: 100%;
		height: 100%;
		display: flex;
		position: relative;
		opacity: 1;
	}
	.node .highlight{
		opacity: 0.8;
	}
	.drag-handle{
		width: 4px;
		height: 100%;
		background-color: transparent;
		position: absolute;
		/* top: 0px%; */
		z-index: 1000000;
		
		cursor: ew-resize;	
		opacity: 0;
	   transition: opacity .25s ease-in-out;
		-moz-transition: opacity .25s ease-in-out;
		-webkit-transition: opacity .25s ease-in-out;
	}

	.drag-handle.highlight{
		opacity: 1;
	}

	.drag-handle .visible-part{
		background-color: black;
		width: 4px;
		height: 100%;
		margin-right: 0px;
	}


	.leaf{
		height: 100%;
		width: 100%;
	}
</style>
