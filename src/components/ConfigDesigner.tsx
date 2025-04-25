import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Chip, Stack } from '@mui/material';
import yaml from 'js-yaml';
import { DesignerConfig, DesignerPhaseInput } from '../types/artillery';

const defaultConfig: DesignerConfig = {
  config: {
    target: '',
    phases: [],
    plugins: {},
    apdex: { threshold: 100 },
    ensure: { thresholds: [] },
  },
  scenarios: [
    { flow: [] }
  ]
};

function ConfigDesigner() {
  const [config, setConfig] = useState<DesignerConfig>(defaultConfig);
  const [phase, setPhase] = useState<DesignerPhaseInput>({ duration: '', arrivalRate: '', rampTo: '', name: '' });
  const [target, setTarget] = useState('');

  // Handlers
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(e.target.value);
    setConfig((prev) => ({ ...prev, config: { ...prev.config, target: e.target.value } }));
  };
  const handlePhaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhase({ ...phase, [e.target.name]: e.target.value });
  };
  const addPhase = () => {
    setConfig((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        phases: [...prev.config.phases, { ...phase, duration: Number(phase.duration), arrivalRate: Number(phase.arrivalRate), rampTo: Number(phase.rampTo) }]
      }
    }));
    setPhase({ duration: '', arrivalRate: '', rampTo: '', name: '' });
  };
  const removePhase = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        phases: prev.config.phases.filter((_, i) => i !== idx)
      }
    }));
  };

  // Plugins (simple toggle)
  const togglePlugin = (plugin: string) => {
    setConfig((prev) => {
      const plugins = { ...prev.config.plugins };
      if (plugins[plugin]) delete plugins[plugin];
      else plugins[plugin] = {};
      return { ...prev, config: { ...prev.config, plugins } };
    });
  };

  // YAML output
  const yamlStr = yaml.dump(config, { lineWidth: 120 });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Design Artillery Config</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField label="Target URL" value={target} onChange={handleTargetChange} fullWidth sx={{ mb: 2 }} />
        <Typography variant="subtitle1">Phases</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField label="Duration (s)" name="duration" value={phase.duration} onChange={handlePhaseChange} size="small" type="number" />
          <TextField label="Arrival Rate" name="arrivalRate" value={phase.arrivalRate} onChange={handlePhaseChange} size="small" type="number" />
          <TextField label="Ramp To" name="rampTo" value={phase.rampTo} onChange={handlePhaseChange} size="small" type="number" />
          <TextField label="Name" name="name" value={phase.name} onChange={handlePhaseChange} size="small" />
          <Button onClick={addPhase} variant="contained">Add Phase</Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {config.config.phases.map((p, idx) => (
            <Chip key={idx} label={`${p.name} (${p.duration}s, ${p.arrivalRate}->${p.rampTo})`} onDelete={() => removePhase(idx)} />
          ))}
        </Stack>
        <Typography variant="subtitle1">Plugins</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {['ensure', 'apdex', 'metrics-by-endpoint'].map(plugin => (
            <Chip
              key={plugin}
              label={plugin}
              color={config.config.plugins[plugin] ? 'primary' : 'default'}
              onClick={() => togglePlugin(plugin)}
              variant={config.config.plugins[plugin] ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
        {/* More fields for apdex, ensure, scenarios, etc. can be added here */}
      </Paper>
      <Typography variant="h6" gutterBottom>YAML Output</Typography>
      <Paper sx={{ p: 2, whiteSpace: 'pre', fontFamily: 'monospace', bgcolor: '#18181b' }}>
        {yamlStr}
      </Paper>
    </Box>
  );
}

export default ConfigDesigner;
