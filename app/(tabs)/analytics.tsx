import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { BarChart2, DollarSign, MessageSquare, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAnalytics } from '@/hooks/analytics-store';
import { useAIServices } from '@/hooks/ai-services-store';
import StatCard from '@/components/StatCard';

export default function AnalyticsScreen() {
  const { 
    selectedPeriod, 
    setSelectedPeriod,
    getTotalCost,
    getTotalMessages,
    getTotalTokens,
    currentStats
  } = useAnalytics();
  
  const { aiServices } = useAIServices();
  
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];
  
  const getServiceName = (serviceId: string) => {
    const service = aiServices.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };
  
  const getServiceColor = (serviceId: string) => {
    const index = aiServices.findIndex(s => s.id === serviceId);
    const colors = ['#6200EE', '#03DAC6', '#FFC107', '#F44336'];
    return colors[index % colors.length];
  };
  
  const renderBarChart = () => {
    const maxValue = Math.max(...currentStats.map(stat => stat.messagesCount));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Messages by AI Service</Text>
        
        <View style={styles.chart}>
          {currentStats.map(stat => (
            <View key={stat.aiService} style={styles.chartItem}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${(stat.messagesCount / maxValue) * 100}%`,
                      backgroundColor: getServiceColor(stat.aiService)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel} numberOfLines={1}>
                {getServiceName(stat.aiService)}
              </Text>
              <Text style={styles.barValue}>{stat.messagesCount}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>
          Track your AI usage and costs
        </Text>
      </View>
      
      <View style={styles.periodSelector}>
        {periods.map(period => (
          <Pressable
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.id as 'daily' | 'weekly' | 'monthly')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period.id && styles.activePeriodButtonText
            ]}>
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard 
          title="Total Cost" 
          value={`$${getTotalCost(selectedPeriod).toFixed(2)}`}
          icon={<DollarSign size={20} color={Colors.light.primary} />}
        />
        <StatCard 
          title="Messages" 
          value={getTotalMessages(selectedPeriod)}
          icon={<MessageSquare size={20} color="#03DAC6" />}
          color="#03DAC6"
        />
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard 
          title="Tokens Used" 
          value={getTotalTokens(selectedPeriod).toLocaleString()}
          icon={<Zap size={20} color="#FFC107" />}
          color="#FFC107"
        />
        <StatCard 
          title="AI Services" 
          value={new Set(currentStats.map(stat => stat.aiService)).size}
          icon={<BarChart2 size={20} color="#F44336" />}
          color="#F44336"
        />
      </View>
      
      {currentStats.length > 0 ? (
        <>
          {renderBarChart()}
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Usage Details</Text>
            
            {currentStats.map(stat => (
              <View key={stat.aiService} style={styles.detailItem}>
                <View style={styles.detailHeader}>
                  <View style={styles.serviceInfo}>
                    <View 
                      style={[
                        styles.serviceColorDot, 
                        { backgroundColor: getServiceColor(stat.aiService) }
                      ]} 
                    />
                    <Text style={styles.serviceName}>{getServiceName(stat.aiService)}</Text>
                  </View>
                  <Text style={styles.detailCost}>${stat.cost.toFixed(2)}</Text>
                </View>
                
                <View style={styles.detailStats}>
                  <View style={styles.detailStat}>
                    <Text style={styles.detailStatLabel}>Messages</Text>
                    <Text style={styles.detailStatValue}>{stat.messagesCount}</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <Text style={styles.detailStatLabel}>Tokens</Text>
                    <Text style={styles.detailStatValue}>{stat.tokensUsed.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <Text style={styles.detailStatLabel}>Avg. Cost</Text>
                    <Text style={styles.detailStatValue}>
                      ${(stat.cost / stat.messagesCount).toFixed(3)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No data available</Text>
          <Text style={styles.emptyStateText}>
            Start using AI services in your workspaces to see usage analytics.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: Colors.light.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  chartContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  chartItem: {
    alignItems: 'center',
    width: '22%',
  },
  barContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '60%',
    alignSelf: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 8,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  detailCost: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailStat: {
    alignItems: 'center',
    flex: 1,
  },
  detailStatLabel: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  detailStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
  },
});