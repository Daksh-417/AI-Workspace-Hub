import { Platform } from 'react-native';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static completedMetrics: PerformanceMetric[] = [];

  static startTimer(name: string, metadata?: Record<string, any>): void {
    const startTime = Date.now();
    
    this.metrics.set(name, {
      name,
      startTime,
      metadata,
    });

    if (__DEV__) {
      console.log(`⏱️ Performance timer started: ${name}`);
    }
  }

  static endTimer(name: string): number | null {
    const metric = this.metrics.get(name);
    
    if (!metric) {
      if (__DEV__) {
        console.warn(`⚠️ Performance timer not found: ${name}`);
      }
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    };

    this.completedMetrics.push(completedMetric);
    this.metrics.delete(name);

    if (__DEV__) {
      console.log(`✅ Performance timer completed: ${name} (${duration}ms)`);
    }

    return duration;
  }

  static measureAsync<T>(
    name: string,
    asyncFn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTimer(name, metadata);
    
    return asyncFn()
      .finally(() => {
        this.endTimer(name);
      });
  }

  static measureSync<T>(
    name: string,
    syncFn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startTimer(name, metadata);
    
    try {
      const result = syncFn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  static getMetrics(): PerformanceMetric[] {
    return [...this.completedMetrics];
  }

  static getAverageTime(name: string): number | null {
    const matchingMetrics = this.completedMetrics.filter(m => m.name === name);
    
    if (matchingMetrics.length === 0) {
      return null;
    }

    const totalTime = matchingMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalTime / matchingMetrics.length;
  }

  static clearMetrics(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  static getMemoryUsage(): Record<string, number> | null {
    if (Platform.OS === 'web' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    
    return null;
  }

  static logPerformanceReport(): void {
    if (!__DEV__) return;

    console.group('📊 Performance Report');
    
    const metrics = this.getMetrics();
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, PerformanceMetric[]>);

    Object.entries(groupedMetrics).forEach(([name, metricList]) => {
      const durations = metricList.map(m => m.duration || 0);
      const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      console.log(`${name}:`, {
        count: metricList.length,
        average: `${average.toFixed(2)}ms`,
        min: `${min}ms`,
        max: `${max}ms`,
      });
    });

    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage) {
      console.log('Memory Usage:', {
        used: `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
      });
    }

    console.groupEnd();
  }
}