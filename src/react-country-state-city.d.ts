declare module 'react-country-state-city' {
    import * as React from 'react';
  
    interface CountrySelectProps {
      value?: string;
      onChange?: (country: { id: string }) => void;
      placeHolder?: string;
    }
  
    interface StateSelectProps {
      countryid: string;
      value?: string;
      onChange?: (state: { id: string }) => void;
      placeHolder?: string;
    }
  
    export const CountrySelect: React.FC<CountrySelectProps>;
    export const StateSelect: React.FC<StateSelectProps>;
    export const CitySelect: React.FC<any>;  
  }