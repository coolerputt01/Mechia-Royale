extends KinematicBody2D

export var speed := 500;
export var acceleration := 0.7;

var direction := Vector2.ZERO;
var velocity := Vector2.ZERO;

onready var bullet_scene := preload("res://Props/Bullet/Bullet.tscn");

func _physics_process(delta: float) -> void:
	direction = Vector2.ZERO;

	if Input.is_action_pressed("up"):
		direction.y -= 1;
	if Input.is_action_pressed("down"):
		direction.y += 1;
	if Input.is_action_pressed("right"):
		direction.x += 1;
	if Input.is_action_pressed("left"):
		direction.x -= 1;

	if Input.is_action_just_pressed("shoot"):
		var bullet = bullet_scene.instance();
		get_parent().add_child(bullet);
		bullet.global_position = position;
		print("shoot")

	if direction != Vector2.ZERO:
		direction = direction.normalized();

	var target_velocity = direction * speed;

	target_velocity = lerp(target_velocity,direction,acceleration);

	velocity = move_and_slide(target_velocity,Vector2.UP);
