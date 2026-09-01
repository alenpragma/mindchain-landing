import React from 'react';
import { Hero } from '../components/Hero';
import { EcosystemGrid } from '../components/EcosystemGrid';
import { TrustAndSpecs } from '../components/TrustAndSpecs';
import { AppliedCoupon } from '../types';

interface HomePageProps {
  isLoggedIn: boolean;
  onOpenBuyFlow: (amount?: number, coupon?: AppliedCoupon | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ isLoggedIn, onOpenBuyFlow }) => {
  return (
    <main className="flex-1">
      {/* Hero Section with Live Bonus Calculator */}
      <Hero
        isLoggedIn={isLoggedIn}
        onBuyClick={(amount, coupon) => onOpenBuyFlow(amount, coupon)}
        onExploreClick={() => {
          document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Ecosystem Grid */}
      <EcosystemGrid onSelectAction={() => onOpenBuyFlow(100)} />

      {/* Comparison Matrix, Tokenomics & FAQ */}
      <TrustAndSpecs />
    </main>
  );
};
