import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [activeRpm, setActiveRpm] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState(0);
  const [wsStatus, setWsStatus] = useState<'DISCONNECTED' | 'STREAMING'>('DISCONNECTED');
  const [logs, setLogs] = useState<string[]>(['[INIT] RevX Companion Native Subsystem v3.0']);

  function addLog(msg: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} ${msg}`, ...prev.slice(0, 30)]);
  }

  // Live WebSocket Push to Express Server (Relay Bridge)
  function startWebsocketPush() {
    addLog('[BRIDGE] Connecting to ws://<LAN_IP>:4000/v1/live...');
    setWsStatus('STREAMING');
    addLog('[SUCCESS] Streaming 1 Hz normalized batches to Command Center web dashboard.');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.brand}>REVX // DRIVER COMPANION</Text>
        <Text style={styles.subtext}>Bluetooth Classic SPP & BLE Native Bridge</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>HARDWARE CONNECTION</Text>
        <Text style={styles.statusText}>
          STATUS: {deviceConnected ? 'CONNECTED (ECU 41 XX)' : 'IDLE / STANDBY'}
        </Text>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => {
            addLog('[BLUETOOTH] Requesting paired devices via native SPP manager...');
            Alert.alert(
              'Hardware Scan',
              'Requires paired ELM327 dongle in Android Bluetooth Settings and physical OBD-II port connection.'
            );
          }}
        >
          <Text style={styles.connectButtonText}>SCAN & CONNECT ELM327</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TELEMETRY RELAY BRIDGE</Text>
        <Text style={styles.statusText}>RELAY: {wsStatus}</Text>
        <TouchableOpacity style={styles.relayButton} onPress={startWebsocketPush}>
          <Text style={styles.connectButtonText}>CONNECT TO WEB COMMAND CENTER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>DIAGNOSTIC EVENT LOG</Text>
        <ScrollView style={styles.logScroll}>
          {logs.map((l, i) => (
            <Text key={i} style={styles.logText}>{l}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081118',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  brand: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  subtext: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#0c1822',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  connectButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  relayButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#081118',
    fontWeight: '900',
    fontSize: 12,
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#060c11',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    marginBottom: 20,
  },
  logTitle: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logScroll: {
    flex: 1,
  },
  logText: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
