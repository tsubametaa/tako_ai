package aiclient

import (
	"sync"
	"time"
)

type breakerState int

const (
	stateClosed breakerState = iota
	stateOpen
	stateHalfOpen
)

type CircuitBreaker struct {
	mu               sync.Mutex
	state            breakerState
	failures         int
	failureThreshold int
	cooldown         time.Duration
	openedAt         time.Time
	probeInFlight    bool
}

func NewCircuitBreaker(failureThreshold int, cooldown time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		state:            stateClosed,
		failureThreshold: failureThreshold,
		cooldown:         cooldown,
	}
}

func (cb *CircuitBreaker) Allow() bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	switch cb.state {
	case stateClosed:
		return true
	case stateOpen:
		if time.Since(cb.openedAt) < cb.cooldown {
			return false
		}
		cb.state = stateHalfOpen
		cb.probeInFlight = true
		return true
	case stateHalfOpen:
		if cb.probeInFlight {
			return false
		}
		cb.probeInFlight = true
		return true
	default:
		return true
	}
}

func (cb *CircuitBreaker) Success() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.state = stateClosed
	cb.failures = 0
	cb.probeInFlight = false
}

func (cb *CircuitBreaker) Failure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.state == stateHalfOpen {
		cb.state = stateOpen
		cb.openedAt = time.Now()
		cb.probeInFlight = false
		return
	}

	cb.failures++
	if cb.failures >= cb.failureThreshold {
		cb.state = stateOpen
		cb.openedAt = time.Now()
	}
}

