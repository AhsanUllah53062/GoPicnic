import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  sender: string;
  type: 'text' | 'image' | 'document' | 'location';
  content: string;
  timestamp: string;
};

export default function ChatScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const addMessage = (type: Message['type'], content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    addMessage('text', input);
    setInput('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      addMessage('image', '📷'); // just icon instead of thumbnail
    }
    setShowAttachmentMenu(false);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      addMessage('document', '📄'); // just icon instead of filename
    }
    setShowAttachmentMenu(false);
  };

  const shareLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    addMessage('location', '📍'); // just icon instead of map
    setShowAttachmentMenu(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const bubbleStyle = item.sender === 'You' ? styles.myMessage : styles.theirMessage;
    return (
      <View style={[styles.messageBubble, bubbleStyle]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{username}</Text>
        <MaterialIcons name="more-vert" size={24} color="#000" />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={() => setShowAttachmentMenu(true)}>
          <MaterialIcons name="attach-file" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSendText}>
          <MaterialIcons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Small Pop-up Menu */}
      <Modal transparent visible={showAttachmentMenu} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setShowAttachmentMenu(false)}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.popupItem} onPress={pickImage}>
              <MaterialIcons name="photo" size={24} color="#007AFF" />
              <Text style={styles.popupText}>Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupItem} onPress={pickDocument}>
              <MaterialIcons name="insert-drive-file" size={24} color="#007AFF" />
              <Text style={styles.popupText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupItem} onPress={shareLocation}>
              <MaterialIcons name="location-on" size={24} color="#007AFF" />
              <Text style={styles.popupText}>Location</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '700' },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#e5e5ea', alignSelf: 'flex-start' },
  messageText: { color: '#fff', fontSize: 14 },
  timestamp: { fontSize: 10, color: '#ddd', marginTop: 4, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 70, // positions near input row
    marginLeft: 16,
  },
  popupItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  popupText: { marginLeft: 8, fontSize: 14, color: '#333' },
});
