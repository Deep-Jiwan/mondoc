/**
 * Given the raw Docker inspect data (or similar API response) as rawData,
 * parse and return an array of container objects in the format expected
 * by the front-end components.
 *
 * Expected output fields include:
 *  - Names, State, Ports, Status, Networks, CreatedAt, ID, Image,
 *    IP, Port, DummyUsername, DummyPassword, Size, Mounts, LocalVolumes, Labels, Tags
 */
export function parseContainers(rawData) {
  // Accept rawData as either an object with a "containers" property or an array.
  const containersArray = rawData && rawData.containers
    ? rawData.containers
    : Array.isArray(rawData)
      ? rawData
      : [];

  return containersArray.map((c) => {
    // Names: if c.Name exists, use it; otherwise check c.Names.
    let names = '';
    if (c.Name) {
      names = c.Name.replace(/^\//, '');
    } else if (c.Names) {
      if (typeof c.Names === 'string') {
        names = c.Names.replace(/^\//, '');
      } else if (Array.isArray(c.Names)) {
        names = c.Names.map(n => n.replace(/^\//, '')).join(', ');
      }
    }

    // State: If c.State is an object, use its Status; otherwise, if it's a string, use it directly.
    let state = '';
    if (typeof c.State === 'object' && c.State !== null) {
      state = c.State.Status || '';
    } else if (typeof c.State === 'string') {
      state = c.State;
    }
    const status = state;

    // Ports: Prefer c.NetworkSettings.Ports; if not present, use c.Ports.
    let portsObj;
    if (c.NetworkSettings && c.NetworkSettings.Ports) {
      portsObj = c.NetworkSettings.Ports;
    } else if (c.Ports) {
      try {
        portsObj = typeof c.Ports === 'string' ? JSON.parse(c.Ports) : c.Ports;
      } catch (e) {
        portsObj = {};
      }
    } else {
      portsObj = {};
    }
    let portsArr = [];
    for (const portKey in portsObj) {
      if (portsObj[portKey] && portsObj[portKey].length > 0) {
        portsArr.push(`${portsObj[portKey][0].HostIp}:${portsObj[portKey][0].HostPort}->${portKey}`);
      } else {
        portsArr.push(portKey);
      }
    }
    const portsStr = portsArr.join(', ');

    // Networks: Prefer c.NetworkSettings.Networks; if not, use c.Networks.
    let networksObj;
    if (c.NetworkSettings && c.NetworkSettings.Networks) {
      networksObj = c.NetworkSettings.Networks;
    } else if (c.Networks) {
      networksObj = c.Networks;
    } else {
      networksObj = {};
    }
    const networks = Object.keys(networksObj).join(', ');

    // CreatedAt: Use c.CreatedAt if available; else fallback to c.Created.
    const createdAt = c.CreatedAt || c.Created || '';

    // ID: Use c.ID or c.Id (and truncate to the first 12 characters)
    const id = (c.ID || c.Id) ? (c.ID || c.Id).substring(0, 12) : '';

    // Image: Prefer c.Config.Image; if not, use c.Image.
    const image = (c.Config && c.Config.Image) ? c.Config.Image : (c.Image || '');

    // IP: If c.NetworkSettings exists, extract IP addresses from its Networks; else use c.IP.
    let ip = '';
    if (c.NetworkSettings && c.NetworkSettings.Networks) {
      let ipAddresses = [];
      Object.keys(c.NetworkSettings.Networks).forEach(netName => {
        const ipVal = c.NetworkSettings.Networks[netName].IPAddress;
        if (ipVal) ipAddresses.push(ipVal);
      });
      ip = ipAddresses.join(', ');
    } else if (c.IP) {
      ip = c.IP;
    }

    // Port: Choose the first host port from portsArr (if available).
    const portChosen = (() => {
      if (portsArr.length > 0) {
        const parts = portsArr[0].split(':');
        if (parts.length > 1) {
          const arrowParts = parts[1].split('->');
          return arrowParts[0] || '';
        }
      }
      return '';
    })();

    // Dummy credentials.
    const DummyUsername = 'admin';
    const DummyPassword = 'secret123';

    // Size: Use c.Size if available; otherwise default to 'N/A'.
    const size = c.Size || 'N/A';

    // Mounts: If c.Mounts exists and is an array, join their Source values; otherwise, if it's a string, use it.
    let mounts = '';
    if (Array.isArray(c.Mounts)) {
      mounts = c.Mounts.map(m => m.Source).join(', ');
    } else if (typeof c.Mounts === 'string') {
      mounts = c.Mounts;
    }

    // LocalVolumes: If c.LocalVolumes exists (as an array), count them; else, if c.Mounts is an array, filter by Type === 'volume'.
    let localVolumes = '';
    if (Array.isArray(c.LocalVolumes)) {
      localVolumes = c.LocalVolumes.length.toString();
    } else if (Array.isArray(c.Mounts)) {
      localVolumes = c.Mounts.filter(m => m.Type === 'volume').length.toString();
    } else {
      localVolumes = '0';
    }

    // Labels: Prefer c.Config.Labels; otherwise, use c.Labels.
    let labels = '';
    if (c.Config && c.Config.Labels) {
      labels = JSON.stringify(c.Config.Labels);
    } else if (c.Labels) {
      labels = JSON.stringify(c.Labels);
    }

    // Tags: Preserve any attached tags, defaulting to an empty array.
    const tags = Array.isArray(c.tags) ? c.tags : [];

    return {
      Names: names,
      State: state,
      Ports: portsStr,
      Status: status,
      Networks: networks,
      CreatedAt: createdAt,
      ID: id,
      Image: image,
      IP: ip,
      Port: portChosen,
      DummyUsername: DummyUsername,
      DummyPassword: DummyPassword,
      Size: size,
      Mounts: mounts,
      LocalVolumes: localVolumes,
      Labels: labels,
      Tags: tags
    };
  });
}
