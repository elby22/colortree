<template lang="pug">
	.node(
		:style="nodeStyle"
		:class="nodeclass"
		@contextmenu.stop.prevent="openMenu"
	)
		template(v-if="hasChildren")
			node(:root="root.children[0]")
			.drag-handle(
				:style="dragHandleStyle"
				@mousedown="startDrag", 
				@mouseover="hoveringDragHandle = true"
				@mouseout="hoveringDragHandle = false"
			)
				.visible-part
			node(:root="root.children[1]")
		.leaf(
			v-else 
		)
			v-menu(
				absolute
				offset-client
				v-model="showMenu"
				:position-x="menuPosition.x"
				:position-y="menuPosition.y"
			)
				v-list
					v-list-item(@click="splitVertical")
						v-list-item-title Split Vertical
					v-list-item(@click="splitHorizontal")
						v-list-item-title Split Horizontal
</template>

<script>
import chroma from "chroma-js";
export default {
	name: "node",
	props: {
		root: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			isDragging: false,
			hoveringDragHandle: false,
			showMenu: false,
			menuPosition: {x: 0, y: 0},

		};
	},
	mounted() {
		document.addEventListener('mousemove', this.drag);
		document.addEventListener('mouseup', this.endDrag);
	},
	computed: {
		nodeStyle() {
			let style = {}
			style['flex-basis'] = `${this.root.percent}%`;
	
			if(this.root.isVertical) style['flex-flow'] = 'column';
			if(!this.hasChildren) style['background-color'] = this.root.color;
			
			return style;
		},
		nodeclass(){
			return {
				'highlight': this.hoveringDragHandle || this.isDragging,
				'vertical': this.root.isVertical,				
			}
		},
		dragHandleStyle() {
			let style = {};
			style['opacity'] = this.hoveringDragHandle || this.isDragging ? 1 : 0;

			const size = `calc(${this.childrenPercents[0]}% - 2px)`;
			if(this.root.isVertical) style['top'] = size;
			else style['left'] = size;

			return style;
		},

		childrenPercents() {
			return [this.root.children[0].percent, this.root.children[1].percent];
		},
		hasChildren() {
			return this.root.children.length;
		}
	},
	methods: {
		splitHorizontal(e) {
			this.root.isVertical = false;
			this.split();
		},
		splitVertical(e){
			this.root.isVertical = true;
			this.split();
		},
		// destroy(index){
		// 	console.log(index);
		// 	if(!this.hasChildren) return;
		// 	this.root.children = [];
		// 	this.$root.$data.height--;

		// },
		split(){
			this.root.children.push({
				color: this.root.color,
				percent: 50,
				children: [],
				depth: this.root.depth + 1,
				isVertical: null
			});

			this.root.children.push({
				color: (this.root.color = chroma.random()),
				percent: 50,
				children: [],
				depth: this.root.depth + 1,
				isVertical: null
			});

			this.$root.$data.height++;
		},
		openMenu(e) {
			this.showMenu = true;
			this.menuPosition = { x: e.clientX, y: e.clientY };
		},
		startDrag(e) {
			this.isDragging = true;
		},
		endDrag() {
			if (this.isDragging) this.isDragging = false;
		},
		drag(e) {
			if (this.isDragging) {
				let viewportOffset = this.$el.getBoundingClientRect();
				let percents = [0, 0];
				
				if(this.root.isVertical){
					const offset = viewportOffset.top;
					const y = e.clientY;
					const total = this.$el.clientHeight;
					const top = ((y - offset) / total) * 100;
					const bottom = 100 - top;
					percents = [top, bottom];
				}else{
					const offset = viewportOffset.left;
					const x = e.clientX;
					const total = this.$el.clientWidth;
					const left = ((x - offset) / total) * 100;
					const right = 100 - left;
					percents = [left, right];
				}

				if(percents[0] < 0 || percents[1] < 0) return;
				this.root.children[0].percent = percents[0];
				this.root.children[1].percent = percents[1];
			}
		},
	},
	beforeDestroy() {
		document.removeEventListener('mousemove', this.drag);
		document.removeEventListener('mouseup', this.endDrag);
	}
};
</script>

<style lang="scss">

.node {
	display: flex;
	height: 100%;
	transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-webkit-transition: opacity 0.25s ease-in-out;
	opacity: 1;

	height: 100%;
	width: 100%;
	width: 100%;
	height: 100%;
	display: flex;
	position: relative;
	opacity: 1;


	> .drag-handle {
		width: 4px;
		height: 100%;
		background-color: transparent;
		position: absolute;
		/* top: 0px%; */
		z-index: 1000;

		cursor: ew-resize;
		transition: opacity 0.25s ease-in-out;
		-moz-transition: opacity 0.25s ease-in-out;
		-webkit-transition: opacity 0.25s ease-in-out;

		.visible-part {
			background-color: black;
			width: 100%;
			height: 100%;
			margin-right: 0px;
		}


	}
	&.highlight {
		opacity: 0.8;
	}
	&.vertical{
		> .drag-handle {
			height: 4px;
			width: 100%;

			cursor: ns-resize;
		}
	}
}
</style>
