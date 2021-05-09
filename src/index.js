import G6 from '@antv/g6';

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  layout: {
    type: 'force',
    preventOverlap: true,
  },
    defaultEdge:{style: {
  endArrow: {
    path: G6.Arrow.triangle(10, 10, 25),
      d:25,// Using the built-in edges for the path, parameters are the width, length, offset (0 by default, corresponds to d), respectively
      stroke:"#818181",
      fill:"#818181"
  },
}},
  modes: {
    default: ['drag-canvas'],
  },
});

fetch('./test.json')
  .then((res) => res.json())
  .then((data) => {
    const nodes = data.nodes;
    // randomize the node size
    nodes.forEach((node) => {
      node.size = 70;
    });
    graph.data({
      nodes,
      edges:data.edges.map(function (edge, i) {
        edge.id = 'edge' + i;
        edge.color="#818181"
        return Object.assign({}, edge);

      }),
    });
    graph.render();
    graph.on('node:click', (ev) => {
        graph.getComboChildren().forEach((node)=>{
            node.hide()
        })
});
    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      const forceLayout = graph.get('layoutController').layoutMethods[0];
      forceLayout.execute();
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
      e.item.get('model').fx = null;
      e.item.get('model').fy = null;
    });
  });

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };

function refreshDragedNodePosition(e) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}
