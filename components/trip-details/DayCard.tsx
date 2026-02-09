import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DayPlan,
  getDayPlan,
  PlaceVisit,
  saveDayPlan,
  Todo,
} from "../../services/itinerary";
import AddPlaceModal from "../itinerary/AddPlaceModal";
import PlaceVisitCard from "../itinerary/PlaceVisitCard";
import TodoItem from "../itinerary/TodoItem";

type Props = {
  tripId: string;
  cityName: string;
  dateLabel: string;
  dayIndex: number;
  date: Date;
};

export default function DayCard({
  tripId,
  cityName,
  dateLabel,
  dayIndex,
  date,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Day plan data
  const [dayPlanId, setDayPlanId] = useState<string | undefined>();
  const [notes, setNotes] = useState<string[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [places, setPlaces] = useState<PlaceVisit[]>([]);

  // UI states
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);

  // Load day plan from Firestore
  useEffect(() => {
    if (expanded && !dayPlanId) {
      loadDayPlan();
    }
  }, [expanded]);

  const loadDayPlan = async () => {
    setLoading(true);
    try {
      console.log(`📥 Loading day plan for day ${dayIndex}`);
      const existingPlan = await getDayPlan(tripId, dayIndex);

      if (existingPlan) {
        setDayPlanId(existingPlan.id);
        setNotes(existingPlan.notes);
        setTodos(existingPlan.todos);
        setPlaces(existingPlan.places);
        console.log(
          `✅ Loaded existing plan with ${existingPlan.places.length} places`,
        );
      } else {
        console.log(`📝 No existing plan found, starting fresh`);
      }
    } catch (error: any) {
      console.error("❌ Error loading day plan:", error);
      Alert.alert("Error", "Failed to load day plan");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      console.log(`💾 Saving day plan for day ${dayIndex}`);

      const dayPlan: DayPlan = {
        id: dayPlanId,
        tripId,
        dayIndex,
        date,
        notes,
        todos,
        places,
      };

      const savedId = await saveDayPlan(dayPlan);
      setDayPlanId(savedId);
      console.log(`✅ Day plan saved successfully`);
    } catch (error: any) {
      console.error("❌ Error saving day plan:", error);
      Alert.alert("Error", "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (
      !dayPlanId &&
      (notes.length > 0 || todos.length > 0 || places.length > 0)
    ) {
      // First save
      saveChanges();
    } else if (dayPlanId) {
      // Subsequent saves - debounce
      const timer = setTimeout(() => {
        saveChanges();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notes, todos, places]);

  const addNote = () => {
    setNotes([...notes, ""]);
    setEditingNoteIndex(notes.length);
  };

  const updateNote = (index: number, text: string) => {
    const updated = [...notes];
    updated[index] = text;
    setNotes(updated);
  };

  const deleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
  };

  const addTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: "",
      done: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo,
    );
    setTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((todo) => todo.id !== id);
    setTodos(updated);
  };

  const handleAddPlace = (place: PlaceVisit) => {
    console.log(`➕ Adding place: ${place.placeName}`);
    setPlaces([...places, place]);
    setShowAddPlaceModal(false);
  };

  const handleDeletePlace = (placeId: string) => {
    Alert.alert("Delete Place", "Are you sure you want to remove this place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updated = places.filter((p) => p.id !== placeId);
          setPlaces(updated);
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.dateText}>{dateLabel}</Text>
          {places.length > 0 && (
            <View style={styles.badge}>
              <MaterialIcons name="place" size={14} color="#007AFF" />
              <Text style={styles.badgeText}>{places.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {saving && (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={styles.savingIndicator}
            />
          )}
          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={24}
            color="#8E8E93"
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading day plan...</Text>
            </View>
          ) : (
            <>
              {/* Places */}
              {places.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Places to Visit</Text>
                  {places.map((place) => (
                    <PlaceVisitCard
                      key={place.id}
                      place={place}
                      onDelete={() => handleDeletePlace(place.id)}
                    />
                  ))}
                </View>
              )}

              {/* Add Place Button */}
              <TouchableOpacity
                style={styles.addPlaceBtn}
                onPress={() => setShowAddPlaceModal(true)}
              >
                <MaterialIcons name="add-location" size={20} color="#fff" />
                <Text style={styles.addPlaceBtnText}>Add a Place</Text>
              </TouchableOpacity>

              {/* Notes */}
              {notes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  {notes.map((note, index) => (
                    <View key={index} style={styles.noteRow}>
                      <TextInput
                        style={styles.noteInput}
                        placeholder="Write your notes..."
                        placeholderTextColor="#C7C7CC"
                        value={note}
                        onChangeText={(text) => updateNote(index, text)}
                        multiline
                        autoFocus={index === editingNoteIndex}
                      />
                      <TouchableOpacity onPress={() => deleteNote(index)}>
                        <MaterialIcons name="close" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Todos */}
              {todos.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>To-Do List</Text>
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={(updates) => updateTodo(todo.id, updates)}
                      onDelete={() => deleteTodo(todo.id)}
                    />
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={addNote}>
                  <MaterialIcons name="note-add" size={22} color="#007AFF" />
                  <Text style={styles.actionBtnText}>Add Note</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={addTodo}>
                  <MaterialIcons name="checklist" size={22} color="#007AFF" />
                  <Text style={styles.actionBtnText}>Add To-Do</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      {/* Add Place Modal */}
      <AddPlaceModal
        visible={showAddPlaceModal}
        cityName={cityName}
        onClose={() => setShowAddPlaceModal(false)}
        onAddPlace={handleAddPlace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  savingIndicator: {
    marginRight: 4,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#8E8E93",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addPlaceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  addPlaceBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  noteInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#000",
    minHeight: 44,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F8FF",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
