const os = require('os');

function detectLocalIP() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          interface: name,
          address: iface.address,
          netmask: iface.netmask,
        });
      }
    }
  }

  // 🔥 1. Priorité au HOTSPOT (ap0)
  const hotspotIP = ips.find(ip =>
    ip.interface.toLowerCase().startsWith('ap') ||
    ip.interface.toLowerCase().includes('hotspot')
  );

  if (hotspotIP) {
    return {
      ip: hotspotIP.address,
      interface: hotspotIP.interface,
      type: 'hotspot',
      allIPs: ips,
    };
  }

  // 🔥 2. WiFi normal (wlan, wlp)
  const wifiIP = ips.find(ip =>
    ip.interface.toLowerCase().includes('wlan') ||
    ip.interface.toLowerCase().includes('wlp') ||
    ip.interface.toLowerCase().includes('wifi') ||
    ip.interface.toLowerCase().includes('en0')
  );

  if (wifiIP) {
    return {
      ip: wifiIP.address,
      interface: wifiIP.interface,
      type: 'wifi',
      allIPs: ips,
    };
  }

  // 🔥 3. Ethernet
  const ethIP = ips.find(ip =>
    ip.interface.toLowerCase().includes('eth') ||
    ip.interface.toLowerCase().includes('enp')
  );

  if (ethIP) {
    return {
      ip: ethIP.address,
      interface: ethIP.interface,
      type: 'ethernet',
      allIPs: ips,
    };
  }

  // 🔥 4. Fallback
  if (ips.length > 0) {
    return {
      ip: ips[0].address,
      interface: ips[0].interface,
      type: 'unknown',
      allIPs: ips,
    };
  }

  return {
    ip: 'localhost',
    interface: 'none',
    type: 'localhost',
    allIPs: [],
  };
}

function getAllIPs() {
  const info = detectLocalIP();
  console.log('\n📡 Interfaces réseau détectées:');
  console.log('─'.repeat(60));

  info.allIPs.forEach(ip => {
    const active = ip.address === info.ip ? '✅' : '  ';
    console.log(`${active} ${ip.interface.padEnd(15)} ${ip.address.padEnd(15)} ${ip.netmask}`);
  });

  console.log('─'.repeat(60));
  console.log(`🎯 IP sélectionnée: ${info.ip} (${info.type})\n`);

  return info;
}

module.exports = {
  detectLocalIP,
  getAllIPs,
};
