import React, { useEffect, useRef, useState } from "react";
import { useSimulationStore } from "../store/simulationStore";

interface Node {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
}

const width = 500,
  height = 500;
const centerX = width / 2,
  centerY = height / 2;
const nodeRadius = 28;
const repulsion = 20000;
const attraction = 0.05;
const damping = 0.85;
const timeStep = 0.8;

export const RelationshipGraph: React.FC = () => {
  const agents = useSimulationStore((state) => state.agents);
  const initialNodes: Node[] = agents.map((a, i) => ({
    id: a.id,
    name: a.name,
    avatar: a.avatar,
    x: centerX + 180 * Math.cos((2 * Math.PI * i) / agents.length),
    y: centerY + 180 * Math.sin((2 * Math.PI * i) / agents.length),
    vx: 0,
    vy: 0,
  }));
  const edges: Edge[] = [];
  for (const agent of agents) {
    for (const [otherId, strength] of Object.entries(
      agent.relationships || {}
    )) {
      if (agent.id < otherId) {
        edges.push({ source: agent.id, target: otherId, strength });
      }
    }
  }
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setNodes(initialNodes);
  }, [agents.length]);

  useEffect(() => {
    if (nodes.length === 0) return;
    function step() {
      const newNodes = nodes.map((n) => ({ ...n }));
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          const dx = newNodes[j].x - newNodes[i].x;
          const dy = newNodes[j].y - newNodes[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = repulsion / (dist * dist);
          const fx = (force * dx) / dist;
          const fy = (force * dy) / dist;
          newNodes[i].vx -= fx;
          newNodes[i].vy -= fy;
          newNodes[j].vx += fx;
          newNodes[j].vy += fy;
        }
      }
      for (const edge of edges) {
        const a = newNodes.find((n) => n.id === edge.source);
        const b = newNodes.find((n) => n.id === edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const desired = 120 - 60 * edge.strength;
        const diff = dist - desired;
        const force = attraction * diff;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      for (const n of newNodes) {
        n.vx += (centerX - n.x) * 0.001;
        n.vy += (centerY - n.y) * 0.001;
      }
      for (const n of newNodes) {
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx * timeStep;
        n.y += n.vy * timeStep;
        n.x = Math.max(nodeRadius, Math.min(width - nodeRadius, n.x));
        n.y = Math.max(nodeRadius, Math.min(height - nodeRadius, n.y));
      }
      setNodes(newNodes);
      animationRef.current = requestAnimationFrame(step);
    }
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [agents.length, edges.length]);

  function getEdgeColor(strength: number) {
    if (strength > 0.3) return "#22c55e";
    if (strength < -0.3) return "#ef4444";
    return "#a3a3a3";
  }
  function getEdgeWidth(strength: number) {
    return 1 + Math.abs(strength) * 4;
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={width} height={height}>
        {}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.source];
          const to = nodeMap[edge.target];
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={getEdgeColor(edge.strength)}
              strokeWidth={getEdgeWidth(edge.strength)}
              opacity={0.7}
            />
          );
        })}
        {}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill="#fff"
              stroke="#7B61FF"
              strokeWidth={2}
              filter="url(#shadow)"
            />
            <text
              x={node.x}
              y={node.y + 6}
              textAnchor="middle"
              fontSize={24}
              fontFamily="sans-serif"
            >
              {node.avatar}
            </text>
            <text
              x={node.x}
              y={node.y + 38}
              textAnchor="middle"
              fontSize={13}
              fill="#333"
              fontFamily="sans-serif"
            >
              {node.name}
            </text>
          </g>
        ))}
        {}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#000"
              floodOpacity="0.15"
            />
          </filter>
        </defs>
      </svg>
      <div className="text-xs text-gray-500 mt-2">
        Green = strong, Red = negative, Gray = neutral
      </div>
    </div>
  );
};
