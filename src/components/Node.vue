<template>
	<div class="node" @click="split" :style="style">
		<div class="children" v-if="hasChildren">
			<node :root="root.children[0]"></node>
			<div class="drag-handle" @mousedown="startDrag"></div>
			<node :root="root.children[1]"></node>
		</div>
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
		}
	},
	mounted(){
		this.mousemoveHandler = document.addEventListener('mousemove', this.drag.bind(this));
		this.mouseupHandler = document.addEventListener('mouseup', this.endDrag.bind(this));
	},
	computed: {
		style(){
			let style = {
				'flex-basis': `${this.root.width}%`
			}
			if(!this.hasChildren){
				style['background-color'] = this.root.color;
			}
			return style;
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
				children: []
			})

			
			this.root.children.push({
				color: this.root.color = chroma.random(),
				width: 50,
				children: []
			})

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

	.node{
		display: flex;
		height: 100%;
		/* border: 3px solid black; */
	}
	.children{
		width: 100%;
		height: 100%;
		display: flex;
	}
	.drag-handle{
		width: 4px;
		background-color: black;
		cursor: ew-resize;
	}
</style>
