import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputAdornment,
  IconButton,
  Typography,
  Popper,
  ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  label, 
  getOptionLabel = (option) => option.name,
  required = false,
  placeholder = "Search...",
  initialSearchTerm = ""
}) {
  // Initialize searchTerm with either the selected value's label or initialSearchTerm
  const [searchTerm, setSearchTerm] = useState(() => {
    if (value) {
      return getOptionLabel(value);
    }
    return initialSearchTerm || '';
  });

  // Update searchTerm when value changes externally
  useEffect(() => {
    if (value) {
      setSearchTerm(getOptionLabel(value));
    }
  }, [value, getOptionLabel]);

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Memoize filtered options with debounce-like behavior
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options.slice(0, 50); // Limit initial display
    
    const searchLower = searchTerm.toLowerCase();
    return options
      .filter(option => 
        getOptionLabel(option).toLowerCase().includes(searchLower) ||
        (option.phone && option.phone.includes(searchTerm))
      )
      .slice(0, 50); // Limit results
  }, [searchTerm, options, getOptionLabel]);

  const handleInputClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  }, []);

  const handleOptionSelect = useCallback((option) => {
    onChange(option);
    setSearchTerm(getOptionLabel(option));
    setIsOpen(false);
  }, [onChange, getOptionLabel]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setIsOpen(true);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    onChange(null);
  }, [onChange]);

  const handleClickAway = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel required={required}>{label}</InputLabel>
          <OutlinedInput
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={handleInputClick}
            placeholder={placeholder}
            label={label}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </FormControl>

        <Popper
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{ width: anchorEl?.offsetWidth, zIndex: 1500 }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              maxHeight: 300, 
              overflow: 'auto',
              mt: 1,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <List dense>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    button
                    selected={value?.id === option.id}
                    sx={{
                      padding: { xs: '8px', sm: '12px' },
                      '& .MuiListItemText-primary': {
                        fontSize: { xs: '14px', sm: '16px' }
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: { xs: '12px', sm: '14px' }
                      }
                    }}
                  >
                    <ListItemText
                      primary={getOptionLabel(option)}
                      secondary={option.phone}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary">
                        No matches found
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

export default React.memo(SearchableSelect); 