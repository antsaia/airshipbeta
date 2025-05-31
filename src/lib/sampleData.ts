import { addRelease, getAllReleases } from './db';

export async function initializeSampleData() {
  // Check if data already exists
  const existingReleases = await getAllReleases();
  if (existingReleases.length > 0) {
    return; // Skip initialization if data exists
  }

  const sampleReleases = [
    {
      title: 'Enhanced Performance Optimization',
      date: '2025-03-15',
      description: 'Major improvements to system performance and resource utilization.',
      status: 'Beta' as const,
      screenshots: [
        {
          url: 'https://images.pexels.com/photos/5473337/pexels-photo-5473337.jpeg',
          caption: 'Performance Dashboard showing improved metrics'
        },
        {
          url: 'https://images.pexels.com/photos/5473302/pexels-photo-5473302.jpeg',
          caption: 'System resource utilization graphs'
        }
      ],
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
      screenshots: [
        {
          url: 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg',
          caption: 'Analytics Dashboard Overview'
        },
        {
          url: 'https://images.pexels.com/photos/7681094/pexels-photo-7681094.jpeg',
          caption: 'Custom Report Builder Interface'
        }
      ],
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
      screenshots: [
        {
          url: 'https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg',
          caption: 'Multi-Channel Message Composer'
        },
        {
          url: 'https://images.pexels.com/photos/8439097/pexels-photo-8439097.jpeg',
          caption: 'Channel Coordination Timeline'
        }
      ],
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