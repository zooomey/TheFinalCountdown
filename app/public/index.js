// Credit: https://github.com/Shopify/draggable/blob/master/examples/src/content/Swappable/Flexbox/index.js

import {Swappable, Plugins} from '@shopify/draggable';

export default function Flexbox() {
  const containers = document.querySelectorAll('#Flexbox .BlockLayout');

  if (containers.length === 0) {
    return false;
  }

  const swappable = new Swappable(containers, {
    draggable: '.Block--isDraggable',
    mirror: {
      constrainDimensions: true,
    },
    plugins: [Plugins.ResizeMirror],
  });

  return swappable;
}