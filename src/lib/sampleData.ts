import { addRelease } from './db';

export async function initializeSampleData() {
  const sampleReleases = [
    {
      title: 'Enhanced Performance Optimization',
      date: '2025-03-15',
      description: 'Major improvements to system performance and resource utilization.',
      status: 'Beta' as const,
      documentation: `# Performance Optimization Update

## Key Improvements

- Reduced latency by 40%
- Optimized memory usage
- Improved database query performance

## Technical Details

Our latest update brings significant performance enhancements across the platform:

### Backend Optimizations
- Implemented advanced caching strategies
- Optimized database queries and indexing
- Reduced API response times

### Frontend Improvements
- Enhanced component rendering
- Implemented lazy loading for better initial load times
- Optimized asset delivery

## Getting Started

To take advantage of these improvements, no additional configuration is required. The optimizations are automatically applied to all existing implementations.`
    },
    {
      title: 'New Analytics Dashboard',
      date: '2025-03-01',
      description: 'Introducing a powerful new analytics dashboard with real-time insights.',
      status: 'Beta' as const,
      documentation: `# Analytics Dashboard

## Features

- Real-time data visualization
- Custom report generation
- Advanced filtering options
- Export capabilities
- Customizable dashboards

## Key Benefits

- Get instant insights into your customer engagement
- Make data-driven decisions with confidence
- Track performance metrics in real-time
- Identify trends and patterns

## Implementation Guide

1. Navigate to the Analytics section
2. Choose from pre-built dashboard templates
3. Customize widgets and metrics
4. Set up automated reports

## Best Practices

- Start with key metrics that align with your goals
- Use filters to segment your data effectively
- Set up regular automated reports
- Review and adjust your dashboard periodically`
    },
    {
      title: 'Multi-Channel Messaging Update',
      date: '2025-02-15',
      description: 'Seamlessly coordinate messages across email, SMS, and push notifications.',
      status: 'Beta' as const,
      documentation: `# Multi-Channel Messaging

## New Capabilities

- Unified messaging interface
- Cross-channel coordination
- Smart channel selection
- Advanced scheduling options
- Message templating system

## Channel Support

- Email
- SMS
- Push Notifications
- In-App Messages
- Web Push

## Implementation Steps

1. Configure channel settings
2. Set up message templates
3. Define coordination rules
4. Test cross-channel scenarios

## Best Practices

- Use channel-specific formatting
- Coordinate timing across channels
- Respect user preferences
- Monitor engagement metrics
- Test thoroughly before deployment`
    }
  ];

  for (const release of sampleReleases) {
    try {
      await addRelease(release);
      console.log(`Added release: ${release.title}`);
    } catch (error) {
      console.error(`Error adding release: ${release.title}`, error);
    }
  }
}