package persona

type Config struct {
	Style              string `json:"style"`
	Tone               string `json:"tone"`
	IncludeCode        bool   `json:"includeCode"`
	CustomInstructions string `json:"customInstructions"`
	CompiledPersona    string `json:"compiledPersona,omitempty"`
}

func DefaultConfig() Config {
	return Config{
		Style:       "structured",
		Tone:        "friendly",
		IncludeCode: true,
	}
}

