const http = require('http');
const os = require('os');

const port = process.env.PORT || 3000;
const platform = 'gitlab';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'healthy',
      platform: platform,
      commit: process.env.COMMIT_SHA || 'unknown',
      timestamp: new Date().toISOString(),
      hostname: os.hostname(),
      version: process.env.APP_VERSION || '1.0.0'
    }));
  } else if (url.pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'GitOps POC - GITLAB Platform',
      platform: platform,
      environment: process.env.NODE_ENV || 'production',
      version: process.env.APP_VERSION || '1.0.0',
      build: {
        commit: process.env.COMMIT_SHA || 'unknown',
        time: process.env.BUILD_TIME || 'unknown',
        image: process.env.IMAGE_NAME || 'unknown'
      },
      kubernetes: {
        namespace: process.env.KUBERNETES_NAMESPACE || 'default',
        pod: os.hostname()
      }
    }));
  } else if (url.pathname === '/metrics') {
    res.writeHead(200);
    res.end(JSON.stringify({
      platform: platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 'Not found', 
      platform: platform,
      availableEndpoints: ['/', '/health', '/metrics']
    }));
  }
});

server.listen(port, () => {
  console.log(`GITLAB GitOps POC server running on port ${port}`);
  console.log(`Commit: ${process.env.COMMIT_SHA || 'unknown'}`);
  console.log(`Image: ${process.env.IMAGE_NAME || 'unknown'}`);
}); 