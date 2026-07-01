# raccoon-tools-editor-lite
Simplified web level editor for creating tactics game levels in one of my toy game engines.

Web hosted tool that will allow for importing and exporting json based level files. You can also create and import multiple levels at a time.

There are various simple tools and a visualizer for placing Players, Enemies, Start Positions, and Obstacles on a Grid.

You can also create Items and there are plans to add Passive abilities someday.

## Codebase Summary

The current implementation is a lightweight Angular editor built with standalone components, Angular Material, and NgRx state management. Level data is modeled around grid dimensions, biome and objective metadata, turn limits, win positions, and collections of players, enemies, obstacles, and start positions. Item definitions are managed separately so combat data can be edited alongside map content without being mixed into the level model.

The editing workflow is split into focused screens for level properties, entity lists, item lists, export, and a grid visualizer. The visualizer renders the active level as a 2D board and supports drag-and-drop repositioning for units, obstacles, escape targets, and start tiles. Multiple loaded levels can be kept in memory and switched inside the UI, which makes the tool useful for batch editing rather than only one-file-at-a-time authoring.

JSON import and export are core to the repository. Import logic does more than raw parsing: it validates file shape, clamps numeric values, normalizes enum-backed fields, and sanitizes strings before data is loaded into the store. In practice, that makes this repo a browser-based content editor for tactics-style level files, with enough structure to support safer iteration on hand-authored or engine-generated data.
