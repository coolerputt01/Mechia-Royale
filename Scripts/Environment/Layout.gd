extends Node2D
onready var player := $Player;
onready var tilemap := $TileMap;

func _ready() -> void:
	player.setPosition(tilemap.getRandomPos());
	print(tilemap.getRandomPos());
