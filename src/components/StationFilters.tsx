import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { TuneOutlined as FilterIcon } from '@mui/icons-material';

interface Station {
  station_id: number;
  station_name: string;
  latitude: number;
  longitude: number;
}

interface StationFiltersProps {
  stations: Station[];
  selectedStation: string;
  selectedVehicleType: string;
  selectedDate: string;
  onStationChange: (station: string) => void;
  onVehicleTypeChange: (vehicleType: string) => void;
  onDateChange: (date: string) => void;
}

const StationFilters: React.FC<StationFiltersProps> = ({
  stations,
  selectedStation,
  selectedVehicleType,
  selectedDate,
  onStationChange,
  onVehicleTypeChange,
  onDateChange,
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: 'primary.main',
            color: 'white',
            mr: 2
          }}>
            <FilterIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Filter Options
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your forecast view
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontWeight: 500 }}>Charging Station</InputLabel>
              <Select
                value={selectedStation}
                label="Charging Station"
                onChange={(e) => onStationChange(e.target.value)}
              >
                {stations.map((station) => (
                  <MenuItem key={station.station_id} value={station.station_name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main' 
                      }} />
                      {station.station_name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontWeight: 500 }}>Vehicle Type</InputLabel>
              <Select
                value={selectedVehicleType}
                label="Vehicle Type"
                onChange={(e) => onVehicleTypeChange(e.target.value)}
              >
                <MenuItem value="car">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'secondary.main' 
                    }} />
                    Electric Car
                  </Box>
                </MenuItem>
                <MenuItem value="scooter">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'warning.main' 
                    }} />
                    Electric Scooter
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Forecast Date"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
                sx: { fontWeight: 500 }
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StationFilters;
