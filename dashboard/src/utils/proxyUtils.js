  import config from '../config';
  
  export function constructProxyUrl(serverIp, port) {
    // Construct the URL for the proxy route based on current window.origin.
    // The proxy route is defined as /proxy/:serverIp/:port.
    return `${config.baseUrl}/proxy/${serverIp}/${port}`;
  }


