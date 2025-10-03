import { useState, useEffect } from 'react';
import EnhancedSqueezeScanner from '../components/EnhancedSqueezeScanner';
import Head from 'next/head';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Ultimate Squeeze Scanner...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Ultimate Squeeze Scanner 4.0 - Enhanced Ortex Edition</title>
        <meta name="description" content="Professional squeeze scanner with enhanced Ortex integration featuring real-time short interest data, cost to borrow analysis, and advanced squeeze detection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <EnhancedSqueezeScanner />
    </>
  );
}