extends TileMap

enum BIOMES {
	GREEN,
	BLUE,
	PINK
}

var tileIds := {
	BIOMES.BLUE : [0,1,2,3,4,5,6,7,8],
	BIOMES.GREEN : [13,14,15,16,17,18,19,20,21],
	BIOMES.PINK : [22,23,24,25,26,27,28,29,30],
	"DIRT" : [9,10,11,12]
}

export var map_width := 25;
export var map_height := 25
var map_data = [];
const DIRT = -1

func initialize_map():
	clear();
	map_data.clear()
	for y in range(map_height):
		map_data.append([])
		for x in range(map_width):
			map_data[y].append(null)

func _ready():
	randomize()
	initialize_map()
	generateBiomes()
	generatePaths()
	placeTiles();


func generateBiomes():
	for y in range(map_height):
		for x in range(map_width):
			if x < map_width/3:
				map_data[y][x] = BIOMES.GREEN;
			elif x < 2 * map_width / 3:
				map_data[y][x] = BIOMES.PINK;
			else:
				map_data[y][x] = BIOMES.BLUE;

func generatePaths():
	var y = int(map_height / 2)
	for x in range(map_width):
		map_data[y][x] = DIRT;
		if randi() % 2 == 0:
			y += int(rand_range(-1,1))
			y = clamp(y, 0, map_height-1);

func getBiomeId(x,y):
	var biome = map_data[y][x];
	var top = null;
	if y > 0:
		top = map_data[y-1][x]
	var bottom = null
	if y < map_height-1:
		bottom = map_data[y+1][x]
	var left = null
	if x > 0:
		left = map_data[y][x-1]
	var right = null
	if x < map_width-1:
		right = map_data[y][x+1]

	var neighbors = {
		"top": top,
		"bottom": bottom,
		"left": left,
		"right": right
	}
	var idx = 4;
	if neighbors["top"] != biome and neighbors["left"] != biome:
		idx = 0;
	elif neighbors["top"] != biome and neighbors["right"] != biome:
		idx = 2;
	elif neighbors["bottom"] != biome and neighbors["left"] != biome:
		idx = 6;
	elif neighbors["bottom"] != biome and neighbors["right"] != biome:
		idx = 8;
	elif neighbors["top"] != biome:
		idx = 1;
	elif neighbors["bottom"] != biome:
		idx = 7;
	elif neighbors["left"] != biome:
		idx = 3;
	elif neighbors["right"] != biome:
		idx = 5;

	return tileIds[biome][idx]


func get_dirt_tile_id(x, y):
	var top = null
	if y > 0:
		top = map_data[y-1][x]

	var bottom = null
	if y < map_height - 1:
		bottom = map_data[y+1][x]

	var left = null
	if x > 0:
		left = map_data[y][x-1]

	var right = null
	if x < map_width - 1:
		right = map_data[y][x+1]

	# Get biome of this tile
	var biome = map_data[y][x]
	if biome == DIRT:
		# If the tile itself is dirt, pick biome from nearby tiles (default to GREEN)
		if y > 0 and map_data[y-1][x] != DIRT:
			biome = map_data[y-1][x]
		elif x > 0 and map_data[y][x-1] != DIRT:
			biome = map_data[y][x-1]
		else:
			biome = BIOMES.GREEN

	var horizontal = (left == DIRT or right == DIRT)
	var vertical = (top == DIRT or bottom == DIRT)
	var variant = 0

	if horizontal and vertical:
		variant = 3
	elif horizontal:
		variant = 0
	elif vertical:
		variant = 1
	else:
		variant = 2

	return tileIds["DIRT"][variant]


func placeTiles():
	for y in range(map_height):
		for x in range(map_width):
			var tile_type = map_data[y][x];
			var tile_id = 0
			if tile_type == DIRT:
				tile_id = get_dirt_tile_id(x, y)
			else:
				tile_id = getBiomeId(x, y)
			set_cell(x, y, tile_id);
