import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ElectricCar as ElectricCarIcon,
  TwoWheeler as TwoWheelerIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import StationFilters from './StationFilters';
import ForecastChart from './ForecastChart';
import OverloadAnalysis from './OverloadAnalysis';
import SolarAnalysis from './SolarAnalysis';
import StationMap from './StationMap';
import TopStationsTable from './TopStationsTable';
import WhatIfSimulator from './WhatIfSimulator';
import { apiService } from '../services/apiService';

interface Station {
  station_id: number;
  station_name: string;
  latitude: number;
  longitude: number;
}

interface ForecastData {
  station_name: string;
  vehicle_type: string;
  date: string;
  forecast: Array<{
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
  }>;
}

const EVDashboard: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('car');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      loadForecast();
    }
  }, [selectedStation, selectedVehicleType, selectedDate]);

  const loadStations = async () => {
    try {
      const stationsData = await apiService.getStations();
      setStations(stationsData);
      if (stationsData.length > 0) {
        setSelectedStation(stationsData[0].station_name);
      }
    } catch (err) {
      setError('Failed to load stations');
    }
  };

  const loadForecast = async () => {
    if (!selectedStation) return;
    
    setLoading(true);
    setError('');
    
    try {
      const forecast = await apiService.getForecast(
        selectedStation,
        selectedVehicleType,
        selectedDate
      );
      setForecastData(forecast);
    } catch (err) {
      setError('Failed to load forecast data');
    } finally {
      setLoading(false);
    }
  };

  const handleStationChange = (station: string) => {
    setSelectedStation(station);
  };

  const handleVehicleTypeChange = (vehicleType: string) => {
    setSelectedVehicleType(vehicleType);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: 'rgba(255,255,255,0.2)',
            mr: 2
          }}>
            <ElectricCarIcon />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EV Charging Demand Forecast Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <StationFilters
          stations={stations}
          selectedStation={selectedStation}
          selectedVehicleType={selectedVehicleType}
          selectedDate={selectedDate}
          onStationChange={handleStationChange}
          onVehicleTypeChange={handleVehicleTypeChange}
          onDateChange={handleDateChange}
        />

        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
              Loading forecast data...
            </Typography>
          </Box>
        )}

        {/* Main Content Layout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Top Row - Chart and Top Stations */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' }, 
            gap: 3 
          }}>
            {/* Main Forecast Chart */}
            <Box sx={{ flex: { lg: 2 } }}>
              <Card sx={{ height: '100%' }}>
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
                      <TimelineIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Demand Forecast
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedStation} • {selectedVehicleType} • {format(new Date(selectedDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                  {forecastData && (
                    <ForecastChart 
                      data={forecastData.forecast}
                      title={`${selectedStation} - ${selectedVehicleType}`}
                    />
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Top Stations */}
            <Box sx={{ flex: { lg: 1 } }}>
              <TopStationsTable 
                vehicleType={selectedVehicleType}
                date={selectedDate}
              />
            </Box>
          </Box>

          {/* Middle Row - Analysis Cards */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            {/* Overload Analysis */}
            <Box sx={{ flex: 1 }}>
              <OverloadAnalysis date={selectedDate} />
            </Box>

            {/* Solar Analysis */}
            <Box sx={{ flex: 1 }}>
              <SolarAnalysis date={selectedDate} />
            </Box>
          </Box>

          {/* Bottom Row - Map and Simulator */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Station Map */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: 'info.main',
                    color: 'white',
                    mr: 2
                  }}>
                    <LocationIcon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Station Network Map
                  </Typography>
                </Box>
                <StationMap 
                  stations={stations}
                  selectedStation={selectedStation}
                  vehicleType={selectedVehicleType}
                />
              </CardContent>
            </Card>

            {/* What-If Simulator */}
            <WhatIfSimulator 
              stations={stations}
              selectedDate={selectedDate}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EVDashboard;
