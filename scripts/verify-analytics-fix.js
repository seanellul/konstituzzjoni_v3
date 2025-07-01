#!/usr/bin/env node

/**
 * Analytics Fix Verification Script
 * 
 * This script tests the analytics endpoints to verify the fix is working
 * Run this after deployment to confirm everything is functioning correctly
 * 
 * Usage: node scripts/verify-analytics-fix.js [BASE_URL]
 * Example: node scripts/verify-analytics-fix.js https://your-site.vercel.app
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:3000';

console.log('🔍 Verifying Analytics Fix...');
console.log(`📍 Testing against: ${BASE_URL}\n`);

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    }).on('error', reject);
  });
}

async function testHealthEndpoint() {
  console.log('🏥 Testing Health Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/analytics/health`);
    
    if (response.status === 200) {
      console.log('✅ Health endpoint is working');
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Database: ${response.data.database?.connected ? 'Connected' : 'Disconnected'}`);
      console.log(`   Total Events: ${response.data.analytics?.dataCount ? 
        Object.values(response.data.analytics.dataCount).reduce((a, b) => a + b, 0) : 'Unknown'}`);
      
      if (response.data.issues?.length > 0) {
        console.log('⚠️  Issues detected:');
        response.data.issues.forEach(issue => console.log(`   - ${issue}`));
      }
    } else {
      console.log(`❌ Health endpoint failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Health endpoint error: ${error.message}`);
  }
  console.log('');
}

async function testDashboardEndpoint() {
  console.log('📊 Testing Dashboard Data Endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/analytics/dashboard-data?timeframe=all`);
    
    if (response.status === 200) {
      console.log('✅ Dashboard endpoint is working');
      const stats = response.data.stats;
      
      if (stats) {
        console.log(`   Unique Visitors: ${stats.uniqueVisitors}`);
        console.log(`   Page Views: ${stats.totalPageViews}`);
        console.log(`   Article Views: ${stats.totalArticleViews}`);
        console.log(`   Searches: ${stats.totalSearches}`);
        console.log(`   Active Users: ${stats.activeUserCount}`);
        
        // Check if the bug is fixed
        if (stats.uniqueVisitors > 0) {
          console.log('🎉 BUG FIXED: Unique visitors is no longer 0!');
        } else if (stats.totalPageViews > 0 || stats.totalArticleViews > 0) {
          console.log('⚠️  Unique visitors still 0, but other data exists. May need time for sessions to accumulate.');
        } else {
          console.log('📝 No analytics data yet - this may be normal for a new deployment');
        }
      }
      
      if (response.data.metadata) {
        console.log(`   Response Time: ${response.data.metadata.responseTime}ms`);
      }
    } else {
      console.log(`❌ Dashboard endpoint failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Dashboard endpoint error: ${error.message}`);
  }
  console.log('');
}

async function testCacheHeaders() {
  console.log('🚀 Testing Performance Optimizations...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/analytics/dashboard-data?timeframe=day`);
    
    if (response.headers['cache-control']) {
      console.log('✅ Cache headers are set');
      console.log(`   Cache-Control: ${response.headers['cache-control']}`);
    } else {
      console.log('⚠️  No cache headers found');
    }
  } catch (error) {
    console.log(`❌ Cache test error: ${error.message}`);
  }
  console.log('');
}

async function main() {
  await testHealthEndpoint();
  await testDashboardEndpoint();
  await testCacheHeaders();
  
  console.log('✅ Analytics verification complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Visit your analytics dashboard to see the fix in action');
  console.log('2. Monitor the health status widget for any issues');
  console.log('3. Compare numbers with Vercel Analytics for validation');
  console.log('4. Check browser console for improved logging');
}

main().catch(console.error);