extends KinematicBody2D

var direction := Vector2.RIGHT;
var velocity := Vector2.ZERO;
var speed := 350;
onready var timer := $Timer;

func _physics_process(delta: float) -> void:
	if direction != Vector2.ZERO:
		direction = direction.normalized();

	var target_velocity : Vector2 = direction * speed;

	var collide = move_and_collide(target_velocity * delta);

	if collide:
		var normal = Vector2(-collide.normal.x,collide.normal.y);
		direction = direction.bounce(normal).normalized();
		rotation = direction.angle();

func _on_Timer_timeout() -> void:
	queue_free();
