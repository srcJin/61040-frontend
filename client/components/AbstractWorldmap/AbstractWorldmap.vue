<script>
// here is js, will fix to ts
import { ref } from "vue";
import * as d3 from "d3";
import { onMounted } from "vue";
import data from "@/assets/data.json";
// console.log("us", us);

export default {
  name: "HorizontalBar",
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => ["letter", "frequency"],
    },
    format: {
      type: String,
      default: "%",
    },
  },

  setup(props) {
    const svgRef = ref(null);

    onMounted(() => {
      let svg = d3.select(svgRef.value);
      const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
      const width = 900;
      const height = 600;
      const margin = 1;

      // Set the attributes directly on this SVG, rather than creating a new one
      svg
        .attr("viewBox", [-margin, -margin, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 6px sans-serif;")
        .on("click", reset)
        .call(zoom);

      // Create a root 'g' container inside the SVG
      const gRoot = svg.append("g");

      const name = (d) => d.id.split(".").pop(); // "Strings" of "flare.util.Strings"
      const group = (d) => d.id.split(".")[1]; // "util" of "flare.util.Strings"
      const names = (d) => name(d).split(/(?=[A-Z][a-z])|\s+/g); // ["Legend", "Item"] of "flare.vis.legend.LegendItems"

      // Specify the number format for values.
      const format = d3.format(",d");

      // Convert lat/lng to x/y using Mercator projection
      const projection = d3.geoMercator().fitSize([width, height], { type: "FeatureCollection", features: data });

      // Categorical color scale
      const color = d3.scaleOrdinal(d3.schemeTableau10);

      // Create the pack layout.
      const pack = d3
        .pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

      // Compute the hierarchy from the (flat) data; expose the values
      // for each node; lastly apply the pack layout.
      const root = pack(d3.hierarchy({ children: data }).sum((d) => d.value));

      // Place each (leaf) node according to the layout’s x and y values.
      // Update this in the pack layout
      const node = gRoot
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .on("click", clicked);

      const simulation = d3
        .forceSimulation(data)
        .force("x", d3.forceX((d) => projection([d.lng, d.lat])[0]).strength(0.2))
        .force("y", d3.forceY((d) => projection([d.lng, d.lat])[1]).strength(0.2))
        .force(
          "collide",
          d3.forceCollide((d) => d.r + 2),
        ) // +2 to ensure a little spacing
        .stop();

      for (let i = 0; i < 120; i++) simulation.tick();

      // Add a title.
      node.append("title").text((d) => `${d.data.id}\n${format(d.value)}`);

      // draw hexagon
      node
        .append("path")
        .attr("d", (d) => hexagon(0, 0, d.r)) // Use d.r as the radius for the hexagon.
        .attr("fill-opacity", 0.7)
        .attr("fill", (d) => color(group(d.data)))
        .on("click", clicked);

      // Add a label.
      const text = node.append("text").attr("clip-path", (d) => `circle(${d.r})`);

      // Add a tspan for each CamelCase-separated word.
      text
        .selectAll()
        .data((d) => names(d.data))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
        .text((d) => d)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em");

      // Add a tspan for the node’s value.
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", (d) => `${names(d.data).length / 2 + 0.35}em`)
        // .attr("fill-opacity", 0.7)
        .text((d) => format(d.value))
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em");

      return Object.assign(svg.node(), { scales: { color } });

      function reset() {
        node.transition().style("fill", (d) => color(group(d.data)));
        svg
          .transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
      }

      function clicked(event, d) {
        const bbox = d3.select(this).node().getBBox();
        const [x0, y0, x1, y1] = [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height];
        event.stopPropagation();

        // node.transition().style("fill", (d) => color(white));
        // d3.select(this).transition().style("fill", "red");

        const MAX_ZOOM_SCALE = 3; // You can tweak this value
        const scale = Math.min(MAX_ZOOM_SCALE, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));

        const translateX = width / 2 - scale * d.x;
        const translateY = height / 2 - scale * d.y;

        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale), d3.pointer(event, svg.node()));
      }

      function zoomed(event) {
        const { transform } = event;
        gRoot.attr("transform", transform);
      }

      function hexagon(x, y, radius) {
        const angleStep = Math.PI / 3;
        let path = d3.path();
        path.moveTo(x + radius, y);
        for (let i = 1; i < 6; i++) {
          let angle = angleStep * i;
          let relX = x + radius * Math.cos(angle);
          let relY = y + radius * Math.sin(angle);
          path.lineTo(relX, relY);
        }
        path.closePath();
        return path.toString();
      }
    });
    console.log("last svgRef", svgRef);
    return { svgRef }; // Return the reactive reference
  },
};
</script>

<template>
  <div>
    <svg ref="svgRef"></svg>
  </div>
</template>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
