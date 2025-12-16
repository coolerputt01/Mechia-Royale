extends KinematicBody2D

var direction := Vector2.RIGHT;
var velocity := Vector2.ZERO;
var speed := 50;
func _physics_process(delta: float) -> void:
	var target_velocity := direction * speed;
	velocity = move_and_slide(target_velocity,Vector2.UP);
