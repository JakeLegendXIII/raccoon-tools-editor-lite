# raccoon-tools-editor-lite
Simplified web level editor for creating tactics game levels and game data for one of my toy game engines.

Web hosted tool that allows for importing and exporting JSON based level files. You can also create, duplicate, import, and switch between multiple levels at a time.

There are various simple tools and a visualizer for editing Players, Enemies, Start Positions, and Obstacles on a Grid.

You can also create, import, and export Items and Passive abilities separately from the level data.

## Codebase Summary

The current implementation is a lightweight Angular editor built with standalone components, Angular Material, and NgRx state management. Level data is modeled around grid dimensions, biome, difficulty and objective metadata, turn limits, win positions, and collections of players, enemies, obstacles, and start positions. Item and Passive definitions are managed separately so game data can be edited alongside map content without being mixed into the level model.

The main Level Editor keeps level properties and the Player, Enemy, Obstacle, and Start Position lists together in expandable panels beside the grid visualizer. The visualizer renders the active level as a 2D board and supports placing and repositioning units, obstacles, win positions, and start tiles. Multiple loaded levels can be kept in memory, duplicated, and switched inside the UI, which makes the tool useful for batch editing rather than only one-file-at-a-time authoring. Items, Passives, level export, and the Ounces to ML converter are available as focused tools from the application menu.

JSON import and export are core to the repository. Multiple level files can be imported together, while the active level can be exported as its own JSON file. Items and Passives have their own JSON import and export workflows. Import logic does more than raw parsing: level files are sanitized and normalized before being loaded into the store, while Item and Passive files are checked for their expected shape and duplicate IDs. In practice, that makes this repo a browser-based content editor for tactics-style levels and supporting game data, with enough structure to support safer iteration on hand-authored or engine-generated files.
