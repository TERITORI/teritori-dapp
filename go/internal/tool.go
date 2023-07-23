//go:build tools
// +build tools

// Package tools ensures that `go mod` detect some required dependencies.
//
// This package should not be imported directly.
package tools

import (
	// required by gomobile
	_ "bazil.org/fuse"
	_ "golang.org/x/mobile/cmd/gomobile"
)
