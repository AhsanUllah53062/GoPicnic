// app/profile/preferences.tsx
import { useUser } from "@/src/context/UserContext";
import {
  AmenityType,
  CarpoolVibeType,
  DEFAULT_PREFERENCES,
  TerrainType,
  UserPreferences,
} from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Static option lists ───────────────────────────────────────────────────────

const TERRAIN_OPTIONS: { id: TerrainType; label: string; icon: string }[] = [
  { id: "mountains", label: "Mountains", icon: "terrain" },
  { id: "beach", label: "Beach", icon: "beach-access" },
  { id: "forest", label: "Forest", icon: "park" },
  { id: "urban", label: "Urban", icon: "location-city" },
  { id: "desert", label: "Desert", icon: "wb-sunny" },
  { id: "countryside", label: "Countryside", icon: "grass" },
];

const AMENITY_OPTIONS: { id: AmenityType; label: string; icon: string }[] = [
  { id: "parking", label: "Parking", icon: "local-parking" },
  { id: "restrooms", label: "Restrooms", icon: "wc" },
  { id: "picnic-area", label: "Picnic Area", icon: "deck" },
  { id: "playground", label: "Playground", icon: "child-care" },
  { id: "restaurant", label: "Restaurant", icon: "restaurant" },
  { id: "shops", label: "Shops", icon: "shopping-bag" },
];

const CARPOOL_VIBES: {
  id: CarpoolVibeType;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "no-smoking",
    label: "No Smoking",
    icon: "smoke-free",
    color: "#EF4444",
  },
  {
    id: "music-lover",
    label: "Music Lover",
    icon: "music-note",
    color: "#8B5CF6",
  },
  {
    id: "quiet-ride",
    label: "Quiet Ride",
    icon: "volume-off",
    color: "#3B82F6",
  },
  { id: "chatty", label: "Chatty", icon: "chat", color: "#F59E0B" },
  { id: "pets-ok", label: "Pets OK", icon: "pets", color: "#10B981" },
  {
    id: "ac-preference",
    label: "AC Preferred",
    icon: "ac-unit",
    color: "#6366F1",
  },
];

// ─── Small reusable sub-components ────────────────────────────────────────────

type ChipProps<T extends string> = {
  id: T;
  label: string;
  icon: string;
  color?: string;
  selected: boolean;
  onToggle: (id: T) => void;
};

function SelectChip<T extends string>({
  id,
  label,
  icon,
  color = "#6366F1",
  selected,
  onToggle,
}: ChipProps<T>) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(id);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Animated.View
        style={[
          chipStyles.chip,
          selected && { ...chipStyles.chipSelected, borderColor: color },
          { transform: [{ scale }] },
        ]}
      >
        <MaterialIcons
          name={icon as any}
          size={17}
          color={selected ? color : "#9CA3AF"}
        />
        <Text
          style={[chipStyles.label, selected && { color, fontWeight: "700" }]}
        >
          {label}
        </Text>
        {selected && (
          <MaterialIcons name="check-circle" size={14} color={color} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  chipSelected: {
    backgroundColor: "#EEF2FF",
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});

// ─── Step-picker for numeric values ───────────────────────────────────────────

type StepPickerProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
};

function StepPicker({
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: StepPickerProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <View style={stepStyles.row}>
      <TouchableOpacity
        style={[stepStyles.btn, value <= min && stepStyles.btnDisabled]}
        onPress={decrement}
        disabled={value <= min}
      >
        <MaterialIcons
          name="remove"
          size={20}
          color={value <= min ? "#D1D5DB" : "#6366F1"}
        />
      </TouchableOpacity>

      <View style={stepStyles.valueBox}>
        <Text style={stepStyles.value}>{value}</Text>
        <Text style={stepStyles.unit}>{unit}</Text>
      </View>

      <TouchableOpacity
        style={[stepStyles.btn, value >= max && stepStyles.btnDisabled]}
        onPress={increment}
        disabled={value >= max}
      >
        <MaterialIcons
          name="add"
          size={20}
          color={value >= max ? "#D1D5DB" : "#6366F1"}
        />
      </TouchableOpacity>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#F3F4F6" },
  valueBox: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 26,
  },
  unit: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

// ─── Temperature range picker ──────────────────────────────────────────────────

type TempRangeProps = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

function TempRangePicker({ min, max, onChange }: TempRangeProps) {
  return (
    <View style={tempStyles.container}>
      <View style={tempStyles.side}>
        <Text style={tempStyles.label}>Min</Text>
        <StepPicker
          value={min}
          min={0}
          max={max - 1}
          step={1}
          unit="°C"
          onChange={(v) => onChange(v, max)}
        />
      </View>

      <View style={tempStyles.separator}>
        <MaterialIcons name="arrow-forward" size={20} color="#D1D5DB" />
      </View>

      <View style={tempStyles.side}>
        <Text style={tempStyles.label}>Max</Text>
        <StepPicker
          value={max}
          min={min + 1}
          max={50}
          step={1}
          unit="°C"
          onChange={(v) => onChange(min, v)}
        />
      </View>
    </View>
  );
}

const tempStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  side: { flex: 1, alignItems: "center", gap: 8 },
  separator: { paddingHorizontal: 8 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

// ─── Section container ─────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.wrapper}>
      <View style={sectionStyles.titleRow}>
        <View
          style={[
            sectionStyles.iconBadge,
            { backgroundColor: `${iconColor}18` },
          ]}
        >
          <MaterialIcons name={icon as any} size={16} color={iconColor} />
        </View>
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrapper: { marginTop: 24, paddingHorizontal: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});

// ─── Row inside a card ─────────────────────────────────────────────────────────

function CardRow({
  icon,
  iconColor,
  label,
  children,
  last,
}: {
  icon: string;
  iconColor: string;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[rowStyles.row, last && rowStyles.rowLast]}>
      <View style={rowStyles.labelGroup}>
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.control}>{children}</View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
    flexWrap: "wrap",
  },
  rowLast: { borderBottomWidth: 0 },
  labelGroup: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  label: { fontSize: 15, fontWeight: "500", color: "#111827" },
  control: { alignItems: "flex-end" },
});

// ─── Chip grid ─────────────────────────────────────────────────────────────────

function ChipGrid({ children }: { children: React.ReactNode }) {
  return <View style={gridStyles.grid}>{children}</View>;
}

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 8,
  },
});

// ─── Main preferences screen ───────────────────────────────────────────────────

export default function PreferencesPage() {
  const router = useRouter();
  const { user, userPreferences, preferencesLoading, setUserPreferences } =
    useUser();

  const [saving, setSaving] = useState(false);

  // Local mutable copy of preferences
  const [prefs, setPrefs] = useState<UserPreferences>(
    userPreferences ?? DEFAULT_PREFERENCES,
  );

  // Once the context loads (async), sync local state
  useEffect(() => {
    if (userPreferences) {
      setPrefs(userPreferences);
    }
  }, [userPreferences]);

  // ── Terrain ──────────────────────────────────────────────────────────────
  const toggleTerrain = (id: TerrainType) => {
    setPrefs((p: UserPreferences) => {
      const has = p.places.terrain.includes(id);
      return {
        ...p,
        places: {
          ...p.places,
          terrain: has
            ? p.places.terrain.filter((t: TerrainType) => t !== id)
            : [...p.places.terrain, id],
        },
      };
    });
  };

  // ── Amenities ─────────────────────────────────────────────────────────────
  const toggleAmenity = (id: AmenityType) => {
    setPrefs((p: UserPreferences) => {
      const has = p.places.amenities.includes(id);
      return {
        ...p,
        places: {
          ...p.places,
          amenities: has
            ? p.places.amenities.filter((a: AmenityType) => a !== id)
            : [...p.places.amenities, id],
        },
      };
    });
  };

  // ── Carpool vibes ─────────────────────────────────────────────────────────
  const toggleVibe = (id: CarpoolVibeType) => {
    setPrefs((p: UserPreferences) => {
      const has = p.carpoolVibes.includes(id);
      return {
        ...p,
        carpoolVibes: has
          ? p.carpoolVibes.filter((v: CarpoolVibeType) => v !== id)
          : [...p.carpoolVibes, id],
      };
    });
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await setUserPreferences(prefs);
      Alert.alert("✅ Saved", "Your preferences have been updated.", [
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (preferencesLoading) {
    return (
      <View style={prefStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={prefStyles.loadingText}>Loading your preferences…</Text>
      </View>
    );
  }

  return (
    <View style={prefStyles.container}>
      {/* ── Header ── */}
      <View style={prefStyles.header}>
        <TouchableOpacity
          style={prefStyles.headerBtn}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={prefStyles.headerTitle}>Preferences</Text>
        <TouchableOpacity
          style={[prefStyles.saveBtn, saving && prefStyles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={prefStyles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={prefStyles.scroll}
        contentContainerStyle={prefStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Place Preferences ──────────────────────────────────────── */}
        <Section title="Place Preferences" icon="place" iconColor="#6366F1">
          {/* Terrain */}
          <View style={prefStyles.chipSection}>
            <Text style={prefStyles.chipSectionLabel}>Preferred Terrain</Text>
            <ChipGrid>
              {TERRAIN_OPTIONS.map((opt) => (
                <SelectChip<TerrainType>
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  icon={opt.icon}
                  color="#6366F1"
                  selected={prefs.places.terrain.includes(opt.id)}
                  onToggle={toggleTerrain}
                />
              ))}
            </ChipGrid>
          </View>

          <View style={prefStyles.divider} />

          {/* Max Distance */}
          <CardRow
            icon="straighten"
            iconColor="#8B5CF6"
            label="Max Distance"
            last={false}
          >
            <StepPicker
              value={prefs.places.maxDistance}
              min={10}
              max={500}
              step={10}
              unit="km"
              onChange={(v) =>
                setPrefs((p: UserPreferences) => ({
                  ...p,
                  places: { ...p.places, maxDistance: v },
                }))
              }
            />
          </CardRow>

          {/* Amenities */}
          <View style={prefStyles.chipSection}>
            <Text style={prefStyles.chipSectionLabel}>Park Amenities</Text>
            <ChipGrid>
              {AMENITY_OPTIONS.map((opt) => (
                <SelectChip<AmenityType>
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  icon={opt.icon}
                  color="#EC4899"
                  selected={prefs.places.amenities.includes(opt.id)}
                  onToggle={toggleAmenity}
                />
              ))}
            </ChipGrid>
          </View>
        </Section>

        {/* ── 2. Weather Preferences ───────────────────────────────────── */}
        <Section
          title="Weather Preferences"
          icon="wb-sunny"
          iconColor="#F59E0B"
        >
          {/* Ideal temperature range */}
          <View style={prefStyles.chipSection}>
            <Text style={prefStyles.chipSectionLabel}>Ideal Temperature</Text>
            <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
              <TempRangePicker
                min={prefs.weather.idealTemp.min}
                max={prefs.weather.idealTemp.max}
                onChange={(min, max) =>
                  setPrefs((p: UserPreferences) => ({
                    ...p,
                    weather: { ...p.weather, idealTemp: { min, max } },
                  }))
                }
              />
            </View>
          </View>

          <View style={prefStyles.divider} />

          {/* Rain alerts toggle */}
          <CardRow icon="umbrella" iconColor="#3B82F6" label="Rain Alerts" last>
            <Switch
              value={prefs.weather.rainAlerts}
              onValueChange={(v) =>
                setPrefs((p: UserPreferences) => ({
                  ...p,
                  weather: { ...p.weather, rainAlerts: v },
                }))
              }
              trackColor={{ false: "#E5E7EB", true: "#A5B4FC" }}
              thumbColor={prefs.weather.rainAlerts ? "#6366F1" : "#9CA3AF"}
            />
          </CardRow>
        </Section>

        {/* ── 3. People Preferences ────────────────────────────────────── */}
        <Section title="People Preferences" icon="group" iconColor="#14B8A6">
          {/* Max group size */}
          <CardRow
            icon="groups"
            iconColor="#14B8A6"
            label="Max Group Size"
            last={false}
          >
            <StepPicker
              value={prefs.people.maxGroupSize}
              min={1}
              max={20}
              step={1}
              unit="people"
              onChange={(v) =>
                setPrefs((p: UserPreferences) => ({
                  ...p,
                  people: { ...p.people, maxGroupSize: v },
                }))
              }
            />
          </CardRow>

          {/* Friends-only carpooling */}
          <CardRow
            icon="shield"
            iconColor="#10B981"
            label="Friends-Only Carpooling"
            last
          >
            <Switch
              value={prefs.people.friendsOnlyCarpooling}
              onValueChange={(v) =>
                setPrefs((p: UserPreferences) => ({
                  ...p,
                  people: { ...p.people, friendsOnlyCarpooling: v },
                }))
              }
              trackColor={{ false: "#E5E7EB", true: "#6EE7B7" }}
              thumbColor={
                prefs.people.friendsOnlyCarpooling ? "#10B981" : "#9CA3AF"
              }
            />
          </CardRow>
        </Section>

        {/* ── 4. Carpool Vibe Tags ─────────────────────────────────────── */}
        <Section
          title="Carpool Vibe Tags"
          icon="local-taxi"
          iconColor="#F59E0B"
        >
          <View style={prefStyles.chipSection}>
            <Text style={prefStyles.chipSectionHint}>
              Select tags that describe your ride style. These appear on your
              carpool cards.
            </Text>
            <ChipGrid>
              {CARPOOL_VIBES.map((vibe) => (
                <SelectChip<CarpoolVibeType>
                  key={vibe.id}
                  id={vibe.id}
                  label={vibe.label}
                  icon={vibe.icon}
                  color={vibe.color}
                  selected={prefs.carpoolVibes.includes(vibe.id)}
                  onToggle={toggleVibe}
                />
              ))}
            </ChipGrid>
          </View>
        </Section>

        {/* ── Summary strip ── */}
        <View style={prefStyles.summaryStrip}>
          <Text style={prefStyles.summaryText}>
            {prefs.places.terrain.length} terrain
            {prefs.places.terrain.length !== 1 ? "s" : ""}
            {"  ·  "}
            {prefs.places.maxDistance} km max
            {"  ·  "}
            {prefs.places.amenities.length} amenit
            {prefs.places.amenities.length !== 1 ? "ies" : "y"}
            {"  ·  "}
            {prefs.people.maxGroupSize} people max
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const prefStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: { fontSize: 15, color: "#6B7280", fontWeight: "500" },

  // ── Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    minWidth: 72,
    alignItems: "center",
  },
  saveBtnDisabled: { backgroundColor: "#A5B4FC" },
  saveBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // ── Chip section label
  chipSection: { paddingTop: 14, paddingBottom: 4 },
  chipSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  chipSectionHint: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },

  // ── Summary strip
  summaryStrip: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366F1",
    textAlign: "center",
  },
});
