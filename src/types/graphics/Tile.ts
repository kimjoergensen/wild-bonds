export type Tile = PathTile | GrassTile;

export type PathTile = 'path_nw' | 'path_n' | 'path_ne' | 'path_w' | 'path_e' | 'path_sw' | 'path_s' | 'path_se' | 'path_corner_nw' | 'path_corner_ne' | 'path_corner_sw' | 'path_corner_se' | 'path' | 'path_1' | 'path_2' | 'path_3';
export type GrassTile = 'grass_nw' | 'grass_n' | 'grass_ne' | 'grass_w' | 'grass_e' | 'grass_sw' | 'grass_s' | 'grass_se' | 'grass_corner_nw' | 'grass_corner_ne' | 'grass_corner_sw' | 'grass_corner_se' | 'grass' | 'grass_1' | 'grass_2' | 'grass_3';