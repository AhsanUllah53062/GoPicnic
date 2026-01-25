import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchForecast, fetchWeather } from "../services/weather";

const screenWidth = Dimensions.get("window").width;

export default function WeatherPage() {
  const { lat, lon, name } = useLocalSearchParams<{
    lat: string;
    lon: string;
    name: string;
  }>();
  const router = useRouter();
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const w = await fetchWeather(Number(lat), Number(lon));
        const f = await fetchForecast(Number(lat), Number(lon));
        setWeather(w);
        setForecast(f);
      } catch (err) {
        console.error("Weather error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lat, lon]);

  const formatTime = (unix: number) =>
    new Date(unix * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (unix: number) =>
    new Date(unix * 1000).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  if (loading || !weather) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Background */}
      <Image
        source={require("../assets/clear.jpg")}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Current Weather */}
        <Text style={styles.location}>{name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
        <Text style={styles.condition}>{weather.weather[0].description}</Text>
        <Text style={styles.range}>
          H: {Math.round(weather.main.temp_max)}° L:{" "}
          {Math.round(weather.main.temp_min)}°
        </Text>

        {/* Hourly Forecast */}
        <ScrollView horizontal style={styles.hourly}>
          {forecast?.list.slice(0, 6).map((f: any, idx: number) => (
            <View key={idx} style={styles.hourCard}>
              <Text style={styles.hour}>{formatTime(f.dt)}</Text>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`,
                }}
                style={styles.icon}
              />
              <Text style={styles.hourTemp}>{Math.round(f.main.temp)}°</Text>
              <Text style={styles.precip}>{Math.round(f.pop * 100)}% rain</Text>
            </View>
          ))}
        </ScrollView>

        {/* Extra Metrics */}
        <View style={styles.metrics}>
          <Text style={styles.metric}>
            💧 Humidity: {weather.main.humidity}%
          </Text>
          <Text style={styles.metric}>
            🌡️ Pressure: {weather.main.pressure} hPa
          </Text>
          <Text style={styles.metric}>💨 Wind: {weather.wind.speed} m/s</Text>
          <Text style={styles.metric}>
            🌫️ Visibility: {weather.visibility / 1000} km
          </Text>
          <Text style={styles.metric}>☁️ Clouds: {weather.clouds.all}%</Text>
          <Text style={styles.metric}>
            🌅 Sunrise: {formatTime(weather.sys.sunrise)}
          </Text>
          <Text style={styles.metric}>
            🌇 Sunset: {formatTime(weather.sys.sunset)}
          </Text>
          {weather.rain?.["1h"] && (
            <Text style={styles.metric}>
              🌧️ Rainfall: {weather.rain["1h"]} mm (last hour)
            </Text>
          )}
        </View>

        {/* 5-Day Forecast */}
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        {forecast?.list
          .filter((_: any, idx: number) => idx % 8 === 0)
          .map((f: any, idx: number) => (
            <View key={idx} style={styles.forecastItem}>
              <Text style={styles.forecastDate}>{formatDate(f.dt)}</Text>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`,
                }}
                style={styles.iconSmall}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(f.main.temp)}°C
              </Text>
              <Text style={styles.forecastDesc}>
                {f.weather[0].description}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { position: "absolute", width: "100%", height: "100%" },
  overlay: { paddingTop: 60, paddingHorizontal: 20 },
  backBtn: { marginBottom: 10 },
  backText: { color: "#fff", fontSize: 16 },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  temp: { fontSize: 64, fontWeight: "bold", color: "#fff" },
  condition: { fontSize: 18, color: "#eee", marginBottom: 4 },
  range: { fontSize: 14, color: "#ccc", marginBottom: 20 },
  hourly: { flexDirection: "row", marginBottom: 20 },
  hourCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 80,
  },
  hour: { color: "#fff", fontSize: 12 },
  icon: { width: 40, height: 40 },
  hourTemp: { color: "#fff", fontSize: 14 },
  precip: { color: "#ccc", fontSize: 12 },
  metrics: { marginTop: 10 },
  metric: { color: "#fff", fontSize: 14, marginBottom: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  forecastDate: { color: "#fff", fontSize: 14, flex: 1 },
  iconSmall: { width: 40, height: 40, marginHorizontal: 8 },
  forecastTemp: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  forecastDesc: { color: "#ccc", fontSize: 14 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
