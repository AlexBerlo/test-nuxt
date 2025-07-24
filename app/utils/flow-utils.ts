// Flow editor utility functions

/**
 * Calculate non-overlapping position for new node
 * @param existingNodes - Array of existing nodes with position data
 * @returns Position object with x and y coordinates
 */
export const calculateNewNodePosition = (existingNodes: Array<{ position: { x: number; y: number } }>) => {
  const nodeWidth = 384; // w-96
  const nodeHeight = 224; // h-56
  const minSpacing = 50; // minimum gap between nodes
  const gridSize = 150; // grid spacing

  // Start from center of viewport
  const startX = 200;
  const startY = 200;

  // If no existing nodes, use starting position
  if (existingNodes.length === 0) {
    return { x: startX, y: startY };
  }

  // Try positions in expanding spiral
  for (let radius = 0; radius < 2000; radius += gridSize) {
    const positions = [];

    if (radius === 0) {
      positions.push({ x: startX, y: startY });
    }
    else {
      // Generate positions in a circle around the center
      const steps = Math.max(8, Math.floor(radius / 50));
      for (let i = 0; i < steps; i++) {
        const angle = (i * 2 * Math.PI) / steps;
        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);
        positions.push({ x, y });
      }
    }

    // Check each position for overlaps
    for (const pos of positions) {
      let hasOverlap = false;

      for (const node of existingNodes) {
        const dx = Math.abs(pos.x - node.position.x);
        const dy = Math.abs(pos.y - node.position.y);

        if (dx < nodeWidth + minSpacing && dy < nodeHeight + minSpacing) {
          hasOverlap = true;
          break;
        }
      }

      if (!hasOverlap) {
        return pos;
      }
    }
  }

  // Fallback: random position if no suitable position found
  return { x: Math.random() * 400, y: Math.random() * 400 };
};

/**
 * Generate random color for progression options
 * @param index - Index of the progression option
 * @returns Hex color string
 */
export const getRandomColor = (index: number): string => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#fb7185'
  ];
  return colors[index % colors.length] || '#ef4444';
};
