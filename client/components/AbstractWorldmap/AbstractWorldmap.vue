<script>
// here is js, will fix to ts
import { ref } from "vue";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import us from "@/assets/us.json";

export default {
  name: "HorizontalBar",
  props: {
    entries: {
      type: Array,
      default: () => [
        { name: "E", value: 0.12702 },
        { name: "T", value: 0.09056 },
        { name: "A", value: 0.08167 },
        { name: "O", value: 0.07507 },
        { name: "I", value: 0.06966 },
        { name: "N", value: 0.06749 },
        { name: "S", value: 0.06327 },
        { name: "H", value: 0.06094 },
        { name: "R", value: 0.05987 },
        { name: "D", value: 0.04253 },
        { name: "L", value: 0.04025 },
        { name: "C", value: 0.02782 },
        { name: "U", value: 0.02758 },
        { name: "M", value: 0.02406 },
        { name: "W", value: 0.0236 },
        { name: "F", value: 0.02288 },
        { name: "G", value: 0.02015 },
        { name: "Y", value: 0.01974 },
        { name: "P", value: 0.01929 },
        { name: "B", value: 0.01492 },
        { name: "V", value: 0.00978 },
        { name: "K", value: 0.00772 },
        { name: "J", value: 0.00153 },
        { name: "X", value: 0.0015 },
        { name: "Q", value: 0.00095 },
        { name: "Z", value: 0.00074 },
      ],
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

    const svg = d3.select(svgRef.value);

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    // Define width, height, and other D3 related constants
    const width = 975;
    const height = 610;

    svg.attr("viewBox", [0, 0, width, height]).attr("width", width).attr("height", height).attr("style", "max-width: 100%; height: auto;").on("click", reset);

    const path = d3.geoPath();

    const g = svg.append("g");

    const states = g
      .append("g")
      .attr("fill", "#444")
      .attr("cursor", "pointer")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .join("path")
      .on("click", clicked)
      .attr("d", path);

    states.append("title").text((d) => d.properties.name);

    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

    svg.call(zoom);

    function reset() {
      states.transition().style("fill", null);
      svg
        .transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
    }

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      states.transition().style("fill", null);
      d3.select(this).transition().style("fill", "red");
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node()),
        );
    }

    function zoomed(event) {
      const { transform } = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    return svg.node();
  },
};
</script>

<template>
  <div>
    <svg ref="svgRef"></svg>

    <!-- <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
      <g v-for="(entry, index) in entries" :key="'bar-' + index" fill="seagreen">
        <rect :x="x(0)" :y="y(index)" :width="Number(x(entry.value)) - Number(x(0))" :height="y.bandwidth()" />
      </g>
      <g v-for="(entry, index) in entries" :key="'text-' + index" fill="white">
        <text :x="x(entry.value)" :y="Number(y(index)) + Number(y.bandwidth()) / 2" dx="-45" dy="0.35em">{{ formattedText(entry.value) }}</text>
      </g>
      <g :transform="`translate(0, ${margin.top})`">
        <g v-for="(num, index) in maxNumber" :key="'x-' + num" opacity="1" :transform="`translate(${Number(x(index)) / 101 + 45}, 0)`">
          <line stroke="darkgreen" y2="-6"></line>
          <text fill="darkgreen" x="-4" y="-9" dy="0em">{{ index + format }}</text>
        </g>
      </g>
      <g :transform="`translate(${margin.left}, 0)`">
        <path class="domain" stroke="darkgreen" d="M0.5,30.5V683.5"></path>
        <g v-for="(entry, index) in entries" :key="'y-' + index" opacity="1" :transform="`translate(0, ${Number(y(index)) + 12})`">
          <line stroke="darkgreen" x2="-6"></line>
          <text fill="darkgreen" x="-25" dy="0.32em">{{ entry.name }}</text>
        </g>
      </g>
    </svg> -->
  </div>
</template>
