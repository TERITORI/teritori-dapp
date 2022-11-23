package marketplace

func subSlice[S ~[]E, E any](s S, start int, end int) S {
	ll := len(s)
	if start > ll {
		start = ll
	}
	if end > ll {
		end = ll
	}
	return s[start:end]
}
