'use client';
import React from 'react';
import { Provider } from '@/components/ui/provider';
import { ColorModeProvider } from './components/ui/color-mode';
import HeroSection from "@/components/main/HeroSection/HeroSection";
import "@/styles/global.css";

function App() {
  return (
    <ColorModeProvider>
        <Provider>
            <HeroSection />
        </Provider>
    </ColorModeProvider>
  );
}

export default App;
