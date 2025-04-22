'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ScatterController
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController, 
);

interface Campaign {
  id: string;
  address: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  daysLeft: number;
  donors: number;
  state?: number;
  milestones?: {
    title: string;
    amount: string;
    status: string;
  }[];
  images?: string[];
  imageURI?: string;
  name?: string;
  totalDonated?: string;
  donations?: {
    amount: string;
    timestamp: string;
    donor: { address: string };
  }[];
}

interface CampaignPredictionChartProps {
  campaigns: Campaign[];
  loading?: boolean;
}

interface PredictionDataPoint {
  date: string;
  amount: number;
  isProjected: boolean;
}

interface PredictionData {
  predictedDonations: PredictionDataPoint[];
  goalCompletionDate: string;
  confidenceScore: number;
  metadata?: {
    conversion?: {
      convertedGoal?: number;
      convertedTotalDonated?: number;
    }
  };
}

export function CampaignPredictionChart({ campaigns, loading = false }: CampaignPredictionChartProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [predictions, setPredictions] = useState<Record<string, PredictionData>>({});
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  
  // Better color scheme for visibility
  const COLORS = [
    "#ff4f8b", "#36d399", "#ffb74d", "#51cbff", "#d580ff", 
    "#55e9bc", "#ff9f5a", "#60a5fa", "#f471b5", "#3ecf8e"
  ];

  // Generate predictions for each campaign
  useEffect(() => {
    if (loading || !campaigns.length) return;

    setIsLoading(true);
    
    const generatePredictions = async () => {
      const newPredictions: Record<string, PredictionData> = {};
      
      for (const campaign of campaigns) {
        try {
          const response = await axios.post('/api/ai/predict-donations', {
            campaignAddress: campaign.address.toLowerCase(),
            daysToPredict: 30
          });
          
          if (response.data.status === 'success') {
            newPredictions[campaign.id] = response.data.data;
            console.log(`Prediction data for ${campaign.title}:`, response.data.data);
          } else {
            throw new Error(response.data.message || 'Failed to generate prediction');
          }
        } catch (error) {
          console.error(`Error generating prediction for campaign ${campaign.id}:`, error);
        }
      }
      
      setPredictions(newPredictions);
      setIsLoading(false);
    };
    
    generatePredictions();
  }, [campaigns, loading]);

  // Remove milestones from the prediction chart data preparation
  const prepareChartData = () => {
    // Filter campaigns based on active tab
    const campaignsToShow = activeTab === 'all' 
      ? campaigns 
      : campaigns.filter(c => c.id === activeTab);
      
    if (campaignsToShow.length === 0) {
      console.log('No campaigns to show');
      setChartData(null);
      return;
    }
    
    // Process each campaign's prediction data
    const datasets: any[] = [];
    
    // Track min/max values to determine appropriate scaling
    let minValue = Infinity;
    let maxValue = -Infinity;
    let hasVerySmallValues = false;
    
    campaignsToShow.forEach((campaign, index) => {
      const predictionData = predictions[campaign.id];
      if (!predictionData || !predictionData.predictedDonations || predictionData.predictedDonations.length === 0) {
        console.log(`No valid prediction data for campaign ${campaign.id}`);
        return;
      }
      
      const campaignName = campaign.title || campaign.name || `Campaign ${index + 1}`;
      const color = COLORS[index % COLORS.length];
      
      // Group by historical vs projected for separate series
      const historicalPoints: Array<{x: string, y: number}> = [];
      const projectedPoints: Array<{x: string, y: number}> = [];
      
      // Process each data point 
      predictionData.predictedDonations.forEach(point => {
        if (!point.date) return;
        
        try {
          // Format date to MM/DD format for display
          const date = new Date(point.date);
          if (isNaN(date.getTime())) return;
          
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const dateLabel = `${month}/${day}`;
          const amount = Number(point.amount);
          
          if (isNaN(amount)) return;
          
          // Update min/max tracking
          minValue = Math.min(minValue, amount);
          maxValue = Math.max(maxValue, amount);
          
          // Check if we're dealing with very small values
          if (amount > 0 && amount < 0.001) {
            hasVerySmallValues = true;
          }
          
          const dataPoint = {
            x: dateLabel,
            y: amount
          };
          
          if (point.isProjected) {
            projectedPoints.push(dataPoint);
          } else {
            historicalPoints.push(dataPoint);
          }
        } catch (e) {
          console.error('Error processing point:', point, e);
        }
      });
      
      console.log(`Campaign ${campaignName} data points:`, {
        historical: historicalPoints.length,
        projected: projectedPoints.length,
        valueRange: `${minValue.toExponential(4)} - ${maxValue.toExponential(4)} ETH`
      });
      
      // Add historical data as a solid line
      if (historicalPoints.length > 0) {
        datasets.push({
          type: 'line',
          label: `${campaignName} (Historical)`,
          data: historicalPoints,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.1,
          fill: false
        });
      }
      
      // Add projected data as a dashed line
      if (projectedPoints.length > 0) {
        datasets.push({
          type: 'line',
          label: `${campaignName} (Projected)`,
          data: projectedPoints,
          borderColor: color,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 4,
          tension: 0.1,
          fill: false
        });
      }
      
      // Add goal as a scatter point
      if (predictionData.goalCompletionDate && campaign.goal) {
        try {
          const date = new Date(predictionData.goalCompletionDate);
          if (!isNaN(date.getTime())) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const dateLabel = `${month}/${day}`;
            
            // Safely parse the goal amount
            let goalAmount = 0;
            const metadata = predictions[campaign.id]?.metadata;
            
            // First try to get from metadata
            if (metadata && 'conversion' in metadata && 
                metadata.conversion && 'convertedGoal' in metadata.conversion) {
              goalAmount = Number(metadata.conversion.convertedGoal);
            } 
            // Then try direct conversion as fallback
            else if (typeof campaign.goal === 'string') {
              try {
                // Only use digits
                const sanitizedGoal = campaign.goal.replace(/[^\d]/g, '');
                if (sanitizedGoal) {
                  goalAmount = Number(BigInt(sanitizedGoal)) / 1e18;
                }
              } catch (e) {
                console.warn('Failed to convert goal:', campaign.goal);
              }
            }
            
            // Only proceed if we have a valid goal amount
            if (goalAmount > 0 && !isNaN(goalAmount)) {
              // Track for scaling
              maxValue = Math.max(maxValue, goalAmount);
              
              if (goalAmount < 0.001) {
                hasVerySmallValues = true;
              }
              
              datasets.push({
                type: 'scatter',
                label: `${campaignName} Goal`,
                data: [{
                  x: dateLabel,
                  y: goalAmount
                }],
                backgroundColor: color,
                borderColor: 'white',
                borderWidth: 1,
                pointRadius: 8,
                pointStyle: 'star',
              });
            }
          }
        } catch (e) {
          console.error('Error processing goal:', {
            goalDate: predictionData.goalCompletionDate,
            goalAmount: campaign.goal,
            error: e
          });
        }
      }
    });
    
    // Get all unique x values from all datasets
    const allXValues = new Set<string>();
    
    datasets.forEach(dataset => {
      if (dataset.data) {
        dataset.data.forEach((point: any) => {
          if (point.x) {
            allXValues.add(point.x);
          }
        });
      }
    });
    
    // Convert to sorted array (MM/DD format)
    const sortedLabels = Array.from(allXValues).sort((a, b) => {
      const [aMonth, aDay] = a.split('/').map(Number);
      const [bMonth, bDay] = b.split('/').map(Number);
      
      return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
    });
    
    console.log("Chart data prepared:", { 
      labels: sortedLabels,
      datasetsCount: datasets.length,
      valueRange: `${minValue.toExponential(4)} - ${maxValue.toExponential(4)} ETH`,
      hasVerySmallValues
    });
    
    // Set final chart data
    setChartData({
      labels: sortedLabels,
      datasets
    });
    
    // Store min/max and scaling info for chart options
    return {
      minValue,
      maxValue,
      hasVerySmallValues
    };
  };

  // Chart.js options with specialized micro-ETH handling
  const getChartOptions = (minValue: number, maxValue: number, hasVerySmallValues: boolean): ChartOptions<'line'> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            color: 'rgba(255, 255, 255, 0.9)',
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'rgba(255, 255, 255, 0.9)',
          bodyColor: 'rgba(255, 255, 255, 0.9)',
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              return `Date: ${items[0].label}`;
            },
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              // Type-safe access to the y value
              const value = typeof context.raw === 'object' && context.raw && 'y' in context.raw 
                ? (context.raw as {y: number}).y
                : context.parsed.y;
                
              // Show maximum precision for ETH values
              if (value !== null && value !== undefined) {
                if (hasVerySmallValues) {
                  // For microETH values (< 0.001), show scientific notation
                  if (value < 0.0000001) {
                    label += value.toExponential(10) + ' ETH';
                  } 
                  // For values between 0.0000001 and 0.0001, show 10 decimal places
                  else if (value < 0.0001) {
                    label += value.toFixed(10).replace(/\.?0+$/, '') + ' ETH';
                  }
                  // For values between 0.0001 and 0.001, show 8 decimal places
                  else if (value < 0.001) {
                    label += value.toFixed(8).replace(/\.?0+$/, '') + ' ETH';
                  }
                  
                  // Add microETH conversion for very small values
                  if (value < 0.001) {
                    const microEth = value * 1000000;
                    label += ` (${microEth.toFixed(6).replace(/\.?0+$/, '')} μETH)`;
                  }
                } else {
                  // For regular values, use normal ETH display
                  if (value < 0.001) {
                    label += value.toFixed(8).replace(/\.?0+$/, '') + ' ETH';
                  } else if (value < 1) {
                    label += value.toFixed(6).replace(/\.?0+$/, '') + ' ETH';
                  } else {
                    label += value.toFixed(4).replace(/\.?0+$/, '') + ' ETH';
                  }
                }
              } else {
                label += 'N/A';
              }
              
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date (Month/Day)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: hasVerySmallValues ? 'Amount (μETH - microETH)' : 'Amount (ETH)',
            color: 'rgba(255, 255, 255, 0.9)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            callback: function(value) {
              if (typeof value !== 'number') return value;
              
              if (hasVerySmallValues) {
                // For microETH display, convert to μETH
                const microEth = value * 1000000;
                
                // Format based on the size
                if (microEth < 0.01) {
                  return microEth.toExponential(2);
                } else if (microEth < 1) {
                  return microEth.toFixed(3) + ' μETH';
                } else if (microEth < 10) {
                  return microEth.toFixed(2) + ' μETH';
                } else {
                  return microEth.toFixed(1) + ' μETH';
                }
              } else {
                // Normal ETH display
                if (value < 0.001) {
                  return value.toExponential(2);
                } else if (value < 0.01) {
                  return value.toFixed(4) + ' ETH';
                } else if (value < 0.1) {
                  return value.toFixed(3) + ' ETH';
                } else if (value < 1) {
                  return value.toFixed(2) + ' ETH';
                } else {
                  return value.toFixed(1) + ' ETH';
                }
              }
            }
          }
        }
      }
    };
  };

  // Update the useEffect for chart data preparation
  useEffect(() => {
    if (isLoading || Object.keys(predictions).length === 0) return;
    
    // Prepare chart data and get the scaling information
    const scaling = prepareChartData();
    // Set chart options based on the value ranges
    setChartOptions(getChartOptions(scaling?.minValue || 0, scaling?.maxValue || 1, scaling?.hasVerySmallValues || false));
  }, [predictions, activeTab]);

  // Add state for chart options
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>(getChartOptions(0, 1, false));

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  // if (loading || isLoading) {
  //   return (
  //     <Card className="col-span-3">
  //       <CardHeader>
  //         <CardTitle>Campaign Funding Predictions</CardTitle>
  //         <CardDescription>AI-powered funding predictions for your campaigns</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <Skeleton className="h-[400px] w-full" />
  //       </CardContent>
  //     </Card>
  //   );
  // }
  if (loading || isLoading && campaigns.length > 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-7 w-[250px] bg-white/70" />
            <Skeleton className="h-4 w-[300px] bg-white/50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-lg bg-white/40" />
              ))}
            </div>

            <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-white/20 bg-white/5 p-4">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-px w-full bg-white/20" />
                ))}
              </div>

              <div className="relative h-full w-full">
                <div className="absolute bottom-0 left-0 right-0 top-0">
                  <div className="h-full w-full animate-pulse">
                    <div
                      className="absolute h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40"
                      style={{
                        clipPath:
                          'polygon(0% 100%, 100% 80%, 100% 100%, 0% 100%)',
                      }}
                    />
                    <div
                      className="absolute h-full w-full bg-gradient-to-b from-transparent to-white/10 opacity-30"
                      style={{
                        clipPath:
                          'polygon(0% 100%, 100% 80%, 100% 100%, 0% 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4">
                {['Historical', 'Projected', 'Goal'].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full bg-white/30" />
                    <Skeleton className="h-3 w-16 bg-white/30" />
                  </div>
                ))}
              </div>
            </div>

            <Skeleton className="mx-auto h-3 w-48 bg-white/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create tabs for each campaign plus an "All" tab
  const campaignTabs = [
    { id: 'all', name: 'All Campaigns' },
    ...campaigns.map(campaign => ({ id: campaign.id, name: campaign.title || campaign.name || 'Campaign' }))
  ];

  // Filter out campaigns with no prediction data
  const validCampaigns = campaigns.filter(campaign => predictions[campaign.id]);

  // Add a fallback component for if no chart is shown
  const FallbackNoChart = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <p className="text-muted-foreground mb-2">No prediction chart data available</p>
      <p className="text-xs text-muted-foreground max-w-md">
        This could be due to:
      </p>
      <ul className="text-xs text-muted-foreground list-disc mt-2 space-y-1">
        <li>Insufficient donation history</li>
        <li>Invalid data from the prediction API</li>
        <li>Error in unit conversion (wei to ETH)</li>
      </ul>
      <p className="text-xs text-muted-foreground mt-3">
        Check the debug panel above for more details.
      </p>
    </div>
  );

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Campaign Funding Predictions
          <Badge variant="outline" className="ml-2 bg-primary/10">AI Enhanced</Badge>
        </CardTitle>
        <CardDescription>AI-powered funding projections based on historical donation data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {campaignTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="h-[400px] space-y-4">
            <div className="bg-muted/40 p-3 rounded-md">
              <div className="flex flex-wrap gap-3 items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 bg-primary rounded-full"></div>
                  <span>Historical Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 border-t-2 border-dashed border-primary rounded-full"></div>
                  <span>AI Predictions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Goal Target</span>
                </div>
              </div>
            </div>
            
            <div className="border border-border/50 rounded-lg p-4 bg-card/30 backdrop-blur-sm h-[320px] overflow-hidden">
              {!chartData || chartData.datasets.length === 0 ? (
                <FallbackNoChart />
              ) : (
                <div className="h-full w-full overflow-auto">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              All values are displayed in ETH
            </div>
          </TabsContent>
        </Tabs>

        {/* Display confidence scores and milestone predictions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Confidence Scores</h4>
            <div className="space-y-3">
              {validCampaigns.map((campaign, index) => {
                const prediction = predictions[campaign.id];
                if (!prediction) return null;
                
                const confidenceScore = prediction.confidenceScore || 0;
                const color = COLORS[index % COLORS.length];
                
                return (
                  <div key={campaign.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="text-sm flex-1">{campaign.title || campaign.name}</span>
                      <div className="ml-2 relative w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-full" 
                          style={{ 
                            width: `${confidenceScore}%`,
                            backgroundColor: color
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{confidenceScore}%</span>
                    </div>
                    <div className="p-2 bg-amber-950/20 border border-amber-800/30 rounded-md text-amber-300 text-xs ml-5">
                      {confidenceScore >= 80 
                        ? "This projection represents an optimistic scenario based on historical patterns. While the confidence score is high, market conditions and donation behaviors can change unexpectedly."
                        : confidenceScore >= 60
                          ? "This is a forward-looking projection that assumes positive growth. The moderate confidence score reflects uncertainty in donation patterns and timing."
                          : confidenceScore >= 40
                            ? "This projection shows a potential path to the goal but has significant uncertainty. The timeline may vary substantially based on actual donation activity."
                            : "This is a highly speculative projection showing one possible path to the funding goal. The low confidence score indicates substantial uncertainty - actual results will likely differ significantly."
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Goal Completion Estimates</h4>
            <div className="space-y-3">
              {validCampaigns.map((campaign, index) => {
                const prediction = predictions[campaign.id];
                if (!prediction) return null;
                
                const goalDate = prediction.goalCompletionDate;
                const color = COLORS[index % COLORS.length];
                
                return (
                  <div key={campaign.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-sm flex-1">{campaign.title || campaign.name}</span>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        backgroundColor: `${color}20`,
                        color: color,
                        borderColor: color
                      }}
                    >
                      {goalDate 
                        ? formatDate(goalDate)
                        : 'Not likely'
                      }
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 