extends KinematicBody2D

var direction := Vector2.RIGHT;
var velocity := Vector2.ZERO;
var speed := 350;
onready var timer := $Timer;

func _physics_process(delta: float) -> void:
	if direction != Vector2.ZERO:
		direction = direction.normalized();

	var target_velocity := direction * speed;

	velocity = move_and_slide(target_velocity,Vector2.UP);

func _on_Timer_timeout() -> void:
	queue_free();
