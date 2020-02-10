<template lang="pug">
	.node(
		:style="nodeStyle"
		:class="nodeclass"
		@contextmenu.stop.prevent="openMenu"
	)
		.children(v-if="hasChildren" :style="{'flex-flow': root.isVertical ? 'column' : 'row'}")
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
		document.addEventListener("mousemove", this.drag);
		document.addEventListener("mouseup", this.endDrag);
	},
	computed: {
		nodeStyle() {
			let style = {
				"flex-basis": `${this.root.width}%`
			};
			if (!this.hasChildren) {
				style["background-color"] = this.root.color;
				if(this.root.isVertical) style['flex-flow'] = 'column';

			}

			
			return style;
		},
		nodeclass(){
			return {
				'highlight': this.hoveringDragHandle || this.isDragging,
				'vertical': this.root.isVertical
			}
		},
		dragHandleStyle() {
			return {
				left: `${this.childrenWidths[0]}%`
			};
		},

		childrenWidths() {
			return [this.root.children[0].width, this.root.children[1].width];
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
				width: 50,
				children: [],
				depth: this.root.depth + 1
			});

			this.root.children.push({
				color: (this.root.color = chroma.random()),
				width: 50,
				children: [],
				depth: this.root.depth + 1
			});

			this.$root.$data.height++;
		},
		openMenu(e) {
			console.log(e);
			this.showMenu = true;
			this.menuPosition = { x: e.clientX, y: e.clientY };
		},
		startDrag(e) {
			console.log(e);
			this.isDragging = true;
		},
		endDrag() {
			if (this.isDragging) this.isDragging = false;
		},
		drag(e) {
			if (this.isDragging) {
				let offset = this.$el.offsetLeft;
				let x = e.clientX;
				let total = this.$el.clientWidth;
				let left = ((x - offset) / total) * 100;
				let right = 100 - left;

				this.root.children[0].width = left;
				this.root.children[1].width = right;
			}
		},
	},
	beforeDestroy() {
		document.removeEventListener("mousemove", this.drag);
		document.removeEventListener("mouseup", this.endDrag);
	}
};
</script>

<style lang="scss">
#app {
	background-color: black;
}
.node {
	display: flex;
	height: 100%;
	transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-webkit-transition: opacity 0.25s ease-in-out;
	opacity: 1;

	.children {
		width: 100%;
		height: 100%;
		display: flex;
		position: relative;
		opacity: 1;
		.drag-handle {
			width: 4px;
			height: 100%;
			background-color: transparent;
			position: absolute;
			/* top: 0px%; */
			z-index: 1000;

			cursor: ew-resize;
			opacity: 0;
			transition: opacity 0.25s ease-in-out;
			-moz-transition: opacity 0.25s ease-in-out;
			-webkit-transition: opacity 0.25s ease-in-out;
		}
	}

}


.node .highlight {
	opacity: 0.8;
}


.drag-handle.highlight {
	opacity: 1;
}

.drag-handle .visible-part {
	background-color: black;
	width: 4px;
	height: 100%;
	margin-right: 0px;
}

.leaf {
	height: 100%;
	width: 100%;
}

</style>
