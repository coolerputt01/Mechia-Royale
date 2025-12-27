extends KinematicBody2D

export var speed := 100;
export var acceleration := 0.7;

var direction := Vector2.ZERO;
var velocity := Vector2.ZERO;

onready var bullet_scene := preload("res://Props/Bullet/Bullet.tscn");
onready var label := $Control/StatesLabel;
onready var weapon := $Hand/Gun/Sprite;
#onready var crosshair := $Crosshair;
var weapon_offset_x := 3;
var bullet_offet := Vector2(13,13);

var facingRight = true;

var shakeTimer := 0.0;
var shakeTime := 3.0;
var delt;
var isMoving = true;

func _input(event) -> void:
	if event.is_action_pressed("ui_cancel"):
		get_tree().quit()

	if event is InputEventMouseButton:
		shoot();

func setStateLabel(txt : String):
	$Control/StatesLabel.bbcode_text = txt;

func handleMovement(delta):
	var new_direction = Vector2.ZERO;

	if Input.is_action_pressed("up"):
		new_direction.y -= 1
	if Input.is_action_pressed("down"):
		new_direction.y += 1
	if Input.is_action_pressed("right"):
		new_direction.x += 1
	if Input.is_action_pressed("left"):
		new_direction.x -= 1


	if new_direction != Vector2.ZERO:
		new_direction = new_direction.normalized();

	direction = new_direction;

	var target_velocity = direction * speed;

	velocity = velocity.linear_interpolate(target_velocity, acceleration);
	velocity = move_and_slide(velocity,Vector2.UP);


func _physics_process(delta: float) -> void:
	delt = delta;
	follow_mouse();
	update_flip();

func follow_mouse():
	$Hand.look_at(get_global_mouse_position());

func update_flip():
	facingRight = get_global_mouse_position().x > global_position.x;
	#weapon.flip_h = not facingRight
	if facingRight:
		$Hand.position.x = weapon_offset_x
	else:
		$Hand.position.x = -weapon_offset_x

	$animation.flip_h = !facingRight;


func shakeScreen():
	shakeTimer += delt;
	if shakeTimer <= shakeTime:
		var rx = randf() * 5 + 1;
		var ry = randf() * 5 + 1;
		$Camera2D.offset = Vector2(rx,ry);
	else:
		shakeTime = 0.0;
		$Camera2D.offset = Vector2.ZERO;

func shoot():
	var bullet = bullet_scene.instance();
	get_parent().add_child(bullet);
	shakeScreen();
	bullet.global_position = weapon.global_position + bullet_offet;
	bullet.direction = get_global_mouse_position() - bullet.global_position;
	bullet.rotation = bullet.direction.angle();
