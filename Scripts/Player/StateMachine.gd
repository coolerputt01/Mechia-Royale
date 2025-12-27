extends "res://Scripts/Character/StateMachine.gd"

func _ready() -> void:
	addState("IDLE");
	addState("MOVE");
	addState("SHOOT");
	addState("BLINK");
	call_deferred("setState","IDLE");

	parent.get_node("animation").play("IDLE");
	parent.setStateLabel("IDLE");
	parent.isMoving = true;
	parent.get_node("animation").flip_h = false;

func stateLogic(delta):
	if state == states.MOVE:
		parent.handleMovement(delta);

func getTransition():
	if Input.is_action_pressed("shoot"):
		return states.BLINK;
	if (Input.is_action_pressed("up") or Input.is_action_pressed("down") or Input.is_action_pressed("left") or Input.is_action_pressed("right")):
		return states.MOVE;
		print("hi");
	else:
		return states.IDLE;


func enterState(state,oldState):
	match state:
		"IDLE":
			parent.get_node("animation").play("IDLE");
			#parent.setStateLabel("IDLE");
		"MOVE":
			parent.get_node("animation").play("MOVE");
			parent.get_node("Hand/Gun/animation").play("MOVE");
			#parent.setStateLabel("MOVE");
		"SHOOT":
			parent.get_node("animation").play("SHOOT");
			#parent.setStateLabel("SHOOT");
		"BLINK":
			parent.get_node("animation").play("BLINK");
			#parent.setStateLabel("BLINK");
			parent.shakeScreen();
			#parent.shoot();
	parent.setStateLabel(state);

func exitState(oldState,newState):
	pass;
