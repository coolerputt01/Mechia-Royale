class_name StateMachine
extends Node

var state = null setget setState;
var previous_state = null;

var states = {};

onready var parent = get_parent();

func _physics_process(delta: float) -> void:
	stateLogic(delta);
	if state != null:
		var transition = getTransition();
		if transition != null:
			setState(transition);

func stateLogic(delta):
	pass;

func getTransition():
	return null;

func enterState(state,oldState):
	pass;

func exitState(oldState,newState):
	pass;

func setState(newState):
	previous_state = state;
	state = newState;

	if previous_state != null:
		exitState(previous_state,state);
	if newState != null:
		enterState(state,previous_state);

func addState(newState):
	states[newState] = newState;
